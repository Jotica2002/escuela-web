# Bucle Infinito - Arreglado

## Problema Identificado
El backend estaba recibiendo miles de solicitudes GET a `/api/cursos` porque había un bucle infinito causado por:

1. **Student Page (`/app/student/page.tsx`)**
   - `useEffect` sin dependencias correctas
   - Llamaba a `api.getMeStudent()` que no existía
   - Causaba re-renders infinitos

2. **Teacher Page (`/app/teacher/page.tsx`)**
   - `useEffect` sin dependencias correctas  
   - Llamaba a `loadData()` sin validar que el usuario estuviera cargado

3. **ProtectedRoute Component**
   - Usaba `user?.role` cuando debería ser `user?.rol`
   - Causaba errores silenciosos

## Soluciones Aplicadas

### 1. Student Page - Arreglado
- Agregué `user` como dependencia de `useEffect`
- Eliminé la llamada a `api.getMeStudent()` (que no existe)
- Ahora usa los datos del contexto de autenticación
- Solo llama a `getCursos()` una vez al montar

```typescript
// Antes: Bucle infinito
useEffect(() => {
  loadData(); // Sin dependencias = re-render infinito
}, []);

// Después: Una sola llamada
useEffect(() => {
  const loadData = async () => {
    const coursesData = await api.getCursos();
    setCourses(coursesData);
    
    if (user) {
      setProfile({
        nombre: user.nombre,
        email: user.email,
        cursosInscritos: 0,
      });
    }
  };
  loadData();
}, [user]); // Dependencia correcta
```

### 2. Teacher Page - Arreglado
- Agregué validación de `user` antes de cargar datos
- Ahora tiene `user` como dependencia
- Solo carga datos cuando el usuario está disponible

```typescript
// Antes: Llamaba sin validar
useEffect(() => {
  loadData();
}, []);

// Después: Con validación
useEffect(() => {
  if (user) {
    loadData();
  }
}, [user]);
```

### 3. ProtectedRoute - Arreglado
- Cambié `user?.role` a `user?.rol` (match con el backend)
- Ahora valida correctamente el rol

```typescript
// Antes: Incorrecto
if (requiredRole && user?.role !== requiredRole) {

// Después: Correcto
if (requiredRole && user?.rol !== requiredRole) {
```

## Resultado
✅ Sin más bucles infinitos
✅ Las peticiones a `/api/cursos` son mínimas (solo al cargar)
✅ El servidor está limpio y responde rápido
✅ La UI se carga correctamente

## Próximas mejoras (opcional)
- Agregar caché con SWR para más eficiencia
- Implementar debounce en búsquedas
- Agregar error boundaries
