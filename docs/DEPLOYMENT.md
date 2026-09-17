# Chaos Tracker - Deployment Guide

## Overview

This guide covers deploying the Chaos Tracker backend (Django REST API) to production environments.

## Prerequisites

- Python 3.11+
- PostgreSQL 15+ (recommended) or SQLite for development
- Redis 7+ (for caching and Celery)
- Nginx (reverse proxy)
- Docker (optional, for containerized deployment)

## Environment Variables

Create a `.env` file with the following variables:

```bash
# Django Core
DJANGO_SECRET_KEY=your-secret-key-here-min-50-chars
DJANGO_DEBUG=false
DJANGO_ALLOWED_HOSTS=api.yourdomain.com,www.yourdomain.com

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/chaos_tracker

# CORS
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
CSRF_TRUSTED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Security
CSRF_COOKIE_SECURE=true
SESSION_COOKIE_SECURE=true
SECURE_SSL_REDIRECT=true

# AI/LLM
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-2.5-flash

# AI Security
AI_MAX_CONTEXT_TOKENS=8000
AI_MAX_RESPONSE_TOKENS=2000
AI_TOOL_EXECUTION_TIMEOUT=30
AI_RATE_LIMIT_ENABLED=true

# Backup
BACKUP_DIR=/app/backups
BACKUP_RETENTION_DAYS=30

# Redis (for caching)
REDIS_URL=redis://localhost:6379/0

# Email (optional)
EMAIL_HOST=smtp.yourdomain.com
EMAIL_PORT=587
EMAIL_USE_TLS=true
EMAIL_HOST_USER=noreply@yourdomain.com
EMAIL_HOST_PASSWORD=your-email-password
```

## Database Setup

### PostgreSQL (Production)

```bash
# Create database and user
sudo -u postgres psql -c "CREATE DATABASE chaos_tracker;"
sudo -u postgres psql -c "CREATE USER tracker_user WITH PASSWORD 'secure_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE chaos_tracker TO tracker_user;"
```

Run migrations:
```bash
python manage.py migrate
```

### SQLite (Development Only)

Default configuration uses SQLite. No additional setup required.

## Static Files

```bash
# Collect static files
python manage.py collectstatic --noinput
```

Configure Nginx to serve static files:
```nginx
location /static/ {
    alias /app/staticfiles/;
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## Running with Gunicorn

```bash
# Install gunicorn
pip install gunicorn

# Run with 4 workers
gunicorn tracker_backend.wsgi:application \
    --bind 0.0.0.0:8000 \
    --workers 4 \
    --worker-class gevent \
    --worker-connections 1000 \
    --timeout 30 \
    --keep-alive 5 \
    --max-requests 1000 \
    --max-requests-jitter 100 \
    --access-logfile - \
    --error-logfile -
```

## Running with Docker

### Dockerfile

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Collect static files
RUN python manage.py collectstatic --noinput

# Create non-root user
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

EXPOSE 8000

CMD ["gunicorn", "tracker_backend.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "4"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: chaos_tracker
      POSTGRES_USER: tracker_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U tracker_user -d chaos_tracker"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  web:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://tracker_user:${DB_PASSWORD}@db:5432/chaos_tracker
      - REDIS_URL=redis://redis:6379/0
      - DJANGO_SECRET_KEY=${DJANGO_SECRET_KEY}
      - DJANGO_DEBUG=false
      - DJANGO_ALLOWED_HOSTS=${ALLOWED_HOSTS}
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    volumes:
      - ./backups:/app/backups
      - ./logs:/app/logs

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./staticfiles:/app/staticfiles:ro
    depends_on:
      - web

volumes:
  postgres_data:
  redis_data:
```

## Nginx Configuration

```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    upstream backend {
        server web:8000;
    }

    server {
        listen 80;
        server_name api.yourdomain.com;

        # Redirect HTTP to HTTPS
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name api.yourdomain.com;

        ssl_certificate /etc/ssl/certs/yourdomain.com.crt;
        ssl_certificate_key /etc/ssl/private/yourdomain.com.key;

        # Security headers
        add_header X-Frame-Options "DENY";
        add_header X-Content-Type-Options "nosniff";
        add_header X-XSS-Protection "1; mode=block";
        add_header Referrer-Policy "strict-origin-when-cross-origin";
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

        # Static files
        location /static/ {
            alias /app/staticfiles/;
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Media files
        location /media/ {
            alias /app/media/;
            expires 1y;
            add_header Cache-Control "public";
        }

        # API
        location /api/ {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_read_timeout 60s;
            proxy_send_timeout 60s;
        }

        # Health check
        location /health/ {
            proxy_pass http://backend;
            access_log off;
        }
    }
}
```

## Celery (Background Tasks)

```bash
# Start Celery worker
celery -A tracker_backend worker -l info -Q default,scheduled_jobs,ai_tools

# Start Celery beat (scheduler)
celery -A tracker_backend beat -l info
```

### Celery Configuration (settings.py)

```python
# Celery
CELERY_BROKER_URL = os.environ.get('REDIS_URL', 'redis://localhost:6379/0')
CELERY_RESULT_BACKEND = os.environ.get('REDIS_URL', 'redis://localhost:6379/0')
CELERY_TASK_TRACK_STARTED = True
CELERY_TASK_TIME_LIMIT = 30 * 60
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TIMEZONE = 'UTC'

CELERY_BEAT_SCHEDULE = {
    'run-scheduled-jobs-every-minute': {
        'task': 'tracker.tasks.run_scheduled_jobs',
        'schedule': 60.0,
    },
    'compact-history-daily': {
        'task': 'tracker.tasks.compact_history',
        'schedule': 86400.0,  # 24 hours
    },
}
```

## Backup & Disaster Recovery

### Automated Backups

```bash
# Create backup
python manage.py backup_db --compress --verify

# Restore from backup
python manage.py restore_db /app/backups/backup_chaos_tracker_20240115_120000.sql.gz --force
```

### Cron Job for Daily Backups

```bash
# Add to crontab
0 2 * * * /app/venv/bin/python /app/manage.py backup_db --compress --verify >> /app/logs/backup.log 2>&1
```

## Monitoring & Logging

### Log Rotation

```bash
# /etc/logrotate.d/chaos-tracker
/app/logs/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 644 appuser appuser
}
```

### Health Check Endpoint

Add to `urls.py`:
```python
from django.http import JsonResponse

def health_check(request):
    from tracker.domain.error_monitoring import HealthCheck
    return JsonResponse(HealthCheck.run_all())
```

### Prometheus Metrics (Optional)

```bash
pip install django-prometheus
```

Add to `settings.py`:
```python
INSTALLED_APPS = [
    ...
    'django_prometheus',
]

MIDDLEWARE = [
    'django_prometheus.middleware.PrometheusBeforeMiddleware',
    ...
    'django_prometheus.middleware.PrometheusAfterMiddleware',
]
```

## Security Checklist

- [ ] `DEBUG = False`
- [ ] `SECRET_KEY` from environment
- [ ] `ALLOWED_HOSTS` configured
- [ ] `SECURE_SSL_REDIRECT = True`
- [ ] `CSRF_COOKIE_SECURE = True`
- [ ] `SESSION_COOKIE_SECURE = True`
- [ ] `SECURE_HSTS_SECONDS = 31536000`
- [ ] Database credentials from environment
- [ ] API keys from environment
- [ ] CORS origins restricted
- [ ] Rate limiting enabled
- [ ] Backup encryption (if sensitive data)
- [ ] Regular security updates

## Scaling Considerations

### Horizontal Scaling
- Run multiple Gunicorn workers behind Nginx
- Use Redis for session storage (configure `SESSION_ENGINE`)
- Use Celery for background tasks
- Database connection pooling via `CONN_MAX_AGE`

### Database Optimization
- Add indexes for common query patterns (see `query_optimization.py`)
- Use `select_related`/`prefetch_related` in views
- Consider read replicas for analytics queries

### Caching
```python
# settings.py
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': os.environ.get('REDIS_URL', 'redis://localhost:6379/1'),
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
        }
    }
}
```

## Rollback Procedure

1. Stop new deployments
2. Restore database from latest backup:
   ```bash
   python manage.py restore_db /app/backups/latest_backup.sql.gz --force
   ```
3. Deploy previous version
4. Run migrations if needed
5. Verify health checks pass

## Troubleshooting

### Common Issues

**Database connection failed:**
- Check `DATABASE_URL` format
- Verify PostgreSQL is running
- Check firewall/security groups

**Static files not loading:**
- Run `collectstatic`
- Check Nginx `alias` path
- Verify permissions

**CORS errors:**
- Verify `CORS_ALLOWED_ORIGINS` includes frontend domain
- Check `CSRF_TRUSTED_ORIGINS` matches

**AI features not working:**
- Verify `GEMINI_API_KEY` is set
- Check API quota limits
- Review AI rate limits in settings

## Support

For issues, check:
1. Application logs: `/app/logs/app.log`
2. Error logs: `/app/logs/error.log`
3. Security logs: `/app/logs/security.log`
4. Nginx logs: `/var/log/nginx/`
5. Database logs: PostgreSQL logs