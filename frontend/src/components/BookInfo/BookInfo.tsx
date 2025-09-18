import { useEffect, useState } from 'react';
import { IconBook, IconBook2, IconBookOff } from '@tabler/icons-react';
import {
  Center,
  Flex,
  Grid,
  Group,
  Image,
  rem,
  SegmentedControl,
  Spoiler,
  Stack,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useUser } from '@/contexts/UserFunctions';
import { Book } from '@/generated/graphql';
import { updateUserLibrary } from '@/hooks/updateUserLibrary';
import InfoGrid from '../InfoGrid/InfoGrid';
import { Ratings } from '../Ratings/Ratings';

type BookInfoProps = {
  book: Book;
};

/**
 * Displays detailed information about a book including cover image, title, authors, and metadata.
 */
const BookInfo = ({ book }: BookInfoProps) => {
  const { submitUpdate, success, message, loading, error } = updateUserLibrary();
  const { info, secret } = useUser();

  useEffect(() => {
    if (!loading && message && typeof success === 'boolean') {
      notifications.show({
        title: success ? 'Success!' : 'Error!',
        message,
        color: success ? 'blue' : 'red',
        autoClose: 5000,
      });
    }
  }, [message, success, loading]);

  const findPlaceInLibrary = () => {
    if (info.wantToRead && info.wantToRead.length > 0) {
      const exists = info.wantToRead.some((item) => item.id === book.id);
      if (exists) {
        return 'wantToRead';
      }
    }

    if (info.haveRead && info.haveRead.length > 0) {
      const exists = info.haveRead.some((item) => item.id === book.id);
      if (exists) {
        return 'haveRead';
      }
    }

    return 'notInLibrary';
  };

  const [where, setWhere] = useState(findPlaceInLibrary);
  const [oldWhere, setOldWhere] = useState(findPlaceInLibrary);

  useEffect(() => {
    if (where !== findPlaceInLibrary()) {
      if (where === 'wantToRead') {
        submitUpdate({ UUID: info.UUID, secret, wantToRead: book.id });
      } else if (where === 'haveRead') {
        submitUpdate({ UUID: info.UUID, secret, haveRead: book.id });
      } else {
        submitUpdate({ UUID: info.UUID, secret, removeFromLibrary: book.id });
      }
    }
  }, [where]);

  useEffect(() => {
    if (!loading) {
      setWhere(findPlaceInLibrary);
      setOldWhere(findPlaceInLibrary);
    }
  }, [info.haveRead, info.wantToRead]);

  useEffect(() => {
    if (error) {
      setWhere(oldWhere);
    }
  }, [error]);

  const theme = useMantineTheme();
  const isDesktop = useMediaQuery(`(min-width: ${theme.breakpoints.sm})`);

  return (
    <Group justify="center" gap="lg">
      <Grid justify="left" align="top">
        <Grid.Col span={{ xs: 12, sm: 4, md: 4, lg: 4, xl: 4 }} mah={400}>
          <Image
            src={book.coverImg}
            alt={`Cover image for ${book.title}`}
            fit="contain"
            fallbackSrc="https://placehold.co/200x300?text=Cover%20image%20for%20book"
            radius="lg"
            sizes="xs"
            w="fit-content"
            maw="100%"
            mah="100%"
            m="auto"
          />
        </Grid.Col>
        <Grid.Col span="auto">
          <Flex gap="sm" justify="center" align="center" direction="row" wrap="wrap">
            <Stack align="center" gap={4}>
              <Text size="lg" fw={700} component="h1">
                {book.title}
              </Text>
              <Text size="md" c="dimmed">
                {book.authors.length > 0 && book.authors[0].name}{' '}
                {book.authors.length > 1 ? 'et al.' : ''}
              </Text>
              <Text ta="center">
                {book.genres
                  .map((genre) => genre.name)
                  .slice(0, 3)
                  .join(', ')}
                {book.genres.length > 3 ? '...' : null}
              </Text>

              <Ratings book={book} justify="center" mt={0} />
            </Stack>

            <Spoiler maxHeight={250} hideLabel="Show less" showLabel="Show more">
              <Text>{book.description}</Text>
            </Spoiler>
          </Flex>
        </Grid.Col>

        <Grid.Col span={12}>
          {isDesktop !== undefined && (
            <SegmentedControl
              data-orientation={isDesktop ? 'horizontal' : 'vertical'}
              fullWidth
              value={where}
              onChange={setWhere}
              color="blue"
              disabled={loading}
              data={[
                {
                  label: (
                    <Center style={{ gap: 10 }} color="blue">
                      <IconBookOff style={{ width: rem(16), height: rem(16) }} />
                      <Text>{where === 'notInLibrary' ? 'Unmarked' : 'Unmark'}</Text>
                    </Center>
                  ),
                  value: 'notInLibrary',
                },
                {
                  label: (
                    <Center style={{ gap: 10 }} color="blue">
                      <IconBook style={{ width: rem(16), height: rem(16) }} />
                      <Text>
                        {where === 'wantToRead' ? 'In reading list' : 'Add to reading list'}
                      </Text>
                    </Center>
                  ),
                  value: 'wantToRead',
                },
                {
                  label: (
                    <Center style={{ gap: 10 }} color="blue">
                      <IconBook2 style={{ width: rem(16), height: rem(16) }} />
                      <Text>{where === 'haveRead' ? 'Have read' : 'Mark as read'}</Text>
                    </Center>
                  ),
                  value: 'haveRead',
                },
              ]}
            />
          )}
          {isDesktop === undefined && (
            <SegmentedControl
              data-orientation="horizontal"
              fullWidth
              value="loading"
              disabled
              data={[
                {
                  label: (
                    <Center style={{ gap: 10 }} color="gray">
                      <IconBookOff style={{ width: rem(16), height: rem(16) }} />
                      <Text>Loading...</Text>
                    </Center>
                  ),
                  value: 'loading',
                },
              ]}
            />
          )}
        </Grid.Col>

        <InfoGrid book={book} />
      </Grid>
    </Group>
  );
};

export default BookInfo;
