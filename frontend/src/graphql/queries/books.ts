// This file defines all queries related to books

import { gql } from '@/generated';

/** Query to fetch a list of books */
export const GET_BOOKS = gql(`
  query GetBooks($limit: Int, $offset: Int, $input: FilterInput) {
    books(limit: $limit, offset: $offset, input: $input) {
      books {
        id
        title
        coverImg
        rating
        numRatings
        description
        genres {
          name
        }
        authors {
          name
        }
      }
      summary {
        totalBooks
      }
    }
  }
`);

/** Query to fetch a single book */
export const GET_BOOK = gql(`
  query GetBook($bookId: String!) {
    book(id: $bookId) {
      id
      title
      series
      numberInSeries
      language
      isbn
      coverImg
      numRatings
      rating
      ratingsByStars
      characters
      bookFormat
      pages
      publishDate
      awards
      setting
      publisher {
        name
      }
      genres {
        name
      }
      authors {
        name
      }
      description
    }
  }
`);

/** Query to get a random book id */
export const GET_RANDOM_BOOK = gql(`
  query GetRandomBook {
    randomBook {
      id
    }
  }
`);

/** Query to get the rating of a specific book */
export const GET_BOOK_RATING = gql(`
  query GetBookRating($bookId: String!) {
    book(id: $bookId) {
      id
      rating
    }
  }
`);

/** Query to get all genres */
export const GET_GENRES = gql(`
  query GetGenres {
    genres {
      name
    }
  }
`);

/** Query to get the count for each filter */
export const GET_FILTER_COUNT = gql(`
  query GetFilterCount($input: FilterInput) {
    filterCount(input: $input) {
      authors {
        name
        count
      }
      genres {
        name
        count
      }
      publishers {
        name
        count
      }
      ratings {
        rating
        count
      }
    }
  }
`);

/** Query to get the earliest and latest publish dates */
export const GET_DATE_SPAN = gql(`
  query GetDateSpan {
    dateSpan {
      earliest
      latest
    }
  }
`);

/** Query to get the smallest and largest page numbers */
export const GET_PAGE_SPAN = gql(`
  query GetPageSpan {
    pageSpan {
      least
      most
    }
  }
`);
