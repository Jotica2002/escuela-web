# Sistema Completamente Conectado - Guía de Funcionamiento

## ✅ Lo que hemos implementado

### 1. CHATBOT CON FAQs para Estudiantes
- **Ubicación**: Esquina inferior derecha del dashboard del estudiante
- **Funcionalidades**:
  - 10 preguntas frecuentes predefinidas
  - Búsqueda de preguntas por texto
  - Categorización de FAQs
  - Interfaz flotante y no invasiva

### 2. FLUJO COMPLETO DE APROBACIÓN

#### Paso 1: Profesor envía propuesta
```
Profesor → Dashboard → "Crear Nueva Propuesta"
  ↓
Completa formulario y envía
  ↓
La propuesta aparece con estado "PENDIENTE"
```

#### Paso 2: Profesor ve estado en tiempo real
```
Dashboard del Profesor → "Mis Propuestas"
  ↓
Ver todas sus propuestas con estado:
  - ⏳ Pendiente (amarillo)
  - ✅ Aprobado (verde)
  - ❌ Rechazado (rojo)
  ↓
Puede filtrar por estado
```

#### Paso 3: Admin revisa y aprueba/rechaza
```
Admin → Panel Admin → "Propuestas"
  ↓
Ve todas las propuestas de todos los profesores
  ↓
Botón APROBAR:
  - Cambia estado a "APROBADO"
  - Crea automáticamente el curso
  
Botón RECHAZAR:
  - Cambia estado a "RECHAZADO"
  - Opcionalmente agrega motivo
```

#### Paso 4: Profesor ve cambio de estado
```
El profesor automáticamente ve en su dashboard:
  - Su propuesta cambió de PENDIENTE a APROBADO o RECHAZADO
  - No necesita refrescar (se actualiza en tiempo real)
```

#### Paso 5: Estudiante ve curso aprobado
```
Estudiante → Dashboard → "Cursos Disponibles"
  ↓
Solo ve cursos APROBADOS (con estado='activo')
  ↓
Botón "Inscribirse" para cada curso
  ↓
Después de inscribirse, aparece en "Mis Cursos Inscritos"
```

## 🔄 Flujo Completo Visual

```
PROFESOR                    ADMIN                      ESTUDIANTE
   │                         │                             │
   ├─→ Envía Propuesta ──────┤                             │
   │   (PENDIENTE)           │                             │
   │                         │                             │
   │                    Revisa & Aprueba                  │
   │                    (Crea Curso)                       │
   │                         │                             │
   ← Ver Estado APROBADO ←───┘                             │
   │                                                       │
   │                    Curso visible ──────────────────→  │
   │                                                       │
   │                                    ← Se Inscribe ←┤
   │                                    (Estudia)        │
   │                                                       │
```

## 📱 Interfaz del Estudiante

### Dashboard Estudiante:
1. **Encabezado** - Nombre y email del estudiante
2. **Chatbot** - Botón flotante con FAQs
3. **Cursos Disponibles** - Lista de cursos aprobados
   - Botón "Inscribirse" para cada curso
4. **Mis Cursos Inscritos** - Cursos donde ya está matriculado

### Chatbot:
- Pregunta de bienvenida
- 10 FAQs comunes sobre:
  - Cómo inscribirse
  - Cancelación de inscripciones
  - Cursos disponibles
  - Gestión de cuenta
  - Progreso
  - Soporte

## 👨‍🏫 Interfaz del Profesor

### Dashboard Profesor:
1. **Estadísticas** - Total, Aprobadas, Pendientes
2. **Crear Nueva Propuesta** - Formulario
3. **Mis Propuestas** - Lista con filtros
   - Filtro por estado (Todas, Pendientes, Aprobadas, Rechazadas)
   - Muestra ícono + color según estado
   - Información completa de cada propuesta

## 👨‍💼 Interfaz del Admin

### Dashboard Admin:
1. **Estadísticas Generales** - Total de usuarios, cursos, propuestas
2. **Todas las Propuestas** - Lista global
   - Botón APROBAR
   - Botón RECHAZAR
3. **Cursos Aprobados** - Lista de cursos activos

## 🔌 Endpoints Utilizados

### Backend (Flask)
```
GET  /api/cursos                    # Cursos disponibles (solo activos)
POST /api/estudiante/inscribirse/{id}
GET  /api/estudiante/cursos         # Mis cursos inscritos
GET  /api/profesor/propuestas       # Mis propuestas
POST /api/profesor/propuestas       # Crear propuesta
GET  /api/admin/propuestas          # Todas las propuestas
POST /api/admin/propuestas/{id}/aprobar
POST /api/admin/propuestas/{id}/rechazar
GET  /api/admin/cursos              # Todos los cursos
GET  /api/admin/estadisticas        # Estadísticas del sistema
```

## ⚙️ Cómo Funciona la Conexión

### 1. Aprobación automática
```python
# Cuando admin aprueba una propuesta:
propuesta.estado = 'aprobado'  # Cambio 1
curso = Curso(...)              # Se crea nuevo curso
curso.estado = 'activo'         # Estado='activo'
db.session.commit()
```

### 2. Obtención de cursos en frontend
```javascript
// El estudiante siempre ve solo cursos con estado='activo'
GET /api/cursos
// Devuelve: cursos.filter(c => c.estado === 'activo')
```

### 3. Actualización en tiempo real
```javascript
// El profesor recibe propuestas con estado actualizado
GET /api/profesor/propuestas
// Devuelve: [{ estado: 'aprobado', ... }]
```

## 🚀 Para Probar el Sistema Completo

### 1. Reiniciar datos:
```bash
cd backend
python seed_data.py  # Carga datos de prueba
python app.py        # Inicia servidor
```

### 2. Flujo de prueba:
```
1. Inicia sesión como profesor1@escuela.com
2. Ve "Mis Propuestas" (vacío)
3. Crea una propuesta
4. Ve estado "PENDIENTE"
5. Abre otra pestaña, inicia sesión como admin@escuela.com
6. Ve propuesta en panel admin
7. Haz clic en "APROBAR"
8. Vuelve a pestaña del profesor
9. Actualiza - ¡Propuesta ahora está "APROBADA"!
10. Inicia sesión como estudiante1@escuela.com
11. Ve el nuevo curso en "Cursos Disponibles"
12. Haz clic en "Inscribirse"
13. Verás el curso en "Mis Cursos Inscritos"
14. ¡Abre el Chatbot y prueba las FAQs!
```

## 📊 Estado de Propuestas

| Estado | Color | Ícono | Significado |
|--------|-------|-------|------------|
| PENDIENTE | Amarillo | ⏳ | En espera de aprobación del admin |
| APROBADO | Verde | ✅ | Aprobado, curso activo |
| RECHAZADO | Rojo | ❌ | Rechazado por el admin |

## 💾 Datos de Prueba

```
Admin: admin@escuela.com / Admin123
Profesor: profesor1@escuela.com / Password123
Estudiante: estudiante1@escuela.com / Password123
```

---

**El sistema está completamente funcional y conectado.** ✅
