import { Card, Flex, Grid, Rating, Stack, Text } from '@mantine/core';
import { Review as ReviewType } from '@/generated/graphql';
import styles from './YourReviewCard.module.css';

type ReviewProps = {
  review: ReviewType;
};

/**
 * Displays a user's own review in a card format, showing rating, date, and review text.
 */
const YourReviewCard = ({ review }: ReviewProps) => {
  return (
    <Card p={30} radius="lg" className={styles.card} m="auto">
      <Grid>
        <Grid.Col span="auto">
          <Grid justify="flex-start">
            <Grid.Col span="content">
              <Stack gap={0}>
                <Text fw={600} component="h4" lineClamp={2} className={styles.bookTitle}>
                  Your review
                </Text>
                <Text fw={500} size="sm" fs="italic" lineClamp={2}>
                  {new Date(review.at).toDateString()}
                </Text>
              </Stack>
            </Grid.Col>
            <Grid.Col span="content">
              <Flex justify="center" align="center" gap={7} mt="xs">
                <Rating value={review.rating} fractions={2} readOnly />
                <Text fw={500}>{review.rating.toFixed(1)}</Text>
              </Flex>
            </Grid.Col>
            {review.description && review.description !== '' ? (
              <Grid.Col span={12}>
                <Text>{review.description}</Text>
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

export default YourReviewCard;
