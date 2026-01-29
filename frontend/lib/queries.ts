import { gql } from '@apollo/client';

export const GET_BOOKS = gql`
  query GetBooks($page: Int, $limit: Int, $filter: BookFilterInput) {
    books(page: $page, limit: $limit, filter: $filter) {
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
          viewCount
          genre
        }
      }
      total
      page
      limit
    }
  }
`;

export const GET_BOOK_DETAILS = gql`
  query GetBook($id: ID!) {
    book(id: $id) {
      id
      title
      description
      published_date
      author {
        id
        name
        biography
      }
      metadata {
        averageRating
        totalReviews
        viewCount
        genre
        tags
      }
      reviews {
        id
        rating
        comment
        reviewerName
        createdAt
      }
    }
  }
`;

export const CREATE_BOOK = gql`
  mutation CreateBook($input: CreateBookInput!) {
    createBook(input: $input) {
      id
      title
      author {
        name
      }
    }
  }
`;

export const DELETE_BOOK = gql`
  mutation DeleteBook($id: ID!) {
    deleteBook(id: $id)
  }
`;

export const GET_AUTHORS = gql`
  query GetAuthors($page: Int, $limit: Int, $filter: AuthorFilterInput) {
    authors(page: $page, limit: $limit, filter: $filter) {
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
      page
      limit
    }
  }
`;

export const DELETE_AUTHOR = gql`
  mutation DeleteAuthor($id: ID!) {
    deleteAuthor(id: $id)
  }
`;
