import { IconStarsOff } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { Grid, Group, Text } from '@mantine/core';
import { Review } from '@/generated/graphql';
import ReviewCard from '../ReviewCard/ReviewCard';
import styles from './ReviewStack.module.css';

type ReviewProps = {
  reviews?: Review[];
  type: 'profileReview' | 'bookReview' | 'yourReview';
};

/**
 * Renders a stack of review cards with different layouts based on the review type.
 * Supports profile reviews, book reviews, and user reviews.
 */
const ReviewStack = ({ reviews, type }: ReviewProps) => {
  if (!reviews || reviews.length === 0) {
    return (
      <Group justify="center" align="center" className={styles.noResultWrapper}>
        <IconStarsOff />
        <Text size="xl" fw={700} my="xl">
          No reviews found
        </Text>
      </Group>
    );
  }

  return (
    <>
      <Grid my="xs" gutter="md" data-testid={`${type}-stack`}>
        {reviews.map((review, index) => (
          <Grid.Col key={index} span={{ base: 12 }}>
            {type === 'bookReview' ? (
              <Link
                to={`/books/${review.book?.id}`}
                className={styles.link}
                aria-label={`Go to the book ${review.book?.title}`}
              >
                <ReviewCard review={review} type={type} />
              </Link>
            ) : (
              <ReviewCard review={review} type={type} />
            )}
          </Grid.Col>
        ))}
      </Grid>
    </>
  );
};

export default ReviewStack;
