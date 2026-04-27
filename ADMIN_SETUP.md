# Panel de Administración - Guía de Uso

## ✨ Características del Administrador

El rol de administrador tiene **poder total** sobre la plataforma:

### 1. **Gestionar Propuestas de Cursos**
- Ver todas las propuestas pendientes de aprobación
- Aprobar propuestas (convertirlas en cursos activos)
- Rechazar propuestas con motivo
- Ver histórico de todas las propuestas (pendientes, aprobadas, rechazadas)

### 2. **Ver Cursos Aprobados**
- Listar todos los cursos activos en el sistema
- Ver detalles de cada curso (nombre, profesor, duración, descripción)
- Información completa de los profesores que crearon los cursos

### 3. **Estadísticas del Sistema**
- Total de usuarios registrados
- Desglose: estudiantes y profesores
- Total de cursos activos
- Estadísticas de propuestas (total, pendientes, aprobadas, rechazadas)
- Dashboard en tiempo real

## 🔐 Credenciales de Administrador

```
Email: admin@escuela.com
Contraseña: Admin123
```

## 🚀 Cómo Acceder

1. **Inicia sesión** con las credenciales de admin
2. **Automáticamente** serás redirigido al panel de administración
3. Verás 3 pestañas principales:
   - **Estadísticas**: Resumen del sistema
   - **Propuestas**: Gestión de propuestas pendientes
   - **Cursos Aprobados**: Ver todos los cursos activos

## 📊 Panel de Estadísticas

El dashboard muestra en tiempo real:

**Usuarios:**
- Total de usuarios en el sistema
- Total de estudiantes
- Total de profesores
- (Admin no se cuenta)

**Cursos:**
- Total de cursos activos

**Propuestas:**
- Total de propuestas
- Propuestas pendientes (requieren acción)
- Propuestas aprobadas (convertidas en cursos)
- Propuestas rechazadas

## ✅ Gestión de Propuestas

### Flujo de Aprobación

1. **Un profesor propone un curso**
   - Completa nombre, descripción, duración y requisitos
   - La propuesta aparece en estado "Pendiente"

2. **El administrador revisa**
   - Ve la propuesta en la pestaña "Propuestas"
   - Lee los detalles completos
   - Decide aprobar o rechazar

3. **Si Aprueba:**
   - El curso se activa inmediatamente
   - Los estudiantes pueden inscribirse
   - La propuesta cambia a estado "Aprobado"
   - Aparece en "Cursos Aprobados"

4. **Si Rechaza:**
   - La propuesta cambia a estado "Rechazado"
   - El profesor recibe notificación (si hay email configurado)
   - No se crea un curso

### Filtros de Propuestas

- **Todas**: Muestra todas las propuestas del sistema
- **Pendiente**: Solo propuestas que esperan decisión (⚠️ IMPORTANTE)
- **Aprobado**: Propuestas ya convertidas en cursos
- **Rechazado**: Propuestas rechazadas

## 🎯 Casos de Uso

### Ejemplo 1: Revisar una Propuesta Pendiente

```
1. Ir a pestaña "Propuestas"
2. Filtrar por "Pendiente"
3. Ver la propuesta de "E-commerce" de Carlos Profesor
4. Leer: descripción, duración, requisitos
5. Hacer clic en "Aprobar" o "Rechazar"
6. Automáticamente se actualiza el estado
```

### Ejemplo 2: Ver Resumen del Sistema

```
1. Ir a pestaña "Estadísticas"
2. Ver 8 tarjetas con información:
   - 5 usuarios totales
   - 2 estudiantes
   - 2 profesores
   - 3 cursos activos
   - 2 propuestas totales
   - 1 pendiente
   - 1 aprobada
   - 0 rechazadas
```

### Ejemplo 3: Listar Todos los Cursos Activos

```
1. Ir a pestaña "Cursos Aprobados"
2. Ver todas las tarjetas de cursos
3. Información de cada curso:
   - Nombre
   - Profesor responsable
   - Descripción
   - Duración en horas
   - Fecha de creación
```

## 🔄 Flujo Completo de Usuario

```
PROFESOR                           ADMIN                         ESTUDIANTE
   |                                |                                |
   |-- Propone Curso ----────>      |                                |
   |                                |                                |
   |                         Revisa propuesta                         |
   |                                |                                |
   |                         Aprueba ✅ o                            |
   |                         Rechaza ❌                              |
   |                                |                                |
   |                         Curso se activa                         |
   |                                |--- Curso visible ------>       |
   |                                |                    Se inscribe |
   |                                |                          ✅    |
```

## ⚙️ Configuración y Cambios

### ¿Puedo cambiar la contraseña del admin?

Actualmente, la contraseña es fija en la base de datos. Para cambiarla:

1. Editar `/backend/seed_data.py`
2. Cambiar `hash_password('Admin123')` por tu contraseña
3. Ejecutar `python seed_data.py` para reinicializar la base de datos

### ¿Puedo crear otro administrador?

Sí. Registrate normalmente en el signup y luego edita la base de datos:

```sql
UPDATE usuario SET rol = 'admin' WHERE email = 'nuevo-admin@email.com'
```

## 🛡️ Permisos

El administrador es el **único rol** que puede:
- ✅ Ver TODAS las propuestas del sistema
- ✅ Aprobar o rechazar propuestas
- ✅ Crear cursos (indirectamente, al aprobar)
- ✅ Ver estadísticas completas del sistema
- ✅ Ver todos los cursos activos

No puede:
- ❌ Inscribirse en cursos (ese es rol de estudiante)
- ❌ Crear propuestas (ese es rol de profesor)
- ❌ Modificar usuarios (en esta versión)

## 📱 Interfaz

### Colores
- **Encabezado**: Rojo (Identificación de admin)
- **Propuestas Pendientes**: Amarillo
- **Propuestas Aprobadas**: Verde
- **Propuestas Rechazadas**: Rojo
- **Botones de Acción**: Verde (Aprobar) y Rojo (Rechazar)

### Iconos
- 🔧 Settings: Panel de administración
- ✅ Check: Aprobar propuesta
- ❌ X: Rechazar propuesta
- 📚 BookOpen: Cursos
- 👥 Users: Usuarios
- ⏱️ Clock: Duración de cursos

## ✨ Próximas Características (Futura)

- Editar usuarios
- Suspender estudiantes
- Ver auditoría completa de cambios
- Exportar reportes
- Envío de emails a profesores
- Backup de base de datos

---

**Panel de Administración v1.0** - Totalmente funcional ✅
