import { useQuery } from '@apollo/client';
import { GET_RANDOM_BOOK } from '@/graphql/queries/books';

/**
 * Custom hook that fetches a random book from the database
 * @returns Object containing:
 * - id: The ID of the random book
 * - loading: Boolean indicating if the query is in progress
 * - error: Any error that occurred during the query
 */
export const useRandomBook = () => {
  const { data, loading, error } = useQuery(GET_RANDOM_BOOK, {
    fetchPolicy: 'no-cache',
  });

  return {
    id: data?.randomBook.id,
    loading,
    error,
  };
};
