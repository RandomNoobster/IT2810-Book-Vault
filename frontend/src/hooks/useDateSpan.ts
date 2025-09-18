import { useQuery } from '@apollo/client';
import { GET_DATE_SPAN } from '@/graphql/queries/books';
import { DEFAULT_FILTERS } from '@/utils/filters';

/**
 * Custom hook that fetches the earliest and latest publication dates of books
 * @returns Object containing:
 * - earliestDate: The earliest publication year
 * - latestDate: The latest publication year
 * - loading: Boolean indicating if the query is in progress
 * - error: Any error that occurred during the query
 */
export const useDateSpan = () => {
  const { data, loading, error } = useQuery(GET_DATE_SPAN);

  if (data) {
    return {
      earliestDate: new Date(data.dateSpan.earliest).getFullYear(),
      latestDate: new Date(data.dateSpan.latest).getFullYear(),
      loading,
      error,
    };
  }

  return {
    earliestDate: DEFAULT_FILTERS.selectedAfterDate.getFullYear(),
    latestDate: DEFAULT_FILTERS.selectedBeforeDate.getFullYear(),
    loading,
    error,
  };
};
