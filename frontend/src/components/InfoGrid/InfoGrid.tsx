import { Grid, Paper, Text } from '@mantine/core';
import { Book } from '@/generated/graphql';
import styles from './InfoGrid.module.css';

type InfoGridProps = {
  book: Book;
};

/**
 * Displays book information in a grid layout.
 */
const InfoGrid = ({ book }: InfoGridProps) => {
  const tableInfos = [
    { header: 'Title', description: book.title },
    { header: 'Author', description: book.authors.map((author) => author.name).join(', ') },
    { header: 'Publisher', description: book.publisher.name },
    {
      header: 'Publish Date',
      description: new Date(book.publishDate).toLocaleDateString('en-UK', {
        month: 'long',
        year: 'numeric',
        day: 'numeric',
      }),
    },
    { header: 'Genres', description: book.genres.map((genre) => genre.name).join(', ') },
    { header: 'Pages', description: book.pages },
    { header: 'Format', description: book.bookFormat },
    {
      header: 'Characters',
      description:
        book.characters && book.characters.length > 0
          ? book.characters.join(', ')
          : 'No characters registered',
    },
    { header: 'ISBN', description: book.isbn },
    { header: 'Language', description: book.language },
  ];

  if (book.series) {
    tableInfos.push({ header: 'Series', description: book.series });
  }

  return (
    <Paper shadow="sm" radius="md" className={styles.paperBackground} p="xl" my="xl">
      <Grid grow>
        {tableInfos.map((info, index) => (
          <Grid.Col key={index} span={6}>
            <Text fw={700}>{info.header}</Text>
            <Text>{info.description}</Text>
          </Grid.Col>
        ))}
      </Grid>
    </Paper>
  );
};

export default InfoGrid;
