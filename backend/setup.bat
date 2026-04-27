@echo off

echo.
echo 🚀 Configurando Backend - Escuela de Emprendimiento
echo.

REM Crear entorno virtual
echo 📦 Creando entorno virtual...
python -m venv venv

REM Activar entorno virtual
call venv\Scripts\activate.bat

REM Instalar dependencias
echo 📚 Instalando dependencias...
pip install -r requirements.txt

REM Copiar .env
if not exist .env (
    echo ⚙️  Creando archivo .env...
    copy .env.example .env
    echo ✅ Archivo .env creado. Por favor, actualiza los valores!
) else (
    echo ✅ Archivo .env ya existe
)

REM Crear base de datos
echo 🗄️  Inicializando base de datos...
python -c "from app import create_app; from models import db; app = create_app(); app.app_context().push(); db.create_all(); print('Base de datos creada')"

echo.
echo ✨ ¡Configuración completada!
echo.
echo Para iniciar el servidor, ejecuta:
echo python app.py
echo.
pause
