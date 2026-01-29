export const typeDefs = `#graphql
  type User {
    id: ID!
    email: String!
    name: String!
    role: String!
    createdAt: String
    updatedAt: String
  }

  type AuthPayload {
    user: User!
    accessToken: String!
    refreshToken: String!
  }

  type Author {
    id: ID!
    name: String!
    biography: String
    born_date: String
    books: [Book!]
    createdAt: String
    updatedAt: String
  }

  type Book {
    id: ID!
    title: String!
    description: String
    published_date: String
    author_id: Int!
    author: Author
    metadata: BookMetadata
    reviews: [Review!]
    createdAt: String
    updatedAt: String
  }

  type BookMetadata {
    bookId: Int!
    averageRating: Float
    totalReviews: Int
    viewCount: Int
    tags: [String!]
    genre: String
  }

  type Review {
    id: ID!
    bookId: Int!
    authorId: Int
    rating: Int!
    comment: String!
    reviewerName: String!
    createdAt: String
    updatedAt: String
  }

  type BooksResponse {
    books: [Book!]!
    total: Int!
    page: Int!
    limit: Int!
  }

  type AuthorsResponse {
    authors: [Author!]!
    total: Int!
    page: Int!
    limit: Int!
  }

  input CreateAuthorInput {
    name: String!
    biography: String
    born_date: String
  }

  input UpdateAuthorInput {
    name: String
    biography: String
    born_date: String
  }

  input CreateBookInput {
    title: String!
    description: String
    published_date: String
    author_id: Int!
  }

  input UpdateBookInput {
    title: String
    description: String
    published_date: String
    author_id: Int
  }

  input CreateReviewInput {
    bookId: Int!
    authorId: Int
    rating: Int!
    comment: String!
    reviewerName: String!
  }

  input BookFilterInput {
    title: String
    author_id: Int
    published_date_from: String
    published_date_to: String
  }

  input AuthorFilterInput {
    name: String
    born_year: Int
  }

  input SignupInput {
    email: String!
    password: String!
    name: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type Query {
    # Health check
    healthCheck: String!

    # Authors
    authors(page: Int, limit: Int, filter: AuthorFilterInput): AuthorsResponse!
    author(id: ID!): Author

    # Books
    books(page: Int, limit: Int, filter: BookFilterInput): BooksResponse!
    book(id: ID!): Book

    # Reviews
    reviews(bookId: Int, authorId: Int): [Review!]!
  }

  type Mutation {
    # Auth
    signup(input: SignupInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    refreshToken(refreshToken: String!): AuthPayload!

    # Authors
    createAuthor(input: CreateAuthorInput!): Author!
    updateAuthor(id: ID!, input: UpdateAuthorInput!): Author!
    deleteAuthor(id: ID!): Boolean!

    # Books
    createBook(input: CreateBookInput!): Book!
    updateBook(id: ID!, input: UpdateBookInput!): Book!
    deleteBook(id: ID!): Boolean!

    # Reviews
    createReview(input: CreateReviewInput!): Review!
    deleteReview(id: ID!): Boolean!
  }
`;
