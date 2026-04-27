"""Migración: agrega columna convenio_id a curso_propuesto si no existe."""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import app, db
from sqlalchemy import text

with app.app_context():
    # Crear todas las tablas nuevas (CursoPropuesto, Voto si no existen)
    db.create_all()

    # Verificar y agregar columna convenio_id
    cols = [row[1] for row in db.session.execute(text("PRAGMA table_info(curso_propuesto)")).fetchall()]
    if 'convenio_id' not in cols:
        db.session.execute(text("ALTER TABLE curso_propuesto ADD COLUMN convenio_id INTEGER REFERENCES usuario(id)"))
        db.session.commit()
        print("OK: Columna convenio_id agregada exitosamente.")
    else:
        print("INFO: Columna convenio_id ya existe.")

    # Verificar y agregar columna tipo a voto
    cols_voto = [row[1] for row in db.session.execute(text("PRAGMA table_info(voto)")).fetchall()]
    if 'tipo' not in cols_voto:
        db.session.execute(text("ALTER TABLE voto ADD COLUMN tipo VARCHAR(20) DEFAULT 'interesado'"))
        db.session.commit()
        print("OK: Columna tipo agregada a la tabla voto.")
    else:
        print("INFO: Columna tipo ya existe en la tabla voto.")
    # Verificar y agregar columna cedula a usuario
    cols_usuario = [row[1] for row in db.session.execute(text("PRAGMA table_info(usuario)")).fetchall()]
    if 'cedula' not in cols_usuario:
        db.session.execute(text("ALTER TABLE usuario ADD COLUMN cedula VARCHAR(20)"))
        db.session.execute(text("CREATE UNIQUE INDEX IF NOT EXISTS ix_usuario_cedula ON usuario (cedula)"))
        db.session.commit()
        print("OK: Columna cedula agregada a la tabla usuario.")
    else:
        print("INFO: Columna cedula ya existe en la tabla usuario.")

    if 'creado_por_id' not in cols_usuario:
        db.session.execute(text("ALTER TABLE usuario ADD COLUMN creado_por_id INTEGER REFERENCES usuario(id)"))
        db.session.commit()
        print("OK: Columna creado_por_id agregada a la tabla usuario.")
    else:
        print("INFO: Columna creado_por_id ya existe en la tabla usuario.")

    print("OK: Migracion completa.")
