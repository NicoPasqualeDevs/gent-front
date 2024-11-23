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

echo "🚀 Iniciando despliegue del frontend..."

# Directorios
FRONTEND_DIR="/home/nicolas_german_pasquale/gents-frontend"
BUILD_DIR="$FRONTEND_DIR/build"
CURRENT_USER=$(whoami)

# Ir al directorio del frontend
cd $FRONTEND_DIR
handle_error $? "No se pudo acceder al directorio del frontend"

# Actualizar desde el repositorio
echo "⬇️ Actualizando código desde el repositorio..."
git reset --hard
git clean -fd
git fetch origin
git reset --hard origin/main
chmod +x front-deploy.sh
handle_error $? "Error al actualizar el código desde git"

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install
handle_error $? "Error al instalar dependencias"

# Construir la aplicación
echo "🏗️ Construyendo la aplicación..."
npm run build
handle_error $? "Error al construir la aplicación"

# Verificar que el directorio build existe
if [ ! -d "$BUILD_DIR" ]; then
    echo "❌ ERROR: El directorio build no se creó correctamente"
    exit 1
fi

# Verificar que los assets existen
if [ ! -d "$BUILD_DIR/assets" ]; then
    echo "❌ ERROR: No se encontró el directorio de assets"
    exit 1
fi

# Ajustar permisos del build
echo "🔒 Configurando permisos..."
sudo chown -R $CURRENT_USER:www-data $BUILD_DIR
sudo chmod -R 755 $BUILD_DIR
handle_error $? "Error al configurar permisos"

# Verificar y configurar favicon.ico
echo "🔍 Configurando favicon..."
if [ -f "$BUILD_DIR/favicon.ico" ]; then
    sudo chmod 644 "$BUILD_DIR/favicon.ico"
    sudo chown $CURRENT_USER:www-data "$BUILD_DIR/favicon.ico"
    echo "✅ Favicon configurado correctamente"
else
    echo "❌ ERROR: favicon.ico no encontrado en el directorio build"
    exit 1
fi

# Verificar y crear directorio de assets si no existe
if [ ! -d "$BUILD_DIR/assets" ]; then
    mkdir -p "$BUILD_DIR/assets"
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
