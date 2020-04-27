import { getManager } from 'typeorm';
import { Job } from '../entity/Job';
import { Resolvers } from '../generated/graphql';

const resolver: Resolvers = {
  Query: {
    // @ts-ignore
    job2(_root, args) {
      const manager = getManager();
      return manager.findOne(Job, args._id);
    },
  },
  Mutation: {
    // @ts-ignore
    async createJob(_root, args) {
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
  }
}

export default resolver;
