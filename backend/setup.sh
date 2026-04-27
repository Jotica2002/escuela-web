#!/bin/bash

# Script de configuración inicial del backend

echo "🚀 Configurando Backend - Escuela de Emprendimiento"
echo ""

# Crear entorno virtual
echo "📦 Creando entorno virtual..."
python -m venv venv

# Activar entorno virtual
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi

# Instalar dependencias
echo "📚 Instalando dependencias..."
pip install -r requirements.txt

# Copiar .env
if [ ! -f .env ]; then
    echo "⚙️  Creando archivo .env..."
    cp .env.example .env
    echo "✅ Archivo .env creado. Por favor, actualiza los valores!"
else
    echo "✅ Archivo .env ya existe"
fi

# Crear base de datos
echo "🗄️  Inicializando base de datos..."
python -c "
from app import create_app
from models import db

app = create_app()
with app.app_context():
    db.create_all()
    print('✅ Base de datos creada')
"

# Preguntar si desea poblar datos de prueba
read -p "¿Deseas poblar la base de datos con datos de prueba? (s/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Ss]$ ]]; then
    echo "🌱 Poblando base de datos..."
    python seed.py
fi

echo ""
echo "✨ ¡Configuración completada!"
echo ""
echo "Para iniciar el servidor, ejecuta:"
echo "python app.py"
echo ""
