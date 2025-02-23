-- Tabla de Roles
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    permisos JSONB NOT NULL,
    es_profesor BOOLEAN DEFAULT FALSE
);

-- Tabla de Usuarios
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    nivel VARCHAR(20) CHECK (nivel IN ('basico', 'medio', 'maestro', 'premium')),
    rol_id INTEGER REFERENCES roles(id),
    es_profesor BOOLEAN DEFAULT FALSE,
    activo BOOLEAN DEFAULT TRUE,
    email_verificado BOOLEAN DEFAULT FALSE,
    codigo_verificacion VARCHAR(64),
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(32)
);

-- Tabla de relación Profesor-Estudiante
CREATE TABLE profesor_estudiante (
    id SERIAL PRIMARY KEY,
    profesor_id INTEGER REFERENCES usuarios(id),
    estudiante_id INTEGER REFERENCES usuarios(id),
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(profesor_id, estudiante_id)
);

-- Tabla de Ejercicios
CREATE TABLE ejercicios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    nivel_requerido VARCHAR(20),
    puntos INTEGER DEFAULT 0,
    creado_por INTEGER REFERENCES usuarios(id),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Asignaciones
CREATE TABLE asignaciones (
    id SERIAL PRIMARY KEY,
    ejercicio_id INTEGER REFERENCES ejercicios(id),
    profesor_id INTEGER REFERENCES usuarios(id),
    estudiante_id INTEGER REFERENCES usuarios(id),
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_vencimiento TIMESTAMP,
    estado VARCHAR(20) CHECK (estado IN ('pendiente', 'completado', 'vencido')),
    retroalimentacion TEXT
);

-- Tabla de Progreso
CREATE TABLE progreso (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id),
    ejercicio_id INTEGER REFERENCES ejercicios(id),
    fecha_completado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    puntos_obtenidos INTEGER DEFAULT 0,
    comentarios TEXT
);

-- Tabla de Logros
CREATE TABLE logros (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    puntos_requeridos INTEGER,
    icono_url VARCHAR(255),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Logros de Usuario
CREATE TABLE logros_usuario (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id),
    logro_id INTEGER REFERENCES logros(id),
    fecha_obtencion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(usuario_id, logro_id)
);

-- Tabla de Interacciones
CREATE TABLE interacciones (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id),
    tipo VARCHAR(20) CHECK (tipo IN ('like', 'comentario', 'reporte')),
    referencia_tipo VARCHAR(20) CHECK (referencia_tipo IN ('ejercicio', 'progreso', 'logro')),
    referencia_id INTEGER,
    contenido TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Notificaciones
CREATE TABLE notificaciones (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id),
    tipo VARCHAR(50) NOT NULL,
    mensaje TEXT NOT NULL,
    leida BOOLEAN DEFAULT FALSE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Actividad de Usuario
CREATE TABLE actividad_usuario (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id),
    tipo_actividad VARCHAR(50) NOT NULL,
    detalles JSONB,
    fecha_actividad TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para tokens de verificación
CREATE TABLE tokens_verificacion (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id),
    token VARCHAR(64) NOT NULL,
    tipo VARCHAR(20) CHECK (tipo IN ('email', 'password_reset', '2fa')),
    fecha_expiracion TIMESTAMP NOT NULL,
    usado BOOLEAN DEFAULT FALSE,
    UNIQUE(token)
);

-- Índices para optimizar búsquedas frecuentes
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_asignaciones_estudiante ON asignaciones(estudiante_id);
CREATE INDEX idx_asignaciones_profesor ON asignaciones(profesor_id);
CREATE INDEX idx_progreso_usuario ON progreso(usuario_id);
CREATE INDEX idx_ejercicios_nivel ON ejercicios(nivel_requerido);

-- Índices adicionales
CREATE INDEX idx_logros_usuario ON logros_usuario(usuario_id);
CREATE INDEX idx_interacciones_usuario ON interacciones(usuario_id);
CREATE INDEX idx_notificaciones_usuario ON notificaciones(usuario_id, leida);

-- Índice para búsqueda rápida de actividad
CREATE INDEX idx_actividad_usuario ON actividad_usuario(usuario_id, fecha_actividad);

-- Índice para búsqueda de tokens
CREATE INDEX idx_tokens_verificacion ON tokens_verificacion(token); 