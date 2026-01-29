# Docker Setup Guide

This project uses Docker Compose to orchestrate all services (frontend, backend, PostgreSQL, and MongoDB).

## Prerequisites

- Docker Desktop installed and running
- Docker Compose (comes with Docker Desktop)

## Quick Start

### 1. Setup Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` to customize your settings (optional - defaults are provided):

```env
# PostgreSQL Database
POSTGRES_DB=books_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres_password

# MongoDB Database
MONGO_INITDB_ROOT_USERNAME=mongoadmin
MONGO_INITDB_ROOT_PASSWORD=mongodb_password

# Backend
BACKEND_PORT=4000
DB_HOST=postgres
DB_PORT=5432
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
NODE_ENV=production

# Frontend
FRONTEND_PORT=3000
NEXT_PUBLIC_GRAPHQL_URL=http://backend:4000/graphql
```

### 2. Start All Services

```bash
docker-compose up -d
```

This will:
- Build and start the frontend (Next.js)
- Build and start the backend (Express + Apollo Server)
- Start PostgreSQL database
- Start MongoDB database

### 3. Verify Services are Running

```bash
docker-compose ps
```

All containers should show status as `Up` or `Healthy`.

### 4. Access the Services

- **Frontend**: http://localhost:3000
- **Backend GraphQL**: http://localhost:4000/graphql
- **Backend Health Check**: http://localhost:4000/health
- **PostgreSQL**: localhost:5432
- **MongoDB**: localhost:27017

## Common Commands

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
docker-compose logs -f mongodb
```

### Stop Services

```bash
docker-compose down
```

### Restart Services

```bash
docker-compose restart
```

### Remove All Data (including volumes)

```bash
docker-compose down -v
```

## Environment Variables

All sensitive values are managed through the `.env` file:

- **POSTGRES_PASSWORD**: PostgreSQL password
- **MONGO_INITDB_ROOT_PASSWORD**: MongoDB root password
- **JWT_SECRET**: JWT signing key for authentication
- **REFRESH_SECRET**: Refresh token signing key

### Production Deployment

For production:

1. Update `.env` with strong, randomly generated secrets
2. Set `NODE_ENV=production`
3. Use a secret management service (AWS Secrets Manager, HashiCorp Vault, etc.)
4. Never commit `.env` to version control

## Database Access

### PostgreSQL

```bash
docker exec -it postgres_db psql -U postgres -d books_db
```

### MongoDB

```bash
docker exec -it mongodb mongosh -u mongoadmin -p mongodb_password
```

## Troubleshooting

### Services not connecting

Ensure all containers are healthy:
```bash
docker-compose ps
```

Check logs:
```bash
docker-compose logs backend
```

### Port Already in Use

If ports are already in use, modify `.env`:
```env
BACKEND_PORT=4001
FRONTEND_PORT=3001
```

### Rebuild Images

```bash
docker-compose build --no-cache
docker-compose up -d
```

## Architecture

```
┌─────────────────────────────────────┐
│         Docker Compose Network      │
├─────────────────────────────────────┤
│                                     │
│  Frontend (Next.js)                 │
│  :3000 ──┐                          │
│          │                          │
│          └──→ Backend (Express)     │
│              :4000                  │
│               │                     │
│    ┌──────────┼──────────┐          │
│    │          │          │          │
│    ▼          ▼          ▼          │
│  PostgreSQL MongoDB                 │
│  :5432     :27017                   │
│                                     │
└─────────────────────────────────────┘
```

## Volume Management

- `postgres_data`: Persists PostgreSQL data
- `mongodb_data`: Persists MongoDB data

Data is preserved across container restarts unless you run `docker-compose down -v`.

## Notes

- All services use Alpine Linux images for minimal size
- Node.js 22 is used for both frontend and backend
- Development dependencies are excluded from the backend build
- Frontend uses Next.js production build
- .dockerignore files optimize build context
