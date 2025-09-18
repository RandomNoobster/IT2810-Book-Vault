import { useEffect, useState } from 'react';
import { IconBook, IconBook2, IconBooks, IconStars } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import {
  Avatar,
  Button,
  Container,
  Divider,
  Group,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import BookCardGrid from '@/components/BookCardGrid/BookCardGrid';
import Loading from '@/components/Loading/Loading';
import { useUser } from '@/contexts/UserFunctions';
import { Review, SortBy, SortOrder } from '@/generated/graphql';
import { updateUser } from '@/hooks/updateUser';
import { useBooks } from '@/hooks/useBooks';
import { useYourBookReviews } from '@/hooks/useYourBookReviews';
import { formatAvatarAbbreviation } from '@/utils/formatting';
import ReviewStack from '../components/ReviewStack/ReviewStack';
import styles from './UserProfile.module.css';

/**
 * ProfilePage component displays the user's profile information and allows editing the user's name.
 * It also shows a list of the user's recent book reviews.
 */
export function ProfilePage() {
  const { info, secret } = useUser();

  const [newName, setNewName] = useState(info.name || '');
  const [isEditing, setIsEditing] = useState(false);
  const [inputError, setInputError] = useState('');

  const { submitUpdate, success, message, loading: updateNameLoading } = updateUser();
  const { reviews, totalReviews, loading, error } = useYourBookReviews({
    limit: 3,
    page: 1,
    userUUID: info.UUID,
  });

  const {
    books: wantToRead,
    totalBooks: totalWantToRead,
    loading: wantToReadLoading,
    error: wantToReadError,
  } = useBooks({
    limit: 3,
    page: 1,
    sortBy: SortBy.WantToRead,
    sortOrder: SortOrder.Desc,
    wantToReadListUserUUID: info.UUID,
  });

  const {
    books: haveRead,
    totalBooks: totalHaveRead,
    loading: haveReadLoading,
    error: haveReadError,
  } = useBooks({
    limit: 3,
    page: 1,
    sortBy: SortBy.HaveRead,
    sortOrder: SortOrder.Desc,
    haveReadListUserUUID: info.UUID,
  });

  useEffect(() => {
    if (!updateNameLoading && message && typeof success === 'boolean') {
      notifications.show({
        title: success ? 'Success!' : 'Error!',
        message,
        color: success ? 'blue' : 'red',
        autoClose: 5000,
      });
    }
  }, [message, success, updateNameLoading]);

  useEffect(() => {
    setNewName(info.name || '');
  }, [info.name]);

  const handleNameChange = () => {
    if (newName.length < 2) {
      setInputError(`Name must be at least 2 characters, the current length is ${newName.length}`);
      return;
    }
    if (newName.length > 50) {
      setInputError(
        `Name must be less than 50 characters, the current length is ${newName.length}`
      );
      return;
    }
    submitUpdate({ name: newName, UUID: info.UUID, secret });
    setIsEditing(false);
    setInputError('');
  };

  return (
    <Container size="sm" my="xl" p={0}>
      <Stack align="center">
        <Avatar size={100} radius="xl">
          {formatAvatarAbbreviation(newName)}
        </Avatar>
        <Text ta="center" size="lg" mt="sm">
          {info.name}
        </Text>

        {isEditing ? (
          <>
            <TextInput
              value={newName}
              onChange={(event) => setNewName(event.target.value)}
              placeholder="Enter new name"
              label="Name"
              autoFocus
              mb="md"
              error={inputError}
              w="75%"
            />
            <Button w="75%" radius="md" onClick={handleNameChange} mt="md">
              Save
            </Button>
          </>
        ) : (
          <Button
            w="75%"
            radius="md"
            size="md"
            variant="default"
            onClick={() => setIsEditing(true)}
            mt="md"
          >
            Edit Name
          </Button>
        )}

        <Group align="center">
          <IconBooks className={styles.icon} />
          <Title order={1} my="xl" size="h2">
            Your library
          </Title>
        </Group>

        <Divider
          size="xs"
          label={
            <Group align="center">
              <IconBook className={`${styles.icon} ${styles.desktopIcon}`} />
              <Title order={2} fw={500} my="xl" size="h3">
                Books you want to read
              </Title>
            </Group>
          }
          labelPosition="center"
          w="100%"
        />

        <BookCardGrid
          books={wantToRead}
          loading={wantToReadLoading}
          error={wantToReadError}
          viewType="grid"
        />

        {(totalWantToRead ?? 0) > 3 && (
          <Link to="/profile/wantToRead" className={styles.link}>
            <Button fullWidth radius="md" mt="md">
              View all
            </Button>
          </Link>
        )}

        <Divider
          size="xs"
          label={
            <Group align="center">
              <IconBook2 className={`${styles.icon} ${styles.desktopIcon}`} />
              <Title order={2} fw={500} my="xl" size="h3">
                Recently read books
              </Title>
            </Group>
          }
          labelPosition="center"
          w="100%"
        />

        <BookCardGrid
          books={haveRead}
          loading={haveReadLoading}
          error={haveReadError}
          viewType="grid"
        />
        {(totalHaveRead ?? 0) > 3 && (
          <Link to="/profile/haveRead" className={styles.link}>
            <Button fullWidth radius="md" mt="md">
              View all
            </Button>
          </Link>
        )}

        <Group align="center">
          <IconStars className={styles.icon} />
          <Title order={1} my="xl" size="h2">
            Your reviews
          </Title>
        </Group>

        {loading ? (
          <Loading />
        ) : error ? (
          <Text ta="center" c="red">
            Error fetching reviews
          </Text>
        ) : (
          <>
            <ReviewStack reviews={reviews as Review[]} type="bookReview" />
            {(totalReviews ?? 0) > 3 && (
              <Link to="/profile/myReviews" className={styles.link}>
                <Button fullWidth radius="md" mt="md">
                  View all
                </Button>
              </Link>
            )}
          </>
        )}
      </Stack>
    </Container>
  );
}

export default ProfilePage;
