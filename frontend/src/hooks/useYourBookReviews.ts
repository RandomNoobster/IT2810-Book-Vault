//GET_YOUR_BOOK_REVIEWS

import { useQuery } from '@apollo/client';
import { GET_YOUR_BOOK_REVIEWS } from '@/graphql/queries/reviews';

type UseYourBookReviewsArgs = {
  limit: number;
  page: number;
  userUUID: string;
  onCompleted?: () => void;
};

/**
 * Custom hook that fetches a user's book reviews
 * @param {number} limit - The number of reviews to fetch
 * @param {number} page - The page number of reviews to fetch
 * @param {string} userUUID - The UUID of the user to fetch reviews for
 * @returns Object containing:
 * - reviews: Array of reviews for the user
 * - totalReviews: The total number of reviews for the user
 * - loading: Boolean indicating if the query is in progress
 * - error: Any error that occurred during the query
 */
export const useYourBookReviews = ({ limit, page, userUUID }: UseYourBookReviewsArgs) => {
  const { data, loading, error } = useQuery(GET_YOUR_BOOK_REVIEWS, {
    variables: { limit, offset: page - 1, userUUID },
  });

  return {
    reviews: data?.bookReviews.reviews,
    totalReviews: data?.bookReviews.summary.total,
    loading,
    error,
  };
};
