from app import create_app
from models import db, Usuario, Curso, Inscripcion, PropuestaCurso
from datetime import datetime

def seed_database():
    """Rellena la base de datos con datos de prueba"""
    app = create_app('development')
    
    with app.app_context():
        # Limpiar datos existentes
        print("Limpiando datos existentes...")
        Inscripcion.query.delete()
        PropuestaCurso.query.delete()
        Curso.query.delete()
        Usuario.query.delete()
        
        # Crear usuarios de prueba
        print("Creando usuarios...")
        
        # Admin/Professor
        profesor1 = Usuario(
            email='profesor1@escuela.com',
            nombre='Juan',
            apellido='Pérez',
            rol='teacher',
            activo=True
        )
        profesor1.set_password('Password123')
        db.session.add(profesor1)
        
        profesor2 = Usuario(
            email='profesor2@escuela.com',
            nombre='María',
            apellido='García',
            rol='teacher',
            activo=True
        )
        profesor2.set_password('Password123')
        db.session.add(profesor2)
        
        # Estudiantes
        estudiante1 = Usuario(
            email='estudiante1@escuela.com',
            nombre='Carlos',
            apellido='López',
            rol='student',
            activo=True
        )
        estudiante1.set_password('Password123')
        db.session.add(estudiante1)
        
        estudiante2 = Usuario(
            email='estudiante2@escuela.com',
            nombre='Ana',
            apellido='Rodríguez',
            rol='student',
            activo=True
        )
        estudiante2.set_password('Password123')
        db.session.add(estudiante2)
        
        estudiante3 = Usuario(
            email='estudiante3@escuela.com',
            nombre='Luis',
            apellido='Martínez',
            rol='student',
            activo=True
        )
        estudiante3.set_password('Password123')
        db.session.add(estudiante3)
        
        db.session.commit()
        print(f"✓ Usuarios creados: 2 profesores, 3 estudiantes")
        
        # Crear cursos
        print("Creando cursos...")
        
        cursos_data = [
            {
                'nombre': 'Fundamentos de Emprendimiento',
                'descripcion': 'Aprende los conceptos básicos para iniciar tu propio negocio',
                'duracion_horas': 20,
                'nivel': 'Básico',
                'categoria': 'Emprendimiento',
                'requisitos': 'Ninguno',
                'capacidad_maxima': 30
            },
            {
                'nombre': 'Marketing Digital para Startups',
                'descripcion': 'Estrategias de marketing digital para pequeñas empresas',
                'duracion_horas': 30,
                'nivel': 'Intermedio',
                'categoria': 'Marketing',
                'requisitos': 'Conocimientos básicos de internet',
                'capacidad_maxima': 25
            },
            {
                'nombre': 'Finanzas para Emprendedores',
                'descripcion': 'Gestión financiera y contabilidad para negocios nuevos',
                'duracion_horas': 25,
                'nivel': 'Intermedio',
                'categoria': 'Finanzas',
                'requisitos': 'Ninguno',
                'capacidad_maxima': 20
            },
            {
                'nombre': 'Pitch y Presentación de Negocios',
                'descripcion': 'Aprende a presentar tu idea de negocio efectivamente',
                'duracion_horas': 15,
                'nivel': 'Intermedio',
                'categoria': 'Habilidades Blandas',
                'requisitos': 'Tener una idea de negocio',
                'capacidad_maxima': 35
            },
            {
                'nombre': 'Tecnología e Innovación',
                'descripcion': 'Tecnologías emergentes para potenciar tu negocio',
                'duracion_horas': 40,
                'nivel': 'Avanzado',
                'categoria': 'Tecnología',
                'requisitos': 'Conocimientos básicos de computación',
                'capacidad_maxima': 15
            }
        ]
        
        cursos = []
        for data in cursos_data:
            curso = Curso(**data, estado='activo')
            db.session.add(curso)
            cursos.append(curso)
        
        db.session.commit()
        print(f"✓ {len(cursos)} cursos creados")
        
        # Crear inscripciones
        print("Creando inscripciones...")
        
        inscripciones = [
            Inscripcion(estudiante_id=estudiante1.id, curso_id=cursos[0].id, estado='activo'),
            Inscripcion(estudiante_id=estudiante1.id, curso_id=cursos[1].id, estado='activo'),
            Inscripcion(estudiante_id=estudiante2.id, curso_id=cursos[0].id, estado='activo'),
            Inscripcion(estudiante_id=estudiante2.id, curso_id=cursos[2].id, estado='completado', calificacion=8.5),
            Inscripcion(estudiante_id=estudiante3.id, curso_id=cursos[1].id, estado='activo'),
            Inscripcion(estudiante_id=estudiante3.id, curso_id=cursos[3].id, estado='cancelado'),
        ]
        
        for insc in inscripciones:
            db.session.add(insc)
        
        db.session.commit()
        print(f"✓ {len(inscripciones)} inscripciones creadas")
        
        # Crear propuestas de cursos
        print("Creando propuestas de cursos...")
        
        propuestas_data = [
            {
                'profesor_id': profesor1.id,
                'nombre': 'Blockchain y Criptomonedas',
                'descripcion': 'Introdución a la tecnología blockchain',
                'duracion_horas': 35,
                'nivel': 'Avanzado',
                'categoria': 'Tecnología',
                'requisitos': 'Conocimientos de programación',
                'objetivos': 'Entender blockchain y sus aplicaciones',
                'metodologia': 'Clases teóricas y prácticas',
                'estado': 'pendiente'
            },
            {
                'profesor_id': profesor1.id,
                'nombre': 'Liderazgo Empresarial',
                'descripcion': 'Desarrollo de habilidades de liderazgo',
                'duracion_horas': 20,
                'nivel': 'Intermedio',
                'categoria': 'Habilidades Blandas',
                'requisitos': 'Ninguno',
                'objetivos': 'Mejorar habilidades de liderazgo',
                'metodologia': 'Talleres interactivos',
                'estado': 'aprobado'
            },
            {
                'profesor_id': profesor2.id,
                'nombre': 'Community Management',
                'descripcion': 'Gestión de comunidades en redes sociales',
                'duracion_horas': 18,
                'nivel': 'Básico',
                'categoria': 'Marketing',
                'requisitos': 'Conocimientos básicos de redes sociales',
                'objetivos': 'Saber gestionar comunidades digitales',
                'metodologia': 'Estudios de caso y prácticas',
                'estado': 'en_revision'
            },
        ]
        
        propuestas = []
        for data in propuestas_data:
            propuesta = PropuestaCurso(**data)
            db.session.add(propuesta)
            propuestas.append(propuesta)
        
        db.session.commit()
        print(f"✓ {len(propuestas)} propuestas de cursos creadas")
        
        print("\n✅ Base de datos sembrada exitosamente!")
        print("\n📌 Credenciales de prueba:")
        print("Profesor: profesor1@escuela.com / Password123")
        print("Profesor: profesor2@escuela.com / Password123")
        print("Estudiante: estudiante1@escuela.com / Password123")
        print("Estudiante: estudiante2@escuela.com / Password123")
        print("Estudiante: estudiante3@escuela.com / Password123")

if __name__ == '__main__':
    seed_database()
