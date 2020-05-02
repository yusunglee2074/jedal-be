import { ObjectID, ObjectIdColumn, Entity, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

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
