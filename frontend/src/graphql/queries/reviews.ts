// This file defines all queries related to reviews

import { gql } from '@/generated';

/** Query to fetch reviews for a specific book */
export const GET_BOOK_REVIEWS = gql(`
  query GetBooksReviews($bookID: String!, $limit: Int!, $offset: Int!, $userUUID: String!) {
    bookReviews(bookID: $bookID, limit: $limit, offset: $offset, avoidUserUUID: $userUUID) {
      reviews {
        UUID
        description
        rating
        at
        user {
          name
          UUID
        }
      }
      pagination 
      {
        isLastPage
      }
    }
  }
`);

/** Query to fetch the current user's review for a specific book */
export const GET_YOUR_BOOK_REVIEW = gql(`
  query GetYourBookReview($bookID: String!, $userUUID: String!) {
    bookReview(bookID: $bookID, userUUID: $userUUID) {
      UUID
      description
      rating
      at
    }
  }

`);

/** Query to fetch all reviews written by the current user */
export const GET_YOUR_BOOK_REVIEWS = gql(`
  query GetYourBookReviews($limit: Int!, $offset: Int!, $userUUID: String!) {
    bookReviews(limit: $limit, offset: $offset, focusUserUUID: $userUUID) {
      reviews {
        UUID
        description
        rating
        at
        book {
          id
          title
          coverImg
        }
      }
      pagination 
      {
        totalPages
        currentPage
        isLastPage
      }
      summary 
      {
        total
      }
    }
  }

`);
