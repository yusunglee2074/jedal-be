import * as graphqlHTTP from 'express-graphql';
import { Router } from 'express';
import schema from './schema';

const router: Router = Router();

router.post(
  '/',
  graphqlHTTP({
    schema,
    graphiql: false,
  })
);

export default router;
