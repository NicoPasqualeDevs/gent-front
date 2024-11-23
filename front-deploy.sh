#!/bin/bash

# Función para manejar errores
handle_error() {
    local exit_code=$1
    local error_message=$2
    if [ $exit_code -ne 0 ]; then
        echo "❌ ERROR: $error_message"
        exit $exit_code
    fi
}

# Actualizar desde el repositorio
echo "⬇️ Actualizando código desde el repositorio..."
git reset --hard
git clean -fd
git fetch origin
git reset --hard origin/main
chmod +x deploy.sh
handle_error $? "Error al actualizar el código desde git"

echo "🚀 Iniciando despliegue del frontend..."

# Directorios
FRONTEND_DIR="/home/nicolas_german_pasquale/gents-front"
DIST_DIR="$FRONTEND_DIR/dist"
CURRENT_USER=$(whoami)

# Ir al directorio del frontend
cd $FRONTEND_DIR
handle_error $? "No se pudo acceder al directorio del frontend"

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install
handle_error $? "Error al instalar dependencias"

# Construir la aplicación
echo "🏗️ Construyendo la aplicación..."
npm run build
handle_error $? "Error al construir la aplicación"

# Verificar que el directorio dist existe
if [ ! -d "$DIST_DIR" ]; then
    echo "❌ ERROR: El directorio dist no se creó correctamente"
    exit 1
fi

# Verificar que los assets existen
if [ ! -d "$DIST_DIR/assets" ]; then
    echo "❌ ERROR: No se encontró el directorio de assets"
    exit 1
fi

# Ajustar permisos del dist
echo "🔒 Configurando permisos..."
sudo chown -R $CURRENT_USER:www-data $DIST_DIR
sudo chmod -R 755 $DIST_DIR
handle_error $? "Error al configurar permisos"

# Verificar y configurar favicon.ico
echo "🔍 Configurando favicon..."
if [ -f "$DIST_DIR/favicon.ico" ]; then
    sudo chmod 644 "$DIST_DIR/favicon.ico"
    sudo chown $CURRENT_USER:www-data "$DIST_DIR/favicon.ico"
    echo "✅ Favicon configurado correctamente"
else
    echo "❌ ERROR: favicon.ico no encontrado en el directorio dist"
    exit 1
fi

# Verificar y crear directorio de assets si no existe
if [ ! -d "$DIST_DIR/assets" ]; then
    mkdir -p "$DIST_DIR/assets"
    handle_error $? "Error al crear directorio de assets"
fi

# Reiniciar Nginx
echo "🔄 Reiniciando Nginx..."
sudo systemctl restart nginx
handle_error $? "Error al reiniciar Nginx"

# Verificar estado de Nginx
echo "🔍 Verificando estado de Nginx..."
sudo systemctl status nginx --no-pager
handle_error $? "Error al verificar estado de Nginx"

# Verificar logs de Nginx
echo "📋 Últimas líneas del log de error de Nginx:"
sudo tail -n 20 /var/log/nginx/error.log

echo "✅ ¡Despliegue del frontend completado exitosamente! 🎉"
