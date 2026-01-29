# Backend - Books Management API

GraphQL API for managing books, authors, and reviews using Apollo Server, Sequelize (PostgreSQL), and Mongoose (MongoDB).

## Tech Stack

- **Node.js** with ES Modules
- **Apollo Server** - GraphQL server
- **Sequelize** - PostgreSQL ORM for Books and Authors
- **Mongoose** - MongoDB ODM for Reviews and Metadata
- **PostgreSQL** - Relational data (Books, Authors)
- **MongoDB** - Non-relational data (Reviews, Ratings, Metadata)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

#### PostgreSQL Setup

```bash
# Install PostgreSQL (if not already installed)
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15

# Create database and user
psql postgres
```

In the PostgreSQL shell:

```sql
CREATE DATABASE sprinto_books;
CREATE USER sprinto_user WITH PASSWORD 'my_strong_password';
GRANT ALL PRIVILEGES ON DATABASE sprinto_books TO sprinto_user;
\q
```

#### MongoDB Setup

```bash
# Install MongoDB (if not already installed)
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# MongoDB will create the database automatically on first connection
```

### 3. Environment Variables

The `.env` file is already configured with:

```env
PORT=4000
DB_NAME=sprinto_books
DB_USER=sprinto_user
DB_PASSWORD=my_strong_password
DB_HOST=localhost
DB_PORT=5432
MONGO_URI=mongodb://127.0.0.1:27017/books_db
```

### 4. Run the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will start at `http://localhost:4000`

## GraphQL API

### Sample Queries

#### Health Check
```graphql
query {
  healthCheck
}
```

#### Get All Books (with pagination)
```graphql
query {
  books(page: 1, limit: 10) {
    books {
      id
      title
      description
      published_date
      author {
        id
        name
      }
      metadata {
        averageRating
        totalReviews
      }
      reviews {
        rating
        comment
        reviewerName
      }
    }
    total
    page
    limit
  }
}
```

#### Get All Authors
```graphql
query {
  authors(page: 1, limit: 10) {
    authors {
      id
      name
      biography
      born_date
      books {
        id
        title
      }
    }
    total
  }
}
```

#### Filter Books by Title
```graphql
query {
  books(filter: { title: "Harry" }) {
    books {
      id
      title
      author {
        name
      }
    }
  }
}
```

### Sample Mutations

#### Create Author
```graphql
mutation {
  createAuthor(input: {
    name: "J.K. Rowling"
    biography: "British author, best known for the Harry Potter series"
    born_date: "1965-07-31"
  }) {
    id
    name
    biography
  }
}
```

#### Create Book
```graphql
mutation {
  createBook(input: {
    title: "Harry Potter and the Philosopher's Stone"
    description: "The first book in the Harry Potter series"
    published_date: "1997-06-26"
    author_id: 1
  }) {
    id
    title
    author {
      name
    }
  }
}
```

#### Create Review
```graphql
mutation {
  createReview(input: {
    bookId: 1
    rating: 5
    comment: "An absolutely magical read!"
    reviewerName: "John Doe"
  }) {
    id
    rating
    comment
    reviewerName
  }
}
```

#### Update Book
```graphql
mutation {
  updateBook(id: 1, input: {
    title: "Updated Book Title"
    description: "Updated description"
  }) {
    id
    title
    description
  }
}
```

#### Delete Book
```graphql
mutation {
  deleteBook(id: 1)
}
```

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js           # Database connection orchestrator
│   │   ├── mongo.js        # MongoDB connection
│   │   └── postgres.js     # PostgreSQL connection (alternative)
│   ├── db/
│   │   └── sequelize.js    # Sequelize instance
│   ├── models/
│   │   ├── Author.js       # Sequelize Author model
│   │   ├── Book.js         # Sequelize Book model
│   │   ├── Review.js       # Mongoose Review model
│   │   ├── BookMetadata.js # Mongoose metadata model
│   │   └── index.js        # Model associations
│   ├── graphql/
│   │   ├── typeDefs.js     # GraphQL schema
│   │   └── resolvers.js    # GraphQL resolvers
│   └── index.js            # Server entry point
├── .env                    # Environment variables
└── package.json
```

## Features

✅ Complete CRUD operations for Books and Authors  
✅ Reviews and ratings system  
✅ Pagination support  
✅ Advanced filtering (by title, author, date, etc.)  
✅ Automatic metadata updates  
✅ Relational data in PostgreSQL  
✅ Non-relational data in MongoDB  
✅ GraphQL API with Apollo Server  
✅ Proper error handling  

## Testing with Apollo Sandbox

Once the server is running, visit `http://localhost:4000` to access Apollo Sandbox where you can test all queries and mutations interactively.
