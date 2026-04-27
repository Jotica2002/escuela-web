# Escuela de Emprendimiento - Guía Completa

Guía de instalación y ejecución del sistema completo (Frontend + Backend).

## 📋 Tabla de Contenidos

1. [Requisitos](#requisitos)
2. [Instalación Rápida](#instalación-rápida)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Ejecución](#ejecución)
5. [Credenciales de Prueba](#credenciales-de-prueba)
6. [API Endpoints](#api-endpoints)
7. [Configuración Avanzada](#configuración-avanzada)

## 🔧 Requisitos

- **Node.js 18+** (para el frontend)
- **Python 3.8+** (para el backend)
- **npm** o **yarn** (gestor de paquetes Node)
- **Git** (opcional)

## 🚀 Instalación Rápida

### Opción 1: Con Scripts (Recomendado)

#### En Windows:

```bash
# Terminal en la carpeta del proyecto

# Instalar backend
cd backend
setup.bat

# En otra terminal, instalar frontend
cd ..
npm install
```

#### En macOS/Linux:

```bash
# Terminal en la carpeta del proyecto

# Instalar backend
cd backend
chmod +x setup.sh
./setup.sh

# En otra terminal, instalar frontend
cd ..
npm install
```

### Opción 2: Manual

#### Backend:

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python app.py
```

#### Frontend:

```bash
npm install
npm run dev
```

## 📁 Estructura del Proyecto

```
escuela-emprendimiento/
├── app/                    # Frontend Next.js
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── (auth)/            # Páginas de autenticación
│   ├── student/           # Dashboard estudiante
│   └── teacher/           # Dashboard profesor
├── components/            # Componentes React
│   ├── AuthContext.tsx
│   ├── ProtectedRoute.tsx
│   ├── StudentHeader.tsx
│   ├── TeacherHeader.tsx
│   └── ...
├── contexts/              # Context API
│   └── AuthContext.tsx
├── lib/                   # Utilidades
│   ├── api.ts            # Cliente API
│   └── utils.ts
├── backend/              # Backend Flask
│   ├── app.py           # Aplicación principal
│   ├── models.py        # Modelos de base de datos
│   ├── config.py        # Configuración
│   ├── routes/          # Blueprints de rutas
│   │   ├── auth.py
│   │   ├── cursos.py
│   │   ├── estudiante.py
│   │   ├── profesor.py
│   │   └── estadisticas.py
│   ├── services/        # Servicios
│   │   └── email_service.py
│   ├── seed.py          # Datos de prueba
│   ├── requirements.txt
│   └── .env.example
├── .env.example
└── package.json
```

## ▶️ Ejecución

### Terminal 1 - Backend

```bash
cd backend

# Activar entorno virtual
source venv/bin/activate  # Windows: venv\Scripts\activate

# Ejecutar servidor
python app.py
```

El backend estará disponible en: `http://localhost:5000`

### Terminal 2 - Frontend

```bash
# En la raíz del proyecto
npm run dev
```

El frontend estará disponible en: `http://localhost:3000`

### Ejecutar con Docker (Opcional)

```bash
cd backend
docker-compose up
```

## 🔑 Credenciales de Prueba

Después de ejecutar `python seed.py` en el backend:

### Profesores:
- **Email**: profesor1@escuela.com
- **Contraseña**: Password123

O:
- **Email**: profesor2@escuela.com
- **Contraseña**: Password123

### Estudiantes:
- **Email**: estudiante1@escuela.com
- **Contraseña**: Password123

O:
- **Email**: estudiante2@escuela.com
- **Contraseña**: Password123

O:
- **Email**: estudiante3@escuela.com
- **Contraseña**: Password123

## 📡 API Endpoints

### Autenticación

```
POST   /api/auth/signup           - Registrar nuevo usuario
POST   /api/auth/login            - Login
GET    /api/auth/me               - Perfil del usuario actual
POST   /api/auth/change-password  - Cambiar contraseña
POST   /api/auth/logout           - Logout
```

### Cursos

```
GET    /api/cursos                - Listar cursos activos
GET    /api/cursos/<id>           - Detalles de un curso
GET    /api/cursos/categorias     - Listar categorías
POST   /api/cursos/crear          - Crear curso (profesor)
PUT    /api/cursos/<id>           - Actualizar curso (profesor)
DELETE /api/cursos/<id>           - Eliminar curso (profesor)
```

### Estudiante

```
GET    /api/estudiante/perfil                    - Perfil del estudiante
GET    /api/estudiante/cursos                    - Mis cursos
POST   /api/estudiante/inscribirse/<curso_id>   - Inscribirse
POST   /api/estudiante/cancelar-inscripcion/<id> - Cancelar inscripción
GET    /api/estudiante/auditorias                - Historial
```

### Profesor

```
GET    /api/profesor/perfil           - Perfil del profesor
GET    /api/profesor/propuestas       - Mis propuestas
POST   /api/profesor/propuestas       - Crear propuesta
PUT    /api/profesor/propuestas/<id>  - Actualizar propuesta
DELETE /api/profesor/propuestas/<id>  - Eliminar propuesta
GET    /api/profesor/auditorias       - Historial
```

### Estadísticas

```
GET /api/estadisticas/propuestas    - Estadísticas de propuestas (profesor)
GET /api/estadisticas/estudiante    - Estadísticas personales (estudiante)
GET /api/estadisticas/generales     - Estadísticas del sistema (profesor)
GET /api/estadisticas/cursos/<id>   - Estadísticas de un curso
```

## ⚙️ Configuración Avanzada

### Cambiar Base de Datos a PostgreSQL

1. Instala PostgreSQL
2. Crea una base de datos:

```sql
CREATE DATABASE escuela_db;
```

3. Actualiza `.env`:

```env
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/escuela_db
```

4. Instala el driver:

```bash
pip install psycopg2-binary
```

### Configurar Email (Gmail)

1. Crea una contraseña de aplicación en tu cuenta de Google
2. Actualiza `.env`:

```env
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=tu-email@gmail.com
MAIL_PASSWORD=tu-contraseña-app
MAIL_DEFAULT_SENDER=tu-email@gmail.com
```

### Variables de Entorno Importantes

**Frontend** (`.env.local`):
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
```

**Backend** (`.env`):
```env
FLASK_ENV=development
SECRET_KEY=cambiar-en-produccion
JWT_SECRET_KEY=cambiar-en-produccion
DATABASE_URL=sqlite:///escuela.db
CORS_ORIGINS=http://localhost:3000
FRONTEND_URL=http://localhost:3000
```

## 🧪 Pruebas de API

Para probar los endpoints, ejecuta:

```bash
cd backend
python test_api.py
```

## 🐛 Solución de Problemas

### Error: "Module not found"

```bash
# Asegúrate de activar el entorno virtual
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Error: "CORS error"

Verifica que `CORS_ORIGINS` en `.env` sea correcto:
```env
CORS_ORIGINS=http://localhost:3000
```

### Error: "JWT Token Error"

Asegúrate de incluir el token en el header:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

### Base de datos está vacía

Ejecuta el seeder:
```bash
python seed.py
```

### Puerto 5000 o 3000 ya está en uso

Cambia el puerto en:
- Backend: Edita `app.py` línea final: `app.run(port=5001)`
- Frontend: `npm run dev -- -p 3001`

## 📚 Documentación Adicional

- **Backend**: Ver `/backend/README.md`
- **Frontend**: Ver `/README.md`

## 🚢 Deploy a Producción

### Backend (Gunicorn + Heroku)

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:create_app()
```

### Frontend (Vercel)

```bash
npm install -g vercel
vercel
```

## 📝 Licencia

MIT

## 💬 Soporte

Para preguntas o problemas, revisa los archivos README de cada carpeta o contacta al equipo de desarrollo.

---

**¡Listo para empezar! 🎉**

1. Ejecuta los scripts de instalación
2. Abre dos terminales
3. Inicia el backend en una y el frontend en la otra
4. Accede a `http://localhost:3000` en tu navegador
5. Usa las credenciales de prueba para login
