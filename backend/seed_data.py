from app import app, db, Usuario, Curso, Inscripcion, PropuestaCurso, hash_password

def seed():
    with app.app_context():
        # Limpiar datos existentes
        db.drop_all()
        db.create_all()
        print("[v0] Base de datos limpiada")
        
        # Crear usuarios
        profesor1 = Usuario(
            nombre='Carlos Profesor',
            email='profesor1@escuela.com',
            password_hash=hash_password('Password123'),
            rol='teacher'
        )
        
        profesor2 = Usuario(
            nombre='María Docente',
            email='profesor2@escuela.com',
            password_hash=hash_password('Password123'),
            rol='teacher'
        )
        
        estudiante1 = Usuario(
            nombre='Juan Estudiante',
            email='estudiante1@escuela.com',
            password_hash=hash_password('Password123'),
            rol='student'
        )
        
        estudiante2 = Usuario(
            nombre='Ana Aprendiz',
            email='estudiante2@escuela.com',
            password_hash=hash_password('Password123'),
            rol='student'
        )
        
        admin = Usuario(
            nombre='Admin Sistema',
            email='admin@escuela.com',
            password_hash=hash_password('Admin123'),
            rol='admin'
        )
        
        db.session.add_all([profesor1, profesor2, estudiante1, estudiante2, admin])
        db.session.commit()
        print("[v0] Usuarios creados")
        
        # Crear cursos
        curso1 = Curso(
            nombre='Emprendimiento Digital',
            descripcion='Aprende a crear un negocio digital',
            duracion=40,
            profesor_id=profesor1.id,
            estado='activo'
        )
        
        curso2 = Curso(
            nombre='Marketing Digital',
            descripcion='Estrategias de marketing en línea',
            duracion=30,
            profesor_id=profesor2.id,
            estado='activo'
        )
        
        curso3 = Curso(
            nombre='Finanzas para Emprendedores',
            descripcion='Gestión financiera de empresas',
            duracion=35,
            profesor_id=profesor1.id,
            estado='activo'
        )
        
        db.session.add_all([curso1, curso2, curso3])
        db.session.commit()
        print("[v0] Cursos creados")
        
        # Crear inscripciones
        inscripcion1 = Inscripcion(
            estudiante_id=estudiante1.id,
            curso_id=curso1.id,
            estado='activo'
        )
        
        inscripcion2 = Inscripcion(
            estudiante_id=estudiante1.id,
            curso_id=curso2.id,
            estado='activo'
        )
        
        inscripcion3 = Inscripcion(
            estudiante_id=estudiante2.id,
            curso_id=curso3.id,
            estado='activo'
        )
        
        db.session.add_all([inscripcion1, inscripcion2, inscripcion3])
        db.session.commit()
        print("[v0] Inscripciones creadas")
        
        # Crear propuestas
        propuesta1 = PropuestaCurso(
            profesor_id=profesor1.id,
            nombre='Curso de E-commerce',
            descripcion='Crea tu tienda online',
            duracion=25,
            requisitos='Conocimientos básicos de internet',
            estado='pendiente'
        )
        
        propuesta2 = PropuestaCurso(
            profesor_id=profesor2.id,
            nombre='Redes Sociales para Negocios',
            descripcion='Gestiona redes sociales profesionales',
            duracion=20,
            requisitos='Ninguno',
            estado='aprobado'
        )
        
        db.session.add_all([propuesta1, propuesta2])
        db.session.commit()
        print("[v0] Propuestas creadas")
        
        print("\n✅ Base de datos poblada exitosamente!")
        print("\nCredenciales de prueba:")
        print("👨‍💼 Admin: admin@escuela.com / Admin123")
        print("👨‍🏫 Profesor: profesor1@escuela.com / Password123")
        print("👨‍🎓 Estudiante: estudiante1@escuela.com / Password123")

if __name__ == '__main__':
    seed()
