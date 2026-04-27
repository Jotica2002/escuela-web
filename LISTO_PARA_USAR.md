# Escuela de Emprendimiento - ¡LISTO PARA USAR!

## ⚡ Inicio en 3 Pasos

### Paso 1: Instalar Dependencias (5 segundos)

**Backend:**
```bash
cd backend
pip install -r requirements.txt
```

**Frontend:**
```bash
npm install
```

### Paso 2: Cargar Datos de Prueba (10 segundos) - OPCIONAL

```bash
cd backend
python seed_data.py
```

### Paso 3: Iniciar Servidores

**Terminal 1 - Backend:**
```bash
cd backend
python app.py
```

Deberías ver:
```
[v0] Base de datos inicializada
[v0] Servidor iniciado en http://localhost:5000
 * Running on http://0.0.0.0:5000
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Deberías ver:
```
> next dev
  ▲ Next.js 16.0.0
  - Local:        http://localhost:3000
```

## 🎯 ¡YA ESTÁ LISTO!

**Frontend:** http://localhost:3000
**Backend:** http://localhost:5000

## 👤 Credenciales de Prueba

**PROFESOR:**
- Email: `profesor1@escuela.com`
- Contraseña: `Password123`

**ESTUDIANTE:**
- Email: `estudiante1@escuela.com`
- Contraseña: `Password123`

## 🚀 Qué Puedes Hacer

### Profesor:
1. Inicia sesión
2. Ve al Dashboard
3. Crea una propuesta de curso
4. Ve tus propuestas y estadísticas

### Estudiante:
1. Inicia sesión
2. Ve al Dashboard
3. Inscríbete en cursos disponibles
4. Ve tus cursos inscritos

## 🔧 Troubleshooting

### "ModuleNotFoundError: No module named 'flask'"
```bash
pip install Flask==3.0.0
```

### "Address already in use"
El puerto 5000 ya está en uso. Opción 1: Termina el proceso. Opción 2: Edita `/backend/app.py` última línea:
```python
app.run(debug=True, host='0.0.0.0', port=5001)  # Cambia a 5001
```

### "Failed to fetch from http://localhost:5000"
- Verifica que el backend esté corriendo
- En `/contexts/AuthContext.tsx` y `/lib/api.ts`, asegúrate que apuntan a `http://localhost:5000`

### "CORS error"
Ya está configurado. Si persiste, verifica que el backend tiene:
```python
CORS(app, resources={r"/api/*": {"origins": "*"}})
```

## 📊 Estructura de Base de Datos

**Usuarios:** id, nombre, email, password_hash, rol (teacher/student)
**Cursos:** id, nombre, descripcion, duracion, profesor_id, estado
**Inscripciones:** id, estudiante_id, curso_id, fecha_inscripcion, estado
**PropuestasCurso:** id, profesor_id, nombre, descripcion, duracion, requisitos, estado

## 🔐 Seguridad

✅ Contraseñas hasheadas con bcrypt
✅ Tokens JWT con expiración
✅ Validación de datos en todos los endpoints
✅ CORS habilitado correctamente

## 📡 Endpoints API

```
POST   /api/auth/signup            - Registrarse
POST   /api/auth/login             - Iniciar sesión
GET    /api/auth/me                - Perfil actual

GET    /api/cursos                 - Listar cursos
GET    /api/cursos/<id>            - Detalles de curso

POST   /api/estudiante/inscribirse/<id>  - Inscribirse
GET    /api/estudiante/cursos      - Mis cursos

POST   /api/profesor/propuestas    - Crear propuesta
GET    /api/profesor/propuestas    - Mis propuestas

GET    /api/estadisticas/propuestas - Estadísticas
```

## ✅ Checklist de Inicio

- [ ] Backend instalado (`pip install -r requirements.txt`)
- [ ] Frontend instalado (`npm install`)
- [ ] Datos cargados (`python seed_data.py`)
- [ ] Backend corriendo en puerto 5000
- [ ] Frontend corriendo en puerto 3000
- [ ] Puedo ver http://localhost:3000
- [ ] Puedo iniciar sesión con profesor1@escuela.com
- [ ] Puedo ver el dashboard de profesor
- [ ] Puedo iniciar sesión con estudiante1@escuela.com
- [ ] Puedo ver el dashboard de estudiante

¿Completaste todo? ¡La aplicación está lista! 🎉

---

**Versión:** 1.0.0 (REVISADA Y LISTA)
**Última actualización:** 30 de Enero de 2026
