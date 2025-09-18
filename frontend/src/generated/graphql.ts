/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
};

export type Author = {
  __typename?: 'Author';
  /** Name of the author */
  name: Scalars['ID']['output'];
};

export type Book = {
  __typename?: 'Book';
  /** List of authors of the book */
  authors: Array<Author>;
  /** List of awards the book has received */
  awards?: Maybe<Array<Scalars['String']['output']>>;
  /** Format of the book (e.g., hardcover, paperback, ebook) */
  bookFormat: Scalars['String']['output'];
  /** List of characters in the book */
  characters?: Maybe<Array<Scalars['String']['output']>>;
  /** URL for the cover image of the book */
  coverImg: Scalars['String']['output'];
  /** Description of the book */
  description: Scalars['String']['output'];
  /** List of genres the book belongs to */
  genres: Array<Genre>;
  /** Unique identifier for the book */
  id: Scalars['ID']['output'];
  /** ISBN number of the book */
  isbn: Scalars['String']['output'];
  /** Language of the book */
  language: Scalars['String']['output'];
  /** Total number of ratings. */
  numRatings: Scalars['Int']['output'];
  /** Position of the book in the series */
  numberInSeries?: Maybe<Scalars['Int']['output']>;
  /** Number of pages in the book */
  pages: Scalars['Int']['output'];
  /** Date the book was published */
  publishDate: Scalars['Date']['output'];
  /** Publisher of the book */
  publisher: Publisher;
  /** Weighted sum of the ratings. */
  rating: Scalars['Float']['output'];
  /** Number of ratings for each star level. The index corresponds to the number of stars. Index 0 is 1 star, index 1 is 2 stars, etc. */
  ratingsByStars: Array<Scalars['Int']['output']>;
  /** The series the book belongs to, if any */
  series?: Maybe<Scalars['String']['output']>;
  /** Setting of the book. A list of locations/periods where the book takes place */
  setting?: Maybe<Array<Scalars['String']['output']>>;
  /** Title of the book */
  title: Scalars['String']['output'];
};

/** Paginated list of books */
export type BookPagination = {
  __typename?: 'BookPagination';
  books: Array<Book>;
  filterCounts: FilterCountResult;
  pagination: PaginationInfo;
  summary: BookSummary;
};

export type BookSummary = {
  __typename?: 'BookSummary';
  totalBooks: Scalars['Int']['output'];
};

export type CreateReviewInput = {
  bookID: Scalars['String']['input'];
  description: Scalars['String']['input'];
  rating: Scalars['Float']['input'];
  secret: Scalars['String']['input'];
  userUUID: Scalars['String']['input'];
};

export type DateSpan = {
  __typename?: 'DateSpan';
  /** Earliest publish date */
  earliest: Scalars['Date']['output'];
  /** Latest publish date */
  latest: Scalars['Date']['output'];
};

export type FilterCount = {
  __typename?: 'FilterCount';
  count: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

/** Result of counting items for each filter */
export type FilterCountResult = {
  __typename?: 'FilterCountResult';
  authors: Array<FilterCount>;
  genres: Array<FilterCount>;
  publishers: Array<FilterCount>;
  ratings: Array<RatingCount>;
};

export type FilterInput = {
  afterDate?: InputMaybe<Scalars['Date']['input']>;
  authors?: InputMaybe<Array<Scalars['String']['input']>>;
  beforeDate?: InputMaybe<Scalars['Date']['input']>;
  genres?: InputMaybe<Array<Scalars['String']['input']>>;
  haveReadListUserUUID?: InputMaybe<Scalars['String']['input']>;
  maxPages?: InputMaybe<Scalars['Int']['input']>;
  minPages?: InputMaybe<Scalars['Int']['input']>;
  minRating?: InputMaybe<Scalars['Int']['input']>;
  publishers?: InputMaybe<Array<Scalars['String']['input']>>;
  search?: InputMaybe<Scalars['String']['input']>;
  sortInput?: InputMaybe<SortInput>;
  wantToReadListUserUUID?: InputMaybe<Scalars['String']['input']>;
};

export type Genre = {
  __typename?: 'Genre';
  /** Name of the genre */
  name: Scalars['ID']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createReview: ReviewResponse;
  createUser: User;
  updateReview: ReviewResponse;
  updateUser: UpdateUserResponse;
  updateUserLibrary: UpdateUserlibraryResponse;
};


export type MutationCreateReviewArgs = {
  input: CreateReviewInput;
};


export type MutationUpdateReviewArgs = {
  input: UpdateReviewInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUsernameInput;
};


export type MutationUpdateUserLibraryArgs = {
  input: UpdateUserLibraryInput;
};

export type PageSpan = {
  __typename?: 'PageSpan';
  /** Minimum number of pages */
  least: Scalars['Int']['output'];
  /** Maximum number of pages */
  most: Scalars['Int']['output'];
};

/** General pagination information */
export type PaginationInfo = {
  __typename?: 'PaginationInfo';
  currentPage: Scalars['Int']['output'];
  isLastPage: Scalars['Boolean']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Publisher = {
  __typename?: 'Publisher';
  /** Name of the publisher */
  name: Scalars['ID']['output'];
};

export type Query = {
  __typename?: 'Query';
  /** Retrieve a list of authors */
  authors: Array<Author>;
  /** Retrieve a specific book based on id */
  book: Book;
  bookReview?: Maybe<Review>;
  /** Retrieve book reviews */
  bookReviews: ReviewPagination;
  /** Retrieve a list of books with optional filters */
  books: BookPagination;
  /** Retrieve the span of publish dates */
  dateSpan: DateSpan;
  /** Retrieve the amount of books meeting current filters and the new one */
  filterCount: FilterCountResult;
  /** Retrieve a list of genres */
  genres: Array<Genre>;
  /** Retrieve the span of number of pages */
  pageSpan: PageSpan;
  /** Retrieve a list of publishers */
  publishers: Array<Publisher>;
  /** Returns a random book */
  randomBook: Book;
  /** Retrieve statistics about the website */
  stats: Stats;
  user?: Maybe<User>;
};


export type QueryBookArgs = {
  id: Scalars['String']['input'];
};


export type QueryBookReviewArgs = {
  bookID: Scalars['String']['input'];
  userUUID: Scalars['String']['input'];
};


export type QueryBookReviewsArgs = {
  avoidUserUUID?: InputMaybe<Scalars['String']['input']>;
  bookID?: InputMaybe<Scalars['String']['input']>;
  focusUserUUID?: InputMaybe<Scalars['String']['input']>;
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
};


export type QueryBooksArgs = {
  input?: InputMaybe<FilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryFilterCountArgs = {
  input?: InputMaybe<FilterInput>;
};


export type QueryUserArgs = {
  UUID: Scalars['String']['input'];
  secret: Scalars['String']['input'];
};

export type RatingCount = {
  __typename?: 'RatingCount';
  count: Scalars['Int']['output'];
  rating: Scalars['Int']['output'];
};

export type Review = {
  __typename?: 'Review';
  /** id for review */
  UUID: Scalars['ID']['output'];
  at: Scalars['Date']['output'];
  book?: Maybe<Book>;
  description: Scalars['String']['output'];
  rating: Scalars['Float']['output'];
  user?: Maybe<User>;
};

export type ReviewPagination = {
  __typename?: 'ReviewPagination';
  pagination: PaginationInfo;
  reviews: Array<Review>;
  summary: ReviewSummary;
};

export type ReviewSummary = {
  __typename?: 'ReviewSummary';
  total: Scalars['Int']['output'];
};

export enum SortBy {
  /** Sort by author name */
  AuthorName = 'authorName',
  /** Sort by book name */
  BookName = 'bookName',
  /** Sort by haveRead */
  HaveRead = 'haveRead',
  /** Sort by publisher name */
  PublisherName = 'publisherName',
  /** Sort by wantToRead */
  WantToRead = 'wantToRead'
}

export type SortInput = {
  sortBy: SortBy;
  sortOrder: SortOrder;
};

export enum SortOrder {
  /** Sort in ascending order */
  Asc = 'asc',
  /** Sort in descending order */
  Desc = 'desc'
}

export type Stats = {
  __typename?: 'Stats';
  /** Total number of authors */
  totalAuthors: Scalars['Int']['output'];
  /** Total number of books */
  totalBooks: Scalars['Int']['output'];
  /** Total number of ratings */
  totalRatings: Scalars['Int']['output'];
};

export type UpdateReviewInput = {
  description: Scalars['String']['input'];
  rating: Scalars['Float']['input'];
  reviewUUID: Scalars['String']['input'];
  secret: Scalars['String']['input'];
};

export type UpdateUserLibraryInput = {
  UUID: Scalars['String']['input'];
  haveRead?: InputMaybe<Scalars['String']['input']>;
  removeFromLibrary?: InputMaybe<Scalars['String']['input']>;
  secret: Scalars['String']['input'];
  wantToRead?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUsernameInput = {
  UUID: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  secret: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  UUID: Scalars['ID']['output'];
  at?: Maybe<Scalars['Date']['output']>;
  haveRead?: Maybe<Array<Book>>;
  name?: Maybe<Scalars['String']['output']>;
  secret?: Maybe<Scalars['String']['output']>;
  wantToRead?: Maybe<Array<Book>>;
};

export type ReviewResponse = {
  __typename?: 'reviewResponse';
  book?: Maybe<Book>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type UpdateUserResponse = {
  __typename?: 'updateUserResponse';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
  user?: Maybe<User>;
};

export type UpdateUserlibraryResponse = {
  __typename?: 'updateUserlibraryResponse';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type CreateReviewMutationVariables = Exact<{
  input: CreateReviewInput;
}>;


export type CreateReviewMutation = { __typename?: 'Mutation', createReview: { __typename?: 'reviewResponse', success: boolean, message: string, book?: { __typename?: 'Book', id: string, rating: number, numRatings: number, ratingsByStars: Array<number> } | null } };

export type UpdateReviewMutationVariables = Exact<{
  input: UpdateReviewInput;
}>;


export type UpdateReviewMutation = { __typename?: 'Mutation', updateReview: { __typename?: 'reviewResponse', success: boolean, message: string, book?: { __typename?: 'Book', id: string, rating: number, numRatings: number, ratingsByStars: Array<number> } | null } };

export type CreateUserMutationVariables = Exact<{ [key: string]: never; }>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'User', UUID: string, secret?: string | null } };

export type UpdateUserMutationVariables = Exact<{
  input: UpdateUsernameInput;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'updateUserResponse', success: boolean, message: string, user?: { __typename?: 'User', UUID: string, name?: string | null } | null } };

export type UpdateUserLibraryMutationVariables = Exact<{
  input: UpdateUserLibraryInput;
}>;


export type UpdateUserLibraryMutation = { __typename?: 'Mutation', updateUserLibrary: { __typename?: 'updateUserlibraryResponse', success: boolean, message: string } };

export type GetBooksQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  input?: InputMaybe<FilterInput>;
}>;


export type GetBooksQuery = { __typename?: 'Query', books: { __typename?: 'BookPagination', books: Array<{ __typename?: 'Book', id: string, title: string, coverImg: string, rating: number, numRatings: number, description: string, genres: Array<{ __typename?: 'Genre', name: string }>, authors: Array<{ __typename?: 'Author', name: string }> }>, summary: { __typename?: 'BookSummary', totalBooks: number } } };

export type GetBookQueryVariables = Exact<{
  bookId: Scalars['String']['input'];
}>;


export type GetBookQuery = { __typename?: 'Query', book: { __typename?: 'Book', id: string, title: string, series?: string | null, numberInSeries?: number | null, language: string, isbn: string, coverImg: string, numRatings: number, rating: number, ratingsByStars: Array<number>, characters?: Array<string> | null, bookFormat: string, pages: number, publishDate: any, awards?: Array<string> | null, setting?: Array<string> | null, description: string, publisher: { __typename?: 'Publisher', name: string }, genres: Array<{ __typename?: 'Genre', name: string }>, authors: Array<{ __typename?: 'Author', name: string }> } };

export type GetRandomBookQueryVariables = Exact<{ [key: string]: never; }>;


export type GetRandomBookQuery = { __typename?: 'Query', randomBook: { __typename?: 'Book', id: string } };

export type GetBookRatingQueryVariables = Exact<{
  bookId: Scalars['String']['input'];
}>;


export type GetBookRatingQuery = { __typename?: 'Query', book: { __typename?: 'Book', id: string, rating: number } };

export type GetGenresQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGenresQuery = { __typename?: 'Query', genres: Array<{ __typename?: 'Genre', name: string }> };

export type GetFilterCountQueryVariables = Exact<{
  input?: InputMaybe<FilterInput>;
}>;


export type GetFilterCountQuery = { __typename?: 'Query', filterCount: { __typename?: 'FilterCountResult', authors: Array<{ __typename?: 'FilterCount', name: string, count: number }>, genres: Array<{ __typename?: 'FilterCount', name: string, count: number }>, publishers: Array<{ __typename?: 'FilterCount', name: string, count: number }>, ratings: Array<{ __typename?: 'RatingCount', rating: number, count: number }> } };

export type GetDateSpanQueryVariables = Exact<{ [key: string]: never; }>;


export type GetDateSpanQuery = { __typename?: 'Query', dateSpan: { __typename?: 'DateSpan', earliest: any, latest: any } };

export type GetPageSpanQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPageSpanQuery = { __typename?: 'Query', pageSpan: { __typename?: 'PageSpan', least: number, most: number } };

export type GetBooksReviewsQueryVariables = Exact<{
  bookID: Scalars['String']['input'];
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  userUUID: Scalars['String']['input'];
}>;


export type GetBooksReviewsQuery = { __typename?: 'Query', bookReviews: { __typename?: 'ReviewPagination', reviews: Array<{ __typename?: 'Review', UUID: string, description: string, rating: number, at: any, user?: { __typename?: 'User', name?: string | null, UUID: string } | null }>, pagination: { __typename?: 'PaginationInfo', isLastPage: boolean } } };

export type GetYourBookReviewQueryVariables = Exact<{
  bookID: Scalars['String']['input'];
  userUUID: Scalars['String']['input'];
}>;


export type GetYourBookReviewQuery = { __typename?: 'Query', bookReview?: { __typename?: 'Review', UUID: string, description: string, rating: number, at: any } | null };

export type GetYourBookReviewsQueryVariables = Exact<{
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  userUUID: Scalars['String']['input'];
}>;


export type GetYourBookReviewsQuery = { __typename?: 'Query', bookReviews: { __typename?: 'ReviewPagination', reviews: Array<{ __typename?: 'Review', UUID: string, description: string, rating: number, at: any, book?: { __typename?: 'Book', id: string, title: string, coverImg: string } | null }>, pagination: { __typename?: 'PaginationInfo', totalPages: number, currentPage: number, isLastPage: boolean }, summary: { __typename?: 'ReviewSummary', total: number } } };

export type GetStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetStatsQuery = { __typename?: 'Query', stats: { __typename?: 'Stats', totalBooks: number, totalAuthors: number, totalRatings: number } };

export type GetUserQueryVariables = Exact<{
  UUID: Scalars['String']['input'];
  secret: Scalars['String']['input'];
}>;


export type GetUserQuery = { __typename?: 'Query', user?: { __typename?: 'User', UUID: string, name?: string | null, at?: any | null, wantToRead?: Array<{ __typename?: 'Book', id: string }> | null, haveRead?: Array<{ __typename?: 'Book', id: string }> | null } | null };


export const CreateReviewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateReview"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateReviewInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createReview"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"book"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"numRatings"}},{"kind":"Field","name":{"kind":"Name","value":"ratingsByStars"}}]}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<CreateReviewMutation, CreateReviewMutationVariables>;
export const UpdateReviewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateReview"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateReviewInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateReview"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"book"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"numRatings"}},{"kind":"Field","name":{"kind":"Name","value":"ratingsByStars"}}]}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<UpdateReviewMutation, UpdateReviewMutationVariables>;
export const CreateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"UUID"}},{"kind":"Field","name":{"kind":"Name","value":"secret"}}]}}]}}]} as unknown as DocumentNode<CreateUserMutation, CreateUserMutationVariables>;
export const UpdateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateUsernameInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"UUID"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<UpdateUserMutation, UpdateUserMutationVariables>;
export const UpdateUserLibraryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateUserLibrary"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateUserLibraryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUserLibrary"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<UpdateUserLibraryMutation, UpdateUserLibraryMutationVariables>;
export const GetBooksDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetBooks"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"books"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"books"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"coverImg"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"numRatings"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"genres"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"authors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"summary"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalBooks"}}]}}]}}]}}]} as unknown as DocumentNode<GetBooksQuery, GetBooksQueryVariables>;
export const GetBookDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetBook"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"bookId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"book"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"bookId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"series"}},{"kind":"Field","name":{"kind":"Name","value":"numberInSeries"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"isbn"}},{"kind":"Field","name":{"kind":"Name","value":"coverImg"}},{"kind":"Field","name":{"kind":"Name","value":"numRatings"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"ratingsByStars"}},{"kind":"Field","name":{"kind":"Name","value":"characters"}},{"kind":"Field","name":{"kind":"Name","value":"bookFormat"}},{"kind":"Field","name":{"kind":"Name","value":"pages"}},{"kind":"Field","name":{"kind":"Name","value":"publishDate"}},{"kind":"Field","name":{"kind":"Name","value":"awards"}},{"kind":"Field","name":{"kind":"Name","value":"setting"}},{"kind":"Field","name":{"kind":"Name","value":"publisher"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"genres"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"authors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]} as unknown as DocumentNode<GetBookQuery, GetBookQueryVariables>;
export const GetRandomBookDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRandomBook"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"randomBook"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<GetRandomBookQuery, GetRandomBookQueryVariables>;
export const GetBookRatingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetBookRating"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"bookId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"book"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"bookId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}}]}}]}}]} as unknown as DocumentNode<GetBookRatingQuery, GetBookRatingQueryVariables>;
export const GetGenresDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetGenres"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"genres"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetGenresQuery, GetGenresQueryVariables>;
export const GetFilterCountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFilterCount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"filterCount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"authors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}},{"kind":"Field","name":{"kind":"Name","value":"genres"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}},{"kind":"Field","name":{"kind":"Name","value":"publishers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ratings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]} as unknown as DocumentNode<GetFilterCountQuery, GetFilterCountQueryVariables>;
export const GetDateSpanDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDateSpan"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dateSpan"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"earliest"}},{"kind":"Field","name":{"kind":"Name","value":"latest"}}]}}]}}]} as unknown as DocumentNode<GetDateSpanQuery, GetDateSpanQueryVariables>;
export const GetPageSpanDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPageSpan"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageSpan"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"least"}},{"kind":"Field","name":{"kind":"Name","value":"most"}}]}}]}}]} as unknown as DocumentNode<GetPageSpanQuery, GetPageSpanQueryVariables>;
export const GetBooksReviewsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetBooksReviews"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"bookID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userUUID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookReviews"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"bookID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"bookID"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"avoidUserUUID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userUUID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reviews"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"UUID"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"at"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"UUID"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pagination"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isLastPage"}}]}}]}}]}}]} as unknown as DocumentNode<GetBooksReviewsQuery, GetBooksReviewsQueryVariables>;
export const GetYourBookReviewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetYourBookReview"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"bookID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userUUID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookReview"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"bookID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"bookID"}}},{"kind":"Argument","name":{"kind":"Name","value":"userUUID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userUUID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"UUID"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"at"}}]}}]}}]} as unknown as DocumentNode<GetYourBookReviewQuery, GetYourBookReviewQueryVariables>;
export const GetYourBookReviewsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetYourBookReviews"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userUUID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookReviews"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"focusUserUUID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userUUID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reviews"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"UUID"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"at"}},{"kind":"Field","name":{"kind":"Name","value":"book"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"coverImg"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pagination"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"isLastPage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"summary"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]}}]} as unknown as DocumentNode<GetYourBookReviewsQuery, GetYourBookReviewsQueryVariables>;
export const GetStatsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetStats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalBooks"}},{"kind":"Field","name":{"kind":"Name","value":"totalAuthors"}},{"kind":"Field","name":{"kind":"Name","value":"totalRatings"}}]}}]}}]} as unknown as DocumentNode<GetStatsQuery, GetStatsQueryVariables>;
export const GetUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"UUID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"secret"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"UUID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"UUID"}}},{"kind":"Argument","name":{"kind":"Name","value":"secret"},"value":{"kind":"Variable","name":{"kind":"Name","value":"secret"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"UUID"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"at"}},{"kind":"Field","name":{"kind":"Name","value":"wantToRead"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"haveRead"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<GetUserQuery, GetUserQueryVariables>;