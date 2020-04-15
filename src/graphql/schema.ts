import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import { mutation } from './mutation/Job';
import { query } from './query/Job';

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQuery',
    fields: query,
  }),
  mutation: new GraphQLObjectType({
    name: 'RootMutation',
    fields: mutation,
  }),
});

export default schema;
