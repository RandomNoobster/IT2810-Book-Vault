import { useQuery } from '@apollo/client';
import { GET_YOUR_BOOK_REVIEW } from '@/graphql/queries/reviews';

type UseBooksReviewsArgs = {
  bookID: string;
  userUUID: string;
};

/**
 * Custom hook that fetches a user's review for a specific book
 * @param {string} bookID - The ID of the book to fetch the review for
 * @param {string} userUUID - The UUID of the user to fetch the review for
 * @returns Object containing:
 * - review: The review data if found
 * - loading: Boolean indicating if the query is in progress
 * - error: Any error that occurred during the query
 * - refetch: Function to refetch the review
 */
export const useYourBookReview = ({ bookID, userUUID }: UseBooksReviewsArgs) => {
  const { data, loading, error, refetch } = useQuery(GET_YOUR_BOOK_REVIEW, {
    variables: { bookID, userUUID },
  });

  return {
    review: data?.bookReview || undefined,
    loading,
    error,
    refetch,
  };
};
