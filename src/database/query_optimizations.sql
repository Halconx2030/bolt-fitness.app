-- Función optimizada para obtener progreso de estudiante
CREATE OR REPLACE FUNCTION obtener_progreso_detallado(
    p_estudiante_id INTEGER
) RETURNS TABLE (
    ejercicio_nombre VARCHAR,
    fecha_completado TIMESTAMP,
    puntos INTEGER,
    nivel_requerido VARCHAR,
    estado VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    WITH progreso_reciente AS (
        SELECT 
            e.nombre,
            p.fecha_completado,
            p.puntos_obtenidos,
            e.nivel_requerido,
            COALESCE(a.estado, 'completado') as estado,
            ROW_NUMBER() OVER (
                PARTITION BY e.id 
                ORDER BY p.fecha_completado DESC
            ) as rn
        FROM ejercicios e
        LEFT JOIN progreso p ON p.ejercicio_id = e.id
        LEFT JOIN asignaciones a ON a.ejercicio_id = e.id
        WHERE p.usuario_id = p_estudiante_id
        OR a.estudiante_id = p_estudiante_id
    )
    SELECT 
        nombre,
        fecha_completado,
        puntos_obtenidos,
        nivel_requerido,
        estado
    FROM progreso_reciente
    WHERE rn = 1;
END;
$$ LANGUAGE plpgsql; 