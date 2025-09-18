import { Card, Flex, Grid, Image, Rating, Stack, Text } from '@mantine/core';
import { Review as ReviewType } from '@/generated/graphql';
import styles from './BookReviewCard.module.css';

type ReviewProps = {
  review: ReviewType;
};

/**
 * Card component that displays a single book review with rating and description.
 */
const BookReviewCard = ({ review }: ReviewProps) => {
  if (!review.book) {
    return <Text>Type of ReviewCard is set to bookReview, but user not set</Text>;
  }

  return (
    <Card p={30} radius="lg" className={styles.card} m="auto">
      <Grid align="center">
        <Grid.Col span="content" h={200} className={styles.img}>
          <Image
            src={review.book.coverImg}
            alt={`Cover image for ${review.book.title}`}
            fallbackSrc="https://placehold.co/200x300?text=Cover%20image%20for%20book"
            radius="lg"
            fit="contain"
            w="fit-content"
            maw="100%"
            mah="100%"
            m="auto"
          />
        </Grid.Col>

        <Grid.Col span="auto">
          <Grid justify="flex-start">
            <Grid.Col span="content">
              <Stack gap={0}>
                <Text fw={600} component="h4" lineClamp={2} className={styles.bookTitle}>
                  {`Review of ${review.book.title}`}
                </Text>
                <Text fw={500} size="sm" fs="italic" lineClamp={2}>
                  {new Date(review.at).toDateString()}
                </Text>
              </Stack>
            </Grid.Col>
            <Grid.Col span={12}>
              <Flex justify="left" align="center" gap={7} mt="xs">
                <Rating
                  value={review.rating}
                  fractions={2}
                  readOnly
                  size={review.description && review.description !== '' ? 'md' : 'xl'}
                />
                <Text size={review.description && review.description !== '' ? 'md' : 'xl'}>
                  {review.rating.toFixed(1)}
                </Text>
              </Flex>
            </Grid.Col>
            {review.description && review.description !== '' ? (
              <Grid.Col span={12}>
                <Text lineClamp={5}>{review.description}</Text>
              </Grid.Col>
            ) : (
              <></>
            )}
          </Grid>
        </Grid.Col>
      </Grid>
    </Card>
  );
};

export default BookReviewCard;
