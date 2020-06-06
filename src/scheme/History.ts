import { Field, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  ObjectIdColumn,
  PrimaryGeneratedColumn,
  ObjectID,
  CreateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType({ description: '유저 히스토리' })
export class History extends BaseEntity {

  @Field(() => String)
  @PrimaryGeneratedColumn()
  @ObjectIdColumn()
  _id: ObjectID;

  @Field(() => String)
  @ObjectIdColumn()
  userId: ObjectID;

  @Field(() => [String])
  @Column()
  trimmedRecipeIds: ObjectID[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
