-- Índices compuestos para búsquedas frecuentes
CREATE INDEX idx_progreso_usuario_fecha ON progreso(usuario_id, fecha_completado);
CREATE INDEX idx_asignaciones_estado_fecha ON asignaciones(estado, fecha_vencimiento);
CREATE INDEX idx_interacciones_tipo_fecha ON interacciones(tipo, fecha_creacion);

-- Índices parciales para consultas específicas
CREATE INDEX idx_usuarios_activos ON usuarios(id, email) WHERE activo = TRUE;
CREATE INDEX idx_asignaciones_pendientes ON asignaciones(estudiante_id, fecha_vencimiento) 
WHERE estado = 'pendiente';

-- Índices para búsquedas de texto
CREATE INDEX idx_ejercicios_nombre_trgm ON ejercicios USING gin(nombre gin_trgm_ops);
CREATE INDEX idx_ejercicios_descripcion_trgm ON ejercicios USING gin(descripcion gin_trgm_ops);

-- Índices para JSON
CREATE INDEX idx_roles_permisos ON roles USING gin(permisos);
CREATE INDEX idx_actividad_detalles ON actividad_usuario USING gin(detalles); 