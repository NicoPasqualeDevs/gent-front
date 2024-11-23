#!/bin/bash

echo "Iniciando despliegue del frontend..."

# Directorio del frontend
FRONTEND_DIR="/home/nicolas_german_pasquale/gents-front"
# Directorio de Django static
DJANGO_STATIC_DIR="/home/nicolas_german_pasquale/gents-back/static"
DJANGO_FRONTEND_DIR="/home/nicolas_german_pasquale/gents-back/static/frontend"
LOGS_DIR="/home/nicolas_german_pasquale/gents-back/static/logs"
CURRENT_USER=$(whoami)

# Ir al directorio del frontend
cd $FRONTEND_DIR

# Actualizar desde el repositorio
echo "Actualizando código desde el repositorio..."
git reset --hard
git clean -fd
git fetch origin
git reset --hard origin/main
chmod +x deploy.sh

# Instalar dependencias
echo "Instalando dependencias..."
npm install

# Construir la aplicación
echo "Construyendo la aplicación..."
npm run build

# Ajustar permisos
echo "Ajustando permisos..."
sudo chown -R www-data:www-data $DJANGO_STATIC_DIR
sudo chown -R $CURRENT_USER:$CURRENT_USER $DJANGO_STATIC_DIR
sudo chmod -R 755 $DJANGO_STATIC_DIR

# Crear el directorio frontend si no existe
echo "Preparando directorio static..."
sudo mkdir -p $DJANGO_FRONTEND_DIR

# Crear archivo de log si no existe
sudo mkdir -p $LOGS_DIR
sudo touch $LOGS_DIR/django.log
sudo chown www-data:www-data $LOGS_DIR/django.log
sudo chown $CURRENT_USER:$CURRENT_USER $LOGS_DIR/django.log
sudo chmod 644 $LOGS_DIR/django.log


# Limpiar el directorio frontend anterior
echo "Limpiando archivos anteriores..."
sudo rm -rf $DJANGO_FRONTEND_DIR/*

# Copiar los nuevos archivos
echo "Copiando nuevos archivos..."
sudo cp -r dist/* $DJANGO_FRONTEND_DIR/

# Recolectar archivos estáticos de Django
echo "Recolectando archivos estáticos de Django..."
cd /home/nicolas_german_pasquale/gents-ia/gents
source ../../gentsvenv/bin/activate
python manage.py collectstatic --noinput

# Reiniciar servicios
echo "Reiniciando servicios..."
sudo systemctl restart nginx
sudo systemctl restart gunicorn

echo "Despliegue completado!"
