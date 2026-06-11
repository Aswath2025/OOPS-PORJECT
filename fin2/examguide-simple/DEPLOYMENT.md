# ExamGuide Platform - Deployment Guide

This guide provides comprehensive instructions for deploying the ExamGuide Platform to production environments.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Docker Deployment](#docker-deployment)
3. [Kubernetes Deployment](#kubernetes-deployment)
4. [AWS Deployment](#aws-deployment)
5. [Environment Configuration](#environment-configuration)
6. [Database Management](#database-management)
7. [Monitoring & Logging](#monitoring--logging)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Tools

- Docker & Docker Compose (v3.9+)
- kubectl (for Kubernetes deployments)
- AWS CLI (for AWS deployments)
- Git
- PostgreSQL client tools (optional, for direct database management)

### System Requirements

- **RAM**: Minimum 4GB, Recommended 8GB+
- **Disk Space**: Minimum 10GB
- **CPU**: 2+ cores recommended
- **OS**: Linux (production recommended), macOS, or Windows with WSL2

## Docker Deployment

### Development Environment

```bash
# Clone the repository
git clone https://github.com/yourusername/examguide.git
cd examguide

# Create development environment file
cp .env.development .env

# Build and start services
docker-compose up -d

# Verify services are running
docker-compose ps

# Check application logs
docker-compose logs -f backend
```

### Staging Environment

```bash
# Create staging environment file
cp .env.staging .env

# Build and start with staging configuration
docker-compose up -d

# Verify health checks
docker-compose logs backend | grep "health"
```

### Production Deployment

```bash
# Create production environment file
cp .env.production .env

# Update sensitive configuration
nano .env  # Edit JWT_SECRET, DB_PASSWORD, etc.

# Build images (or use pre-built images from registry)
docker-compose build --no-cache

# Start services in production mode
docker-compose -f docker-compose.yml up -d

# Verify all services are healthy
docker-compose logs --tail=50 backend
docker-compose logs --tail=50 frontend
```

### Stopping Services

```bash
# Stop all services gracefully
docker-compose down

# Stop and remove volumes (use caution!)
docker-compose down -v
```

## Kubernetes Deployment

### Prerequisites

- Kubernetes cluster (1.24+)
- kubectl configured
- Persistent storage provisioner

### Deployment Steps

1. **Build Docker Images**

```bash
docker build -t examguide/backend:latest ./backend
docker build -t examguide/frontend:latest ./frontend

# Push to registry
docker push examguide/backend:latest
docker push examguide/frontend:latest
```

2. **Create Namespace**

```bash
kubectl create namespace examguide
```

3. **Create ConfigMaps and Secrets**

```bash
# Create ConfigMap for non-sensitive configuration
kubectl create configmap examguide-config \
  --from-literal=SPRING_CACHE_TYPE=redis \
  --from-literal=LOG_LEVEL=INFO \
  -n examguide

# Create Secret for sensitive data
kubectl create secret generic examguide-secrets \
  --from-literal=DB_PASSWORD=your_secure_password \
  --from-literal=JWT_SECRET=your_jwt_secret \
  -n examguide
```

4. **Deploy PostgreSQL (if using in-cluster)**

```yaml
# kubernetes/postgres-deployment.yml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
  namespace: examguide
spec:
  serviceName: postgres
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:15-alpine
        ports:
        - containerPort: 5432
        env:
        - name: POSTGRES_DB
          value: examguide_db
        - name: POSTGRES_USER
          value: postgres
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: examguide-secrets
              key: DB_PASSWORD
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
  volumeClaimTemplates:
  - metadata:
      name: postgres-storage
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 5Gi
```

5. **Deploy Backend Service**

```yaml
# kubernetes/backend-deployment.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: examguide-backend
  namespace: examguide
spec:
  replicas: 3
  selector:
    matchLabels:
      app: examguide-backend
  template:
    metadata:
      labels:
        app: examguide-backend
    spec:
      containers:
      - name: backend
        image: examguide/backend:latest
        ports:
        - containerPort: 8080
        env:
        - name: SPRING_DATASOURCE_URL
          value: jdbc:postgresql://postgres:5432/examguide_db
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: examguide-secrets
              key: DB_PASSWORD
        envFrom:
        - configMapRef:
            name: examguide-config
        livenessProbe:
          httpGet:
            path: /api/health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/health
            port: 8080
          initialDelaySeconds: 10
          periodSeconds: 5
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1024Mi"
            cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: examguide-backend
  namespace: examguide
spec:
  type: ClusterIP
  ports:
  - port: 8080
    targetPort: 8080
  selector:
    app: examguide-backend
```

6. **Deploy Frontend Service**

```yaml
# kubernetes/frontend-deployment.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: examguide-frontend
  namespace: examguide
spec:
  replicas: 2
  selector:
    matchLabels:
      app: examguide-frontend
  template:
    metadata:
      labels:
        app: examguide-frontend
    spec:
      containers:
      - name: frontend
        image: examguide/frontend:latest
        ports:
        - containerPort: 3000
        env:
        - name: REACT_APP_API_BASE_URL
          value: https://api.examguide.com/api
        livenessProbe:
          httpGet:
            path: /
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 5
        resources:
          requests:
            memory: "256Mi"
            cpu: "100m"
          limits:
            memory: "512Mi"
            cpu: "200m"
---
apiVersion: v1
kind: Service
metadata:
  name: examguide-frontend
  namespace: examguide
spec:
  type: LoadBalancer
  ports:
  - port: 80
    targetPort: 3000
  selector:
    app: examguide-frontend
```

7. **Apply Kubernetes Manifests**

```bash
kubectl apply -f kubernetes/
kubectl get all -n examguide
```

## AWS Deployment

### Using AWS Elastic Container Service (ECS) with Fargate

1. **Create ECR Repositories**

```bash
aws ecr create-repository --repository-name examguide/backend --region us-east-1
aws ecr create-repository --repository-name examguide/frontend --region us-east-1
```

2. **Push Images to ECR**

```bash
docker tag examguide/backend:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/examguide/backend:latest
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/examguide/backend:latest

docker tag examguide/frontend:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/examguide/frontend:latest
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/examguide/frontend:latest
```

3. **Create RDS PostgreSQL Database**

```bash
aws rds create-db-instance \
  --db-instance-identifier examguide-postgres \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 15.3 \
  --master-username postgres \
  --master-user-password your_password \
  --allocated-storage 20 \
  --publicly-accessible false
```

4. **Create ECS Task Definition**

Edit task-definition.json and create:

```bash
aws ecs register-task-definition \
  --cli-input-json file://task-definition.json
```

5. **Create ECS Service**

```bash
aws ecs create-service \
  --cluster examguide-cluster \
  --service-name examguide-backend \
  --task-definition examguide-backend:1 \
  --desired-count 3 \
  --load-balancers targetGroupArn=arn:aws:elasticloadbalancing:...,containerName=backend,containerPort=8080 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx],securityGroups=[sg-xxx],assignPublicIp=DISABLED}"
```

## Environment Configuration

### Configuration File Structure

```
.env.{environment}
├── Database Configuration
│   ├── DB_HOST
│   ├── DB_PORT
│   ├── DB_NAME
│   ├── DB_USER
│   └── DB_PASSWORD
├── Application Configuration
│   ├── BACKEND_PORT
│   ├── FRONTEND_PORT
│   └── SERVER_SERVLET_CONTEXT_PATH
├── Security Configuration
│   ├── JWT_SECRET
│   └── JWT_EXPIRATION
└── Operational Configuration
    ├── LOG_LEVEL
    └── SPRING_CACHE_TYPE
```

### Sensitive Configuration Management

Never commit sensitive information to version control:

```bash
# Use .gitignore
echo ".env" >> .gitignore
echo ".env.*.local" >> .gitignore

# Use environment management tools
# - HashiCorp Vault
# - AWS Systems Manager Parameter Store
# - Kubernetes Secrets
# - GitHub Secrets (for CI/CD)
```

## Database Management

### Initial Setup

```sql
-- Create database
CREATE DATABASE examguide_db;

-- Create user with limited privileges
CREATE USER examguide_user WITH PASSWORD 'secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE examguide_db TO examguide_user;
GRANT CONNECT ON DATABASE examguide_db TO examguide_user;
GRANT USAGE ON SCHEMA public TO examguide_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO examguide_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO examguide_user;
```

### Backup and Recovery

```bash
# Backup database
pg_dump -U postgres -d examguide_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore database
psql -U postgres -d examguide_db < backup_20241501_120000.sql

# Backup with compression
pg_dump -U postgres -d examguide_db | gzip > backup.sql.gz

# Restore from compressed backup
gunzip < backup.sql.gz | psql -U postgres -d examguide_db
```

### Database Migrations

Flyway migrations are automatically executed on application startup:

```bash
# View migration status
SELECT * FROM flyway_schema_history;

# Manual migration execution (if needed)
mvn flyway:info
mvn flyway:migrate
```

## Monitoring & Logging

### Application Logs

```bash
# View real-time logs
docker-compose logs -f backend

# View logs with timestamps
docker-compose logs --timestamps backend

# View last 50 lines
docker-compose logs --tail=50 backend
```

### Health Checks

```bash
# Check application health
curl http://localhost:8080/api/health

# Check database connectivity
curl http://localhost:8080/api/health/db
```

### Metrics and Monitoring

Enable Micrometer/Actuator metrics:

```yaml
# application.properties
management.endpoints.web.exposure.include=health,metrics,prometheus
management.metrics.enable.jvm=true
management.metrics.enable.process=true
management.metrics.enable.system=true
```

### Log Aggregation

Integrate with ELK Stack, Splunk, or CloudWatch:

```yaml
logging:
  driver: "awslogs"
  options:
    awslogs-group: "/ecs/examguide"
    awslogs-region: "us-east-1"
    awslogs-stream-prefix: "ecs"
```

## Troubleshooting

### Common Issues and Solutions

#### Service Won't Start

```bash
# Check logs
docker-compose logs backend

# Verify environment variables
docker-compose config | grep -A 20 "backend:"

# Check port availability
lsof -i :8080  # macOS/Linux
netstat -ano | findstr :8080  # Windows
```

#### Database Connection Issues

```bash
# Verify database is running
docker-compose logs postgres

# Test connection
psql -h localhost -U postgres -d examguide_db

# Check networking
docker network inspect examguide-network
```

#### Performance Issues

```bash
# Check container resource usage
docker stats

# View slow queries in PostgreSQL logs
docker-compose logs postgres | grep "duration"

# Rebuild cache
curl -X POST http://localhost:8080/api/admin/cache/clear
```

#### SSL/TLS Certificate Issues

```bash
# For self-signed certificates in development
# Update frontend to accept self-signed certs

# For production, use Let's Encrypt
certbot certonly --standalone -d examguide.com
```

## Support & Escalation

For deployment issues or questions:

1. Check application logs
2. Review this deployment guide
3. Check GitHub Issues
4. Contact support team

---

**Last Updated**: 2024-03-02  
**Version**: 1.0.0
