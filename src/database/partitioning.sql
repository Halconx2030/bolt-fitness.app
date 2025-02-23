-- Particionamiento de la tabla de progreso por fecha
CREATE TABLE progreso_particionado (
    id SERIAL,
    usuario_id INTEGER,
    ejercicio_id INTEGER,
    fecha_completado TIMESTAMP,
    puntos_obtenidos INTEGER,
    comentarios TEXT
) PARTITION BY RANGE (fecha_completado);

-- Crear particiones por mes
CREATE TABLE progreso_y2024m01 PARTITION OF progreso_particionado
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
CREATE TABLE progreso_y2024m02 PARTITION OF progreso_particionado
    FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');
-- ... más particiones según necesidad

-- Función para crear particiones automáticamente
CREATE OR REPLACE FUNCTION crear_particion_progreso(
    fecha_inicio DATE,
    fecha_fin DATE
) RETURNS void AS $$
DECLARE
    partition_name TEXT;
    partition_sql TEXT;
BEGIN
    partition_name := 'progreso_y' || 
                     to_char(fecha_inicio, 'YYYY') ||
                     'm' || to_char(fecha_inicio, 'MM');
    
    partition_sql := format(
        'CREATE TABLE IF NOT EXISTS %I PARTITION OF progreso_particionado
         FOR VALUES FROM (%L) TO (%L)',
        partition_name,
        fecha_inicio,
        fecha_fin
    );
    
    EXECUTE partition_sql;
END;
$$ LANGUAGE plpgsql; 