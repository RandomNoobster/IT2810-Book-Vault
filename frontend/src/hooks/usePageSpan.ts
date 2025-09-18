import { useQuery } from '@apollo/client';
import { GET_PAGE_SPAN } from '@/graphql/queries/books';

/**
 * Custom hook that fetches the least and most number of pages of books
 * @returns Object containing:
 * - leastPages: The minimum number of pages found in any book
 * - mostPages: The maximum number of pages found in any book
 * - loading: Boolean indicating if the query is in progress
 * - error: Any error that occurred during the query
 */
export const usePageSpan = () => {
  const { data, loading, error } = useQuery(GET_PAGE_SPAN);

  return {
    leastPages: data?.pageSpan.least ?? 1,
    mostPages: data?.pageSpan.most ?? 11095,
    loading,
    error,
  };
};
