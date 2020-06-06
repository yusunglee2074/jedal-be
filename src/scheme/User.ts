import { Field, ID, ObjectType } from 'type-graphql';
import {
  UpdateDateColumn,
  BaseEntity,
  Column,
  Entity,
  ObjectIdColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn, ObjectID,
} from 'typeorm';

@Entity()
@ObjectType({ description: '유저' })
export class User extends BaseEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn()
  @ObjectIdColumn()
  _id: ObjectID;

  @Field()
  @Column()
  skipIntro: boolean;

  @Field()
  @UpdateDateColumn()
  lastLogin: Date;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
