#!/bin/bash

# Configurar variables
DB_NAME="bolt_fitness"
BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_$DATE.sql"

# Crear directorio de backups si no existe
mkdir -p $BACKUP_DIR

# Realizar backup
pg_dump $DATABASE_URL > $BACKUP_FILE

# Comprimir backup
gzip $BACKUP_FILE

# Mantener solo los últimos 7 backups
find $BACKUP_DIR -type f -name "*.sql.gz" -mtime +7 -delete 