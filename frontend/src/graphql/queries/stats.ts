// This file defines all queries related to stats

import { gql } from '@/generated';

/** Query to fetch overall statistics about books, authors and ratings */
export const GET_STATS = gql(`
  query GetStats {
    stats {
      totalBooks
      totalAuthors
      totalRatings
    }
  }
`);
