import { FieldResolver, Resolver, Root } from 'type-graphql';
import { getManager } from 'typeorm';
import { History } from '../scheme/History';
import { TrimmedRecipe } from '../scheme/TrimmedRecipe';

@Resolver(History)
export default class HistoryResolver {
  private manager = getManager();

  @FieldResolver(() => [TrimmedRecipe])
  async searchedRecipes(@Root() history: History): Promise<TrimmedRecipe[]> {
    try {
      return await this.manager.find(TrimmedRecipe, {
        where: { _id: { $in: history.trimmedRecipeIds } },
      });
    } catch (e) {
      // TODO 에러 처리 모듈 만들기
      console.log(e, '에러발생');
    }
  }
}
