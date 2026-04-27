# ✅ Checklist - Deployment a Producción

## Pre-Deployment

### Backend
- [ ] Cambiar `FLASK_ENV` a `production`
- [ ] Actualizar `SECRET_KEY` con valor seguro
- [ ] Actualizar `JWT_SECRET_KEY` con valor seguro
- [ ] Configurar `DATABASE_URL` a PostgreSQL
- [ ] Configurar email (Gmail, SendGrid, etc.)
- [ ] Configurar `CORS_ORIGINS` con dominio producción
- [ ] Configurar `FRONTEND_URL` con dominio producción
- [ ] Testear todos los endpoints con `test_api.py`
- [ ] Revisar logs para errores
- [ ] Crear backup de base de datos

### Frontend
- [ ] Cambiar `NEXT_PUBLIC_API_BASE_URL` a dominio backend producción
- [ ] Cambiar `NEXT_PUBLIC_FRONTEND_URL` a dominio frontend producción
- [ ] Ejecutar `npm run build` sin errores
- [ ] Revisar performance con `npm run build`
- [ ] Testear todos los flows en producción local

### Base de Datos
- [ ] Migrar a PostgreSQL (o servicio cloud)
- [ ] Crear backups automáticos
- [ ] Configurar punto de recuperación
- [ ] Revisar índices en tablas grandes
- [ ] Configurar logs de base de datos

## Seguridad

### Backend
- [ ] Validar todas las entradas (input validation)
- [ ] Sanitizar outputs
- [ ] Implementar rate limiting
- [ ] Configurar HTTPS/SSL
- [ ] Revisar CORS (solo dominios permitidos)
- [ ] Implementar CSRF protection
- [ ] Configurar headers de seguridad
- [ ] Auditar dependencias (`pip check`)
- [ ] Actualizar todas las dependencias
- [ ] Implementar logging seguro (sin passwords)

### Frontend
- [ ] Remover console.logs de debug
- [ ] Implementar CSP (Content Security Policy)
- [ ] Validar que no haya secrets en código
- [ ] Auditar dependencias npm (`npm audit`)
- [ ] Actualizar todas las dependencias
- [ ] Implementar error boundary

### General
- [ ] SSL Certificate configurado
- [ ] Firewall configurado
- [ ] DDoS protection habilitado
- [ ] Backups automáticos configurados
- [ ] Monitoring y alertas configurados

## Performance

### Backend
- [ ] Optimizar queries de base de datos
- [ ] Agregar índices a queries frecuentes
- [ ] Implementar caching (Redis)
- [ ] Implementar paginación
- [ ] Comprimir responses (gzip)
- [ ] Configurar connection pooling
- [ ] Revisar tiempos de respuesta

### Frontend
- [ ] Optimizar imágenes
- [ ] Implementar lazy loading
- [ ] Minificar CSS/JS
- [ ] Implementar code splitting
- [ ] Usar CDN para estáticos
- [ ] Verificar Core Web Vitals
- [ ] Configurar caching de assets

## Testing

- [ ] Ejecutar suite de tests
- [ ] Pruebas de carga (load testing)
- [ ] Pruebas de seguridad (security testing)
- [ ] Pruebas de integración
- [ ] Verificar todos los endpoints
- [ ] Verificar flujos de usuario
- [ ] Probar en diferentes navegadores
- [ ] Probar en móvil

## Deployment - Backend

### Opción 1: Heroku
- [ ] Instalar Heroku CLI
- [ ] Crear app: `heroku create escuela-emprendimiento-api`
- [ ] Configurar variables: `heroku config:set`
- [ ] Crear Procfile: `web: gunicorn app:create_app()`
- [ ] Crear runtime.txt: `python-3.11.0`
- [ ] Hacer push: `git push heroku main`
- [ ] Verificar logs: `heroku logs --tail`

### Opción 2: Railway
- [ ] Conectar GitHub repo
- [ ] Crear proyecto
- [ ] Agregar PostgreSQL plugin
- [ ] Configurar env variables
- [ ] Deploy automático

### Opción 3: AWS
- [ ] Crear EC2 instance
- [ ] Instalar dependencias
- [ ] Crear Gunicorn service
- [ ] Configurar Nginx reverse proxy
- [ ] Configurar SSL con Let's Encrypt
- [ ] Configurar RDS para base de datos

### Opción 4: DigitalOcean
- [ ] Crear Droplet
- [ ] SSH conectarse
- [ ] Instalar Python, Postgres
- [ ] Clone repo
- [ ] Crear virtual environment
- [ ] Instalar dependencias
- [ ] Usar systemd para servicio
- [ ] Configurar Nginx

## Deployment - Frontend

### Opción 1: Vercel (Recomendado)
- [ ] Conectar GitHub repo
- [ ] Configurar env variables
- [ ] Build settings:
  - Build command: `npm run build`
  - Output directory: `.next`
  - Node version: 18.x
- [ ] Deploy
- [ ] Configurar custom domain

### Opción 2: Netlify
- [ ] Conectar GitHub repo
- [ ] Configurar build:
  - Command: `npm run build`
  - Publish directory: `.next`
- [ ] Configurar env variables
- [ ] Deploy
- [ ] Configurar custom domain

### Opción 3: AWS S3 + CloudFront
- [ ] Crear S3 bucket
- [ ] Crear CloudFront distribution
- [ ] Configurar DNS (Route 53)
- [ ] Configurar SSL

### Opción 4: Docker + Cualquier Servidor
- [ ] Crear Dockerfile para frontend (con Node builder)
- [ ] Crear docker-compose
- [ ] Build image: `docker build -t escuela-frontend .`
- [ ] Push a registry (Docker Hub, ECR)
- [ ] Deploy en servidor

## Deployment - Base de Datos

### PostgreSQL en la Nube
- [ ] Crear instancia PostgreSQL (Neon, Render, AWS RDS)
- [ ] Configurar backups automáticos
- [ ] Configurar acceso (whitelist IPs)
- [ ] Obtener connection string
- [ ] Actualizar `DATABASE_URL`
- [ ] Ejecutar migraciones en prod

### Migración desde SQLite
```bash
# Exportar datos
sqlite3 escuela.db .dump > dump.sql

# Importar a PostgreSQL
psql -U user -d escuela_db -f dump.sql
```

## Monitoreo y Logging

### Logging
- [ ] Configurar logs centralizados (DataDog, Sentry, etc.)
- [ ] Configurar alertas para errores
- [ ] Configurar alertas para performance
- [ ] Configurar rotación de logs

### Monitoring
- [ ] Configurar uptime monitoring (UptimeRobot, StatusPage)
- [ ] Configurar performance monitoring (New Relic, DataDog)
- [ ] Configurar health checks
- [ ] Configurar alertas de CPU/memoria
- [ ] Configurar alertas de base de datos

### Analytics
- [ ] Configurar Google Analytics
- [ ] Configurar eventos personalizados
- [ ] Configurar error tracking (Sentry)
- [ ] Revisar métricas regularmente

## Configuración Post-Deploy

### Email
- [ ] Verificar que emails se envían correctamente
- [ ] Configurar templates profesionales
- [ ] Configurar sender verificado

### DNS
- [ ] Configurar registro A (frontend)
- [ ] Configurar registro CNAME (backend)
- [ ] Configurar MX records (si es necesario)
- [ ] Verificar propagación DNS

### SSL/TLS
- [ ] Generar certificados (Let's Encrypt)
- [ ] Configurar auto-renewal
- [ ] Verificar certificado válido
- [ ] Configurar HSTS header

### Backups
- [ ] Configurar backups diarios
- [ ] Verificar integridad de backups
- [ ] Documentar procedimiento de restore
- [ ] Testear restore en staging

## Documentación

- [ ] Actualizar README con URLs de producción
- [ ] Documentar processo de deployment
- [ ] Documentar processo de rollback
- [ ] Documentar passwords y secrets (en lugar seguro)
- [ ] Crear runbook para incident response

## Go-Live

### 24 Horas Antes
- [ ] Notificar a usuarios (si aplica)
- [ ] Preparar rollback plan
- [ ] Revisar monitoring setup
- [ ] Asegurar que el equipo esté disponible

### Día del Deploy
- [ ] Hacer backup de producción actual
- [ ] Ejecutar deployment
- [ ] Verificar todos los endpoints
- [ ] Verificar flujos de usuario críticos
- [ ] Monitorear logs activamente
- [ ] Recolectar feedback

### Post-Deploy
- [ ] Verificar que todo funciona
- [ ] Revisar métricas
- [ ] Revisar logs de error
- [ ] Comunicar status a usuarios
- [ ] Documentar cualquier issue
- [ ] Planificar follow-up

## Rollback Plan

Si algo falla:

```bash
# Backend
git revert HEAD
git push origin main
heroku deploy:rollback  # Si es Heroku

# Frontend  
vercel rollback  # Si es Vercel

# Base de Datos
# Restaurar backup más reciente
```

## Checklist Final

- [ ] ✅ Backend en producción
- [ ] ✅ Frontend en producción
- [ ] ✅ Base de datos migrada
- [ ] ✅ Emails funcionando
- [ ] ✅ Monitoreo activo
- [ ] ✅ Backups configurados
- [ ] ✅ SSL/TLS funcionando
- [ ] ✅ Todo los tests pasando
- [ ] ✅ Documentación actualizada
- [ ] ✅ Equipo capacitado
- [ ] ✅ Usuarios notificados

## 🎉 ¡Listo para Producción!

Si todos los items están checked, tu aplicación está lista para usuarios reales.

---

## Variables de Entorno de Producción

### Backend (.env)
```env
FLASK_ENV=production
SECRET_KEY=<valor-seguro-largo>
JWT_SECRET_KEY=<otro-valor-seguro>
DATABASE_URL=postgresql://user:pass@host:5432/escuela_db
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=<tu-email>
MAIL_PASSWORD=<contraseña-app>
CORS_ORIGINS=https://tudominio.com
FRONTEND_URL=https://tudominio.com
```

### Frontend (.env.production)
```env
NEXT_PUBLIC_API_BASE_URL=https://api.tudominio.com
NEXT_PUBLIC_FRONTEND_URL=https://tudominio.com
```

---

**Última actualización**: 30 de Enero de 2026
**Versión**: 1.0.0
