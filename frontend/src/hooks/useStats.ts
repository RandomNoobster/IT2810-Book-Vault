import { useQuery } from '@apollo/client';
import { GET_STATS } from '@/graphql/queries/stats';

/**
 * Custom hook that fetches statistics about the website. Gets the total number of books, authors, and ratings.
 * @returns Object containing:
 * - stats: Object containing the statistics
 * - loading: Boolean indicating if the query is in progress
 * - error: Any error that occurred during the query
 */
export const useStats = () => {
  const { data, loading, error, refetch } = useQuery(GET_STATS);

  return {
    stats: data?.stats,
    loading,
    error,
    refetch,
  };
};
