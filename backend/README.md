# Backend - Escuela de Emprendimiento

Backend Flask para la Escuela de Emprendimiento Antonio Patricio de Alcalá.

## Características

- ✅ Autenticación con JWT
- ✅ Roles de usuario (Estudiante, Profesor)
- ✅ Gestión de cursos e inscripciones
- ✅ Propuestas de cursos de profesores
- ✅ Notificaciones por email
- ✅ Sistema de auditoría
- ✅ Estadísticas y reportes
- ✅ SQLite para desarrollo (fácil migración a PostgreSQL)

## Requisitos

- Python 3.8+
- pip

## Instalación

### 1. Clonar el repositorio

```bash
cd backend
```

### 2. Crear entorno virtual

```bash
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
```

### 3. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 4. Configurar variables de entorno

Copia `.env.example` a `.env` y configura los valores:

```bash
cp .env.example .env
```

Edita `.env` con tus valores:

```env
FLASK_ENV=development
SECRET_KEY=tu-clave-secreta-muy-segura
JWT_SECRET_KEY=tu-jwt-secret
DATABASE_URL=sqlite:///escuela.db
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=tu-email@gmail.com
MAIL_PASSWORD=tu-contraseña-app
MAIL_DEFAULT_SENDER=tu-email@gmail.com
CORS_ORIGINS=http://localhost:3000
FRONTEND_URL=http://localhost:3000
```

### 5. Ejecutar el servidor

```bash
python app.py
```

El servidor estará disponible en `http://localhost:5000`

### 6. Sembrar la base de datos (opcional)

Para cargar datos de prueba:

```bash
python seed.py
```

## Estructura del Proyecto

```
backend/
├── app.py                 # Aplicación principal
├── config.py             # Configuración
├── models.py             # Modelos de base de datos
├── requirements.txt      # Dependencias
├── seed.py              # Script para sembrar datos
├── .env.example         # Variables de entorno de ejemplo
├── routes/              # Blueprints de rutas
│   ├── auth.py         # Autenticación
│   ├── cursos.py       # Gestión de cursos
│   ├── estudiante.py   # Endpoints de estudiante
│   ├── profesor.py     # Endpoints de profesor
│   └── estadisticas.py # Estadísticas
└── services/            # Servicios
    └── email_service.py # Servicio de email
```

## Endpoints Principales

### Autenticación

- `POST /api/auth/signup` - Registrar usuario
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Perfil del usuario
- `POST /api/auth/change-password` - Cambiar contraseña
- `POST /api/auth/logout` - Logout

### Cursos

- `GET /api/cursos` - Listar cursos
- `GET /api/cursos/<id>` - Obtener detalles de curso
- `GET /api/cursos/categorias` - Listar categorías
- `POST /api/cursos/crear` - Crear curso (profesor)
- `PUT /api/cursos/<id>` - Actualizar curso (profesor)
- `DELETE /api/cursos/<id>` - Eliminar curso (profesor)

### Estudiante

- `GET /api/estudiante/perfil` - Perfil del estudiante
- `GET /api/estudiante/cursos` - Mis cursos
- `POST /api/estudiante/inscribirse/<id>` - Inscribirse a curso
- `POST /api/estudiante/cancelar-inscripcion/<id>` - Cancelar inscripción
- `GET /api/estudiante/auditorias` - Historial de auditoría

### Profesor

- `GET /api/profesor/perfil` - Perfil del profesor
- `GET /api/profesor/propuestas` - Mis propuestas
- `POST /api/profesor/propuestas` - Crear propuesta
- `PUT /api/profesor/propuestas/<id>` - Actualizar propuesta
- `DELETE /api/profesor/propuestas/<id>` - Eliminar propuesta
- `GET /api/profesor/auditorias` - Historial de auditoría

### Estadísticas

- `GET /api/estadisticas/propuestas` - Estadísticas de propuestas
- `GET /api/estadisticas/estudiante` - Estadísticas del estudiante
- `GET /api/estadisticas/generales` - Estadísticas generales (profesor)
- `GET /api/estadisticas/cursos/<id>` - Estadísticas de curso

## Credenciales de Prueba

Después de ejecutar `seed.py`:

**Profesores:**
- Email: `profesor1@escuela.com` / Contraseña: `Password123`
- Email: `profesor2@escuela.com` / Contraseña: `Password123`

**Estudiantes:**
- Email: `estudiante1@escuela.com` / Contraseña: `Password123`
- Email: `estudiante2@escuela.com` / Contraseña: `Password123`
- Email: `estudiante3@escuela.com` / Contraseña: `Password123`

## Configuración de Email

Para usar el servicio de email, necesitas:

1. Configurar una contraseña de aplicación en Gmail
2. Habilitar "Aplicaciones menos seguras" en tu cuenta de Google
3. Actualizar las variables de entorno con tu email y contraseña

## Deploy a Producción

### Con Gunicorn

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:create_app()
```

### Cambiar a PostgreSQL

1. Instala PostgreSQL
2. Cambia `DATABASE_URL` en `.env`:

```env
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/escuela_db
```

3. Instala el driver de PostgreSQL:

```bash
pip install psycopg2-binary
```

## Solución de Problemas

### Error: "JWT Token Error"

Asegúrate de incluir el token en el header `Authorization`:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

### Error: "Email no configurado"

Si no quieres usar email en desarrollo, los emails no se enviarán pero tampoco cauarán errores.

### Error de CORS

Verifica que `CORS_ORIGINS` en `.env` sea correcto.

## Licencia

MIT

## Soporte

Para reportar bugs o sugerencias, contacta al equipo de desarrollo.
