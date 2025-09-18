import { useQuery } from '@apollo/client';
import { GET_GENRES } from '@/graphql/queries/books';

/**
 * Custom hook that fetches the list of genres from the server
 * @returns Object containing:
 * - genres: Array of available book genres
 * - loading: Boolean indicating if the query is in progress
 * - error: Any error that occurred during the query
 */
export const useGenres = () => {
  const { data, loading, error } = useQuery(GET_GENRES);

  return {
    genres: data?.genres,
    loading,
    error,
  };
};
