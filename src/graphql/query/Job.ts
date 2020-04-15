import { Job, JobType } from '../../entity/Job';
import { GraphQLID } from 'graphql';
import { getManager } from 'typeorm';

export const query = {
  job: {
    type: JobType,
    args: {
      id: { type: GraphQLID },
    },
    resolve(_root, args) {
      const manager = getManager();
      return manager.findOne(Job, args.id);
    },
  },
};
