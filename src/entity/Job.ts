import { ObjectID, ObjectIdColumn, Entity, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { GraphQLObjectType, GraphQLID, GraphQLString } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';

@Entity()
export class Job {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  title: string;

  @Column()
  slug?: string;

  @Column()
  description?: string;

  @Column()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;
}

export const JobType = new GraphQLObjectType({
  name: 'Job',
  fields: {
    _id: { type: GraphQLID },
    title: { type: GraphQLString },
    slug: { type: GraphQLString },
    description: { type: GraphQLString },
    createdAt: {
      type: GraphQLDateTime,
      resolve(parent) {
        return new Date(parent.createdAt);
      },
    },
    updatedAt: {
      type: GraphQLDateTime,
      resolve(parent) {
        return new Date(parent.updatedAt);
      },
    },
  },
});

