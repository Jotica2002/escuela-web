# ⚡ Quick Start - 5 Minutos

Inicia el proyecto en 5 minutos.

## 🚀 Paso 1: Clonar/Abrir Proyecto

```bash
cd proyecto
```

## 🔥 Paso 2: Instalar Backend

### En Windows:
```bash
cd backend
setup.bat
```

### En macOS/Linux:
```bash
cd backend
chmod +x setup.sh
./setup.sh
```

**Esto hace:**
- ✅ Crear entorno virtual
- ✅ Instalar dependencias
- ✅ Crear archivo .env
- ✅ Inicializar base de datos
- ✅ Poblar datos de prueba

## 🎨 Paso 3: Instalar Frontend

```bash
cd ..
npm install
```

## ▶️ Paso 4: Ejecutar en 2 Terminales

### Terminal 1 - Backend:
```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
python app.py
```

**Esperado:**
```
 * Running on http://127.0.0.1:5000
```

### Terminal 2 - Frontend:
```bash
npm run dev
```

**Esperado:**
```
- Local:        http://localhost:3000
```

## 🌐 Paso 5: Abrir en Navegador

Ir a: **http://localhost:3000**

## 🔑 Paso 6: Login

Usa cualquiera de estas credenciales:

### Como Profesor:
- Email: `profesor1@escuela.com`
- Password: `Password123`

### Como Estudiante:
- Email: `estudiante1@escuela.com`
- Password: `Password123`

## ✅ Listo!

Ya tienes la aplicación funcionando:
- 📚 Frontend: http://localhost:3000
- 🔌 Backend API: http://localhost:5000/api
- 🗄️ Database: SQLite local (backend/escuela.db)

## 🎯 Prueba Estas Acciones

### Como Estudiante:
1. Ver cursos disponibles
2. Inscribirse a un curso
3. Ver mis cursos

### Como Profesor:
1. Crear propuesta de curso
2. Ver estado de propuestas
3. Editar propuesta

## 🧪 Probar API (Opcional)

```bash
cd backend
python test_api.py
```

Ejecuta 15 tests automatizados.

## 📝 Notas Importantes

- El backend usa **SQLite** (perfecto para desarrollo)
- Los datos de prueba están automáticamente cargados
- Los tokens JWT se guardan en `localStorage`
- El CORS ya está configurado para conexión local

## 🆘 Si Algo Falla

### Puerto 5000 o 3000 ocupado
```bash
# Cambiar puerto backend (app.py línea final)
app.run(port=5001)

# Cambiar puerto frontend
npm run dev -- -p 3001
```

### "Module not found" en Backend
```bash
cd backend
source venv/bin/activate  # o venv\Scripts\activate
pip install -r requirements.txt
```

### "Cannot find module" en Frontend
```bash
npm install
# o
npm ci
```

### Base de datos vacía
```bash
cd backend
python seed.py
```

## 📚 Documentación Completa

- **GUIA_COMPLETA.md** - Guía detallada
- **API_INTEGRATION.md** - Cómo funciona la integración
- **RESUMEN_PROYECTO.md** - Visión general del proyecto
- **backend/README.md** - Documentación backend
- **/README.md** - Documentación frontend

## 🚢 Próximos Pasos

1. ✅ **Entender la arquitectura** → Leer RESUMEN_PROYECTO.md
2. ✅ **Explorar endpoints** → Ver API_INTEGRATION.md
3. ✅ **Hacer cambios** → Editar componentes y rutas
4. ✅ **Deploy** → Ver sección en GUIA_COMPLETA.md

## 💡 Estructura Base

```
Frontend                         Backend
   |                              |
   +-- Login/Signup          +-- Auth Endpoints
   |                              |
   +-- Student Dashboard     +-- Student Routes
   |   - Ver cursos              |
   |   - Inscribirse         +-- Course Routes
   |   - Mi perfil                |
   |                          +-- Statistics
   +-- Teacher Dashboard      |
       - Crear propuestas    +-- Email Service
       - Ver propuestas
```

## 🎓 Flujo Básico de Usuario

```
1. Abrir http://localhost:3000
   ↓
2. Ver página de login
   ↓
3. Hacer clic en "Registrarse" o usar credencial de prueba
   ↓
4. Login exitoso → Se obtiene JWT token
   ↓
5. Token se guarda en localStorage
   ↓
6. Redirect a dashboard (student o teacher)
   ↓
7. Navegar y usar la aplicación
```

## 🎉 ¡Éxito!

Tu plataforma educativa está corriendo. Ahora puedes:
- 🧪 Probar funcionalidades
- 🔧 Hacer modificaciones
- 📈 Agregar nuevas features
- 🚀 Hacer deploy

---

**¿Necesitas ayuda?** Ver GUIA_COMPLETA.md
