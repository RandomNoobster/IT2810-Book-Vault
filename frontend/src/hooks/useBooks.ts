import { useQuery } from '@apollo/client';
import { SortBy, SortInput, SortOrder } from '@/generated/graphql';
import { GET_BOOKS } from '@/graphql/queries/books';

type UseBooksArgs = {
  limit: number;
  page: number;
  sortBy: SortBy;
  sortOrder: SortOrder;
  search?: string;
  beforeDate?: Date;
  afterDate?: Date;
  authors?: string[];
  genres?: string[];
  publishers?: string[];
  minPages?: number;
  maxPages?: number;
  minRating?: number;
  wantToReadListUserUUID?: string;
  haveReadListUserUUID?: string;
  onCompleted?: () => void;
};

/**
 * Custom hook that fetches books based on filter and pagination parameters.
 * @param {number} limit - The number of books to fetch
 * @param {number} page - The page number of books to fetch
 * @param {string} search - The search query to filter books by
 * @param {SortBy} sortBy - The field to sort books by
 * @param {SortOrder} sortOrder - The order to sort books by
 * @param {Date} beforeDate - The date to filter books before
 * @param {Date} afterDate - The date to filter books after
 * @param {string[]} authors - The authors to filter books by
 * @param {string[]} genres - The genres to filter books by
 * @param {string[]} publishers - The publishers to filter books by
 * @param {number} minPages - The minimum number of pages to filter books by
 * @param {number} maxPages - The maximum number of pages to filter books by
 * @param {number} minRating - The minimum rating to filter books by
 * @param {string} wantToReadListUserUUID - UUID of users wantToRead list you want to filter based on
 * @param {string} haveReadListUserUUID - UUID of users haveRead list you want to filter based on
 * @returns Object containing the books, total number of books, loading state, and error state
 */
export const useBooks = ({
  limit,
  page,
  search,
  sortBy,
  sortOrder,
  beforeDate,
  afterDate,
  authors,
  genres,
  publishers,
  minPages,
  maxPages,
  minRating,
  wantToReadListUserUUID,
  haveReadListUserUUID,
}: UseBooksArgs) => {
  const sortInput: SortInput = { sortBy, sortOrder };
  const filterInput = {
    search,
    sortInput,
    beforeDate,
    afterDate,
    authors,
    genres,
    publishers,
    minPages,
    maxPages,
    minRating,
    wantToReadListUserUUID,
    haveReadListUserUUID,
  };

  const { data, loading, error } = useQuery(GET_BOOKS, {
    variables: { limit, offset: page - 1, input: filterInput },
  });

  return {
    books: data?.books.books,
    totalBooks: data?.books.summary.totalBooks,
    loading,
    error,
  };
};
