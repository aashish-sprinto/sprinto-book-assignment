# Sprinto Books - Library Management System

A full-stack web application for managing books, authors, and reviews. Built with Next.js 15 (Frontend), Node.js with GraphQL (Backend), PostgreSQL, and MongoDB.

## Quick Start with Docker

### Prerequisites
- Docker Desktop installed and running
- Git installed

### Setup Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd sprinto-books-assignment
```

2. **Create environment file**
```bash
cp .env.example .env
```

3. **Start all services**
```bash
docker-compose up -d
```

4. **Verify services are running**
```bash
docker-compose ps
```

### Access the Application

- **Frontend**: http://localhost:3000
- **Backend GraphQL**: http://localhost:4000
- **Apollo Sandbox**: http://localhost:4000

## Common Docker Commands

**View logs**
```bash
docker-compose logs -f
```

**Stop services**
```bash
docker-compose down
```

**Restart services**
```bash
docker-compose restart
```

**Rebuild and start fresh**
```bash
docker-compose up -d --build
```

## How It Works

The application has a simple architecture:

1. **Frontend** (Next.js) - User interface where you browse books, authors, and leave reviews
2. **Backend** (GraphQL API) - Server that handles all requests from the frontend
3. **PostgreSQL** - Stores books and authors data
4. **MongoDB** - Stores reviews and ratings data

**Data Flow:**
- User interacts with the web app (Frontend)
- Frontend sends GraphQL queries to the Backend
- Backend fetches/updates data from PostgreSQL or MongoDB
- Data is displayed back to the user

## User Roles & Permissions

### Guest User
- View all books and authors
- View reviews and ratings
- **Cannot**: Create, edit, or delete content

### Author
- View all books and authors
- View reviews and ratings
- Create new books
- Edit their own books
- Cannot delete books
- Cannot manage other authors' books

### Admin
- Full access to all features
- Create, edit, and delete books
- Create, edit, and delete authors
- Manage all user content
- Delete reviews if needed
- Access to all system data

## Features

- Browse and search for books
- Manage authors and their publications
- Write and view book reviews and ratings
- Create new books and authors
- Persistent storage with PostgreSQL and MongoDB

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS, Apollo Client
- **Backend**: Node.js, GraphQL Apollo Server, Express
- **Databases**: PostgreSQL, MongoDB
- **DevOps**: Docker, Docker Compose

---

For detailed documentation, see `/backend/README.md` and `/frontend/README.md`
