import { importSchema } from 'graphql-import';
import { makeExecutableSchema } from 'graphql-tools';
import resolvers from '../resolvers';

const typeDefs = `
  scalar DateTime
  type Job {
    _id: String,
    title: String,
    description: String, 
    thumbURL: String,
    photoURL: String,
    createdAt: DateTime,
    updatedAt: DateTime,
    deletedAt: DateTime
  }
  type Query{
    job(_id:String):Job
  }
  type Mutation{
    createJob(
    title: String!,
    description: String!,
    slug: String
    ): Job
  }
`;

const schema = makeExecutableSchema({
  typeDefs: importSchema('schemas/schema.graphql'),
  resolvers,
});

export default schema;
