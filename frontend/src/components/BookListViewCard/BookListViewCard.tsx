import { Card, Flex, Image, Stack, Text } from '@mantine/core';
import { Book } from '@/generated/graphql';
import { Ratings } from '../Ratings/Ratings';
import styles from './BookListViewCard.module.css';

type BookListViewCardProps = {
  book: Pick<
    Book,
    'id' | 'title' | 'coverImg' | 'rating' | 'authors' | 'numRatings' | 'genres' | 'description'
  >;
};

const BookListViewCard = ({ book }: BookListViewCardProps) => {
  return (
    <Card p="md" radius="lg" className={`${styles.card}`}>
      <Flex direction="row" gap="lg" className={styles.contentContainer}>
        <Image
          src={book.coverImg}
          alt={`Cover image for ${book.title}`}
          fallbackSrc="https://placehold.co/200x300?text=Cover%20image%20for%20book"
          radius="lg"
          fit="contain"
          w="100%"
          maw={300}
          mah={190}
          key={book.id}
        />
        <Stack gap="xs">
          <Text fw={600} component="h4">
            {book.title}
          </Text>
          <Text size="sm" c="dimmed" title={book.authors.map((author) => author.name).join(', ')}>
            {book.authors.map((author) => author.name).join(', ')}
          </Text>
          <Text size="sm">{book.genres.map((genre) => genre.name).join(', ')}</Text>
          <Ratings size="xs" book={book} verbose mt={0} />
          <Text size="sm" lineClamp={3}>
            {book.description}
          </Text>
        </Stack>
      </Flex>
    </Card>
  );
};

export default BookListViewCard;
