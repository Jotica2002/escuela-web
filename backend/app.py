from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import bcrypt
import jwt
from datetime import datetime, timedelta
import os
import werkzeug.utils

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///escuela.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'super-secret-key-change-in-production'
app.config['JWT_SECRET'] = 'jwt-secret-key-change-in-production'
app.config['JWT_ALGORITHM'] = 'HS256'
app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

db = SQLAlchemy(app)
CORS(app, resources={r"/api/*": {"origins": "*"}})

from flask import send_from_directory

@app.route('/uploads/<path:filename>')
def serve_uploads(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# ==================== MODELOS ====================

class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    cedula = db.Column(db.String(20), unique=True, nullable=True) # Se permite nulo por compatibilidad con usuarios antiguos
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    rol = db.Column(db.String(20), nullable=False)  # 'student' o 'teacher'
    foto_perfil = db.Column(db.String(255), nullable=True)
    creado_por_id = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=True)
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)

class Curso(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    descripcion = db.Column(db.Text)
    duracion = db.Column(db.String(50))  # Changed to String to allow "8 semanas" etc
    profesor_id = db.Column(db.Integer, db.ForeignKey('usuario.id'))
    estado = db.Column(db.String(20), default='activo')  # 'activo', 'inactivo'
    imagen_url = db.Column(db.String(255), nullable=True)
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)

class Inscripcion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    estudiante_id = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=False)
    curso_id = db.Column(db.Integer, db.ForeignKey('curso.id'), nullable=False)
    fecha_inscripcion = db.Column(db.DateTime, default=datetime.utcnow)
    estado = db.Column(db.String(20), default='activo')

class PropuestaCurso(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    profesor_id = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=False)
    nombre = db.Column(db.String(100), nullable=False)
    descripcion = db.Column(db.Text)
    duracion = db.Column(db.String(50))  # Changed to String
    requisitos = db.Column(db.Text)
    estado = db.Column(db.String(20), default='pendiente')  # 'pendiente', 'aprobado', 'rechazado'
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)

# -------- Votación de Cursos Propuestos --------

class CursoPropuesto(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(150), nullable=False)
    descripcion = db.Column(db.Text)
    instructor_tentativo = db.Column(db.String(100))
    estado = db.Column(db.String(20), default='pendiente')  # 'pendiente', 'aceptado'
    convenio_id = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=True)  # quien creó la propuesta
    imagen_url = db.Column(db.String(255), nullable=True)
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)

class Voto(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=False)
    curso_propuesto_id = db.Column(db.Integer, db.ForeignKey('curso_propuesto.id'), nullable=False)
    tipo = db.Column(db.String(20), default='interesado')  # 'interesado' o 'no_interesado'
    fecha_voto = db.Column(db.DateTime, default=datetime.utcnow)
    __table_args__ = (db.UniqueConstraint('usuario_id', 'curso_propuesto_id', name='uq_usuario_curso_voto'),)

class Certificado(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    estudiante_id = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=False)
    nombre_curso = db.Column(db.String(150), nullable=False)
    archivo_url = db.Column(db.String(255), nullable=False)
    fecha_subida = db.Column(db.DateTime, default=datetime.utcnow)

class Asistencia(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    curso_id = db.Column(db.Integer, db.ForeignKey('curso.id'), nullable=False)
    profesor_id = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=False)
    fecha_clase = db.Column(db.Date, nullable=False)
    archivo_url = db.Column(db.String(255), nullable=False)
    fecha_subida = db.Column(db.DateTime, default=datetime.utcnow)

class Horario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    curso_id = db.Column(db.Integer, db.ForeignKey('curso.id'), nullable=False, unique=True)
    descripcion = db.Column(db.Text, nullable=False)  # Text schedule e.g. "Lunes y Miércoles 6pm-8pm"
    archivo_url = db.Column(db.String(255), nullable=True)  # Optional image of schedule
    fecha_actualizacion = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# ==================== FUNCIONES AUXILIARES ====================

def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password, password_hash):
    return bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8'))

def create_token(usuario_id, rol):
    payload = {
        'id': usuario_id,
        'rol': rol,
        'exp': datetime.utcnow() + timedelta(days=30),
        'iat': datetime.utcnow()
    }
    token = jwt.encode(payload, app.config['JWT_SECRET'], algorithm=app.config['JWT_ALGORITHM'])
    return token

def verify_token(token):
    try:
        payload = jwt.decode(token, app.config['JWT_SECRET'], algorithms=[app.config['JWT_ALGORITHM']])
        return payload
    except:
        return None

# ==================== RUTAS PÚBLICAS ====================

@app.route('/', methods=['GET'])
def home():
    return jsonify({'message': 'Escuela de Emprendimiento API v1.0'}), 200

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'}), 200

# ==================== AUTENTICACIÓN ====================

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password') or not data.get('nombre') or not data.get('cedula'):
        return jsonify({'error': 'Faltan campos requeridos'}), 400
    
    if Usuario.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'El email ya está registrado'}), 400
        
    if Usuario.query.filter_by(cedula=data['cedula']).first():
        return jsonify({'error': 'La cédula ya está registrada'}), 400
    
    usuario = Usuario(
        nombre=data['nombre'],
        cedula=data['cedula'],
        email=data['email'],
        password_hash=hash_password(data['password']),
        rol='student'  # Se fuerza el rol a estudiante por seguridad
    )
    
    db.session.add(usuario)
    db.session.commit()
    
    token = create_token(usuario.id, usuario.rol)
    
    return jsonify({
        'message': 'Registro exitoso',
        'token': token,
        'user': {
            'id': usuario.id,
            'nombre': usuario.nombre,
            'cedula': usuario.cedula,
            'email': usuario.email,
            'rol': usuario.rol
        }
    }), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email y contraseña requeridos'}), 400
    
    usuario = Usuario.query.filter_by(email=data['email']).first()
    
    if not usuario or not verify_password(data['password'], usuario.password_hash):
        return jsonify({'error': 'Email o contraseña incorrectos'}), 401
    
    token = create_token(usuario.id, usuario.rol)
    
    return jsonify({
        'message': 'Login exitoso',
        'token': token,
        'user': {
            'id': usuario.id,
            'nombre': usuario.nombre,
            'cedula': usuario.cedula,
            'email': usuario.email,
            'rol': usuario.rol,
            'foto_perfil': f'/uploads/{usuario.foto_perfil}' if usuario.foto_perfil else None
        }
    }), 200

@app.route('/api/auth/me', methods=['GET'])
def me():
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    
    if not token:
        return jsonify({'error': 'Token requerido'}), 401
    
    payload = verify_token(token)
    if not payload:
        return jsonify({'error': 'Token inválido'}), 401
    
    usuario = Usuario.query.get(payload['id'])
    if not usuario:
        return jsonify({'error': 'Usuario no encontrado'}), 404
    
    return jsonify({
        'id': usuario.id,
        'nombre': usuario.nombre,
        'email': usuario.email,
        'rol': usuario.rol,
        'foto_perfil': f'/uploads/{usuario.foto_perfil}' if usuario.foto_perfil else None
    }), 200

@app.route('/api/auth/profile', methods=['PUT'])
def update_profile():
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    if not token:
        return jsonify({'error': 'Token requerido'}), 401
    
    payload = verify_token(token)
    if not payload:
        return jsonify({'error': 'Token inválido'}), 401
    
    usuario = Usuario.query.get(payload['id'])
    if not usuario:
        return jsonify({'error': 'Usuario no encontrado'}), 404
    
    import werkzeug
    
    # Handle JSON or FormData for name updates
    if request.is_json:
        datos = request.get_json()
        if 'nombre' in datos:
            usuario.nombre = datos['nombre']
    else:
        # FormData handling for mixed Name + File
        if 'nombre' in request.form:
            usuario.nombre = request.form['nombre']
        
        # Profile Picture Upload Logic
        if 'foto_perfil' in request.files:
            file = request.files['foto_perfil']
            if file and file.filename != '':
                import uuid
                # Generate unique secure filename
                ext = file.filename.rsplit('.', 1)[1].lower() if '.' in file.filename else 'png'
                filename = f"user_{usuario.id}_{uuid.uuid4().hex[:8]}.{ext}"
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                
                # Delete old photo if it exists
                if usuario.foto_perfil:
                    old_path = os.path.join(app.config['UPLOAD_FOLDER'], usuario.foto_perfil)
                    if os.path.exists(old_path):
                        os.remove(old_path)
                        
                file.save(filepath)
                usuario.foto_perfil = filename
    
    try:
        db.session.commit()
        return jsonify({
            'mensaje': 'Perfil actualizado correctamente',
            'user': {
                'id': usuario.id,
                'nombre': usuario.nombre,
                'email': usuario.email,
                'rol': usuario.rol,
                'foto_perfil': f'/uploads/{usuario.foto_perfil}' if usuario.foto_perfil else None
            }
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Error actualizando el perfil'}), 500

# ==================== CURSOS ====================

@app.route('/api/cursos', methods=['GET'])
def get_cursos():
    cursos = Curso.query.filter_by(estado='activo').all()
    return jsonify([{
        'id': c.id,
        'nombre': c.nombre,
        'descripcion': c.descripcion,
        'duracion': c.duracion,
        'profesor_id': c.profesor_id
    } for c in cursos]), 200

@app.route('/api/cursos/<int:curso_id>', methods=['GET'])
def get_curso(curso_id):
    curso = Curso.query.get(curso_id)
    if not curso:
        return jsonify({'error': 'Curso no encontrado'}), 404
    
    return jsonify({
        'id': curso.id,
        'nombre': curso.nombre,
        'descripcion': curso.descripcion,
        'duracion': curso.duracion,
        'profesor_id': curso.profesor_id
    }), 200

# ==================== ESTUDIANTE ====================

@app.route('/api/student/available-courses', methods=['GET'])
def get_available_courses():
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    usuario_id = None
    if token:
        payload = verify_token(token)
        if payload:
            usuario_id = payload['id']
            
    cursos = Curso.query.filter_by(estado='activo').all()
    
    if usuario_id:
        inscripciones = Inscripcion.query.filter_by(estudiante_id=usuario_id, estado='activo').all()
        inscritos_ids = [i.curso_id for i in inscripciones]
        cursos = [c for c in cursos if c.id not in inscritos_ids]

    return jsonify([{
        'id': c.id,
        'nombre': c.nombre,
        'descripcion': c.descripcion,
        'duracion': c.duracion,
        'profesor_id': c.profesor_id,
        'imagen_url': c.imagen_url
    } for c in cursos]), 200

@app.route('/api/student/enroll', methods=['POST'])
def enroll_course():
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    if not token: return jsonify({'error': 'Token requerido'}), 401
    payload = verify_token(token)
    if not payload: return jsonify({'error': 'Token inválido'}), 401
    
    usuario = Usuario.query.get(payload['id'])
    if not usuario or usuario.rol != 'student':
        return jsonify({'error': 'No autorizado'}), 403
    
    data = request.get_json()
    curso_id = data.get('curso_id')
    if not curso_id:
        return jsonify({'error': 'Falta el id del curso'}), 400
        
    curso = Curso.query.get(curso_id)
    if not curso:
        return jsonify({'error': 'Curso no encontrado'}), 404
        
    existente = Inscripcion.query.filter_by(estudiante_id=usuario.id, curso_id=curso.id).first()
    if existente:
        return jsonify({'error': 'Ya estás inscrito en este curso'}), 400
        
    nueva_inscripcion = Inscripcion(estudiante_id=usuario.id, curso_id=curso.id, estado='activo')
    db.session.add(nueva_inscripcion)
    db.session.commit()
    
    return jsonify({'message': 'Inscripción exitosa', 'inscripcion_id': nueva_inscripcion.id}), 201

@app.route('/api/student/my-enrollments', methods=['GET'])
def list_my_enrollments():
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    if not token: return jsonify({'error': 'Token requerido'}), 401
    payload = verify_token(token)
    if not payload: return jsonify({'error': 'Token inválido'}), 401
    
    usuario = Usuario.query.get(payload['id'])
    if not usuario or usuario.rol != 'student':
        return jsonify({'error': 'No autorizado'}), 403
        
    inscripciones = Inscripcion.query.filter_by(estudiante_id=usuario.id, estado='activo').all()
    cursos_inscritos = []
    for insc in inscripciones:
        curso = Curso.query.get(insc.curso_id)
        if curso:
            cursos_inscritos.append({
                'inscripcion_id': insc.id,
                'fecha_inscripcion': insc.fecha_inscripcion.isoformat() if insc.fecha_inscripcion else None,
                'curso': {
                    'id': curso.id,
                    'nombre': curso.nombre,
                    'descripcion': curso.descripcion,
                    'imagen_url': curso.imagen_url
                }
            })
            
    return jsonify(cursos_inscritos), 200

@app.route('/api/estudiante/inscribirse/<int:curso_id>', methods=['POST'])
def inscribirse(curso_id):
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    
    if not token:
        return jsonify({'error': 'Token requerido'}), 401
    
    payload = verify_token(token)
    if not payload:
        return jsonify({'error': 'Token inválido'}), 401
    
    usuario = Usuario.query.get(payload['id'])
    if not usuario or usuario.rol != 'student':
        return jsonify({'error': 'No autenticado como estudiante'}), 401
    
    curso = Curso.query.get(curso_id)
    if not curso:
        return jsonify({'error': 'Curso no encontrado'}), 404
    
    inscripcion_existente = Inscripcion.query.filter_by(
        estudiante_id=usuario.id,
        curso_id=curso_id
    ).first()
    
    if inscripcion_existente:
        return jsonify({'error': 'Ya estás inscrito en este curso'}), 400
    
    inscripcion = Inscripcion(
        estudiante_id=usuario.id,
        curso_id=curso_id
    )
    
    db.session.add(inscripcion)
    db.session.commit()
    
    return jsonify({'message': 'Inscripción exitosa', 'inscripcion_id': inscripcion.id}), 201

@app.route('/api/estudiante/cursos', methods=['GET'])
def mis_cursos():
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    
    if not token:
        return jsonify({'error': 'Token requerido'}), 401
    
    payload = verify_token(token)
    if not payload:
        return jsonify({'error': 'Token inválido'}), 401
    
    usuario = Usuario.query.get(payload['id'])
    if not usuario:
        return jsonify({'error': 'Usuario no encontrado'}), 404
    
    inscripciones = Inscripcion.query.filter_by(
        estudiante_id=usuario.id,
        estado='activo'
    ).all()
    
    cursos = []
    for ins in inscripciones:
        curso = Curso.query.get(ins.curso_id)
        if curso:
            cursos.append({
                'id': curso.id,
                'nombre': curso.nombre,
                'descripcion': curso.descripcion,
                'duracion': curso.duracion
            })
    
    return jsonify(cursos), 200

# ==================== PROFESOR ====================

@app.route('/api/teacher/my-courses', methods=['GET'])
def teacher_my_courses():
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    if not token: return jsonify({'error': 'Token requerido'}), 401
    payload = verify_token(token)
    if not payload: return jsonify({'error': 'Token inválido'}), 401
    
    usuario = Usuario.query.get(payload['id'])
    if not usuario or usuario.rol not in ['teacher', 'profesor']:
        return jsonify({'error': 'No autorizado'}), 403
        
    mis_cursos = Curso.query.filter_by(profesor_id=usuario.id).all()
    return jsonify([{
        'id': c.id,
        'nombre': c.nombre,
        'descripcion': c.descripcion,
        'duracion': c.duracion,
        'estado': c.estado
    } for c in mis_cursos]), 200

@app.route('/api/teacher/courses/<int:curso_id>/students', methods=['GET'])
def teacher_course_students(curso_id):
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    if not token: return jsonify({'error': 'Token requerido'}), 401
    payload = verify_token(token)
    if not payload: return jsonify({'error': 'Token inválido'}), 401
    
    profesor = Usuario.query.get(payload['id'])
    if not profesor or profesor.rol not in ['teacher', 'profesor']:
        return jsonify({'error': 'No autorizado'}), 403
        
    curso = Curso.query.get(curso_id)
    if not curso: return jsonify({'error': 'Curso no encontrado'}), 404
    
    if curso.profesor_id != profesor.id:
        return jsonify({'error': 'Este curso no te pertenece'}), 403
        
    # Realizando JOIN manual usando consultas a la base de datos
    inscripciones = Inscripcion.query.filter_by(curso_id=curso.id).all()
    estudiantes_data = []
    
    for inscripcion in inscripciones:
        estudiante = Usuario.query.get(inscripcion.estudiante_id)
        if estudiante:
            estudiantes_data.append({
                'inscripcion_id': inscripcion.id,
                'fecha_inscripcion': inscripcion.fecha_inscripcion.isoformat() if inscripcion.fecha_inscripcion else None,
                'estado': inscripcion.estado,
                'estudiante': {
                    'id': estudiante.id,
                    'nombre': estudiante.nombre,
                    'email': estudiante.email
                }
            })
            
    return jsonify(estudiantes_data), 200

# ----- Teacher Proposals Routes -----

@app.route('/api/teacher/proposals', methods=['POST'])
def create_proposal():
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    if not token:
        return jsonify({'error': 'Token requerido'}), 401
    
    payload = verify_token(token)
    if not payload or payload['rol'] not in ['teacher', 'profesor']:
        return jsonify({'error': 'Solo profesores pueden proponer cursos'}), 403
        
    data = request.get_json()
    if not data or not data.get('nombre') or not data.get('descripcion'):
        return jsonify({'error': 'El nombre y la descripción son obligatorios'}), 400

    propuesta = PropuestaCurso(
        profesor_id=payload['id'],
        nombre=data['nombre'],
        descripcion=data['descripcion'],
        duracion=data.get('duracion', 0),
        requisitos=data.get('requisitos', ''),
        estado='pendiente'
    )

    db.session.add(propuesta)
    db.session.commit()

    return jsonify({'message': 'Propuesta enviada exitosamente', 'id': propuesta.id}), 201

@app.route('/api/teacher/proposals', methods=['GET'])
def get_teacher_proposals():
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    if not token:
        return jsonify({'error': 'Token requerido'}), 401
    
    payload = verify_token(token)
    if not payload or payload['rol'] not in ['teacher', 'profesor']:
        return jsonify({'error': 'Solo profesores pueden ver sus propuestas'}), 403
        
    propuestas = PropuestaCurso.query.filter_by(profesor_id=payload['id']).order_by(PropuestaCurso.fecha_creacion.desc()).all()
    
    return jsonify([{
        'id': p.id,
        'nombre': p.nombre,
        'descripcion': p.descripcion,
        'duracion': p.duracion,
        'requisitos': p.requisitos,
        'estado': p.estado,
        'fecha_creacion': p.fecha_creacion.isoformat()
    } for p in propuestas]), 200
    
@app.route('/api/teacher/estadisticas', methods=['GET'])
def get_teacher_estadisticas():
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    if not token:
        return jsonify({'error': 'Token requerido'}), 401
    
    payload = verify_token(token)
    if not payload or payload['rol'] not in ['teacher', 'profesor']:
        return jsonify({'error': 'Acceso denegado'}), 403
        
    propuestas_totales = PropuestaCurso.query.filter_by(profesor_id=payload['id']).count()
    propuestas_pendientes = PropuestaCurso.query.filter_by(profesor_id=payload['id'], estado='pendiente').count()
    propuestas_aprobadas = PropuestaCurso.query.filter_by(profesor_id=payload['id'], estado='aprobado').count()
    
    return jsonify({
        'total': propuestas_totales,
        'pendientes': propuestas_pendientes,
        'aprobadas': propuestas_aprobadas
    }), 200

# --- ASISTENCIAS ---
@app.route('/api/teacher/asistencias', methods=['POST'])
def upload_asistencia():
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    if not token: return jsonify({'error': 'Token requerido'}), 401
    payload = verify_token(token)
    if not payload or payload['rol'] not in ['teacher', 'profesor', 'admin', 'convenio']: return jsonify({'error': 'No autorizado'}), 403
    
    if 'file' not in request.files:
        return jsonify({'error': 'No se adjuntó archivo'}), 400
        
    file = request.files['file']
    curso_id = request.form.get('curso_id')
    fecha_clase = request.form.get('fecha_clase')
    
    if file.filename == '' or not curso_id or not fecha_clase:
        return jsonify({'error': 'Datos incompletos'}), 400
        
    curso = Curso.query.get(curso_id)
    if not curso:
        return jsonify({'error': 'Curso no encontrado'}), 404
        
    # Validar que el profesor que sube es el dueño del curso (o es admin)
    if curso.profesor_id != payload['id'] and payload['rol'] != 'admin':
        return jsonify({'error': 'No eres el profesor de este curso'}), 403
        
    try:
        fecha_obj = datetime.strptime(fecha_clase, '%Y-%m-%d').date()
    except ValueError:
        return jsonify({'error': 'Formato de fecha inválido. Use YYYY-MM-DD'}), 400
        
    asist_folder = os.path.join(app.config['UPLOAD_FOLDER'], 'asistencias')
    os.makedirs(asist_folder, exist_ok=True)
    
    filename = werkzeug.utils.secure_filename(f"asist_curso{curso_id}_{fecha_clase}_{int(datetime.utcnow().timestamp())}_{file.filename}")
    file_path = os.path.join(asist_folder, filename)
    file.save(file_path)
    
    nueva_asistencia = Asistencia(
        curso_id=curso_id,
        profesor_id=payload['id'],
        fecha_clase=fecha_obj,
        archivo_url=f"/uploads/asistencias/{filename}"
    )
    
    db.session.add(nueva_asistencia)
    db.session.commit()
    
    return jsonify({
        'message': 'Asistencia subida exitosamente',
        'asistencia_id': nueva_asistencia.id
    }), 201

@app.route('/api/teacher/asistencias/<int:curso_id>', methods=['GET'])
def get_asistencias(curso_id):
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    if not token: return jsonify({'error': 'Token requerido'}), 401
    payload = verify_token(token)
    if not payload: return jsonify({'error': 'Token inválido'}), 401
    
    curso = Curso.query.get(curso_id)
    if not curso: return jsonify({'error': 'Curso no encontrado'}), 404
    
    # Solo el profe o admin puede ver
    if curso.profesor_id != payload['id'] and payload['rol'] != 'admin':
        return jsonify({'error': 'No autorizado'}), 403
        
    asistencias = Asistencia.query.filter_by(curso_id=curso_id).order_by(Asistencia.fecha_clase.desc()).all()
    
    return jsonify([{
        'id': a.id,
        'fecha_clase': a.fecha_clase.isoformat(),
        'archivo_url': a.archivo_url,
        'fecha_subida': a.fecha_subida.isoformat()
    } for a in asistencias]), 200

@app.route('/api/teacher/asistencias/<int:asistencia_id>', methods=['DELETE'])
def delete_asistencia(asistencia_id):
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    if not token: return jsonify({'error': 'Token requerido'}), 401
    payload = verify_token(token)
    if not payload: return jsonify({'error': 'Token inválido'}), 401
    
    asistencia = Asistencia.query.get(asistencia_id)
    if not asistencia: return jsonify({'error': 'Asistencia no encontrada'}), 404
    
    # Solo el profe original o admin puede borrar
    if asistencia.profesor_id != payload['id'] and payload['rol'] != 'admin':
        return jsonify({'error': 'No autorizado para borrar esta asistencia'}), 403
        
    db.session.delete(asistencia)
    db.session.commit()
    
    return jsonify({'message': 'Asistencia eliminada exitosamente'}), 200

# ==================== ADMINISTRADOR ====================

@app.route('/api/admin/courses', methods=['POST'])
def admin_create_course():
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    if not token: return jsonify({'error': 'Token requerido'}), 401
    payload = verify_token(token)
    if not payload: return jsonify({'error': 'Token inválido'}), 401
    
    admin = Usuario.query.get(payload['id'])
    if not admin or admin.rol != 'admin':
        return jsonify({'error': 'No autorizado. Solo administrador.'}), 403
        
    if request.is_json:
        data = request.get_json()
    else:
        data = request.form

    if not data or not data.get('nombre') or not data.get('profesor_id'):
        return jsonify({'error': 'Nombre y profesor_id son requeridos'}), 400
        
    profesor = Usuario.query.get(data['profesor_id'])
    if not profesor or profesor.rol not in ['teacher', 'profesor', 'convenio', 'admin']:
        return jsonify({'error': 'El ID asignado no corresponde a un profesor válido'}), 400
        
    nuevo_curso = Curso(
        nombre=data['nombre'],
        descripcion=data.get('descripcion', ''),
        duracion=data.get('duracion', 0),
        profesor_id=profesor.id,
        estado='activo'
    )
    
    if 'imagen' in request.files:
        file = request.files['imagen']
        if file and file.filename != '':
            import uuid
            ext = file.filename.rsplit('.', 1)[1].lower() if '.' in file.filename else 'png'
            filename = f"curso_{uuid.uuid4().hex[:8]}.{ext}"
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            nuevo_curso.imagen_url = filename
    
    db.session.add(nuevo_curso)
    db.session.commit()
    
    return jsonify({
        'message': 'Curso creado y asignado exitosamente',
        'curso': {
            'id': nuevo_curso.id,
            'nombre': nuevo_curso.nombre,
            'profesor_id': nuevo_curso.profesor_id,
            'imagen_url': nuevo_curso.imagen_url
        }
    }), 201

@app.route('/api/admin/create-user', methods=['POST'])
def admin_crear_usuario():
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    
    if not token:
        return jsonify({'error': 'Token requerido'}), 401
    
    payload = verify_token(token)
    if not payload:
        return jsonify({'error': 'Token inválido'}), 401
    
    usuario_admin = Usuario.query.get(payload['id'])
    if not usuario_admin or usuario_admin.rol != 'admin':
        return jsonify({'error': 'No autorizado'}), 403
        
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password') or not data.get('nombre') or not data.get('rol'):
        return jsonify({'error': 'Faltan campos requeridos'}), 400
        
    roles_permitidos = ['teacher', 'profesor', 'convenio', 'admin', 'student']
    if data['rol'] not in roles_permitidos:
        return jsonify({'error': 'Rol no permitido'}), 400
        
    if Usuario.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'El email ya está registrado'}), 400
        
    nuevo_usuario = Usuario(
        nombre=data['nombre'],
        email=data['email'],
        password_hash=hash_password(data['password']),
        rol=data['rol'],
        creado_por_id=payload['id']
    )
    
    db.session.add(nuevo_usuario)
    db.session.commit()
    
    return jsonify({
        'message': 'Usuario creado exitosamente',
        'user': {
            'id': nuevo_usuario.id,
            'nombre': nuevo_usuario.nombre,
            'email': nuevo_usuario.email,
            'rol': nuevo_usuario.rol
        }
    }), 201

@app.route('/api/admin/proposals', methods=['GET'])
def admin_get_proposals():
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    if not token:
        return jsonify({'error': 'Token requerido'}), 401
    
    payload = verify_token(token)
    if not payload or payload['rol'] != 'admin':
        return jsonify({'error': 'No autorizado'}), 403
    
    propuestas = PropuestaCurso.query.order_by(PropuestaCurso.fecha_creacion.desc()).all()
    
    return jsonify([{
        'id': p.id,
        'nombre': p.nombre,
        'descripcion': p.descripcion,
        'duracion': p.duracion,
        'requisitos': p.requisitos,
        'estado': p.estado,
        'profesor_id': p.profesor_id,
        'profesor_nombre': Usuario.query.get(p.profesor_id).nombre if Usuario.query.get(p.profesor_id) else 'Desconocido',
        'fecha_creacion': p.fecha_creacion.isoformat()
    } for p in propuestas]), 200

@app.route('/api/admin/proposals/<int:propuesta_id>/approve', methods=['PUT'])
def admin_approve_proposal(propuesta_id):
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    if not token:
        return jsonify({'error': 'Token requerido'}), 401
    
    payload = verify_token(token)
    if not payload or payload['rol'] != 'admin':
        return jsonify({'error': 'No autorizado'}), 403
    
    propuesta = PropuestaCurso.query.get(propuesta_id)
    if not propuesta:
        return jsonify({'error': 'Propuesta no encontrada'}), 404
        
    if propuesta.estado != 'pendiente':
         return jsonify({'error': f'La propuesta ya está {propuesta.estado}'}), 400
    
    # Update proposal status
    propuesta.estado = 'aprobado'
    
    # Create the actual active Course
    curso = Curso(
        nombre=propuesta.nombre,
        descripcion=propuesta.descripcion,
        duracion=propuesta.duracion,
        profesor_id=propuesta.profesor_id,
        estado='activo'
    )
    
    db.session.add(curso)
    db.session.commit()
    
    return jsonify({
        'message': 'Propuesta aprobada y curso creado',
        'propuesta_id': propuesta_id,
        'curso_id': curso.id
    }), 200

@app.route('/api/admin/proposals/<int:propuesta_id>/reject', methods=['PUT'])
def admin_reject_proposal(propuesta_id):
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    if not token:
        return jsonify({'error': 'Token requerido'}), 401
    
    payload = verify_token(token)
    if not payload or payload['rol'] != 'admin':
        return jsonify({'error': 'No autorizado'}), 403
    
    propuesta = PropuestaCurso.query.get(propuesta_id)
    if not propuesta:
        return jsonify({'error': 'Propuesta no encontrada'}), 404
        
    if propuesta.estado != 'pendiente':
         return jsonify({'error': f'La propuesta ya está {propuesta.estado}'}), 400
    
    data = request.get_json() or {}
    motivo = data.get('motivo', 'Sin especificar')
    
    propuesta.estado = 'rechazado'
    # Currently we don't save the rejection motive in db, but we could add it to PropuestaCurso model later
    db.session.commit()
    
    return jsonify({
        'message': 'Propuesta rechazada',
        'propuesta_id': propuesta_id,
        'motivo': motivo
    }), 200

@app.route('/api/admin/usuarios', methods=['GET'])
def admin_usuarios():
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    if not token:
        return jsonify({'error': 'Token requerido'}), 401
    
    payload = verify_token(token)
    if not payload or payload['rol'] != 'admin':
        return jsonify({'error': 'No autorizado'}), 403
    
    usuarios = Usuario.query.all()
    result = []
    for u in usuarios:
        creador_nombre = None
        if u.creado_por_id:
            creador = Usuario.query.get(u.creado_por_id)
            if creador:
                creador_nombre = creador.nombre
        
        result.append({
            'id': u.id,
            'nombre': u.nombre,
            'cedula': u.cedula,
            'email': u.email,
            'rol': u.rol,
            'creado_por_id': u.creado_por_id,
            'creado_por_nombre': creador_nombre,
            'fecha_creacion': u.fecha_creacion.isoformat()
        })
        
    return jsonify(result), 200

@app.route('/api/admin/cursos', methods=['GET'])
def admin_cursos():
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    
    if not token:
        return jsonify({'error': 'Token requerido'}), 401
    
    payload = verify_token(token)
    if not payload:
        return jsonify({'error': 'Token inválido'}), 401
    
    usuario = Usuario.query.get(payload['id'])
    if not usuario or usuario.rol != 'admin':
        return jsonify({'error': 'No autorizado'}), 403
    
    cursos = Curso.query.all()
    
    return jsonify([{
        'id': c.id,
        'nombre': c.nombre,
        'descripcion': c.descripcion,
        'duracion': c.duracion,
        'profesor_id': c.profesor_id,
        'profesor_nombre': Usuario.query.get(c.profesor_id).nombre if Usuario.query.get(c.profesor_id) else 'Desconocido',
        'estado': c.estado,
        'imagen_url': c.imagen_url,
        'fecha_creacion': c.fecha_creacion.isoformat()
    } for c in cursos]), 200

@app.route('/api/admin/cursos/<int:curso_id>', methods=['PUT'])
def admin_editar_curso(curso_id):
    """PUT /api/admin/cursos/<id> - Solo admin. Edita nombre/descripción/duración de un curso."""
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    if not token: return jsonify({'error': 'Token requerido'}), 401
    payload = verify_token(token)
    if not payload or payload['rol'] != 'admin': return jsonify({'error': 'No autorizado'}), 403

    curso = Curso.query.get(curso_id)
    if not curso: return jsonify({'error': 'Curso no encontrado'}), 404

    if request.is_json:
        data = request.get_json()
    else:
        data = request.form

    if data.get('nombre'): curso.nombre = data['nombre']
    if 'descripcion' in data: curso.descripcion = data['descripcion']
    if 'duracion' in data: curso.duracion = data['duracion']
    if 'profesor_id' in data:
        profe = Usuario.query.get(data['profesor_id'])
        if profe: curso.profesor_id = profe.id
        
    if 'imagen' in request.files:
        file = request.files['imagen']
        if file and file.filename != '':
            import uuid
            ext = file.filename.rsplit('.', 1)[1].lower() if '.' in file.filename else 'png'
            filename = f"curso_{uuid.uuid4().hex[:8]}.{ext}"
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            
            if curso.imagen_url:
                old_path = os.path.join(app.config['UPLOAD_FOLDER'], curso.imagen_url)
                if os.path.exists(old_path):
                    os.remove(old_path)
                    
            file.save(filepath)
            curso.imagen_url = filename
            
    db.session.commit()
    return jsonify({'message': 'Curso actualizado correctamente'}), 200


@app.route('/api/convenio/propuestas/<int:propuesta_id>', methods=['PUT'])
def convenio_editar_propuesta(propuesta_id):
    """PUT /api/convenio/propuestas/<id> - Convenio edita su propia propuesta pendiente."""
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    if not token: return jsonify({'error': 'Token requerido'}), 401
    payload = verify_token(token)
    if not payload or payload['rol'] not in ['convenio', 'admin']: return jsonify({'error': 'No autorizado'}), 403

    propuesta = CursoPropuesto.query.get(propuesta_id)
    if not propuesta: return jsonify({'error': 'Propuesta no encontrada'}), 404
    if payload['rol'] == 'convenio' and propuesta.convenio_id != payload['id']:
        return jsonify({'error': 'No tienes permiso para editar esta propuesta'}), 403
    if propuesta.estado != 'pendiente':
        return jsonify({'error': 'Solo se pueden editar propuestas pendientes'}), 400

    if request.is_json:
        data = request.get_json()
    else:
        data = request.form
        
    if data.get('titulo'): propuesta.titulo = data['titulo']
    if 'descripcion' in data: propuesta.descripcion = data['descripcion']
    if 'instructor_tentativo' in data: propuesta.instructor_tentativo = data['instructor_tentativo']
    
    if 'imagen' in request.files:
        file = request.files['imagen']
        if file and file.filename != '':
            import uuid
            import os
            ext = file.filename.rsplit('.', 1)[1].lower() if '.' in file.filename else 'png'
            filename = f"propuesta_{uuid.uuid4().hex[:8]}.{ext}"
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            
            if propuesta.imagen_url:
                old_path = os.path.join(app.config['UPLOAD_FOLDER'], propuesta.imagen_url)
                if os.path.exists(old_path):
                    os.remove(old_path)
                    
            file.save(filepath)
            propuesta.imagen_url = filename
            
    db.session.commit()
    return jsonify({'message': 'Propuesta actualizada correctamente'}), 200


# ==================== HORARIOS ====================

@app.route('/api/teacher/horario/<int:curso_id>', methods=['GET'])
def get_horario(curso_id):
    """GET /api/teacher/horario/<curso_id> - Obtiene el horario de un curso."""
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    if not token: return jsonify({'error': 'Token requerido'}), 401
    payload = verify_token(token)
    if not payload: return jsonify({'error': 'Token inválido'}), 401

    horario = Horario.query.filter_by(curso_id=curso_id).first()
    if not horario:
        return jsonify(None), 200

    return jsonify({
        'id': horario.id,
        'curso_id': horario.curso_id,
        'descripcion': horario.descripcion,
        'archivo_url': horario.archivo_url,
        'fecha_actualizacion': horario.fecha_actualizacion.isoformat()
    }), 200


@app.route('/api/teacher/horario', methods=['POST'])
def save_horario():
    """POST /api/teacher/horario - Crea o actualiza el horario de un curso (upsert)."""
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    if not token: return jsonify({'error': 'Token requerido'}), 401
    payload = verify_token(token)
    if not payload or payload['rol'] not in ['teacher', 'profesor', 'admin']: return jsonify({'error': 'No autorizado'}), 403

    curso_id = request.form.get('curso_id')
    descripcion = request.form.get('descripcion', '').strip()
    if not curso_id or not descripcion:
        return jsonify({'error': 'curso_id y descripcion son requeridos'}), 400

    curso = Curso.query.get(curso_id)
    if not curso: return jsonify({'error': 'Curso no encontrado'}), 404
    if payload['rol'] != 'admin' and curso.profesor_id != payload['id']:
        return jsonify({'error': 'No eres el profesor de este curso'}), 403

    # Handle optional file upload
    archivo_url = None
    if 'file' in request.files:
        file = request.files['file']
        if file and file.filename:
            hor_folder = os.path.join(app.config['UPLOAD_FOLDER'], 'horarios')
            os.makedirs(hor_folder, exist_ok=True)
            filename = werkzeug.utils.secure_filename(f"horario_curso{curso_id}_{int(datetime.utcnow().timestamp())}_{file.filename}")
            file.save(os.path.join(hor_folder, filename))
            archivo_url = f'/uploads/horarios/{filename}'

    horario = Horario.query.filter_by(curso_id=curso_id).first()
    if horario:
        horario.descripcion = descripcion
        if archivo_url: horario.archivo_url = archivo_url
        horario.fecha_actualizacion = datetime.utcnow()
    else:
        horario = Horario(curso_id=curso_id, descripcion=descripcion, archivo_url=archivo_url)
        db.session.add(horario)

    db.session.commit()
    return jsonify({'message': 'Horario guardado correctamente', 'archivo_url': horario.archivo_url}), 200


@app.route('/api/admin/estadisticas', methods=['GET'])
def admin_estadisticas():
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    
    if not token:
        return jsonify({'error': 'Token requerido'}), 401
    
    payload = verify_token(token)
    if not payload:
        return jsonify({'error': 'Token inválido'}), 401
    
    usuario = Usuario.query.get(payload['id'])
    if not usuario or usuario.rol != 'admin':
        return jsonify({'error': 'No autorizado'}), 403
    
    total_usuarios = Usuario.query.count()
    total_estudiantes = Usuario.query.filter_by(rol='student').count()
    total_profesores = Usuario.query.filter(Usuario.rol.in_(['teacher', 'profesor'])).count()
    total_convenios = Usuario.query.filter_by(rol='convenio').count()
    total_cursos = Curso.query.count()
    total_propuestas = PropuestaCurso.query.count()
    propuestas_pendientes = PropuestaCurso.query.filter_by(estado='pendiente').count()
    propuestas_aprobadas = PropuestaCurso.query.filter_by(estado='aprobado').count()
    propuestas_rechazadas = PropuestaCurso.query.filter_by(estado='rechazado').count()
    
    return jsonify({
        'total_usuarios': total_usuarios,
        'total_estudiantes': total_estudiantes,
        'total_profesores': total_profesores,
        'total_convenios': total_convenios,
        'total_cursos': total_cursos,
        'total_propuestas': total_propuestas,
        'propuestas_pendientes': propuestas_pendientes,
        'propuestas_aprobadas': propuestas_aprobadas,
        'propuestas_rechazadas': propuestas_rechazadas
    }), 200

# ==================== CONVENIO ====================

@app.route('/api/convenio/propuestas', methods=['POST'])
def convenio_crear_propuesta():
    """POST /api/convenio/propuestas — Convenio crea una propuesta de curso para votación."""
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    if not token:
        return jsonify({'error': 'Token requerido'}), 401

    payload = verify_token(token)
    if not payload:
        return jsonify({'error': 'Token inválido'}), 401

    usuario = Usuario.query.get(payload['id'])
    if not usuario or usuario.rol not in ['convenio', 'admin']:
        return jsonify({'error': 'Solo instituciones de convenio pueden crear propuestas'}), 403

    if request.is_json:
        data = request.get_json()
    else:
        data = request.form

    if not data or not data.get('titulo'):
        return jsonify({'error': 'El título es obligatorio'}), 400

    nueva = CursoPropuesto(
        titulo=data['titulo'],
        descripcion=data.get('descripcion', ''),
        instructor_tentativo=data.get('instructor_tentativo', ''),
        convenio_id=usuario.id
    )
    
    if 'imagen' in request.files:
        file = request.files['imagen']
        if file and file.filename != '':
            import uuid
            import os
            ext = file.filename.rsplit('.', 1)[1].lower() if '.' in file.filename else 'png'
            filename = f"propuesta_{uuid.uuid4().hex[:8]}.{ext}"
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            nueva.imagen_url = filename
            
    db.session.add(nueva)
    db.session.commit()

    return jsonify({'message': 'Propuesta creada exitosamente', 'id': nueva.id, 'imagen_url': nueva.imagen_url}), 201


@app.route('/api/convenio/mis-propuestas', methods=['GET'])
def convenio_mis_propuestas():
    """GET /api/convenio/mis-propuestas — Lista las propuestas del convenio con conteo de votos."""
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    if not token:
        return jsonify({'error': 'Token requerido'}), 401

    payload = verify_token(token)
    if not payload:
        return jsonify({'error': 'Token inválido'}), 401

    usuario = Usuario.query.get(payload['id'])
    if not usuario or usuario.rol not in ['convenio', 'admin']:
        return jsonify({'error': 'No autorizado'}), 403

    propuestas = CursoPropuesto.query.filter_by(convenio_id=usuario.id).order_by(CursoPropuesto.fecha_creacion.desc()).all()

    result = []
    for p in propuestas:
        votos_positivos = Voto.query.filter_by(curso_propuesto_id=p.id, tipo='interesado').count()
        votos_negativos = Voto.query.filter_by(curso_propuesto_id=p.id, tipo='no_interesado').count()
        result.append({
            'id': p.id,
            'titulo': p.titulo,
            'descripcion': p.descripcion,
            'instructor_tentativo': p.instructor_tentativo,
            'estado': p.estado,
            'votos': votos_positivos,
            'votos_negativos': votos_negativos,
            'imagen_url': p.imagen_url,
            'fecha_creacion': p.fecha_creacion.isoformat()
        })

    return jsonify(result), 200


@app.route('/api/convenio/estadisticas', methods=['GET'])
def convenio_estadisticas():
    """GET /api/convenio/estadisticas — Stats del convenio."""
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    if not token:
        return jsonify({'error': 'Token requerido'}), 401

    payload = verify_token(token)
    if not payload:
        return jsonify({'error': 'Token inválido'}), 401

    usuario = Usuario.query.get(payload['id'])
    if not usuario or usuario.rol not in ['convenio', 'admin']:
        return jsonify({'error': 'No autorizado'}), 403

    mis_propuestas = CursoPropuesto.query.filter_by(convenio_id=usuario.id).all()
    total = len(mis_propuestas)
    pendientes = sum(1 for p in mis_propuestas if p.estado == 'pendiente')
    aprobadas = sum(1 for p in mis_propuestas if p.estado == 'aceptado')
    
    total_interesados = 0
    total_no_interesados = 0
    for p in mis_propuestas:
        total_interesados += Voto.query.filter_by(curso_propuesto_id=p.id, tipo='interesado').count()
        total_no_interesados += Voto.query.filter_by(curso_propuesto_id=p.id, tipo='no_interesado').count()

    return jsonify({
        'total_propuestas': total,
        'propuestas_pendientes': pendientes,
        'propuestas_aprobadas': aprobadas,
        'total_votos_recibidos': total_interesados,
        'total_votos_negativos': total_no_interesados
    }), 200


# ==================== VOTACIÓN DE CURSOS PROPUESTOS ====================

@app.route('/api/propuestas-votacion', methods=['GET'])
def get_propuestas_votacion():
    """GET /api/propuestas-votacion — Lista CursosPropuestos en estado pendiente con conteo de votos."""
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    payload = verify_token(token) if token else None
    usuario_id = payload['id'] if payload else None

    cursos = CursoPropuesto.query.filter_by(estado='pendiente').order_by(CursoPropuesto.fecha_creacion.desc()).all()

    result = []
    for c in cursos:
        votos_positivos = Voto.query.filter_by(curso_propuesto_id=c.id, tipo='interesado').count()
        votos_negativos = Voto.query.filter_by(curso_propuesto_id=c.id, tipo='no_interesado').count()
        
        ya_vote = None
        if usuario_id:
            voto = Voto.query.filter_by(usuario_id=usuario_id, curso_propuesto_id=c.id).first()
            if voto:
                ya_vote = voto.tipo
                
        result.append({
            'id': c.id,
            'titulo': c.titulo,
            'descripcion': c.descripcion,
            'instructor_tentativo': c.instructor_tentativo,
            'estado': c.estado,
            'votos': votos_positivos,
            'votos_negativos': votos_negativos,
            'ya_vote': ya_vote, # 'interesado', 'no_interesado' o None
            'fecha_creacion': c.fecha_creacion.isoformat()
        })

    return jsonify(result), 200


@app.route('/api/votar', methods=['POST'])
def votar_curso():
    """POST /api/votar — Registra el voto del usuario autenticado para un curso propuesto."""
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    if not token:
        return jsonify({'error': 'Token requerido'}), 401

    payload = verify_token(token)
    if not payload:
        return jsonify({'error': 'Token inválido'}), 401

    data = request.get_json()
    curso_id = data.get('curso_id') if data else None
    tipo = data.get('tipo', 'interesado') if data else 'interesado'
    
    if tipo not in ['interesado', 'no_interesado']:
        return jsonify({'error': 'Tipo de voto inválido'}), 400

    if not curso_id:
        return jsonify({'error': 'Falta el campo curso_id'}), 400

    curso = CursoPropuesto.query.get(curso_id)
    if not curso:
        return jsonify({'error': 'Curso propuesto no encontrado'}), 404

    if curso.estado != 'pendiente':
        return jsonify({'error': 'Este curso ya no está en votación'}), 400

    voto_existente = Voto.query.filter_by(usuario_id=payload['id'], curso_propuesto_id=curso_id).first()
    if voto_existente:
        return jsonify({'error': 'Ya diste tu opinión sobre este curso'}), 409

    nuevo_voto = Voto(usuario_id=payload['id'], curso_propuesto_id=curso_id, tipo=tipo)
    db.session.add(nuevo_voto)
    db.session.commit()

    votos_positivos = Voto.query.filter_by(curso_propuesto_id=curso_id, tipo='interesado').count()
    votos_negativos = Voto.query.filter_by(curso_propuesto_id=curso_id, tipo='no_interesado').count()
    
    return jsonify({
        'message': 'Opinión registrada exitosamente', 
        'votos': votos_positivos,
        'votos_negativos': votos_negativos
    }), 201


@app.route('/api/admin/aprobar-curso-propuesto/<int:curso_id>', methods=['PATCH'])
def admin_aprobar_curso_propuesto(curso_id):
    """PATCH /api/admin/aprobar-curso/<id> — Solo admin. Aprueba y crea el curso oficial."""
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    if not token:
        return jsonify({'error': 'Token requerido'}), 401

    payload = verify_token(token)
    if not payload or payload['rol'] != 'admin':
        return jsonify({'error': 'No autorizado. Solo administradores.'}), 403

    curso_propuesto = CursoPropuesto.query.get(curso_id)
    if not curso_propuesto:
        return jsonify({'error': 'Curso propuesto no encontrado'}), 404

    if curso_propuesto.estado != 'pendiente':
        return jsonify({'error': f'Este curso ya fue {curso_propuesto.estado}'}), 400

    # Cambiar estado a aceptado
    curso_propuesto.estado = 'aceptado'

    # Leer profesor_id opcional del body
    data = request.get_json(silent=True) or {}
    profesor_id = data.get('profesor_id', None)

    # Validar que el profesor existe si se envió
    if profesor_id:
        profe = Usuario.query.get(profesor_id)
        if not profe or profe.rol not in ['teacher', 'profesor']:
            return jsonify({'error': 'Profesor inválido'}), 400

    # Crear el curso oficial en la tabla Curso
    nuevo_curso = Curso(
        nombre=curso_propuesto.titulo,
        descripcion=curso_propuesto.descripcion,
        duracion='Por definir',
        profesor_id=profesor_id,
        estado='activo'
    )
    db.session.add(nuevo_curso)
    db.session.commit()

    return jsonify({
        'message': 'Curso aprobado y creado exitosamente',
        'curso_propuesto_id': curso_id,
        'nuevo_curso_id': nuevo_curso.id
    }), 200


@app.route('/api/admin/propuestas-votacion', methods=['GET'])
def admin_get_propuestas_votacion():
    """GET /api/admin/propuestas-votacion — Lista todos los CursosPropuestos ordenados por votos (desc)."""
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    if not token:
        return jsonify({'error': 'Token requerido'}), 401

    payload = verify_token(token)
    if not payload or payload['rol'] != 'admin':
        return jsonify({'error': 'No autorizado'}), 403

    cursos = CursoPropuesto.query.all()

    result = []
    for c in cursos:
        votos_positivos = Voto.query.filter_by(curso_propuesto_id=c.id, tipo='interesado').count()
        votos_negativos = Voto.query.filter_by(curso_propuesto_id=c.id, tipo='no_interesado').count()
        result.append({
            'id': c.id,
            'titulo': c.titulo,
            'descripcion': c.descripcion,
            'instructor_tentativo': c.instructor_tentativo,
            'estado': c.estado,
            'votos': votos_positivos,
            'votos_negativos': votos_negativos,
            'fecha_creacion': c.fecha_creacion.isoformat()
        })

    # Ordenar por votos positivos de mayor a menor
    result.sort(key=lambda x: x['votos'], reverse=True)
    return jsonify(result), 200


@app.route('/api/admin/propuestas-votacion', methods=['POST'])
def admin_crear_propuesta_votacion():
    """POST /api/admin/propuestas-votacion — Crear un nuevo CursoPropuesto (solo admin)."""
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    if not token:
        return jsonify({'error': 'Token requerido'}), 401

    payload = verify_token(token)
    if not payload or payload['rol'] != 'admin':
        return jsonify({'error': 'No autorizado'}), 403

    data = request.get_json()
    if not data or not data.get('titulo'):
        return jsonify({'error': 'El título es obligatorio'}), 400

    nuevo = CursoPropuesto(
        titulo=data['titulo'],
        descripcion=data.get('descripcion', ''),
        instructor_tentativo=data.get('instructor_tentativo', '')
    )
    db.session.add(nuevo)
    db.session.commit()

    return jsonify({'message': 'Propuesta de votación creada', 'id': nuevo.id}), 201


# ==================== CONVENIO ====================

@app.route('/api/convenio/create-teacher', methods=['POST'])
def convenio_create_teacher():
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    if not token:
        return jsonify({'error': 'Token requerido'}), 401

    payload = verify_token(token)
    if not payload or payload['rol'] != 'convenio':
        return jsonify({'error': 'No autorizado. Solo para convenios.'}), 403

    data = request.get_json()
    if not data or not data.get('nombre') or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Nombre, email y password son requeridos'}), 400

    # Verificar si el email ya existe
    if Usuario.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'El email ya está registrado'}), 400
        
    if data.get('cedula') and Usuario.query.filter_by(cedula=data['cedula']).first():
        return jsonify({'error': 'La cédula ya está registrada'}), 400

    hashed_pw = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    nuevo_profesor = Usuario(
        nombre=data['nombre'],
        cedula=data.get('cedula', ''),
        email=data['email'],
        password_hash=hashed_pw,
        rol='teacher',
        creado_por_id=payload['id']
    )
    
    db.session.add(nuevo_profesor)
    db.session.commit()
    
    return jsonify({
        'message': 'Profesor creado exitosamente',
        'profesor_id': nuevo_profesor.id
    }), 201

@app.route('/api/convenio/my-teachers', methods=['GET'])
def convenio_get_my_teachers():
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    if not token:
        return jsonify({'error': 'Token requerido'}), 401

    payload = verify_token(token)
    if not payload or payload['rol'] != 'convenio':
        return jsonify({'error': 'No autorizado. Solo para convenios.'}), 403

    profesores = Usuario.query.filter_by(creado_por_id=payload['id'], rol='teacher').all()

    return jsonify([{
        'id': p.id,
        'nombre': p.nombre,
        'email': p.email,
        'cedula': p.cedula
    } for p in profesores]), 200


# ==================== CERTIFICADOS ====================

@app.route('/api/admin/users', methods=['GET'])
def get_all_users():
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    if not token: return jsonify({'error': 'Token requerido'}), 401
    payload = verify_token(token)
    if not payload or payload['rol'] != 'admin': return jsonify({'error': 'No autorizado'}), 403
    
    usuarios = Usuario.query.all()
    return jsonify([{
        'id': u.id,
        'nombre': u.nombre,
        'email': u.email,
        'cedula': u.cedula,
        'rol': u.rol
    } for u in usuarios]), 200

@app.route('/api/admin/certificados', methods=['POST'])
def upload_certificado():
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    if not token: return jsonify({'error': 'Token requerido'}), 401
    payload = verify_token(token)
    if not payload or payload['rol'] != 'admin': return jsonify({'error': 'No autorizado'}), 403
    
    if 'file' not in request.files:
        return jsonify({'error': 'No se adjuntó archivo'}), 400
        
    file = request.files['file']
    estudiante_id = request.form.get('estudiante_id')
    nombre_curso = request.form.get('nombre_curso')
    
    if file.filename == '' or not estudiante_id or not nombre_curso:
        return jsonify({'error': 'Datos incompletos'}), 400
        
    estudiante = Usuario.query.get(estudiante_id)
    if not estudiante or estudiante.rol != 'student':
        return jsonify({'error': 'Estudiante inválido'}), 400
        
    cert_folder = os.path.join(app.config['UPLOAD_FOLDER'], 'certificados')
    os.makedirs(cert_folder, exist_ok=True)
    
    filename = werkzeug.utils.secure_filename(f"cert_{estudiante_id}_{int(datetime.utcnow().timestamp())}_{file.filename}")
    file_path = os.path.join(cert_folder, filename)
    file.save(file_path)
    
    certificado = Certificado(
        estudiante_id=estudiante_id,
        nombre_curso=nombre_curso,
        archivo_url=f"/uploads/certificados/{filename}"
    )
    db.session.add(certificado)
    db.session.commit()
    
    return jsonify({'message': 'Certificado subido exitosamente'}), 201

@app.route('/api/student/certificados', methods=['GET'])
def get_my_certificates():
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    if not token: return jsonify({'error': 'Token requerido'}), 401
    payload = verify_token(token)
    if not payload or payload['rol'] != 'student': return jsonify({'error': 'No autorizado'}), 403
    
    certificados = Certificado.query.filter_by(estudiante_id=payload['id']).order_by(Certificado.fecha_subida.desc()).all()
    
    return jsonify([{
        'id': c.id,
        'nombre_curso': c.nombre_curso,
        'archivo_url': c.archivo_url,
        'fecha_subida': c.fecha_subida.isoformat()
    } for c in certificados]), 200

# ==================== ERROR HANDLERS ====================

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Recurso no encontrado'}), 404

@app.errorhandler(500)
def server_error(error):
    return jsonify({'error': 'Error interno del servidor'}), 500

# ==================== INICIALIZACIÓN ====================

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        print("[v0] Base de datos inicializada")
        print(f"[v0] Servidor iniciado en http://localhost:{os.environ.get('PORT', 5000)}")
    
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
