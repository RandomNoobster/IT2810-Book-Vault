import { useQuery } from '@apollo/client';
import { GET_BOOK_REVIEWS } from '@/graphql/queries/reviews';

type UseBooksReviewsArgs = {
  bookID: string;
  limit: number;
  page: number;
  userUUID: string;
};

/**
 * Custom hook that fetches reviews for a specific book
 * @param {string} bookID - The ID of the book to fetch reviews for
 * @param {number} limit - The number of reviews to fetch
 * @param {number} page - The page number of reviews to fetch
 * @param {string} userUUID - The UUID of the user to fetch reviews for
 * @returns Object containing:
 * - reviews: Array of reviews for the book
 * - pagination: Pagination information
 * - loading: Boolean indicating if the query is in progress
 * - error: Any error that occurred during the query
 * - refetch: Function to refetch the reviews
 */
export const useBookReviews = ({ bookID, limit, page, userUUID }: UseBooksReviewsArgs) => {
  const { data, loading, error, refetch } = useQuery(GET_BOOK_REVIEWS, {
    variables: { bookID, limit, offset: page - 1, userUUID },
  });

  return {
    reviews: data?.bookReviews.reviews,
    pagination: data?.bookReviews.pagination,
    loading,
    error,
    refetch,
  };
};
