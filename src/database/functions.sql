-- Función para verificar si un usuario es profesor
CREATE OR REPLACE FUNCTION es_profesor(usuario_id INTEGER) 
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM usuarios 
        WHERE id = usuario_id AND es_profesor = TRUE
    );
END;
$$ LANGUAGE plpgsql;

-- Función para obtener estudiantes de un profesor
CREATE OR REPLACE FUNCTION obtener_estudiantes(profesor_id INTEGER) 
RETURNS TABLE (
    estudiante_id INTEGER,
    nombre VARCHAR,
    email VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT u.id, u.nombre, u.email
    FROM usuarios u
    INNER JOIN profesor_estudiante pe ON pe.estudiante_id = u.id
    WHERE pe.profesor_id = profesor_id;
END;
$$ LANGUAGE plpgsql;

-- Función para asignar ejercicio a un estudiante
CREATE OR REPLACE FUNCTION asignar_ejercicio(
    p_profesor_id INTEGER,
    p_estudiante_id INTEGER,
    p_ejercicio_id INTEGER,
    p_fecha_vencimiento TIMESTAMP
) RETURNS INTEGER AS $$
DECLARE
    v_asignacion_id INTEGER;
BEGIN
    -- Verificar que el usuario es profesor
    IF NOT es_profesor(p_profesor_id) THEN
        RAISE EXCEPTION 'Usuario no es profesor';
    END IF;

    -- Verificar relación profesor-estudiante
    IF NOT EXISTS (
        SELECT 1 FROM profesor_estudiante 
        WHERE profesor_id = p_profesor_id AND estudiante_id = p_estudiante_id
    ) THEN
        RAISE EXCEPTION 'No existe relación profesor-estudiante';
    END IF;

    -- Crear la asignación
    INSERT INTO asignaciones (
        ejercicio_id, profesor_id, estudiante_id, 
        fecha_vencimiento, estado
    ) VALUES (
        p_ejercicio_id, p_profesor_id, p_estudiante_id, 
        p_fecha_vencimiento, 'pendiente'
    ) RETURNING id INTO v_asignacion_id;

    RETURN v_asignacion_id;
END;
$$ LANGUAGE plpgsql;

-- Función para actualizar progreso de ejercicio
CREATE OR REPLACE FUNCTION registrar_progreso(
    p_usuario_id INTEGER,
    p_ejercicio_id INTEGER,
    p_puntos INTEGER,
    p_comentarios TEXT
) RETURNS INTEGER AS $$
DECLARE
    v_progreso_id INTEGER;
BEGIN
    -- Verificar si existe una asignación pendiente
    UPDATE asignaciones 
    SET estado = 'completado' 
    WHERE estudiante_id = p_usuario_id 
    AND ejercicio_id = p_ejercicio_id 
    AND estado = 'pendiente';

    -- Registrar el progreso
    INSERT INTO progreso (
        usuario_id, ejercicio_id, 
        puntos_obtenidos, comentarios
    ) VALUES (
        p_usuario_id, p_ejercicio_id, 
        p_puntos, p_comentarios
    ) RETURNING id INTO v_progreso_id;

    RETURN v_progreso_id;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener resumen de progreso de un estudiante
CREATE OR REPLACE FUNCTION obtener_resumen_progreso(p_estudiante_id INTEGER)
RETURNS TABLE (
    total_ejercicios INTEGER,
    ejercicios_completados INTEGER,
    puntos_totales INTEGER,
    nivel_actual VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(DISTINCT a.ejercicio_id)::INTEGER as total_ejercicios,
        COUNT(DISTINCT p.ejercicio_id)::INTEGER as ejercicios_completados,
        COALESCE(SUM(p.puntos_obtenidos), 0)::INTEGER as puntos_totales,
        u.nivel
    FROM usuarios u
    LEFT JOIN asignaciones a ON a.estudiante_id = u.id
    LEFT JOIN progreso p ON p.usuario_id = u.id
    WHERE u.id = p_estudiante_id
    GROUP BY u.id, u.nivel;
END;
$$ LANGUAGE plpgsql;

-- Función para otorgar logro a usuario
CREATE OR REPLACE FUNCTION otorgar_logro(
    p_usuario_id INTEGER,
    p_logro_id INTEGER
) RETURNS BOOLEAN AS $$
DECLARE
    v_puntos_totales INTEGER;
    v_puntos_requeridos INTEGER;
BEGIN
    -- Obtener puntos totales del usuario
    SELECT COALESCE(SUM(puntos_obtenidos), 0) INTO v_puntos_totales
    FROM progreso
    WHERE usuario_id = p_usuario_id;

    -- Obtener puntos requeridos para el logro
    SELECT puntos_requeridos INTO v_puntos_requeridos
    FROM logros
    WHERE id = p_logro_id;

    -- Verificar si cumple los requisitos
    IF v_puntos_totales >= v_puntos_requeridos THEN
        INSERT INTO logros_usuario (usuario_id, logro_id)
        VALUES (p_usuario_id, p_logro_id)
        ON CONFLICT (usuario_id, logro_id) DO NOTHING;

        -- Crear notificación
        INSERT INTO notificaciones (usuario_id, tipo, mensaje)
        VALUES (p_usuario_id, 'logro_obtenido', 
               'Has obtenido un nuevo logro: ' || (SELECT nombre FROM logros WHERE id = p_logro_id));
        
        RETURN TRUE;
    END IF;
    
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- Función para crear interacción
CREATE OR REPLACE FUNCTION crear_interaccion(
    p_usuario_id INTEGER,
    p_tipo VARCHAR,
    p_referencia_tipo VARCHAR,
    p_referencia_id INTEGER,
    p_contenido TEXT
) RETURNS INTEGER AS $$
DECLARE
    v_interaccion_id INTEGER;
BEGIN
    INSERT INTO interacciones (
        usuario_id, tipo, referencia_tipo, 
        referencia_id, contenido
    ) VALUES (
        p_usuario_id, p_tipo, p_referencia_tipo, 
        p_referencia_id, p_contenido
    ) RETURNING id INTO v_interaccion_id;

    -- Si es un comentario, notificar al usuario relacionado
    IF p_tipo = 'comentario' THEN
        INSERT INTO notificaciones (
            usuario_id, 
            tipo, 
            mensaje
        )
        SELECT 
            CASE 
                WHEN p_referencia_tipo = 'ejercicio' THEN e.creado_por
                WHEN p_referencia_tipo = 'progreso' THEN p.usuario_id
            END,
            'nuevo_comentario',
            'Tienes un nuevo comentario en tu ' || p_referencia_tipo
        FROM ejercicios e
        LEFT JOIN progreso p ON p.id = p_referencia_id
        WHERE e.id = p_referencia_id
        OR p.id = p_referencia_id;
    END IF;

    RETURN v_interaccion_id;
END;
$$ LANGUAGE plpgsql;

-- Función para verificar permisos de usuario
CREATE OR REPLACE FUNCTION tiene_permiso(
    p_usuario_id INTEGER,
    p_permiso TEXT
) RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM usuarios u
        JOIN roles r ON r.id = u.rol_id
        WHERE u.id = p_usuario_id 
        AND r.permisos::jsonb ? p_permiso
    );
END;
$$ LANGUAGE plpgsql;

-- Función para actualizar nivel de usuario basado en puntos
CREATE OR REPLACE FUNCTION actualizar_nivel_usuario(
    p_usuario_id INTEGER
) RETURNS VARCHAR AS $$
DECLARE
    v_puntos_totales INTEGER;
    v_nuevo_nivel VARCHAR;
BEGIN
    -- Obtener puntos totales
    SELECT COALESCE(SUM(puntos_obtenidos), 0) INTO v_puntos_totales
    FROM progreso
    WHERE usuario_id = p_usuario_id;

    -- Determinar nuevo nivel
    v_nuevo_nivel := CASE
        WHEN v_puntos_totales >= 1000 THEN 'premium'
        WHEN v_puntos_totales >= 500 THEN 'maestro'
        WHEN v_puntos_totales >= 100 THEN 'medio'
        ELSE 'basico'
    END;

    -- Actualizar nivel del usuario
    UPDATE usuarios
    SET nivel = v_nuevo_nivel
    WHERE id = p_usuario_id;

    RETURN v_nuevo_nivel;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar nivel automáticamente
CREATE OR REPLACE FUNCTION trigger_actualizar_nivel()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM actualizar_nivel_usuario(NEW.usuario_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_progreso_update
AFTER INSERT OR UPDATE ON progreso
FOR EACH ROW
EXECUTE FUNCTION trigger_actualizar_nivel();

-- Trigger para actualizar estado de asignaciones vencidas
CREATE OR REPLACE FUNCTION trigger_actualizar_estado_vencido()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE asignaciones
    SET estado = 'vencido'
    WHERE estado = 'pendiente'
    AND fecha_vencimiento < CURRENT_TIMESTAMP;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_vencimientos
AFTER INSERT OR UPDATE ON asignaciones
FOR EACH STATEMENT
EXECUTE FUNCTION trigger_actualizar_estado_vencido();

-- Función para obtener métricas de usuario
CREATE OR REPLACE FUNCTION obtener_metricas_usuario(
    p_usuario_id INTEGER
) RETURNS TABLE (
    total_ejercicios_completados INTEGER,
    total_puntos INTEGER,
    nivel_actual VARCHAR,
    total_logros INTEGER,
    ultima_actividad TIMESTAMP,
    promedio_puntos_diario FLOAT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(DISTINCT p.ejercicio_id)::INTEGER,
        COALESCE(SUM(p.puntos_obtenidos), 0)::INTEGER,
        u.nivel,
        COUNT(DISTINCT l.logro_id)::INTEGER,
        MAX(p.fecha_completado),
        COALESCE(
            SUM(p.puntos_obtenidos)::FLOAT / 
            NULLIF(
                EXTRACT(DAY FROM NOW() - MIN(p.fecha_completado))::INTEGER,
                0
            ),
            0
        )
    FROM usuarios u
    LEFT JOIN progreso p ON p.usuario_id = u.id
    LEFT JOIN logros_usuario l ON l.usuario_id = u.id
    WHERE u.id = p_usuario_id
    GROUP BY u.id, u.nivel;
END;
$$ LANGUAGE plpgsql;

-- Función para monitoreo de actividad
CREATE OR REPLACE FUNCTION registrar_actividad_usuario(
    p_usuario_id INTEGER,
    p_tipo_actividad VARCHAR,
    p_detalles JSONB
) RETURNS VOID AS $$
BEGIN
    INSERT INTO actividad_usuario (
        usuario_id,
        tipo_actividad,
        detalles,
        fecha_actividad
    ) VALUES (
        p_usuario_id,
        p_tipo_actividad,
        p_detalles,
        CURRENT_TIMESTAMP
    );
END;
$$ LANGUAGE plpgsql;

-- Función para validación de permisos avanzada
CREATE OR REPLACE FUNCTION validar_permiso_accion(
    p_usuario_id INTEGER,
    p_accion VARCHAR,
    p_recurso_tipo VARCHAR,
    p_recurso_id INTEGER
) RETURNS BOOLEAN AS $$
DECLARE
    v_rol_permisos JSONB;
    v_es_propietario BOOLEAN;
BEGIN
    -- Obtener permisos del rol
    SELECT r.permisos INTO v_rol_permisos
    FROM usuarios u
    JOIN roles r ON r.id = u.rol_id
    WHERE u.id = p_usuario_id;

    -- Verificar si es propietario del recurso
    SELECT EXISTS (
        SELECT 1
        FROM CASE p_recurso_tipo
            WHEN 'ejercicio' THEN ejercicios
            WHEN 'progreso' THEN progreso
            WHEN 'asignacion' THEN asignaciones
        END
        WHERE id = p_recurso_id 
        AND (creado_por = p_usuario_id OR usuario_id = p_usuario_id)
    ) INTO v_es_propietario;

    RETURN (
        v_rol_permisos ? p_accion 
        OR v_es_propietario 
        OR v_rol_permisos ? 'admin'
    );
END;
$$ LANGUAGE plpgsql;

-- Función para asignar rol a usuario
CREATE OR REPLACE FUNCTION asignar_rol_usuario(
    p_admin_id INTEGER,
    p_usuario_id INTEGER,
    p_rol_id INTEGER
) RETURNS BOOLEAN AS $$
DECLARE
    v_es_admin BOOLEAN;
BEGIN
    -- Verificar si quien ejecuta es admin
    SELECT EXISTS (
        SELECT 1 
        FROM usuarios u
        JOIN roles r ON r.id = u.rol_id
        WHERE u.id = p_admin_id 
        AND r.permisos::jsonb ? 'admin'
    ) INTO v_es_admin;

    IF NOT v_es_admin THEN
        RAISE EXCEPTION 'No tienes permisos para asignar roles';
    END IF;

    -- Actualizar rol del usuario
    UPDATE usuarios
    SET rol_id = p_rol_id
    WHERE id = p_usuario_id;

    -- Registrar la actividad
    INSERT INTO actividad_usuario (
        usuario_id,
        tipo_actividad,
        detalles
    ) VALUES (
        p_usuario_id,
        'cambio_rol',
        jsonb_build_object(
            'rol_anterior', (SELECT rol_id FROM usuarios WHERE id = p_usuario_id),
            'rol_nuevo', p_rol_id,
            'asignado_por', p_admin_id
        )
    );

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Trigger para validar relación profesor-estudiante
CREATE OR REPLACE FUNCTION validar_profesor_estudiante()
RETURNS TRIGGER AS $$
BEGIN
    -- Verificar que el profesor tenga el flag es_profesor
    IF NOT EXISTS (
        SELECT 1 FROM usuarios
        WHERE id = NEW.profesor_id AND es_profesor = TRUE
    ) THEN
        RAISE EXCEPTION 'El usuario % no es profesor', NEW.profesor_id;
    END IF;

    -- Verificar que el estudiante no sea profesor
    IF EXISTS (
        SELECT 1 FROM usuarios
        WHERE id = NEW.estudiante_id AND es_profesor = TRUE
    ) THEN
        RAISE EXCEPTION 'Un profesor no puede ser estudiante de otro profesor';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_profesor_estudiante_insert
BEFORE INSERT ON profesor_estudiante
FOR EACH ROW
EXECUTE FUNCTION validar_profesor_estudiante();

-- Función para obtener métricas del sistema
CREATE OR REPLACE FUNCTION obtener_metricas_sistema()
RETURNS TABLE (
    total_usuarios INTEGER,
    usuarios_activos_hoy INTEGER,
    total_ejercicios INTEGER,
    ejercicios_completados_hoy INTEGER,
    promedio_engagement FLOAT
) AS $$
BEGIN
    RETURN QUERY
    WITH metricas AS (
        SELECT
            (SELECT COUNT(*) FROM usuarios) as total_usuarios,
            (SELECT COUNT(DISTINCT usuario_id) 
             FROM actividad_usuario 
             WHERE fecha_actividad >= CURRENT_DATE) as usuarios_activos_hoy,
            (SELECT COUNT(*) FROM ejercicios) as total_ejercicios,
            (SELECT COUNT(*) FROM progreso 
             WHERE fecha_completado >= CURRENT_DATE) as ejercicios_completados_hoy,
            (SELECT COALESCE(
                AVG(ejercicios_completados)::FLOAT, 0
             ) FROM (
                SELECT usuario_id, COUNT(*) as ejercicios_completados
                FROM progreso
                GROUP BY usuario_id
             ) as user_completions) as promedio_engagement
    )
    SELECT * FROM metricas;
END;
$$ LANGUAGE plpgsql;

-- Función para generar token de verificación
CREATE OR REPLACE FUNCTION generar_token_verificacion(
    p_usuario_id INTEGER,
    p_tipo VARCHAR
) RETURNS VARCHAR AS $$
DECLARE
    v_token VARCHAR;
BEGIN
    -- Generar token único
    v_token := encode(sha256(random()::text::bytea), 'hex');
    
    -- Insertar token
    INSERT INTO tokens_verificacion (
        usuario_id,
        token,
        tipo,
        fecha_expiracion
    ) VALUES (
        p_usuario_id,
        v_token,
        p_tipo,
        CURRENT_TIMESTAMP + INTERVAL '24 hours'
    );

    RETURN v_token;
END;
$$ LANGUAGE plpgsql;

-- Función para verificar email
CREATE OR REPLACE FUNCTION verificar_email(
    p_token VARCHAR
) RETURNS BOOLEAN AS $$
DECLARE
    v_usuario_id INTEGER;
BEGIN
    -- Verificar token válido y no expirado
    SELECT usuario_id INTO v_usuario_id
    FROM tokens_verificacion
    WHERE token = p_token 
    AND tipo = 'email'
    AND NOT usado
    AND fecha_expiracion > CURRENT_TIMESTAMP;

    IF v_usuario_id IS NULL THEN
        RETURN FALSE;
    END IF;

    -- Marcar email como verificado
    UPDATE usuarios
    SET email_verificado = TRUE
    WHERE id = v_usuario_id;

    -- Marcar token como usado
    UPDATE tokens_verificacion
    SET usado = TRUE
    WHERE token = p_token;

    -- Registrar actividad
    PERFORM registrar_actividad_usuario(
        v_usuario_id,
        'email_verificado',
        jsonb_build_object('token', p_token)
    );

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Función para habilitar 2FA
CREATE OR REPLACE FUNCTION habilitar_2fa(
    p_usuario_id INTEGER,
    p_secret VARCHAR
) RETURNS BOOLEAN AS $$
BEGIN
    -- Actualizar usuario con secreto 2FA
    UPDATE usuarios
    SET 
        two_factor_enabled = TRUE,
        two_factor_secret = p_secret
    WHERE id = p_usuario_id;

    -- Registrar actividad
    PERFORM registrar_actividad_usuario(
        p_usuario_id,
        '2fa_habilitado',
        jsonb_build_object('timestamp', CURRENT_TIMESTAMP)
    );

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Función para validar código 2FA
CREATE OR REPLACE FUNCTION validar_2fa(
    p_usuario_id INTEGER,
    p_codigo VARCHAR
) RETURNS BOOLEAN AS $$
DECLARE
    v_token VARCHAR;
BEGIN
    -- Generar token de sesión si el código es válido
    IF p_codigo = '000000' THEN -- Aquí iría la validación real del código TOTP
        v_token := generar_token_verificacion(p_usuario_id, '2fa');
        RETURN TRUE;
    END IF;
    
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- Función para limpiar tokens expirados
CREATE OR REPLACE FUNCTION limpiar_tokens_expirados() RETURNS INTEGER AS $$
DECLARE
    v_count INTEGER;
BEGIN
    DELETE FROM tokens_verificacion
    WHERE fecha_expiracion < CURRENT_TIMESTAMP
    AND NOT usado;
    
    GET DIAGNOSTICS v_count = ROW_COUNT;
    RETURN v_count;
END;
$$ LANGUAGE plpgsql;

-- Programar limpieza automática de tokens
CREATE OR REPLACE FUNCTION trigger_limpiar_tokens()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM limpiar_tokens_expirados();
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_limpiar_tokens
AFTER INSERT ON tokens_verificacion
FOR EACH STATEMENT
EXECUTE FUNCTION trigger_limpiar_tokens(); 