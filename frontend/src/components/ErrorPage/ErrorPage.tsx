import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom';
import {
  Button,
  Center,
  Code,
  Collapse,
  Container,
  Group,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Illustration404 } from './Illustration404';
import styles from './ErrorPage.module.css';

type ErrorPageProps = {
  title?: string;
  description?: string;
  link?: string;
};

/**
 * Error page component that handles different types of errors and displays appropriate messages.
 * If the error is a 404, it will display a 404 error page with a message and a link to the home page.
 */
export function ErrorPage({ title, description, link }: ErrorPageProps) {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return <Error404 title={title} description={description} link={link} />;
  }

  return <ErrorUnexpectedError error={error as Error} />;
}

/** Default error page. Displays error code and stack trace. */
const ErrorUnexpectedError = ({ error }: { error: Error }) => {
  const [opened, { toggle }] = useDisclosure(true);

  const errorMessage = error?.message || 'Unknown error';
  const errorStack = error?.stack || 'No stack trace available';

  return (
    <Container className={styles.container}>
      <Container className={styles.content}>
        <Title className={styles.title}>Unexpected Application Error!</Title>
        <Text c="dimmed" size="lg" ta="center" className={styles.description}>
          Something went wrong, please try again.
        </Text>
        <Center>
          <Link to="/" reloadDocument>
            <Button size="md">Take me back to safe ground</Button>
          </Link>
        </Center>
        <Center mt="xl">
          <Stack align="center">
            <Button onClick={toggle} w="fit-content">
              {opened ? 'Hide' : 'Open'} error message
            </Button>
            <Collapse in={opened}>
              <Code block mt="sm">
                {errorMessage}
              </Code>
              <Code block mt="sm" data-testid="stackTrace">
                {errorStack}
              </Code>
            </Collapse>
          </Stack>
        </Center>
      </Container>
    </Container>
  );
};

/**
 * 404 error page component.
 * You can customize the title, description, and link to redirect the user to a different page.
 */
export const Error404 = ({
  title = 'Nothing to see here',
  description = 'The page you are trying to open does not exist. You may have mistyped the address, or the page has been moved to another URL.',
  link = '/',
}: ErrorPageProps) => {
  return (
    <Container className={styles.container}>
      <Illustration404 className={styles.image} />
      <Container className={styles.content}>
        <Title className={styles.title}>{title}</Title>
        <Text c="dimmed" size="lg" ta="center" className={styles.description}>
          {description}
        </Text>
        <Group justify="center">
          <Link to={link} reloadDocument>
            <Button size="md">Take me back to safe ground</Button>
          </Link>
        </Group>
      </Container>
    </Container>
  );
};
