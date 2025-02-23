#!/bin/bash

# Configurar variables
PROJECT_ID="your-project-id"
BACKUP_DIR="./backups/supabase"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_$DATE.sql"

# Crear directorio si no existe
mkdir -p $BACKUP_DIR

# Realizar backup usando Supabase CLI
supabase db dump -p $BACKUP_FILE

# Comprimir backup
gzip $BACKUP_FILE

# Limpiar backups antiguos (mantener últimos 7 días)
find $BACKUP_DIR -type f -name "*.sql.gz" -mtime +7 -delete

# Subir a almacenamiento seguro (opcional)
if [ ! -z "$BACKUP_STORAGE_URL" ]; then
    curl -X PUT -T "${BACKUP_FILE}.gz" "$BACKUP_STORAGE_URL/backup_$DATE.sql.gz"
fi 