import { Arg, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { User } from '../scheme/User';
import { getManager } from 'typeorm';
import { History } from '../scheme/History';
import { ObjectID } from 'mongodb';

@Resolver(User)
export default class UserResolver {
  private manager = getManager();

  @FieldResolver(() => [History])
  async histories(@Root() user: User): Promise<History[]> {
    try {
      const histories = await this.manager.find(History, { where: { userId: ObjectID(user._id) } });
      return histories;
    } catch (e) {
      // TODO 에러 처리 모듈 만들기
      console.log(e, '에러발생');
    }
  }

  @Query(() => User)
  async user(@Arg('userId', { nullable: false }) userId: string): Promise<User> {
    try {
      return this.manager.findOne(User, userId);
    } catch (e) {
      // TODO 에러 처리 모듈 만들기
      console.log(e);
      console.log('에러발생');
    }
  }

  @Mutation(() => User)
  async firstJoin(): Promise<User> {
    const user = await this.manager.create(User, {
      skipIntro: false,
    });
    await user.save();
    return user;
  }
}
