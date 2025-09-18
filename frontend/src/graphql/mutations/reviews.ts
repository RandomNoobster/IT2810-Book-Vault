import { gql } from '@/generated';

/** Mutation to create a new review for a book */
export const CREATE_REVIEW = gql(`
  mutation CreateReview($input: CreateReviewInput!) {
    createReview(input: $input) {
      book {
        id
        rating
        numRatings
        ratingsByStars
      }
      success
      message
    }
  }
`);

/** Mutation to update an existing review */
export const UPDATE_REVIEW = gql(`
  mutation UpdateReview($input: UpdateReviewInput!) {
    updateReview(input: $input) {
      book {
        id
        rating
        numRatings
        ratingsByStars
      }
      success
      message
    }
  }
`);
