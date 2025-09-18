import { Property } from 'csstype';
import { Card, Image, Text } from '@mantine/core';
import { Book } from '@/generated/graphql';
import { Ratings } from '../Ratings/Ratings';
import styles from './BookCard.module.css';

type BookCardProps = {
  book: Pick<Book, 'id' | 'title' | 'coverImg' | 'rating' | 'authors' | 'numRatings'>;
  w?: Property.Width;
};

/**
 * Card component that displays basic book information including cover, title, author and rating.
 * This component is used in the BookCardGrid component.
 */
const BookCard = ({ book, w = '190' }: BookCardProps) => {
  return (
    <Card p={30} radius="lg" className={styles.card} m="auto" w={w}>
      <Card.Section h={200}>
        <Image
          src={book.coverImg}
          alt={`Cover image for ${book.title}`}
          fallbackSrc="https://placehold.co/200x300?text=Cover%20image%20for%20book"
          radius="lg"
          fit="contain"
          w="fit-content"
          maw="100%"
          mah="100%"
          m="auto"
          key={book.id}
        />
      </Card.Section>
      <Card.Section mt="xs" h={50}>
        <Text fw={600} lineClamp={2} title={book.title} className={styles.bookTitle}>
          {book.title}
        </Text>
        <Text
          size="xs"
          c="dimmed"
          lineClamp={1}
          title={book.authors.map((author) => author.name).join(', ')}
          className={styles.bookAuthor}
        >
          {book.authors.length > 0 && book.authors[0].name}{' '}
          {book.authors.length > 1 ? 'et al.' : ''}
        </Text>
      </Card.Section>
      <Card.Section mt="xs" className={styles.ratingSection}>
        <Ratings size="xs" book={book} verbose={false} />
      </Card.Section>
    </Card>
  );
};

export default BookCard;
