# 📁 Estructura Completa del Proyecto

## Árbol de Directorios

```
escuela-emprendimiento/
│
├── 📄 QUICK_START.md                    # Guía rápida (EMPIEZA AQUÍ)
├── 📄 GUIA_COMPLETA.md                  # Guía detallada
├── 📄 API_INTEGRATION.md                # Guía de integración
├── 📄 RESUMEN_PROYECTO.md               # Resumen del proyecto
├── 📄 PROJECT_STRUCTURE.md              # Este archivo
│
├── 📄 package.json                      # Frontend dependencies
├── 📄 tsconfig.json                     # TypeScript config
├── 📄 next.config.mjs                   # Next.js config
├── 📄 .env.example                      # Env variables example
│
├── 📁 app/                              # Next.js App Router
│   ├── layout.tsx                       # Root layout con AuthProvider
│   ├── page.tsx                         # Home page (redirect a login/dashboard)
│   ├── globals.css                      # Global styles + design tokens
│   │
│   ├── 📁 (auth)/                       # Auth group route
│   │   ├── login/
│   │   │   └── page.tsx                 # Login page
│   │   └── signup/
│   │       └── page.tsx                 # Signup page
│   │
│   ├── 📁 student/                      # Student protected route
│   │   └── page.tsx                     # Student dashboard
│   │
│   ├── 📁 teacher/                      # Teacher protected route
│   │   └── page.tsx                     # Teacher dashboard
│   │
│   ├── not-found.tsx                    # 404 page
│   └── error.tsx                        # Error boundary (si lo necesitas)
│
├── 📁 components/                       # React components
│   ├── 📁 ui/                           # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── dialog.tsx
│   │   ├── form.tsx
│   │   ├── select.tsx
│   │   ├── skeleton.tsx
│   │   └── ... (otros componentes shadcn)
│   │
│   ├── AuthContext.tsx                  # (En contexts/) - Context de autenticación
│   ├── ProtectedRoute.tsx               # Protector de rutas
│   ├── SonnerProvider.tsx               # Proveedor de notificaciones
│   │
│   ├── StudentHeader.tsx                # Header del dashboard estudiante
│   ├── StudentProfile.tsx               # Perfil del estudiante
│   ├── StudentStats.tsx                 # Estadísticas del estudiante
│   │
│   ├── TeacherHeader.tsx                # Header del dashboard profesor
│   ├── TeacherStats.tsx                 # Estadísticas del profesor
│   │
│   ├── CourseCard.tsx                   # Card de curso
│   ├── CourseList.tsx                   # Lista de cursos
│   ├── CourseProposalForm.tsx           # Formulario de propuesta
│   ├── ProposalsTable.tsx               # Tabla de propuestas
│   │
│   └── ... (otros componentes)
│
├── 📁 contexts/                         # Context API
│   └── AuthContext.tsx                  # Contexto global de autenticación
│
├── 📁 hooks/                            # Custom React hooks
│   ├── use-mobile.tsx                   # Hook para detectar mobile
│   └── use-toast.ts                     # Hook para notificaciones
│
├── 📁 lib/                              # Librerías y utilidades
│   ├── api.ts                           # Cliente API (fetch centralizado)
│   ├── utils.ts                         # Utilidades (cn function)
│   └── ... (otras utilidades)
│
├── 📁 public/                           # Archivos estáticos
│   ├── icon-light-32x32.png
│   ├── icon-dark-32x32.png
│   ├── icon.svg
│   └── apple-icon.png
│
├── 📁 backend/                          # Backend Flask
│   │
│   ├── app.py                           # Aplicación principal Flask
│   ├── config.py                        # Configuración (dev, test, prod)
│   ├── models.py                        # Modelos SQLAlchemy (5 modelos)
│   ├── seed.py                          # Script para poblar datos
│   ├── test_api.py                      # Tests de API
│   │
│   ├── 📁 routes/                       # Blueprints de rutas (27 endpoints)
│   │   ├── auth.py                      # Autenticación (6 endpoints)
│   │   │   ├── POST /auth/signup
│   │   │   ├── POST /auth/login
│   │   │   ├── GET /auth/me
│   │   │   ├── POST /auth/change-password
│   │   │   ├── POST /auth/logout
│   │   │   └── GET /auth/profile
│   │   │
│   │   ├── cursos.py                    # Gestión de cursos (6 endpoints)
│   │   │   ├── GET /cursos
│   │   │   ├── GET /cursos/<id>
│   │   │   ├── GET /cursos/categorias
│   │   │   ├── POST /cursos/crear
│   │   │   ├── PUT /cursos/<id>
│   │   │   └── DELETE /cursos/<id>
│   │   │
│   │   ├── estudiante.py                # Rutas de estudiante (5 endpoints)
│   │   │   ├── GET /estudiante/perfil
│   │   │   ├── GET /estudiante/cursos
│   │   │   ├── POST /estudiante/inscribirse/<id>
│   │   │   ├── POST /estudiante/cancelar-inscripcion/<id>
│   │   │   └── GET /estudiante/auditorias
│   │   │
│   │   ├── profesor.py                  # Rutas de profesor (6 endpoints)
│   │   │   ├── GET /profesor/perfil
│   │   │   ├── GET /profesor/propuestas
│   │   │   ├── POST /profesor/propuestas
│   │   │   ├── PUT /profesor/propuestas/<id>
│   │   │   ├── DELETE /profesor/propuestas/<id>
│   │   │   └── GET /profesor/auditorias
│   │   │
│   │   └── estadisticas.py              # Estadísticas (4 endpoints)
│   │       ├── GET /estadisticas/propuestas
│   │       ├── GET /estadisticas/estudiante
│   │       ├── GET /estadisticas/generales
│   │       └── GET /estadisticas/cursos/<id>
│   │
│   ├── 📁 services/                     # Servicios
│   │   └── email_service.py             # Servicio de email + notificaciones
│   │
│   ├── 📁 migrations/                   # Migraciones (si usas Alembic)
│   │
│   ├── requirements.txt                 # Dependencies Python
│   ├── .env.example                     # Variables de entorno ejemplo
│   ├── .gitignore                       # Git ignore
│   │
│   ├── Dockerfile                       # Docker config
│   ├── docker-compose.yml               # Docker compose
│   │
│   ├── setup.sh                         # Script setup Linux/Mac
│   ├── setup.bat                        # Script setup Windows
│   │
│   └── README.md                        # Documentación backend
│
├── 📁 .github/                          # GitHub (opcional)
│   └── workflows/                       # CI/CD workflows (opcional)
│
└── 📁 node_modules/                     # Dependencias Node (generado)
```

## 📊 Estadísticas de Archivos

### Frontend
- Páginas: 5 (login, signup, student, teacher, 404)
- Componentes: 10+
- Hooks: 2
- Librerías: 1 (api.ts)
- Contextos: 1

### Backend
- Rutas: 27 endpoints
- Modelos: 5
- Servicios: 1
- Blueprints: 5

## 🔄 Flujo de Datos

```
Frontend (Next.js)
    ↓
    + AuthContext (localStorage)
    + lib/api.ts (fetch)
    ↓
Backend (Flask)
    ↓
    + Routes (27 endpoints)
    + Services (email)
    + Models (SQLAlchemy)
    ↓
Database (SQLite)
    + usuarios
    + cursos
    + inscripciones
    + propuestas_cursos
    + auditorias
```

## 🔐 Capas de Seguridad

```
Request
  ↓
CORS Check (Flask)
  ↓
JWT Validation
  ↓
Role Check
  ↓
Route Handler
  ↓
Database Query
  ↓
Audit Log
  ↓
Response
```

## 📦 Dependencias Principales

### Frontend (package.json)
```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "tailwindcss": "^4.0.0",
    "@radix-ui/react-*": "latest",
    "sonner": "latest",
    "swr": "^2.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "tailwindcss": "^4.0.0",
    "postcss": "^8.0.0"
  }
}
```

### Backend (requirements.txt)
```
Flask==3.0.0
Flask-SQLAlchemy==3.1.1
Flask-JWT-Extended==4.5.2
Flask-CORS==4.0.0
bcrypt==4.1.1
python-dotenv==1.0.0
Flask-Mail==0.9.1
marshmallow==3.20.1
```

## 🗄️ Base de Datos - Modelos

### Usuario
```sql
CREATE TABLE usuarios (
  id INTEGER PRIMARY KEY,
  email VARCHAR(120) UNIQUE NOT NULL,
  nombre VARCHAR(120) NOT NULL,
  apellido VARCHAR(120) NOT NULL,
  contraseña_hash VARCHAR(255) NOT NULL,
  rol VARCHAR(20) DEFAULT 'student',
  activo BOOLEAN DEFAULT TRUE,
  created_at DATETIME,
  updated_at DATETIME
);
```

### Curso
```sql
CREATE TABLE cursos (
  id INTEGER PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  descripcion TEXT NOT NULL,
  duracion_horas INTEGER NOT NULL,
  nivel VARCHAR(50),
  categoria VARCHAR(100) NOT NULL,
  requisitos TEXT,
  estado VARCHAR(20),
  capacidad_maxima INTEGER DEFAULT 30,
  created_at DATETIME,
  updated_at DATETIME
);
```

### Inscripción
```sql
CREATE TABLE inscripciones (
  id INTEGER PRIMARY KEY,
  estudiante_id INTEGER FOREIGN KEY,
  curso_id INTEGER FOREIGN KEY,
  estado VARCHAR(20),
  calificacion FLOAT,
  created_at DATETIME,
  updated_at DATETIME,
  UNIQUE(estudiante_id, curso_id)
);
```

### PropuestaCurso
```sql
CREATE TABLE propuestas_cursos (
  id INTEGER PRIMARY KEY,
  profesor_id INTEGER FOREIGN KEY,
  nombre VARCHAR(150) NOT NULL,
  descripcion TEXT NOT NULL,
  duracion_horas INTEGER NOT NULL,
  nivel VARCHAR(50),
  categoria VARCHAR(100) NOT NULL,
  requisitos TEXT,
  objetivos TEXT,
  metodologia TEXT,
  estado VARCHAR(20),
  motivo_rechazo TEXT,
  created_at DATETIME,
  updated_at DATETIME
);
```

### Auditoria
```sql
CREATE TABLE auditorias (
  id INTEGER PRIMARY KEY,
  usuario_id INTEGER FOREIGN KEY,
  accion VARCHAR(100) NOT NULL,
  tabla_afectada VARCHAR(50) NOT NULL,
  registro_id INTEGER,
  detalles JSON,
  created_at DATETIME
);
```

## 🔀 Rutas Principales

### Públicas
- GET `/` → Home (redirect)
- GET `/login` → Login page
- GET `/signup` → Signup page
- GET `/api/health` → Health check
- GET `/api/cursos` → Lista de cursos

### Protegidas - Estudiante
- GET `/student` → Dashboard
- GET `/api/estudiante/*` → Rutas estudiante

### Protegidas - Profesor
- GET `/teacher` → Dashboard
- GET `/api/profesor/*` → Rutas profesor

## 🎯 Puntos de Extensión

Dónde agregar nuevas features:

1. **Nuevo endpoint**: Crear en `backend/routes/`
2. **Nuevo modelo**: Agregar en `backend/models.py`
3. **Nuevo componente**: Crear en `components/`
4. **Nuevo servicio**: Crear en `backend/services/`
5. **Nueva página**: Crear en `app/`
6. **Nueva ruta protegida**: Usar `<ProtectedRoute>` component

## 🚀 Deployment

### Frontend (Vercel)
- Conectar repo GitHub
- Build: `npm run build`
- Output: `.next`

### Backend (Heroku/Railway)
- Connectar repo GitHub
- Procfile: `web: gunicorn app:create_app()`
- Python 3.11

### Base de Datos (Neon/Render)
- PostgreSQL
- Cambiar `DATABASE_URL` en config

## 📚 Referencias Rápidas

- **Frontend Docs**: https://nextjs.org
- **React Docs**: https://react.dev
- **Tailwind Docs**: https://tailwindcss.com
- **shadcn/ui**: https://ui.shadcn.com
- **Flask Docs**: https://flask.palletsprojects.com
- **SQLAlchemy**: https://sqlalchemy.org

---

**Última actualización**: 30 de Enero de 2026
**Versión**: 1.0.0
