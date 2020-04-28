import { importSchema } from 'graphql-import';
import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolvers';

import * as graphqlHTTP from 'express-graphql';
import { Router } from 'express';

const router: Router = Router();

const schema = makeExecutableSchema({
  typeDefs: importSchema('schemas/schema.graphql'),
  resolvers,
});

router.post(
  '/',
  graphqlHTTP({
    schema,
    graphiql: false,
  })
);

export default router;
