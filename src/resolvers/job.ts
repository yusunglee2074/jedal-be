import { getManager } from 'typeorm';
import { Job } from '../entity/Job';
import { Resolvers } from '../generated/graphql';

const resolver: Resolvers = {
  Query: {
    job(_root, args) {
      const manager = getManager();
      return manager.findOne(Job, args._id);
    },
  },
  Mutation: {
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
