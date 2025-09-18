import express, { json } from 'express';
import cors from 'cors';
import { gql } from 'graphql-tag';
import { ApolloServer } from '@apollo/server';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { expressMiddleware } from '@apollo/server/express4';
import resolvers from './resolvers.js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';

import { fileURLToPath } from 'url';

// Use Express to create a new server

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors());
app.use(express.json());

const typeDefs = gql(
  readFileSync(resolve(__dirname, '..', 'schema.graphql'), {
    encoding: 'utf-8',
  }),
);

const schema = buildSubgraphSchema({ typeDefs, resolvers });
const server = new ApolloServer({
  schema,
});
await server.start();

app.use('/graphql', cors(), json(), expressMiddleware(server));

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
