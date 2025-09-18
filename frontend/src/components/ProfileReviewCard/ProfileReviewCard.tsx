import { Avatar, Card, Flex, Grid, Rating, Stack, Text } from '@mantine/core';
import { Review as ReviewType } from '@/generated/graphql';
import { formatAvatarAbbreviation } from '@/utils/formatting';
import styles from './ProfileReviewCard.module.css';

type ReviewProps = {
  review: ReviewType;
};

/**
 * Displays a user's review with their avatar, name, rating, and review description.
 */
const ProfileReviewCard = ({ review }: ReviewProps) => {
  if (!review.user) {
    return <Text>Type of ReviewCard is set to profileReview, but user not set</Text>;
  }

  return (
    <Card p={30} radius="lg" className={styles.card} m="auto">
      <Grid>
        <Grid.Col span="auto">
          <Grid justify="flex-start">
            <Grid.Col span="content">
              <Avatar color="blue">
                {review.user.name && formatAvatarAbbreviation(review.user.name)}
              </Avatar>
            </Grid.Col>
            <Grid.Col span="content">
              <Stack gap={0}>
                <Text fw={600} component="h4" lineClamp={2} className={styles.bookTitle}>
                  {review.user && review.user.name}
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

export default ProfileReviewCard;
