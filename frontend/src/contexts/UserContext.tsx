import { createContext, ReactNode, useEffect } from 'react';
import { Button, Flex, Loader, Stack, Text } from '@mantine/core';
import { User } from '@/generated/graphql';
import { makeUser } from '@/hooks/makeUser';
import { useUserHook } from '@/hooks/useUserHook';
import styles from './userContext.module.css';

/**
 * Interface defining the shape of the UserContext value
 */
interface UserContextProps {
  info: User;
  secret: string;
}

/**
 * Generates a new user by clearing localStorage and reloading the page
 */
const genNewUser = () => {
  localStorage.removeItem('UUID');
  localStorage.removeItem('secret');
  window.location.reload();
};

export const UserContext = createContext<UserContextProps | undefined>(undefined);

/**
 * Context Provider for the UserContext. This component fetches the user data from the database and makes it available to the rest of the app.
 */
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const UUID = localStorage.getItem('UUID');
  const secret = localStorage.getItem('secret');
  const { createUser, loading: loadingCreateUser, error: errorCreateUser } = makeUser();
  const { user, loading, error } = useUserHook({ UUID, secret });

  useEffect(() => {
    if (!UUID || !secret) {
      createUser()
        .then((response) => {
          const createdUser = response.data?.createUser;
          if (createdUser?.UUID && createdUser.secret) {
            localStorage.setItem('UUID', createdUser.UUID);
            localStorage.setItem('secret', createdUser.secret);
          }
        })
        .catch((e: Error) => {
          // Will also trigger errorCreateUser to be an error, because of how Apollo works
          console.error('Error during user creation:', e);
        });
    }
  }, [UUID, secret]);

  if (loading || loadingCreateUser) {
    return (
      <Flex justify="center" align="center" className={styles.centeredOnPage}>
        <Stack align="center">
          <Text size="lg" component="h1">
            Fetching user data
          </Text>
          <Loader />
        </Stack>
      </Flex>
    );
  }

  if (errorCreateUser) {
    return (
      <Flex justify="center" align="center" className={styles.centeredOnPage}>
        <Stack align="center">
          <Text c="red" size="lg">
            Error creating new user
          </Text>
        </Stack>
      </Flex>
    );
  }

  if (!secret) {
    return (
      <Flex justify="center" align="center" className={styles.centeredOnPage}>
        <Stack align="center">
          <Text c="red" size="lg">
            Missing credentials
          </Text>
          <Flex w="30rem">
            <Text size="lg" ta="center">
              You have missing credentials. Would you like to create a new user?
            </Text>
          </Flex>
          <Button onClick={genNewUser}>New user</Button>
        </Stack>
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex justify="center" align="center" className={styles.centeredOnPage}>
        <Stack align="center">
          <Text c="red" size="lg">
            Error fetching user data
          </Text>
        </Stack>
      </Flex>
    );
  }

  if (!user) {
    return (
      <Flex justify="center" align="center" className={styles.centeredOnPage}>
        <Stack align="center">
          <Text c="red" size="lg">
            Error fetching user data
          </Text>
          <Flex w="30rem">
            <Text size="lg" ta="center">
              This error may be caused by the user your UUID reference having been removed from the
              database. Would you like to create a new user?
            </Text>
          </Flex>
          <Button onClick={genNewUser}>New user</Button>
        </Stack>
      </Flex>
    );
  }

  return (
    <UserContext.Provider value={{ info: user as User, secret }}>{children}</UserContext.Provider>
  );
};
