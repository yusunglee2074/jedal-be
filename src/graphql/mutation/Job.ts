import { Job, JobType } from '../../entity/Job';
import { GraphQLString } from 'graphql';
import { getManager } from 'typeorm';

export const mutation = {
  createJob: {
    type: JobType,
    args: {
      title: { type: GraphQLString },
      description: { type: GraphQLString },
      slug: { type: GraphQLString },
    },
    async resolve(_root, args) {
      const manager = getManager();
      const result = manager.create(Job, args);
      console.log(result);
    },
  },
};
