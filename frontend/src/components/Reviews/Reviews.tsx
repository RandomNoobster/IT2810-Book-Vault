import { useRef } from 'react';
import { BarChart } from '@mantine/charts';
import { Group, Stack, Text } from '@mantine/core';
import { Book } from '@/generated/graphql';
import BookReviews from '../BookReviews/BookReviews';
import { Ratings } from '../Ratings/Ratings';
import YourReviewHandler from '../YourReviewHandler/YourReviewHandler';

import '@mantine/charts/styles.css';

type ReviewProps = {
  book: Book;
};

/**
 * Comprehensive review section for a book, displaying ratings distribution chart,
 * user's review interface, and all book reviews.
 */
const Reviews = ({ book }: ReviewProps) => {
  // For scrolling to top when reaching bottom
  const topOfReviews = useRef<HTMLDivElement>(null);
  return (
    <Group justify="left" gap="lg" ref={topOfReviews}>
      <Stack gap="sm" w="100%">
        <Text size="xl" fw={700}>
          Reviews
        </Text>
        <Ratings book={book} justify="left" mt={0} />
        <BarChart
          h={200}
          valueFormatter={(value) => value.toLocaleString().replace(/,/g, ' ')}
          data={book.ratingsByStars
            .entries()
            .map(([key, value]) => ({ stars: key + 1, Ratings: value }))
            .toArray()
            .reverse()}
          dataKey="stars"
          orientation="vertical"
          yAxisLabel="Stars"
          yAxisProps={{ width: 40 }}
          xAxisLabel="Ratings"
          barProps={{ radius: 10 }}
          series={[{ name: 'Ratings', color: 'orange.5' }]}
          gridAxis="y"
        />
        <YourReviewHandler book={book} />
        <BookReviews bookId={book.id} top={topOfReviews} />
      </Stack>
    </Group>
  );
};

export default Reviews;
