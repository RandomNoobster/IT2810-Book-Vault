import { Property } from 'csstype';
import { abbreviateNumber } from 'js-abbreviation-number';
import { Flex, MantineSize, MantineSpacing, Rating, Text } from '@mantine/core';
import { Book } from '@/generated/graphql';
import { formatNumberWithSpaces } from '@/utils/formatting';

interface RatingsProps {
  book: Pick<Book, 'rating' | 'numRatings'>;
  size?: MantineSize;
  verbose?: boolean;
  justify?: Property.JustifyContent;
  mt?: MantineSpacing;
}

/**
 * Displays a book's rating with stars and the number of ratings.
 * Supports verbose and abbreviated number formats.
 */
export const Ratings = ({
  book,
  verbose = true,
  size = 'md',
  justify = 'left',
  mt = 'xs',
}: RatingsProps) => {
  return (
    <Flex justify={justify} gap={5} mt={mt} wrap="wrap" align="center">
      <Rating value={Math.round(book.rating * 2) / 2} fractions={2} readOnly size={size} />
      <Text fw={500} size={size}>
        {book.rating.toFixed(1)}
      </Text>
      <Text c="dimmed" size={size}>
        ({verbose ? formatNumberWithSpaces(book.numRatings) : abbreviateNumber(book.numRatings)}
        {verbose ? (book.numRatings === 1 ? ' rating' : ' ratings') : ''})
      </Text>
    </Flex>
  );
};
