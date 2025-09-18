import { useQuery } from '@apollo/client';
import { GET_BOOK } from '@/graphql/queries/books';

type UseBookArgs = {
  bookId?: string;
};

/**
 * Custom hook that fetches a book by its ID
 * @param {string} bookId - The ID of the book to fetch
 * @returns Object containing:
 * - book: The book data if found
 * - loading: Boolean indicating if the query is in progress
 * - error: Any error that occurred during the query
 */
export const useBook = ({ bookId }: UseBookArgs) => {
  const { data, loading, error } = useQuery(GET_BOOK, {
    variables: bookId ? { bookId } : undefined, // Just to make TypeScript happy, the query is not executed if bookId is undefined
    skip: !bookId,
  });

  return {
    book: data?.book,
    loading,
    error,
  };
};
