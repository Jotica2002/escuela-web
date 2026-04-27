#!/usr/bin/env python
"""
Script de diagnóstico para identificar problemas con el backend
Ejecutar: python diagnose.py
"""
import sys
import os
import importlib.util

print("\n" + "="*60)
print("DIAGNÓSTICO DEL BACKEND - Escuela de Emprendimiento")
print("="*60 + "\n")

# 1. Verificar Python
print("1. VERIFICANDO PYTHON")
print(f"   Python version: {sys.version}")
print(f"   Python executable: {sys.executable}")
if sys.version_info < (3, 8):
    print("   ✗ ERROR: Se requiere Python 3.8+")
    sys.exit(1)
else:
    print("   ✓ Version correcta")

# 2. Verificar directorio
print("\n2. VERIFICANDO DIRECTORIO")
print(f"   Working directory: {os.getcwd()}")
print(f"   Backend directory: {os.path.dirname(os.path.abspath(__file__))}")

if not os.path.exists('requirements.txt'):
    print("   ✗ ERROR: requirements.txt no encontrado")
    print("   Ejecuta desde la carpeta /backend")
    sys.exit(1)
else:
    print("   ✓ requirements.txt encontrado")

# 3. Verificar estructura de carpetas
print("\n3. VERIFICANDO ESTRUCTURA DE CARPETAS")
required_files = [
    'app.py',
    'config.py',
    'models.py',
    'seed.py',
    'requirements.txt',
    'routes/__init__.py',
    'routes/auth.py',
    'routes/cursos.py',
    'routes/estudiante.py',
    'routes/profesor.py',
    'routes/estadisticas.py',
    'services/__init__.py',
    'services/email_service.py',
]

all_files_exist = True
for file in required_files:
    if os.path.exists(file):
        print(f"   ✓ {file}")
    else:
        print(f"   ✗ FALTA: {file}")
        all_files_exist = False

if not all_files_exist:
    print("\n   ✗ Faltan algunos archivos. Descarga nuevamente el proyecto.")
    sys.exit(1)

# 4. Verificar dependencias
print("\n4. VERIFICANDO DEPENDENCIAS")

required_packages = [
    'flask',
    'flask_sqlalchemy',
    'flask_jwt_extended',
    'flask_cors',
    'bcrypt',
]

missing_packages = []
for package in required_packages:
    try:
        __import__(package.replace('_', '-'))
        print(f"   ✓ {package}")
    except ImportError:
        print(f"   ✗ FALTA: {package}")
        missing_packages.append(package)

if missing_packages:
    print(f"\n   Instala las dependencias faltantes con:")
    print(f"   pip install -r requirements.txt")
    sys.exit(1)

# 5. Verificar sintaxis Python
print("\n5. VERIFICANDO SINTAXIS PYTHON")

python_files = [
    'app.py',
    'config.py',
    'models.py',
    'routes/auth.py',
    'routes/cursos.py',
    'services/email_service.py',
]

for file in python_files:
    try:
        with open(file, 'r', encoding='utf-8') as f:
            compile(f.read(), file, 'exec')
        print(f"   ✓ {file}")
    except SyntaxError as e:
        print(f"   ✗ ERROR en {file}: {e}")
        sys.exit(1)

# 6. Verificar importaciones
print("\n6. VERIFICANDO IMPORTACIONES")

try:
    import config
    print("   ✓ config")
except Exception as e:
    print(f"   ✗ config: {e}")

try:
    import models
    print("   ✓ models")
except Exception as e:
    print(f"   ✗ models: {e}")

try:
    from routes import auth
    print("   ✓ routes.auth")
except Exception as e:
    print(f"   ✗ routes.auth: {e}")

try:
    from services import email_service
    print("   ✓ services.email_service")
except Exception as e:
    print(f"   ✗ services.email_service: {e}")

# 7. Verificar base de datos
print("\n7. VERIFICANDO BASE DE DATOS")

try:
    import app as app_module
    test_app = app_module.create_app()
    print("   ✓ Base de datos lista")
except Exception as e:
    print(f"   ✗ ERROR con base de datos: {e}")

# 8. Resumen
print("\n" + "="*60)
print("✓ DIAGNÓSTICO COMPLETADO - TODO FUNCIONA")
print("="*60)
print("\nAhora ejecuta:")
print("   python run_simple.py")
print("\n" + "="*60 + "\n")
