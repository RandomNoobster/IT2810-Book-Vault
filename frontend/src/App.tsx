import '@mantine/core/styles.css';

import { ApolloProvider } from '@apollo/client';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { UserProvider } from './contexts/UserContext';
import { client } from './graphql/apolloClient';
import { Router } from './Router';
import { resolver, theme } from './theme';

import '@mantine/notifications/styles.css';

export default function App() {
  return (
    <MantineProvider theme={theme} cssVariablesResolver={resolver}>
      <Notifications />
      <ApolloProvider client={client}>
        <UserProvider>
          <Router />
        </UserProvider>
      </ApolloProvider>
    </MantineProvider>
  );
}
