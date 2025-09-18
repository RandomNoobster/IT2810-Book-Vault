import { useEffect } from 'react';
import { ApolloError } from '@apollo/client/errors';
import { Box, Container, Text } from '@mantine/core';
import { Stats } from '@/generated/graphql';
import { useStats } from '@/hooks/useStats';
import { formatNumberWithSpaces } from '@/utils/formatting';
import styles from './StatsGroup.module.css';

type StatsType = Omit<Stats, '__typename'>;

const getField = (
  stats: StatsType | undefined,
  field: keyof StatsType,
  loading: boolean,
  error: ApolloError | undefined
): string => {
  if (loading) {
    return '. . .';
  }
  if (error || stats == null) {
    return '-';
  }
  return formatNumberWithSpaces(stats[field]);
};

/**
 * Displays key statistics about the book collection, including total books, authors, and ratings.
 * Automatically refreshes data on component mount.
 */
export const StatsGroup = () => {
  const { stats, loading, error, refetch } = useStats();

  // The data may have changed (e.g. num of reviews), therefore we need to refetch on initial load
  useEffect(() => {
    refetch();
  }, []);

  const data = [
    {
      title: 'Books in our collection',
      stats: getField(stats, 'totalBooks', loading, error),
      description:
        'Explore our vast collection of books, where every title opens the door to new adventures and ideas!',
    },
    {
      title: 'Authors featured',
      stats: getField(stats, 'totalAuthors', loading, error),
      description:
        'Immerse yourself in stories from a diverse set of authors, each bringing a unique perspective to our library.',
    },
    {
      title: 'Number of ratings',
      stats: getField(stats, 'totalRatings', loading, error),
      description:
        'With a massive collection of ratings, you have the insights you need to discover your next must-read.',
    },
  ];

  return (
    <Box className={styles.wrapper}>
      {data.map((stat, i) => (
        <Container key={i} className={styles.stat} aria-live="polite">
          <Text className={styles.count}>{stat.stats}</Text>
          <Text className={styles.title}>{stat.title}</Text>
          <Text className={styles.description}>{stat.description}</Text>
        </Container>
      ))}
    </Box>
  );
};
