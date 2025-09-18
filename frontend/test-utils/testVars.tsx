import { Book } from '@/generated/graphql';

export const dummyBook: Book = {
  __typename: 'Book',
  authors: [{ __typename: 'Author', name: 'A name' }],
  coverImg: 'https://placehold.co/200x300?text=Cover%20image%20for%20book',
  genres: [{ __typename: 'Genre', name: 'A genre' }],
  id: '1',
  publisher: { __typename: 'Publisher', name: 'A publisher' },
  title: 'A title',
  bookFormat: 'Paper',
  characters: ['A character'],
  description: 'A deep book about deep topics',
  isbn: '999999999',
  language: 'Swedish',
  pages: 1000,
  publishDate: '03/03/03',
  rating: 3.555,
  series: 'Title #1',
  numRatings: 5000,
  ratingsByStars: [1, 5, 10, 7, 1],
};
