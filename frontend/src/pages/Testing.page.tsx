import { Link } from 'react-router-dom';
import { Button, Card, Flex, Stack, Text } from '@mantine/core';
import { useUser } from '@/contexts/UserFunctions';
import styles from './Testing.module.css';

const Testing = () => {
  const genNewUser = () => {
    localStorage.removeItem('UUID');
    localStorage.removeItem('secret');
    window.location.reload();
  };

  return (
    <Stack gap="lg">
      <Text size="xl" fw={700}>
        About this page
      </Text>
      <Text size="md">
        This page is for adding different funcitons that is useful for testers so that they can more
        easily test the application to give better feedback.
      </Text>
      <Flex wrap="wrap" direction="row" justify="flex-start" align="flex-start" gap="xl">
        <Card p={30} radius="lg" className={styles.card} m="auto">
          <Stack justify="center">
            <Text size="lg" fw={700}>
              User
            </Text>
            <Text size="lg">Username: {useUser().info.name}</Text>
            <Button autoContrast color="cyan.4" onClick={genNewUser}>
              New user
            </Button>
          </Stack>
        </Card>

        <Card p={30} radius="lg" className={styles.card} m="auto">
          <Stack justify="center">
            <Text size="lg" fw={700}>
              For book reviews
            </Text>
            <Text size="lg">Visit a book with many reviews</Text>
            <Link to="/books/2767052-the-hunger-games">
              <Button autoContrast className={styles.testButton} color="lime.5">
                Go to bookpage
              </Button>
            </Link>
          </Stack>
        </Card>

        <Card p={30} radius="lg" className={styles.card} m="auto">
          <Stack justify="center">
            <Text size="lg" fw={700}>
              Another test component
            </Text>
            <Text size="lg">That currently does nothing</Text>
            <Button color="gray">Nothing</Button>
          </Stack>
        </Card>
      </Flex>
    </Stack>
  );
};

export default Testing;
