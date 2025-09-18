import { GraphQLScalarType, Kind } from 'graphql';
import db from './db/connection.js';
import { Document } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

// Define interfaces and enums

export enum SortBy {
  Book = 'bookName',
  Author = 'authorName',
  Publisher = 'publisherName',
  wantToRead = 'wantToRead',
  haveRead = 'haveRead',
}

export enum SortOrder {
  Ascending = 'asc',
  Descending = 'desc',
}

interface SortInput {
  sortBy: SortBy;
  sortOrder: SortOrder;
}

interface FilterInput {
  search?: string;
  sortInput?: SortInput;
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
}

interface FilterCountInput {
  input?: FilterInput;
}

interface BooksQueryArgs {
  input?: FilterInput;
  sortInput?: SortInput;
  offset: number;
  limit: number;
}

interface BookQueryArgs {
  id: string;
}

interface UserQueryArgs {
  UUID: string;
}

interface BookReviewsQueryArgs {
  bookID: string;
  limit: number;
  offset: number;
  avoidUserUUID: string;
  focusUserUUID: string;
}

interface SingleBookReviewQueryArgs {
  bookID: string;
  userUUID: string;
}

interface BookReviewMutationArgs {
  userUUID: string;
  bookID: string;
  description: string;
  rating: number;
  secret: string;
}

interface UpdateBookReviewMutationArgs {
  reviewUUID: string;
  description: string;
  rating: number;
  secret: string;
}

interface UserQueryArgs {
  UUID: string;
  secret: string;
}

interface BookReviewsQueryArgs {
  bookID: string;
  limit: number;
  offset: number;
  avoidUserUUID: string;
  focusUserUUID: string;
}

interface SingleBookReviewQueryArgs {
  bookID: string;
  userUUID: string;
}

interface MongoBookFilters {
  $or?: { [key: string]: { $regex: RegExp } }[];
  publishDate?: { $lt?: Date; $gt?: Date };
  authors?: { $in: string[] };
  genres?: { $in: string[] };
  publisher?: { $in: string[] };
  pages?: { $gte?: number; $lte?: number };
  rating?: { $gte?: number };
}

interface UserDocument {
  UUID: string;
  name: string;
  at: Date;
  secret: string;
  wantToRead: string[];
  haveRead: string[];
}

/**
 * Counts documents in the 'books' collection with optional exclusions.
 *
 * This function builds an aggregation pipeline to count documents in the 'books' collection
 * based on the provided filters. It allows excluding specific filters from the count.
 *
 * @param {FilterInput} input - The filter criteria for counting documents.
 * @param {keyof FilterInput | null | 'publisher'} excludeField - The field to exclude from the filter criteria.
 * @returns {Promise<Array>} A promise that resolves to an array of count results.
 *
 * The function performs the following steps:
 * 1. Builds an initial pipeline without specific filters.
 * 2. Adds filters to the pipeline based on the input, excluding the specified field.
 * 3. If no field is excluded, counts all documents.
 * 4. If 'minRating' is excluded, counts documents for each rating from 0 to 5.
 * 5. If another field is excluded, groups and counts documents by that field.
 * 6. Executes the aggregation pipeline and returns the count results.
 */
const countWithExclusions = async (
  input: FilterInput,
  excludeField: keyof FilterInput | null | 'publisher',
) => {
  const pipeline = buildPipelineWithoutSpecificFilters(input);

  // Exclude specific filters by modifying the pipeline
  if (excludeField !== 'genres' && input.genres && input.genres.length > 0) {
    pipeline.push({ $match: { genres: { $in: input.genres } } });
  }
  if (excludeField !== 'authors' && input.authors && input.authors.length > 0) {
    pipeline.push({ $match: { authors: { $in: input.authors } } });
  }
  if (excludeField !== 'publisher' && input.publishers && input.publishers.length > 0) {
    pipeline.push({ $match: { publisher: { $in: input.publishers } } });
  }
  if (excludeField !== 'minRating' && input.minRating) {
    pipeline.push({ $match: { rating: { $gte: input.minRating } } });
  }

  if (excludeField === null) {
    pipeline.push({ $count: 'all' });
    return await db.collection('books').aggregate(pipeline).toArray();
  }

  if (excludeField === 'minRating') {
    pipeline.push(
      {
        $facet: {
          '0': [{ $match: { rating: { $gte: 0 } } }, { $count: 'count' }],
          '1': [{ $match: { rating: { $gte: 1 } } }, { $count: 'count' }],
          '2': [{ $match: { rating: { $gte: 2 } } }, { $count: 'count' }],
          '3': [{ $match: { rating: { $gte: 3 } } }, { $count: 'count' }],
          '4': [{ $match: { rating: { $gte: 4 } } }, { $count: 'count' }],
          '5': [{ $match: { rating: { $gte: 5 } } }, { $count: 'count' }],
        },
      },
      {
        $project: {
          ratings: {
            $concatArrays: [
              [
                {
                  $mergeObjects: [
                    { rating: '0' },
                    { count: { $ifNull: [{ $arrayElemAt: ['$0.count', 0] }, 0] } },
                  ],
                },
              ],
              [
                {
                  $mergeObjects: [
                    { rating: '1' },
                    { count: { $ifNull: [{ $arrayElemAt: ['$1.count', 0] }, 0] } },
                  ],
                },
              ],
              [
                {
                  $mergeObjects: [
                    { rating: '2' },
                    { count: { $ifNull: [{ $arrayElemAt: ['$2.count', 0] }, 0] } },
                  ],
                },
              ],
              [
                {
                  $mergeObjects: [
                    { rating: '3' },
                    { count: { $ifNull: [{ $arrayElemAt: ['$3.count', 0] }, 0] } },
                  ],
                },
              ],
              [
                {
                  $mergeObjects: [
                    { rating: '4' },
                    { count: { $ifNull: [{ $arrayElemAt: ['$4.count', 0] }, 0] } },
                  ],
                },
              ],
              [
                {
                  $mergeObjects: [
                    { rating: '5' },
                    { count: { $ifNull: [{ $arrayElemAt: ['$5.count', 0] }, 0] } },
                  ],
                },
              ],
            ],
          },
        },
      },
      {
        $unwind: '$ratings',
      },
      {
        $replaceRoot: { newRoot: '$ratings' },
      },
    );
  } else {
    pipeline.push(
      { $unwind: `$${excludeField}` },
      { $group: { _id: `$${excludeField}`, count: { $sum: 1 } } },
      { $project: { name: '$_id', count: 1, _id: 0 } },
      { $sort: { count: -1 } },
    );
  }

  const counts = await db.collection('books').aggregate(pipeline).toArray();
  return counts;
};

/**
 * Builds an aggregation pipeline without specific filters.
 *
 * This function constructs a MongoDB aggregation pipeline based on the provided filter criteria.
 * It handles date ranges, page ranges, sorting, and search functionality.
 *
 * @param {FilterInput} input - The filter criteria for building the pipeline.
 * @returns {Array<Document>} An array representing the MongoDB aggregation pipeline.
 *
 * The function performs the following steps:
 * 1. Initializes filters based on date and page ranges.
 * 2. Adds sorting to the pipeline based on the sort input.
 * 3. Adds search functionality using regular expressions.
 * 4. Returns the constructed pipeline.
 */
const buildPipelineWithoutSpecificFilters = ({
  search,
  sortInput,
  beforeDate,
  afterDate,
  minPages,
  maxPages,
  wantToReadListUserUUID,
  haveReadListUserUUID,
}: FilterInput) => {
  const filters: MongoBookFilters = {};

  if (beforeDate && afterDate) {
    filters.publishDate = {
      $lt: beforeDate,
      $gt: afterDate,
    };
  } else if (beforeDate) {
    filters.publishDate = { $lt: beforeDate };
  } else if (afterDate) {
    filters.publishDate = { $gt: afterDate };
  }
  if (minPages && maxPages) {
    filters.pages = { $gte: minPages, $lte: maxPages };
  } else if (minPages) {
    filters.pages = { $gte: minPages };
  } else if (maxPages) {
    filters.pages = { $lte: maxPages };
  }

  const pipeline: Document[] = [{ $match: filters }];

  if (sortInput) {
    const sortOrder = sortInput.sortOrder === SortOrder.Ascending ? 1 : -1;
    switch (sortInput.sortBy) {
      case SortBy.Book:
        pipeline.push({
          $sort: { title: sortOrder, _id: 1 },
        });
        break;
      case SortBy.Author:
        pipeline.push({
          $sort: { 'authors.0': sortOrder, _id: 1 },
        });
        break;
      case SortBy.Publisher:
        pipeline.push({
          $sort: { publisher: sortOrder, _id: 1 },
        });
        break;
      case SortBy.wantToRead:
        pipeline.push(
          ...[
            {
              $lookup: {
                from: 'users',
                pipeline: [
                  { $match: { UUID: wantToReadListUserUUID } },
                  { $project: { wantToRead: 1 } },
                ],
                as: 'userWantToRead',
              },
            },
            {
              $unwind: '$userWantToRead',
            },
            {
              $addFields: {
                orderIndex: { $indexOfArray: ['$userWantToRead.wantToRead', '$id'] },
              },
            },
            {
              $match: { orderIndex: { $ne: -1 } },
            },
            {
              $sort: { orderIndex: sortOrder },
            },
            {
              $project: {
                userWantToRead: 0,
                orderIndex: 0,
              },
            },
          ],
        );
        break;
      case SortBy.haveRead:
        pipeline.push(
          ...[
            {
              $lookup: {
                from: 'users',
                pipeline: [
                  { $match: { UUID: haveReadListUserUUID } },
                  { $project: { haveRead: 1 } },
                ],
                as: 'userHaveRead',
              },
            },
            {
              $unwind: '$userHaveRead',
            },
            {
              $addFields: {
                orderIndex: { $indexOfArray: ['$userHaveRead.haveRead', '$id'] },
              },
            },
            {
              $match: { orderIndex: { $ne: -1 } },
            },
            {
              $sort: { orderIndex: sortOrder },
            },
            {
              $project: {
                userHaveRead: 0,
                orderIndex: 0,
              },
            },
          ],
        );
        break;
    }
  }

  if (search) {
    const searchRegexSubString = new RegExp(search, 'i');
    const searchRegexWholeWords = new RegExp(`\\b${search}\\b`, 'i');
    filters.$or = [
      { title: { $regex: searchRegexSubString } },
      { description: { $regex: searchRegexWholeWords } },
    ];
  }

  return pipeline;
};

/**
 * GraphQL resolvers for handling various queries and mutations.
 * The resolvers handle data fetching, aggregation, and transformation logic.
 */
const resolvers = {
  Date: new GraphQLScalarType({
    name: 'Date',
    description:
      "A Date can be a string in the format 'YYYY-MM-DD' or a number representing the milliseconds since the Unix epoch (1970-01-01T00:00:00Z)",
    parseValue(value: string | number) {
      return new Date(value);
    },
    serialize(value: string) {
      return new Date(value);
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING && ast.value.match(/^\d+$/)) {
        return new Date(Number.parseInt(ast.value));
      }
      if (ast.kind === Kind.STRING || ast.kind === Kind.INT) {
        return new Date(ast.value);
      }
      return null;
    },
  }),

  Query: {
    /** Fetches all books matching filters, with sorting and pagination */
    async books(_, args: BooksQueryArgs) {
      const pipeline = buildPipelineWithoutSpecificFilters(args.input ?? {});

      if (args.input.authors && args.input.authors.length > 0) {
        pipeline.push({ $match: { authors: { $in: args.input.authors } } });
      }
      if (args.input.genres && args.input.genres.length > 0) {
        pipeline.push({ $match: { genres: { $in: args.input.genres } } });
      }
      if (args.input.publishers && args.input.publishers.length > 0) {
        pipeline.push({ $match: { publisher: { $in: args.input.publishers } } });
      }
      if (args.input.minRating) {
        pipeline.push({ $match: { rating: { $gte: args.input.minRating } } });
      }

      if (args.input.wantToReadListUserUUID && args.input.sortInput.sortBy !== 'wantToRead') {
        const matchingUser = await db
          .collection('users')
          .findOne({ UUID: args.input.wantToReadListUserUUID });
        const wantToReadList = matchingUser ? matchingUser.wantToRead : [];
        pipeline.push({ $match: { id: { $in: wantToReadList } } });
      }
      if (args.input.haveReadListUserUUID && args.input.sortInput.sortBy !== 'haveRead') {
        const matchingUser = await db
          .collection('users')
          .findOne({ UUID: args.input.haveReadListUserUUID });
        const haveReadList = matchingUser ? matchingUser.haveRead : [];
        pipeline.push({ $match: { id: { $in: haveReadList } } });
      }

      const totalBooks = (await countWithExclusions(args.input ?? {}, null))[0]?.all || 0;

      pipeline.push({ $skip: args.offset * args.limit });
      pipeline.push({ $limit: args.limit });

      const books = await db.collection('books').aggregate(pipeline).toArray();

      return {
        books,
        summary: {
          totalBooks,
        },
      };
    },

    /** Fetches counts for available filter options based on current filter selections */
    async filterCount(_, args: FilterCountInput) {
      const input = args.input ?? {};
      const genresCount = await countWithExclusions(input, 'genres');
      const authorsCount = await countWithExclusions(input, 'authors');
      const publishersCount = await countWithExclusions(input, 'publisher');
      const minRatingCount = await countWithExclusions(input, 'minRating');

      return {
        ratings: minRatingCount,
        genres: genresCount,
        authors: authorsCount,
        publishers: publishersCount,
      };
    },

    /** Fetches all authors in the database */
    async authors() {
      return (await db.collection('books').distinct('authors')).map((author) => ({ name: author }));
    },

    /** Fetches a specific book based on the ID */
    async book(_, { id }: BookQueryArgs) {
      return await db.collection('books').findOne({ id: id });
    },

    /** Fetches a specific user based on the UUID */
    async user(_, { UUID, secret }: UserQueryArgs) {
      const user = await db
        .collection('users')
        .findOne({ UUID: UUID, secret: secret }, { projection: { secret: 0 } });

      if (!user) {
        return;
      }

      const haveReadArray = await db
        .collection('books')
        .find({ id: { $in: user.haveRead } })
        .toArray();

      const wantToReadArray = await db
        .collection('books')
        .find({ id: { $in: user.wantToRead } })
        .toArray();

      return { ...user, wantToRead: wantToReadArray, haveRead: haveReadArray };
    },

    /** Fetches all reviews for a book. This is paginated and sorted desceding based on when the review was created.  */
    async bookReviews(
      _,
      { bookID, limit, offset, avoidUserUUID, focusUserUUID }: BookReviewsQueryArgs,
    ) {
      if (avoidUserUUID && bookID) {
        const total = await db
          .collection('reviews')
          .countDocuments({ bookID: bookID, userUUID: { $ne: avoidUserUUID } });

        const totalPages = Math.ceil(total / limit);
        const currentPage = offset + 1;
        const isLastPage = currentPage >= totalPages;
        const skip = offset * limit;

        const reviews = await db
          .collection('reviews')
          .aggregate([
            {
              $match: {
                bookID: bookID,
                userUUID: { $ne: avoidUserUUID },
                description: { $ne: '' },
              },
            },
            { $sort: { at: -1 } },
            { $skip: skip },
            { $limit: limit },
          ])
          .toArray();

        const book = await db.collection('books').findOne({ id: bookID });

        const finishedReviews = [];
        for (let i = 0; i < reviews.length; i++) {
          const review = reviews[i];
          const user = await db
            .collection('users')
            .findOne({ UUID: review.userUUID }, { projection: { secret: 0 } });

          finishedReviews.push({
            UUID: review.UUID,
            description: review.description,
            rating: review.rating,
            at: new Date(review.at),
            user: user,
            book: book,
          });
        }

        return {
          reviews: finishedReviews,
          pagination: {
            totalPages,
            currentPage,
            isLastPage,
          },
          summary: {
            total,
          },
        };
      }

      if (focusUserUUID) {
        const total = await db.collection('reviews').countDocuments({ userUUID: focusUserUUID });

        const totalPages = Math.ceil(total / limit);
        const currentPage = offset + 1;
        const isLastPage = currentPage >= totalPages;
        const skip = offset * limit;

        const reviews = await db
          .collection('reviews')
          .aggregate([
            { $match: { userUUID: focusUserUUID } },
            { $sort: { at: -1 } },
            { $skip: skip },
            { $limit: limit },
          ])
          .toArray();

        const user = await db
          .collection('users')
          .findOne({ UUID: focusUserUUID }, { projection: { secret: 0 } });

        const finishedReviews = [];
        for (let i = 0; i < reviews.length; i++) {
          const review = reviews[i];
          const book = await db.collection('books').findOne({ id: review.bookID });

          finishedReviews.push({
            UUID: review.UUID,
            description: review.description,
            rating: review.rating,
            at: new Date(review.at),
            book: book,
            user: user,
          });
        }

        return {
          reviews: finishedReviews,
          pagination: {
            totalPages,
            currentPage,
            isLastPage,
          },
          summary: {
            total,
          },
        };
      }

      const total = await db.collection('reviews').countDocuments();

      const totalPages = Math.ceil(total / limit);
      const currentPage = offset + 1;
      const isLastPage = currentPage >= totalPages;
      const skip = offset * limit;

      const reviews = await db
        .collection('reviews')
        .aggregate([{ $sort: { at: -1 } }, { $skip: skip }, { $limit: limit }])
        .toArray();

      const finishedReviews = [];
      for (let i = 0; i < reviews.length; i++) {
        const review = reviews[i];
        const user = await db
          .collection('users')
          .findOne({ UUID: review.userUUID }, { projection: { secret: 0 } });
        const book = await db.collection('books').findOne({ id: review.bookID });

        finishedReviews.push({
          UUID: review.UUID,
          description: review.description,
          rating: review.rating,
          at: new Date(review.at),
          book: book,
          user: user,
        });
      }

      return {
        reviews: finishedReviews,
        pagination: {
          totalPages,
          currentPage,
          isLastPage,
        },
        summary: {
          total,
        },
      };
    },

    /** Fetches a specific review */
    async bookReview(_, { bookID, userUUID }: SingleBookReviewQueryArgs) {
      const review = await db.collection('reviews').findOne({ bookID: bookID, userUUID: userUUID });

      if (review)
        return {
          UUID: review.UUID,
          description: review.description,
          rating: review.rating,
          at: new Date(review.at),
        };
      return;
    },

    /** Fetches all genres in the database */
    async genres() {
      return (await db.collection('books').distinct('genres')).map((genre) => ({
        name: genre,
      }));
    },

    /** Fetches all publishers in the database */
    async publishers() {
      return (await db.collection('books').distinct('publisher')).map((publisher) => ({
        name: publisher,
      }));
    },

    /** Fetches the earliest and latest publish dates of all books */
    async dateSpan() {
      const minDate = await db.collection('books').find().sort({ publishDate: 1 }).limit(1).next();
      const maxDate = await db.collection('books').find().sort({ publishDate: -1 }).limit(1).next();
      return {
        earliest: minDate?.publishDate,
        latest: maxDate?.publishDate,
      };
    },

    /** Fetches the least and most pages of all books */
    async pageSpan() {
      const minPages = await db.collection('books').find().sort({ pages: 1 }).limit(1).next();
      const maxPages = await db.collection('books').find().sort({ pages: -1 }).limit(1).next();
      return {
        least: minPages?.pages,
        most: maxPages?.pages,
      };
    },

    /** Fetches the total number of books, authors, and ratings */
    async stats() {
      return {}; // Uses the resolver in Stats, this makes it so if a field is not requested, then it is not calculated
    },

    /** Fetches a random book */
    async randomBook() {
      const randomBook = await db
        .collection('books')
        .aggregate([{ $sample: { size: 1 } }])
        .toArray();
      return randomBook[0] || null;
    },
  },

  /** Resolver for Stats. By doing this only the requested fields are calculated
   * (if we defined a function all would be calculated but only the requested would be returned, which is more inefficient)
   */
  Stats: {
    totalBooks: async () => {
      return await db.collection('books').countDocuments();
    },
    totalAuthors: async () => {
      return (await db.collection('books').distinct('publisher')).length;
    },
    totalRatings: async () => {
      const totalRatings = await db
        .collection('books')
        .aggregate([
          {
            $group: {
              _id: null,
              totalRatings: {
                $sum: {
                  $add: [
                    '$ratingsByStars.1',
                    '$ratingsByStars.2',
                    '$ratingsByStars.3',
                    '$ratingsByStars.4',
                    '$ratingsByStars.5',
                  ],
                },
              },
            },
          },
        ])
        .toArray();

      return totalRatings[0]?.totalRatings || 0;
    },
  },

  /** Resolver for Book */
  Book: {
    authors: async (book: { authors: string[] }) => {
      return book.authors.map((author) => ({ name: author }));
    },
    genres: async (book: { genres: string[] }) => {
      return book.genres.map((genre) => ({ name: genre }));
    },
    publisher: async (book: { publisher: string }) => {
      return { name: book.publisher };
    },
    numRatings: async (book: { ratingsByStars: { [x: number]: number } }) => {
      return Object.values(book.ratingsByStars).reduce((total, count) => total + count, 0);
    },
    ratingsByStars: async (book: { ratingsByStars: { [x: number]: number } }) => {
      return Object.values(book.ratingsByStars);
    },
  },

  Mutation: {
    /**
     * Creates a new user with a randomly generated name.
     *
     * This function generates a random name by combining a random adjective and a random noun
     * from the respective collections. It then creates a new user with this name, a unique UUID,
     * and initializes empty lists for 'wantToRead' and 'haveRead' books.
     */
    async createUser() {
      const collection = db.collection('users');

      // The user needs a secret so that we can authenticate that its them since we dont have passwords
      const secret = crypto.randomBytes(32).toString('hex');

      const randomAdjective = await db
        .collection('adjectives')
        .aggregate([{ $sample: { size: 1 } }])
        .toArray();

      const randomNoun = await db
        .collection('nouns')
        .aggregate([{ $sample: { size: 1 } }])
        .toArray();

      const randomName = randomAdjective[0].word + ' ' + randomNoun[0].word;

      const newUser = {
        UUID: uuidv4(),
        name: randomName,
        at: new Date(),
        wantToRead: [],
        haveRead: [],
        secret: secret,
      };

      await collection.insertOne(newUser);
      return newUser; // Return the created user
    },

    async updateUser(_, { input }: { input: { UUID: string; secret: string; name: string } }) {
      const { UUID, secret, name } = input;
      const updatedUser = await db
        .collection('users')
        .findOneAndUpdate(
          { UUID: UUID, secret: secret },
          { $set: { name: name } },
          { returnDocument: 'after' },
        );
      if (updatedUser.value) {
        return { success: true, message: 'Name successfully updated!', user: updatedUser.value };
      }
      return { success: false, message: 'Wrong user credentials!' };
    },

    async updateUserLibrary(
      _,
      {
        input,
      }: {
        input: {
          UUID: string;
          secret: string;
          wantToRead: string;
          haveRead: string;
          removeFromLibrary: string;
        };
      },
    ) {
      const { UUID, secret, wantToRead, haveRead, removeFromLibrary } = input;

      if (!wantToRead && !haveRead && !removeFromLibrary) {
        return { success: true, message: 'Nothing successfully changed' };
      }

      if (wantToRead) {
        const book = await db.collection('books').findOne({ id: wantToRead });
        if (!book) {
          return { success: false, message: 'wantToRead book doesnt exist!' };
        }
      }

      if (haveRead) {
        const book = await db.collection('books').findOne({ id: haveRead });
        if (!book) {
          return { success: false, message: 'haveRead book doesnt exist!' };
        }
      }

      if (removeFromLibrary) {
        const book = await db.collection('books').findOne({ id: removeFromLibrary });
        if (!book) {
          return { success: false, message: 'removeFromLibrary book doesnt exist!' };
        }
      }

      // Couldnt do pull and push in the same operation ):
      await db.collection<UserDocument>('users').findOneAndUpdate(
        { UUID: UUID, secret: secret },
        {
          $pull: {
            wantToRead: { $in: [haveRead, removeFromLibrary] },
            haveRead: { $in: [wantToRead, removeFromLibrary] },
          },
        },
      );

      const updateFields: { [key: string]: string } = {};
      if (haveRead) {
        updateFields.haveRead = haveRead;
      }
      if (wantToRead) {
        updateFields.wantToRead = wantToRead;
      }

      const updatedUser = await db.collection<UserDocument>('users').findOneAndUpdate(
        { UUID: UUID, secret: secret },
        {
          $push: updateFields,
        },
        { returnDocument: 'after' },
      );

      if (!updatedUser.value) {
        return { success: false, message: 'Wrong user credentials!' };
      }

      return {
        success: true,
        message: 'Library successfully updated!',
      };
    },

    /**
     * Creates a new review for a book.
     *
     * This function inserts a new review into the 'reviews' collection and updates the book's rating.
     * It calculates the new average rating for the book based on the updated ratings by stars.
     */
    async createReview(_, { input }: { input: BookReviewMutationArgs }) {
      const { userUUID, bookID, description, rating, secret } = input;

      const user = await db.collection('users').findOne({ UUID: userUUID, secret: secret });

      if (!user) {
        return { success: false, message: 'Wrong credentials!' };
      }

      const newReview = {
        UUID: uuidv4(),
        description: description,
        rating: rating,
        at: new Date(),
        userUUID: userUUID,
        bookID: bookID,
      };

      await db.collection('reviews').insertOne(newReview);

      const incKey = rating.toString();

      const result = await db.collection('books').findOneAndUpdate(
        { id: bookID },
        {
          $inc: {
            [`ratingsByStars.${incKey}`]: 1,
          },
        },
        {
          returnDocument: 'after',
        },
      );

      const updatedBook = result.value;

      const numRatings = Object.values(updatedBook.ratingsByStars).reduce(
        (total: number, count: number) => total + count,
        0,
      ) as number;

      const weightedSum = Object.entries(updatedBook.ratingsByStars).reduce(
        (sum, [key, count]: [string, number]) => {
          return sum + parseInt(key, 10) * count;
        },
        0,
      );

      const newRating = numRatings > 0 ? weightedSum / numRatings : 0;
      const finishedBook = await db.collection('books').findOneAndUpdate(
        { id: bookID },
        {
          $set: {
            rating: newRating,
          },
        },
        {
          returnDocument: 'after',
        },
      );

      return { book: finishedBook.value, success: true, message: 'Review successfully created!' };
    },

    /**
     * Updates an existing review for a book.
     *
     * This function updates the description and rating of a review in the 'reviews' collection.
     * It also updates the book's rating by incrementing the new rating and decrementing the old one.
     */
    async updateReview(_, { input }: { input: UpdateBookReviewMutationArgs }) {
      const { reviewUUID, description, rating, secret } = input;

      // Check that review exists
      const review = await db.collection('reviews').findOne({ UUID: reviewUUID });

      if (!review) {
        return { success: false, message: 'Review does not exist!' };
      }

      // Check that secret matches user that created the review
      const user = await db.collection('users').findOne({ UUID: review.userUUID, secret: secret });

      if (!user) {
        return { success: false, message: 'Wrong user credentials!' };
      }

      // Update review
      const oldReview = await db.collection('reviews').findOneAndUpdate(
        { UUID: reviewUUID },
        {
          $set: {
            description: description,
            rating: rating,
          },
        },
        {
          returnDocument: 'before',
        },
      );

      if (rating != oldReview.value.rating) {
        const incKey = rating.toString(); // Increment new rating
        const decKey = oldReview.value.rating.toString(); // Decrement old one

        const result = await db.collection('books').findOneAndUpdate(
          { id: oldReview.value.bookID },
          {
            $inc: {
              [`ratingsByStars.${incKey}`]: 1,
              [`ratingsByStars.${decKey}`]: -1,
            },
          },
          {
            returnDocument: 'after',
          },
        );

        const updatedBook = result.value;

        const numRatings = Object.values(updatedBook.ratingsByStars).reduce(
          (total: number, count: number) => total + count,
          0,
        ) as number;

        const weightedSum = Object.entries(updatedBook.ratingsByStars).reduce(
          (sum, [key, count]: [string, number]) => {
            return sum + parseInt(key, 10) * count;
          },
          0,
        );

        const newRating = numRatings > 0 ? weightedSum / numRatings : 0;
        const finishedBook = await db.collection('books').findOneAndUpdate(
          { id: oldReview.value.bookID },
          {
            $set: {
              rating: newRating,
            },
          },
          {
            returnDocument: 'after',
          },
        );

        return { book: finishedBook.value, success: true, message: 'Review updated!' };
      }
      return { success: true, message: 'Review updated!' };
    },
  },
};

export default resolvers;
