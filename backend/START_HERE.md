# COMENZAR AQUÍ - Backend Flask

## Opción 1: Instalación Rápida (Recomendado)

### Windows
```bash
cd backend
setup.bat
python run_simple.py
```

### macOS/Linux
```bash
cd backend
chmod +x setup.sh
./setup.sh
python run_simple.py
```

## Opción 2: Instalación Manual (Si la anterior no funciona)

### Paso 1: Crear ambiente virtual
```bash
cd backend

# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### Paso 2: Instalar dependencias
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### Paso 3: Ejecutar el servidor
```bash
python run_simple.py
```

## ¿Qué sucede si ves errores?

### Error: "No module named 'flask'"
```bash
# Asegúrate que el venv está activado
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate

# Luego instala de nuevo
pip install -r requirements.txt
```

### Error: "Port 5000 already in use"
```bash
# Cambiar puerto en run_simple.py, línea ~103
# Cambiar: app.run(debug=True, host='0.0.0.0', port=5000)
# Por: app.run(debug=True, host='0.0.0.0', port=5001)
```

### Error: "ModuleNotFoundError" con rutas
- Verifica que los archivos `__init__.py` existen en:
  - backend/routes/__init__.py
  - backend/services/__init__.py

## Verificar que funciona

Abre en el navegador:
- http://localhost:5000 - Debe mostrar: `{"message": "Escuela de Emprendimiento API v1.0"}`
- http://localhost:5000/api/health - Debe mostrar: `{"status": "ok", "message": "Backend is running"}`

## Una vez que funciona

### Crear usuarios de prueba
Abre otra terminal y ejecuta:
```bash
cd backend
python seed.py
```

Esto creará:
- Profesor: profesor1@escuela.com / Password123
- Estudiante: estudiante1@escuela.com / Password123

### Testear endpoints
En otra terminal:
```bash
cd backend
python test_api.py
```

## Frontend

Cuando el backend esté corriendo, en otra terminal:
```bash
npm run dev
```

Accede a: http://localhost:3000

## Errores Comunes

| Error | Solución |
|-------|----------|
| `FileNotFoundError: [Errno 2] No such file or directory` | Asegúrate que estás en la carpeta `/backend` |
| `SyntaxError` | Usa Python 3.8+ |
| `pip: command not found` | Usa `pip3` en lugar de `pip` |
| Database locked | Cierra otras instancias del servidor |

## Archivos Importantes

- `app.py` - Archivo principal (versión con manejo de errores)
- `run_simple.py` - Versión simple de inicio (sin dependencias complicadas)
- `config.py` - Configuración (funciona sin .env)
- `models.py` - Modelos de base de datos
- `routes/` - Endpoints API
- `services/email_service.py` - Servicio de email (opcional)

## Debugging

Si necesitas ver qué está pasando exactamente:

```bash
# Ver todas las líneas [v0] que hemos agregado
python run_simple.py 2>&1 | grep "\[v0\]"
```

## Soporte

Si sigue sin funcionar, crea un issue con:
1. Tu sistema operativo
2. Versión de Python (`python --version`)
3. Error completo que ves
4. Terminal output

## Siguiente paso

Una vez que el backend esté corriendo, puedes:
1. Ejecutar `python seed.py` para datos de prueba
2. Iniciar el frontend: `npm run dev`
3. Acceder a http://localhost:3000

¡Éxito!
