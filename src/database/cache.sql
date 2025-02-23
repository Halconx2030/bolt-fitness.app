-- Vista materializada para estadísticas de usuario
CREATE MATERIALIZED VIEW mv_estadisticas_usuario AS
SELECT 
    u.id as usuario_id,
    u.nombre,
    u.nivel,
    COUNT(DISTINCT p.ejercicio_id) as total_ejercicios,
    COALESCE(SUM(p.puntos_obtenidos), 0) as puntos_totales,
    COUNT(DISTINCT l.logro_id) as total_logros,
    MAX(p.fecha_completado) as ultima_actividad
FROM usuarios u
LEFT JOIN progreso p ON p.usuario_id = u.id
LEFT JOIN logros_usuario l ON l.usuario_id = u.id
GROUP BY u.id, u.nombre, u.nivel;

CREATE UNIQUE INDEX idx_mv_estadisticas_usuario ON mv_estadisticas_usuario(usuario_id);

-- Función para refrescar la vista materializada
CREATE OR REPLACE FUNCTION refrescar_estadisticas_usuario()
RETURNS TRIGGER AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_estadisticas_usuario;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Triggers para mantener la vista actualizada
CREATE TRIGGER trigger_refresh_estadisticas
AFTER INSERT OR UPDATE OR DELETE ON progreso
FOR EACH STATEMENT
EXECUTE FUNCTION refrescar_estadisticas_usuario(); 