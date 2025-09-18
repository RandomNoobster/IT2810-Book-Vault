import { ApolloClient, InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';

// Create a new ApolloClient instance
const client = new ApolloClient({
  uri: import.meta.env.VITE_GRAPHQL_ENDPOINT,
  cache: new InMemoryCache({
    typePolicies: {
      Book: {
        keyFields: ['id'],
      },
      User: {
        keyFields: ['UUID'],
      },
    },
  }),
});

export { client, MockedProvider };
