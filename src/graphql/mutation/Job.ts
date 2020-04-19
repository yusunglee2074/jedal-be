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
      const { title, description } = args;
      const manager = getManager();
      const job = new Job();
      job.title = title;
      job.description = description;
      try {
        return await manager.save(job);
      } catch (e) {
        throw Error('에러');
      }
    },
  },
};
