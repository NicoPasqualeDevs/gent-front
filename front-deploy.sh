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

# Directorios actualizados
FRONTEND_DIR="/home/nicolas_german_pasquale/gents-front"
BACKEND_DIR="/home/nicolas_german_pasquale/gents-back"
BUILD_DIR="$BACKEND_DIR/static/frontend"

# Validar directorio frontend
validate_directory_permissions "$FRONTEND_DIR" "directorio frontend"
validate_directory_permissions "$BACKEND_DIR" "directorio backend"

# Configurar variables de usuario y grupo
CURRENT_USER=$(whoami)
WEB_GROUP="www-data"

# Asegurar que existe el directorio base static en el backend
echo "🔧 Configurando directorio static en backend..."
if [ ! -d "$BACKEND_DIR/static" ]; then
    echo "📁 Creando directorio static..."
    sudo mkdir -p "$BACKEND_DIR/static"
    handle_error $? "Error al crear directorio static"
    
    # Configurar permisos del directorio static
    sudo chown $CURRENT_USER:$WEB_GROUP "$BACKEND_DIR/static"
    sudo chmod 775 "$BACKEND_DIR/static"
    handle_error $? "Error al configurar permisos del directorio static"
fi

# Preparar directorio frontend
echo "🔧 Preparando directorio frontend..."
if [ -d "$BUILD_DIR" ]; then
    echo "🧹 Limpiando directorio frontend anterior..."
    sudo rm -rf "$BUILD_DIR"
    handle_error $? "Error al limpiar directorio frontend"
fi

echo "📁 Creando directorio frontend..."
sudo mkdir -p "$BUILD_DIR"
handle_error $? "Error al crear directorio frontend"

# Configurar permisos específicos para el directorio frontend
echo "🔒 Configurando permisos del directorio frontend..."
sudo chown $CURRENT_USER:$WEB_GROUP "$BUILD_DIR"
sudo chmod 775 "$BUILD_DIR"
handle_error $? "Error al configurar permisos del directorio frontend"

# Verificar permisos
echo "🔍 Verificando permisos..."
if [ ! -w "$BUILD_DIR" ]; then
    echo "❌ ERROR: No hay permisos de escritura en el directorio frontend"
    ls -la "$BUILD_DIR"
    exit 1
fi

# Ir al directorio del frontend
cd $FRONTEND_DIR
handle_error $? "No se pudo acceder al directorio del frontend"

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install
npm install terser --save-dev
handle_error $? "Error al instalar dependencias"

# Construir la aplicación
echo "🏗️ Construyendo la aplicación..."
npm run build
handle_error $? "Error al construir la aplicación"

# Después de la build, asegurar permisos recursivos
echo "🔒 Configurando permisos finales..."
sudo find "$BUILD_DIR" -type d -exec chmod 755 {} \;
sudo find "$BUILD_DIR" -type f -exec chmod 644 {} \;
sudo chown -R $CURRENT_USER:$WEB_GROUP "$BUILD_DIR"
handle_error $? "Error al configurar permisos finales"

# Verificar permisos finales
echo "🔍 Verificando permisos finales..."
ls -la "$BUILD_DIR"
ls -la "$BUILD_DIR/assets"

# Verificar estructura del build
echo "🔍 Verificando estructura del build..."

# Verificar que el directorio de build existe
if [ ! -d "$BUILD_DIR" ]; then
    echo "❌ ERROR: No se encontró el directorio de build en $BUILD_DIR"
    exit 1
fi

# Verificar contenido mínimo requerido
echo "🔍 Verificando contenido del build..."

# Lista de archivos y directorios requeridos
required_files=(
    "index.html"
    "assets"
    "assets/js"
    "assets/css"
    "manifest.json"
)

for file in "${required_files[@]}"; do
    if [ ! -e "$BUILD_DIR/$file" ]; then
        echo "❌ ERROR: No se encontró $file en el build"
        echo "Contenido actual de $BUILD_DIR:"
        ls -la "$BUILD_DIR"
        if [ -d "$BUILD_DIR/assets" ]; then
            echo "Contenido de assets:"
            ls -la "$BUILD_DIR/assets"
        fi
        exit 1
    else
        echo "✅ $file encontrado"
    fi
done

# Verificar que el directorio no está vacío
if [ ! "$(ls -A $BUILD_DIR)" ]; then
    echo "❌ ERROR: El directorio de build está vacío"
    exit 1
fi

# Verificar permisos de archivos críticos
echo "🔍 Verificando permisos de archivos críticos..."

critical_paths=(
    "$BUILD_DIR"
    "$BUILD_DIR/assets"
    "$BUILD_DIR/index.html"
)

for path in "${critical_paths[@]}"; do
    if [ -e "$path" ]; then
        echo "✅ $path existe"
        ls -l "$path"
        
        # Verificar permisos
        if [[ -d "$path" && ! -x "$path" ]]; then
            echo "❌ ERROR: El directorio $path no tiene permisos de ejecución"
            exit 1
        fi
        if [[ -f "$path" && ! -r "$path" ]]; then
            echo "❌ ERROR: El archivo $path no tiene permisos de lectura"
            exit 1
        fi
    else
        echo "❌ ERROR: $path no existe"
        exit 1
    fi
done

# Mostrar estructura final del build
echo "📁 Estructura final del build:"
tree "$BUILD_DIR" -L 2

# Verificar y configurar favicon.ico
echo "🔍 Configurando favicon..."
if [ ! -f "$BUILD_DIR/favicon.ico" ]; then
    echo "⚠️ Copiando favicon desde public..."
    cp "$FRONTEND_DIR/public/favicon.ico" "$BUILD_DIR/favicon.ico"
    handle_error $? "Error al copiar favicon"
fi

# Configurar fuentes personalizadas
echo "🔤 Configurando fuentes personalizadas..."

# Crear directorio de fuentes en dist/assets
mkdir -p "$BUILD_DIR/assets/fonts"
handle_error $? "Error al crear directorio de fuentes en dist"

# Copiar fuente ROBO al directorio de distribución
if [ -f "$FRONTEND_DIR/src/assets/fonts/ROBO.woff2" ]; then
    echo "📝 Copiando fuente ROBO a dist..."
    cp "$FRONTEND_DIR/src/assets/fonts/ROBO.woff2" "$BUILD_DIR/assets/fonts/"
    handle_error $? "Error al copiar fuente ROBO a dist"
    
    # Configurar permisos de la fuente en dist
    chmod 644 "$BUILD_DIR/assets/fonts/ROBO.woff2"
    sudo chown $CURRENT_USER:www-data "$BUILD_DIR/assets/fonts/ROBO.woff2"
    handle_error $? "Error al configurar permisos de la fuente en dist"
else
    echo "⚠️ Archivo de fuente ROBO.woff2 no encontrado"
fi

# Copiar CSS de la fuente
if [ -f "$FRONTEND_DIR/src/assets/fonts/ROBO.css" ]; then
    echo "📝 Copiando CSS de la fuente..."
    cp "$FRONTEND_DIR/src/assets/fonts/ROBO.css" "$BUILD_DIR/assets/fonts/"
    handle_error $? "Error al copiar CSS de la fuente"
    
    # Configurar permisos del CSS
    chmod 644 "$BUILD_DIR/assets/fonts/ROBO.css"
    handle_error $? "Error al configurar permisos del CSS de la fuente"
else
    echo "⚠️ Archivo ROBO.css no encontrado"
fi

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
    "$BUILD_DIR/index.html"
    "$BUILD_DIR/favicon.ico"
    "$BUILD_DIR/assets"
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

# Verificación más detallada de assets
echo "🔍 Verificando estructura de assets..."
asset_directories=(
    "assets/js"
    "assets/css"
    "assets/fonts"
)

for dir in "${asset_directories[@]}"; do
    if [ -d "$BUILD_DIR/$dir" ]; then
        echo "✅ $dir encontrado"
        echo "Contenido de $dir:"
        ls -la "$BUILD_DIR/$dir"
    else
        echo "ℹ️ $dir no presente (puede ser normal dependiendo de la build)"
    fi
done

# Verificar chunks de JavaScript
echo "🔍 Verificando archivos JavaScript..."
if ls "$BUILD_DIR/assets/js/"*index*.js 1> /dev/null 2>&1; then
    echo "✅ Archivo index.js encontrado"
else
    echo "❌ ERROR: No se encontró el archivo index.js"
    echo "Contenido de assets/js:"
    ls -la "$BUILD_DIR/assets/js"
    exit 1
fi

if ls "$BUILD_DIR/assets/js/"*vendor*.js 1> /dev/null 2>&1; then
    echo "✅ Chunk de vendor (React) encontrado"
else
    echo "❌ ERROR: No se encontró el chunk de vendor (React)"
    echo "Contenido de assets/js:"
    ls -la "$BUILD_DIR/assets/js"
    exit 1
fi

if ls "$BUILD_DIR/assets/js/"*mui*.js 1> /dev/null 2>&1; then
    echo "✅ Chunk de MUI encontrado"
else
    echo "❌ ERROR: No se encontró el chunk de MUI"
    echo "Contenido de assets/js:"
    ls -la "$BUILD_DIR/assets/js"
    exit 1
fi

# Configurar MIME types para JavaScript
echo "🔧 Configurando MIME types..."
NGINX_MIME_TYPES="/etc/nginx/mime.types"

# Verificar si ya existe la configuración de MIME type para JavaScript
if ! grep -q "application/javascript" "$NGINX_MIME_TYPES"; then
    sudo sed -i '/types {/a \    application/javascript  js;' "$NGINX_MIME_TYPES"
    echo "✅ MIME type JavaScript agregado"
fi

# Asegurar permisos correctos para archivos JavaScript
echo "🔒 Configurando permisos para archivos JavaScript..."
find "$BUILD_DIR/assets/js" -type f -name "*.js" -exec sudo chmod 644 {} \;
find "$BUILD_DIR/assets/js" -type f -name "*.js" -exec sudo chown $CURRENT_USER:$WEB_GROUP {} \;

# Verificar configuración de MIME types en Nginx
echo "🔍 Verificando configuración de MIME types en Nginx..."
if ! sudo nginx -T | grep -q "application/javascript"; then
    echo "⚠️ ADVERTENCIA: MIME type JavaScript no encontrado en la configuración de Nginx"
else
    echo "✅ MIME type JavaScript configurado correctamente"
fi

# Crear archivo de configuración personalizado para Nginx
echo "🔧 Configurando Nginx para JavaScript modules..."
NGINX_CONF="/etc/nginx/conf.d/javascript-mime.conf"

sudo tee "$NGINX_CONF" > /dev/null << EOF
types {
    application/javascript js;
    application/javascript mjs;
    text/javascript js;
    text/javascript mjs;
}

map \$sent_http_content_type \$x_content_type {
    "~*javascript" "nosniff";
    default "";
}

map \$uri \$javascript_content_type {
    "~\.js$" "application/javascript";
    default "";
}
EOF

# Verificar y ajustar la configuración del servidor Nginx
NGINX_SERVER_CONF="/etc/nginx/sites-available/default"

# Agregar las directivas necesarias si no existen
if ! grep -q "add_header X-Content-Type-Options nosniff;" "$NGINX_SERVER_CONF"; then
    sudo sed -i '/server {/a \    add_header X-Content-Type-Options nosniff;' "$NGINX_SERVER_CONF"
fi

if ! grep -q "add_header Content-Type" "$NGINX_SERVER_CONF"; then
    sudo sed -i '/location \/ {/a \        if ($javascript_content_type) {\n            add_header Content-Type $javascript_content_type;\n        }' "$NGINX_SERVER_CONF"
fi

# Verificar la configuración de Nginx
echo "🔍 Verificando configuración de Nginx..."
sudo nginx -t
handle_error $? "Error en la configuración de Nginx"

# Reiniciar Nginx para aplicar cambios
echo "🔄 Reiniciando Nginx..."
sudo systemctl restart nginx
handle_error $? "Error al reiniciar Nginx"

echo "✅ ¡Despliegue del frontend completado! 🎉"
