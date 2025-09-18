import { ApolloError } from '@apollo/client';
import { IconBookOff } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { Grid, Group, Stack, Text } from '@mantine/core';
import { Book } from '@/generated/graphql';
import BookCard from '../BookCard/BookCard';
import BookListViewCard from '../BookListViewCard/BookListViewCard';
import Loading from '../Loading/Loading';
import styles from './BookCardGrid.module.css';

type BookCardGridProps = {
  books:
    | Pick<
        Book,
        'id' | 'title' | 'coverImg' | 'rating' | 'authors' | 'numRatings' | 'genres' | 'description'
      >[]
    | undefined;
  loading: boolean;
  error: ApolloError | undefined;
  viewType?: 'grid' | 'list';
};

/**
 * Displays a grid of book cards.
 */
const BookCardGrid = ({ books, loading, error, viewType = 'grid' }: BookCardGridProps) => {
  if (loading) {
    return <Loading />;
  }

  if (error || !books) {
    return (
      <Group justify="center" align="flex-start" className={styles.noResultWrapper}>
        <Group align="center">
          <IconBookOff />
          <Text size="xl" fw={500} my="xl">
            Error fetching books
          </Text>
        </Group>
      </Group>
    );
  }

  if (books.length === 0) {
    return (
      <Group justify="center" align="flex-start" className={styles.noResultWrapper}>
        <Group align="center">
          <IconBookOff />
          <Text size="xl" fw={500} my="xl">
            No books found
          </Text>
        </Group>
      </Group>
    );
  }

  if (viewType === 'list') {
    return (
      <Stack gap={20}>
        {books.map((book) => (
          <Link to={`/books/${book.id}`} className={styles.link} key={book.id}>
            <BookListViewCard book={book} />
          </Link>
        ))}
      </Stack>
    );
  }

  return (
    <>
      <Grid justify="center" display="inline-grid">
        {books.map((book) => (
          <Grid.Col key={book.id} span="content" className={styles.column}>
            <Link to={`/books/${book.id}`} className={styles.link}>
              <BookCard book={book} />
            </Link>
          </Grid.Col>
        ))}
      </Grid>
    </>
  );
};

export default BookCardGrid;
