import { importSchema } from 'graphql-import';
import { makeExecutableSchema } from 'graphql-tools';
import resolvers from '../resolvers';

const schema = makeExecutableSchema({
  typeDefs: importSchema('schemas/schema.graphql'),
  resolvers,
});

export default schema;
