import { getManager } from 'typeorm';
import { Job } from '../entity/Job';

const resolver = {
  Query: {
    job(_root, args) {
      const manager = getManager();
      return manager.findOne(Job, args.id);
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
