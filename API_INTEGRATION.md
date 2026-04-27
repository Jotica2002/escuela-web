# Guía de Integración API - Frontend & Backend

## 🔗 Configuración de la Conexión

### 1. Frontend - Variables de Entorno

Crear archivo `.env.local` en la raíz del proyecto:

```env
# API Backend
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
```

### 2. Backend - CORS Configuration

El backend está configurado en `config.py` para aceptar requests desde el frontend.

Verificar que en `.env` del backend esté:

```env
CORS_ORIGINS=http://localhost:3000
FRONTEND_URL=http://localhost:3000
```

## 📋 Flujo de Autenticación

### Signup (Registro)

```
Frontend                          Backend
   |                               |
   |-- POST /api/auth/signup ----->|
   |  {email, nombre, apellido,    |
   |   contraseña, rol}            |
   |                               |
   |<-- 201 Created ---------------| 
   |  {user, access_token}         |
   |                               |
   |-- Almacenar token en         |
   |   localStorage               |
   |                               |
```

**Frontend Code (ya implementado)**:
```typescript
// lib/api.ts
export async function signup(data: SignupData) {
  const response = await fetch(`${BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) throw new Error('Signup failed');
  
  const result = await response.json();
  localStorage.setItem('token', result.access_token);
  return result;
}
```

### Login

```
Frontend                          Backend
   |                               |
   |-- POST /api/auth/login ------>|
   |  {email, contraseña}          |
   |                               |
   |<-- 200 OK --------------------|
   |  {user, access_token}         |
   |                               |
   |-- Almacenar token            |
   |-- Redirectionar a dashboard  |
   |                               |
```

### Requests Autenticados

Todos los requests que requieren autenticación deben incluir el JWT token:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Frontend Code (ya implementado)**:
```typescript
// lib/api.ts
function getHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
}

export async function fetchStudent() {
  const response = await fetch(`${BASE_URL}/estudiante/perfil`, {
    method: 'GET',
    headers: getHeaders()
  });
  
  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  
  return response.json();
}
```

## 🔄 Flujos Principales

### Flujo de Estudiante

```
1. Login / Signup
   └─> AuthContext actualiza estado
   └─> Redirectiona a /student

2. Ver Cursos Disponibles
   └─> GET /api/cursos
   └─> Mostrar CardsCursos

3. Inscribirse
   └─> POST /api/estudiante/inscribirse/{id}
   └─> Actualiza lista de cursos

4. Ver Mis Cursos
   └─> GET /api/estudiante/cursos
   └─> GET /api/estadisticas/estudiante
   └─> Mostrar información personalizada
```

### Flujo de Profesor

```
1. Login / Signup (rol: teacher)
   └─> AuthContext actualiza estado
   └─> Redirectiona a /teacher

2. Ver Propuestas
   └─> GET /api/profesor/propuestas
   └─> GET /api/estadisticas/propuestas
   └─> Mostrar tabla de propuestas

3. Crear Propuesta
   └─> POST /api/profesor/propuestas
   └─> {nombre, descripcion, duracion_horas, ...}
   └─> Actualiza lista

4. Editar/Eliminar Propuesta
   └─> PUT /api/profesor/propuestas/{id}
   └─> DELETE /api/profesor/propuestas/{id}
```

## 🎯 Ejemplos de Uso

### Ejemplo 1: Obtener Lista de Cursos

```typescript
// components/CourseList.tsx
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchCourses() {
      try {
        const data = await api.getCursos();
        setCourses(data.cursos);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchCourses();
  }, []);
  
  if (loading) return <div>Cargando...</div>;
  
  return (
    <div>
      {courses.map(course => (
        <div key={course.id}>
          <h3>{course.nombre}</h3>
          <p>{course.descripcion}</p>
          <p>Duración: {course.duracion_horas} horas</p>
        </div>
      ))}
    </div>
  );
}
```

### Ejemplo 2: Inscribirse a un Curso

```typescript
// components/CourseCard.tsx
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function CourseCard({ course }) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  async function handleInscribe() {
    if (!user) {
      toast.error('Debes iniciar sesión');
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await api.subscribeCourse(course.id);
      toast.success('¡Inscripción exitosa!');
      // Actualizar UI
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }
  
  return (
    <div>
      <h3>{course.nombre}</h3>
      <button onClick={handleInscribe} disabled={isLoading}>
        {isLoading ? 'Inscribiendo...' : 'Inscribirse'}
      </button>
    </div>
  );
}
```

### Ejemplo 3: Crear Propuesta de Curso

```typescript
// components/CourseProposalForm.tsx
import { useState } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export default function CourseProposalForm() {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    duracion_horas: 0,
    categoria: '',
    nivel: 'Intermedio'
  });
  const [loading, setLoading] = useState(false);
  
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await api.createProposal(formData);
      toast.success('Propuesta creada exitosamente');
      setFormData({ nombre: '', descripcion: '', duracion_horas: 0, categoria: '', nivel: 'Intermedio' });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nombre del curso"
        value={formData.nombre}
        onChange={(e) => setFormData({...formData, nombre: e.target.value})}
        required
      />
      <textarea
        placeholder="Descripción"
        value={formData.descripcion}
        onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
        required
      />
      <input
        type="number"
        placeholder="Duración (horas)"
        value={formData.duracion_horas}
        onChange={(e) => setFormData({...formData, duracion_horas: parseInt(e.target.value)})}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Creando...' : 'Crear Propuesta'}
      </button>
    </form>
  );
}
```

## 🔐 Manejo de Errores

### Errores Comunes

| Status | Mensaje | Acción |
|--------|---------|--------|
| 400 | Bad Request | Validar datos enviados |
| 401 | Unauthorized | Pedir login nuevamente |
| 403 | Forbidden | Verificar permisos/rol |
| 404 | Not Found | El recurso no existe |
| 409 | Conflict | Ya existe (ej: email duplicado) |
| 500 | Server Error | Contactar soporte |

### Implementación de Manejo de Errores

```typescript
// lib/api.ts
async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json();
    
    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    throw new Error(error.error || 'Error desconocido');
  }
  
  return response.json();
}

export async function getCursos() {
  const response = await fetch(`${BASE_URL}/cursos`);
  return handleResponse(response);
}
```

## 📊 Estadísticas y Datos en Tiempo Real

### Obtener Estadísticas del Estudiante

```typescript
// Dentro de useEffect en StudentDashboard
const stats = await api.getStudentStats();

return (
  <div>
    <h2>Mi Dashboard</h2>
    <StatCard
      title="Cursos Activos"
      value={stats.cursos_activos}
    />
    <StatCard
      title="Cursos Completados"
      value={stats.cursos_completados}
    />
    <StatCard
      title="Promedio"
      value={stats.promedio_calificacion.toFixed(2)}
    />
  </div>
);
```

## 🔄 Sincronización de Estado

El frontend usa `AuthContext` y `SWR` para mantener el estado sincronizado:

```typescript
// contexts/AuthContext.tsx
const { data: user, isLoading } = useSWR(
  isAuthenticated ? '/api/auth/me' : null,
  fetcher,
  { revalidateOnFocus: false }
);
```

## 📝 Notas Importantes

1. **Tokens**: Se guardan en `localStorage` con clave `token`
2. **CORS**: El backend acepta requests desde `http://localhost:3000`
3. **Contraseñas**: Deben tener al menos 8 caracteres, mayúscula y número
4. **Emails**: Deben ser válidos
5. **Roles**: Solo "student" y "teacher"

## 🚀 Próximos Pasos

1. Verificar que ambos servidores estén corriendo
2. Probar el signup/login en el frontend
3. Verificar en DevTools (Network) que los requests lleguen al backend
4. Usar `test_api.py` para validar endpoints
5. Implementar más features según sea necesario

---

**¿Problemas?** Ver `/GUIA_COMPLETA.md` para solución de problemas.
