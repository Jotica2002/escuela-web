#!/usr/bin/env python
"""
Script simple para iniciar el backend sin complicaciones
Ejecutar: python run_simple.py
"""
import sys
import os

# Agregar el directorio actual al path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

print("[v0] Iniciando Escuela de Emprendimiento Backend...")
print("[v0] Python version:", sys.version)
print("[v0] Working directory:", os.getcwd())

try:
    print("\n[v0] Importando Flask...")
    from flask import Flask
    print("[v0] ✓ Flask importado correctamente")
    
    print("[v0] Importando configuración...")
    from config import config
    print("[v0] ✓ Configuración cargada")
    
    print("[v0] Importando modelos...")
    from models import db
    print("[v0] ✓ Modelos importados")
    
    print("[v0] Importando rutas...")
    from routes.auth import auth_bp
    from routes.cursos import cursos_bp
    from routes.estudiante import estudiante_bp
    from routes.profesor import profesor_bp
    from routes.estadisticas import estadisticas_bp
    print("[v0] ✓ Rutas importadas")
    
    print("\n[v0] Creando aplicación Flask...")
    app = Flask(__name__)
    
    print("[v0] Aplicando configuración...")
    app.config.from_object(config['development'])
    
    print("[v0] Inicializando extensiones...")
    db.init_app(app)
    
    from flask_jwt_extended import JWTManager
    JWTManager(app)
    
    from flask_cors import CORS
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:3000"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    print("[v0] Registrando blueprints...")
    app.register_blueprint(auth_bp)
    app.register_blueprint(cursos_bp)
    app.register_blueprint(estudiante_bp)
    app.register_blueprint(profesor_bp)
    app.register_blueprint(estadisticas_bp)
    
    print("[v0] Configurando rutas...")
    @app.route('/', methods=['GET'])
    def root():
        return {'message': 'Escuela de Emprendimiento API v1.0'}, 200
    
    @app.route('/api/health', methods=['GET'])
    def health():
        return {'status': 'ok', 'message': 'Backend is running'}, 200
    
    @app.errorhandler(404)
    def not_found(error):
        return {'error': 'Recurso no encontrado'}, 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return {'error': 'Error interno del servidor'}, 500
    
    print("[v0] Inicializando base de datos...")
    with app.app_context():
        db.create_all()
        print("[v0] ✓ Base de datos inicializada")
    
    print("\n" + "="*60)
    print("✓ SERVIDOR LISTO!")
    print("="*60)
    print("URL: http://localhost:5000")
    print("API: http://localhost:5000/api")
    print("Health: http://localhost:5000/api/health")
    print("\nCredenciales de prueba:")
    print("  Profesor: profesor1@escuela.com / Password123")
    print("  Estudiante: estudiante1@escuela.com / Password123")
    print("="*60 + "\n")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
    
except Exception as e:
    print(f"\n[v0] ✗ ERROR: {str(e)}")
    import traceback
    print("\nDetalles del error:")
    traceback.print_exc()
    sys.exit(1)
