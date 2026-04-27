# Escuela de Emprendimiento - Plataforma Completa

Plataforma educativa profesional con **Frontend Next.js** + **Backend Flask** para la Escuela de Emprendimiento Antonio Patricio de Alcalá. Sistema completo de gestión de cursos, propuestas y usuarios con autenticación JWT.

**⭐ [EMPIEZA AQUÍ: QUICK_START.md](./QUICK_START.md)**

## ✨ Características Principales

### 🔐 Autenticación & Seguridad
- JWT tokens con expiración
- Bcrypt password hashing
- Roles diferenciados (Estudiante/Profesor)
- Protección de rutas por rol
- Validación de email y contraseña
- CORS configurado

### 👨‍🎓 Dashboard Estudiante
- Visualizar cursos disponibles (filtrados por categoría y nivel)
- Inscribirse a cursos
- Ver cursos inscritos (activos/completados)
- Estadísticas personales
- Historial de actividades

### 👨‍🏫 Dashboard Profesor
- Crear propuestas de cursos
- Ver estado de propuestas
- Editar/eliminar propuestas
- Estadísticas de propuestas
- Recibir notificaciones por email
- Historial de actividades

### 🎨 Diseño Profesional
- Tailwind CSS con paleta optimizada
- Componentes shadcn/ui reutilizables
- Paleta azul para estudiantes, naranja para profesores
- Responsive (móvil, tablet, desktop)
- Skeleton loaders durante carga
- Notificaciones con Sonner

### 📡 Backend Robusto
- 27 endpoints API RESTful
- Base de datos normalizada (SQLite/PostgreSQL)
- Sistema de auditoría completo
- Notificaciones por email
- Manejo de errores profesional

## 🚀 Inicio Rápido (5 minutos)

### Requisitos
- **Node.js 18+**
- **Python 3.8+**
- **npm** o **yarn**

### Instalación Automática

#### Windows:
```bash
cd backend
setup.bat
```

#### macOS/Linux:
```bash
cd backend
chmod +x setup.sh
./setup.sh
```

### Ejecutar

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
python app.py
```

**Terminal 2 - Frontend:**
```bash
npm install
npm run dev
```

### Acceder
- Frontend: http://localhost:3000
- Backend: http://localhost:5000/api

### Credenciales de Prueba
- **Profesor**: profesor1@escuela.com / Password123
- **Estudiante**: estudiante1@escuela.com / Password123

**[Ver QUICK_START.md para más detalles →](./QUICK_START.md)**

## 📁 Estructura del Proyecto

```
app/
├── (auth)/           # Rutas de autenticación
│   ├── login/
│   └── signup/
├── student/          # Dashboard de estudiante
├── teacher/          # Dashboard de profesor
├── page.tsx          # Página de inicio (redirección)
└── layout.tsx        # Layout raíz

components/
├── ui/               # Componentes shadcn/ui
├── AuthContext.tsx   # Contexto de autenticación
├── ProtectedRoute.tsx # Protector de rutas
├── StudentHeader.tsx # Header para estudiantes
├── TeacherHeader.tsx # Header para profesores
├── CourseCard.tsx    # Tarjeta de curso
├── CourseProposalForm.tsx # Formulario de propuesta
└── ProposalsTable.tsx     # Tabla de propuestas

lib/
├── api.ts           # Servicio centralizado de API
└── utils.ts         # Utilidades

contexts/
└── AuthContext.tsx  # Contexto de autenticación global
```

## 📚 Documentación

| Documento | Contenido |
|-----------|----------|
| **[QUICK_START.md](./QUICK_START.md)** | Guía de 5 minutos para empezar |
| **[GUIA_COMPLETA.md](./GUIA_COMPLETA.md)** | Guía detallada de instalación y configuración |
| **[API_INTEGRATION.md](./API_INTEGRATION.md)** | Cómo funciona la integración frontend-backend |
| **[RESUMEN_PROYECTO.md](./RESUMEN_PROYECTO.md)** | Resumen del proyecto y características |
| **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** | Estructura completa de carpetas |
| **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** | Checklist para deploy a producción |
| **[backend/README.md](./backend/README.md)** | Documentación del backend Flask |

## 🔌 Endpoints del Backend (27 Total)

### Autenticación (6)
- `POST /api/auth/signup` - Registro
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Perfil actual
- `POST /api/auth/change-password` - Cambiar contraseña
- `POST /api/auth/logout` - Logout

### Cursos (6)
- `GET /api/cursos` - Listar cursos
- `GET /api/cursos/<id>` - Detalles del curso
- `GET /api/cursos/categorias` - Categorías
- `POST /api/cursos/crear` - Crear curso (profesor)
- `PUT /api/cursos/<id>` - Actualizar curso (profesor)
- `DELETE /api/cursos/<id>` - Eliminar curso (profesor)

### Estudiante (5)
- `GET /api/estudiante/perfil` - Mi perfil
- `GET /api/estudiante/cursos` - Mis cursos
- `POST /api/estudiante/inscribirse/<id>` - Inscribirse
- `POST /api/estudiante/cancelar-inscripcion/<id>` - Cancelar inscripción
- `GET /api/estudiante/auditorias` - Historial

### Profesor (6)
- `GET /api/profesor/perfil` - Mi perfil
- `GET /api/profesor/propuestas` - Mis propuestas
- `POST /api/profesor/propuestas` - Crear propuesta
- `PUT /api/profesor/propuestas/<id>` - Actualizar propuesta
- `DELETE /api/profesor/propuestas/<id>` - Eliminar propuesta
- `GET /api/profesor/auditorias` - Historial

### Estadísticas (4)
- `GET /api/estadisticas/propuestas` - Stats de propuestas
- `GET /api/estadisticas/estudiante` - Stats del estudiante
- `GET /api/estadisticas/generales` - Stats del sistema
- `GET /api/estadisticas/cursos/<id>` - Stats del curso

## 🎨 Personalización

### Colores
- **Estudiante**: Azul (`bg-blue-600`, `text-blue-600`)
- **Profesor**: Naranja (`bg-orange-600`, `text-orange-600`)

Edita los gradientes en las páginas de login/signup en `app/(auth)/` para cambiar los colores.

### Mensajes
Los mensajes están en español. Busca en los componentes para cambiar textos.

## 📝 Variables de Entorno (Opcional)

Si necesitas cambiar la URL del backend, edita `lib/api.ts`:

```typescript
const BASE_URL = 'http://localhost:5000/api';
```

## 🧪 Testing

Para probar la aplicación:

1. **Login como Estudiante**
   - Email: student@example.com
   - Password: password123
   - Rol: Estudiante

2. **Login como Profesor**
   - Email: teacher@example.com
   - Password: password123
   - Rol: Profesor

## 🛠️ Desarrollo

### Scripts Disponibles

```bash
npm run dev      # Iniciar servidor de desarrollo
npm run build    # Compilar para producción
npm start        # Iniciar servidor de producción
npm run lint     # Ejecutar linter
```

## 📦 Dependencias Principales

- **Next.js 16** - Framework React con SSR
- **React 19.2** - Librería UI
- **Tailwind CSS 4** - Utilidades CSS
- **shadcn/ui** - Componentes reutilizables
- **Sonner** - Notificaciones toast
- **Lucide React** - Iconos
- **Zod** - Validación de esquemas

## 🤝 Contribución

Para contribuir, haz fork del proyecto y envía un pull request.

## 📄 Licencia

Este proyecto está bajo licencia MIT.

## 📞 Soporte

Si encuentras problemas:

1. Verifica que el backend Flask esté ejecutándose
2. Comprueba que los endpoints estén configurados correctamente
3. Revisa la consola del navegador para errores

## 🚀 Deploy a Producción

### Frontend - Vercel (Recomendado)
```bash
npm run build
vercel
```

### Backend - Heroku / Railway
```bash
# Heroku
git push heroku main

# Railway
Conectar GitHub y deploy automático
```

### Base de Datos
- Cambiar de SQLite a PostgreSQL
- Usar servicios como Neon o Render
- Ver [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)

## 📊 Tech Stack

### Frontend
- **Next.js 16** - React framework
- **React 19.2** - UI library
- **Tailwind CSS 4** - Styling
- **shadcn/ui** - Components
- **TypeScript** - Type safety
- **Sonner** - Notifications

### Backend
- **Flask 3.0** - Web framework
- **SQLAlchemy 3.1** - ORM
- **Flask-JWT-Extended** - JWT auth
- **Bcrypt** - Password hashing
- **Flask-CORS** - CORS handling
- **Flask-Mail** - Email service

### Base de Datos
- **SQLite** (desarrollo)
- **PostgreSQL** (producción)

## 🐛 Solución de Problemas

Ver [GUIA_COMPLETA.md](./GUIA_COMPLETA.md) sección "Solución de Problemas"

- **Puerto en uso**: Cambiar puerto en app.py o npm run dev
- **Module not found**: Reinstalar dependencias
- **CORS error**: Verificar CORS_ORIGINS en .env
- **JWT error**: Incluir token en Authorization header

## 🧪 Testing

```bash
# Probar API
cd backend
python test_api.py
```

## 🔐 Seguridad

✅ Contraseñas hasheadas con bcrypt
✅ JWT tokens con expiración
✅ CORS configurado
✅ Validación de entrada completa
✅ Auditoría de cambios
✅ Headers de seguridad

## 📦 Estadísticas del Proyecto

| Métrica | Cantidad |
|---------|----------|
| Endpoints API | 27 |
| Componentes React | 10+ |
| Modelos BD | 5 |
| Rutas Frontend | 7 |
| Líneas de código | 5000+ |
| Tests de API | 15 |

## 🤝 Contribución

Pull requests son bienvenidos. Para cambios mayores, abre un issue primero.

## 📄 Licencia

MIT - Libre para usar comercialmente

## 👥 Equipo

Desarrollado para la **Escuela de Emprendimiento Antonio Patricio de Alcalá**

## 📞 Soporte

- 📖 Leer documentación en [GUIA_COMPLETA.md](./GUIA_COMPLETA.md)
- 🐛 Revisar [API_INTEGRATION.md](./API_INTEGRATION.md)
- ⚙️ Ver [backend/README.md](./backend/README.md)

---

**Versión**: 1.0.0 | **Estado**: ✅ Completo | **Última actualización**: 30 de Enero de 2026

Creado con ❤️ para impulsar el emprendimiento
