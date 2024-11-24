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

# Función para validar permisos de directorios
validate_directory_permissions() {
    local dir=$1
    local description=$2
    if [ ! -d "$dir" ]; then
        echo "❌ ERROR: $description ($dir) no existe"
        exit 1
    fi
    
    if [ ! -w "$dir" ]; then
        echo "❌ ERROR: No hay permisos de escritura en $description ($dir)"
        exit 1
    fi
    echo "✅ Permisos correctos para $description"
}

# Actualizar desde el repositorio
echo "⬇️ Actualizando código desde el repositorio... v1.0.2"

git reset --hard
git clean -fd
git fetch origin
git reset --hard origin/main
chmod +x front-deploy.sh
handle_error $? "Error al actualizar el código desde git"

echo "🚀 Iniciando despliegue del frontend..."

# Directorios
FRONTEND_DIR="/home/nicolas_german_pasquale/gents-front"
DIST_DIR="$FRONTEND_DIR/dist"
ASSETS_DIR="$DIST_DIR/assets"
CURRENT_USER=$(whoami)

# Validar directorio frontend
validate_directory_permissions "$FRONTEND_DIR" "directorio frontend"

# Limpiar dist si existe
if [ -d "$DIST_DIR" ]; then
    echo "🧹 Limpiando directorio dist anterior..."
    rm -rf "$DIST_DIR"
    handle_error $? "Error al limpiar directorio dist"
fi

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

# Verificar estructura del build
echo "🔍 Verificando estructura del build..."

# Verificar dist
if [ ! -d "$DIST_DIR" ]; then
    echo "❌ ERROR: El build no generó el directorio dist"
    exit 1
fi

# Verificar assets
if [ ! -d "$ASSETS_DIR" ]; then
    echo "❌ ERROR: El build no generó el directorio assets"
    exit 1
fi

# Verificar index.html
if [ ! -f "$DIST_DIR/index.html" ]; then
    echo "❌ ERROR: No se encontró index.html en el build"
    exit 1
fi

# Verificar y configurar favicon.ico
echo "🔍 Configurando favicon..."
if [ ! -f "$DIST_DIR/favicon.ico" ]; then
    echo "⚠️ Copiando favicon desde public..."
    cp "$FRONTEND_DIR/public/favicon.ico" "$DIST_DIR/favicon.ico"
    handle_error $? "Error al copiar favicon"
fi

# Configurar fuentes personalizadas
echo "🔤 Configurando fuentes personalizadas..."

# Crear directorio de fuentes en dist/assets
mkdir -p "$DIST_DIR/assets/fonts"
handle_error $? "Error al crear directorio de fuentes en dist"

# Copiar fuente ROBO al directorio de distribución
if [ -f "$FRONTEND_DIR/src/assets/fonts/ROBO.woff2" ]; then
    echo "📝 Copiando fuente ROBO a dist..."
    cp "$FRONTEND_DIR/src/assets/fonts/ROBO.woff2" "$DIST_DIR/assets/fonts/"
    handle_error $? "Error al copiar fuente ROBO a dist"
    
    # Configurar permisos de la fuente en dist
    chmod 644 "$DIST_DIR/assets/fonts/ROBO.woff2"
    sudo chown $CURRENT_USER:www-data "$DIST_DIR/assets/fonts/ROBO.woff2"
    handle_error $? "Error al configurar permisos de la fuente en dist"
else
    echo "⚠️ Archivo de fuente ROBO.woff2 no encontrado"
fi

# Copiar CSS de la fuente
if [ -f "$FRONTEND_DIR/src/assets/fonts/ROBO.css" ]; then
    echo "📝 Copiando CSS de la fuente..."
    cp "$FRONTEND_DIR/src/assets/fonts/ROBO.css" "$DIST_DIR/assets/fonts/"
    handle_error $? "Error al copiar CSS de la fuente"
    
    # Configurar permisos del CSS
    chmod 644 "$DIST_DIR/assets/fonts/ROBO.css"
    handle_error $? "Error al configurar permisos del CSS de la fuente"
else
    echo "⚠️ Archivo ROBO.css no encontrado"
fi

# Configurar permisos
echo "🔒 Configurando permisos..."

# Permisos para dist
sudo chown -R $CURRENT_USER:www-data $DIST_DIR
sudo chmod -R 755 $DIST_DIR
handle_error $? "Error al configurar permisos del directorio dist"

# Permisos específicos para archivos
find $DIST_DIR -type f -exec sudo chmod 644 {} \;
handle_error $? "Error al configurar permisos de archivos"

# Permisos específicos para directorios
find $DIST_DIR -type d -exec sudo chmod 755 {} \;
handle_error $? "Error al configurar permisos de directorios"

# Verificar Nginx
echo "🔍 Verificando configuración de Nginx..."
sudo nginx -t
handle_error $? "Error en la configuración de Nginx"

# Reiniciar Nginx
echo "🔄 Reiniciando Nginx..."
sudo systemctl restart nginx
handle_error $? "Error al reiniciar Nginx"

# Verificar estado de servicios
echo "🔍 Verificando estado de servicios..."

echo "📋 Estado de Nginx:"
sudo systemctl status nginx --no-pager
handle_error $? "Error al verificar estado de Nginx"

echo "📋 Últimas líneas del log de error de Nginx:"
sudo tail -n 20 /var/log/nginx/error.log

# Verificar acceso a archivos críticos
echo "🔍 Verificando acceso a archivos críticos..."

files_to_check=(
    "$DIST_DIR/index.html"
    "$DIST_DIR/favicon.ico"
    "$ASSETS_DIR"
)

for file in "${files_to_check[@]}"; do
    if [ -e "$file" ]; then
        echo "✅ $file existe y es accesible"
        ls -l "$file"
    else
        echo "❌ ERROR: $file no existe o no es accesible"
        exit 1
    fi
done

echo "✅ ¡Despliegue del frontend completado! 🎉"
