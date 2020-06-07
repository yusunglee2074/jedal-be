import { Query, Resolver } from 'type-graphql';
import { SeasonIngredient } from '../scheme/SeasonIngredient';
import { openApiCache } from '../cache';

@Resolver(SeasonIngredient)
export default class SeasonIngredientResolver {

  @Query(() => [SeasonIngredient])
  async seasonIngredients() {
    try {
      return openApiCache.get('seasonIngredients');
    } catch (e) {
      // TODO 에러 처리 모듈 만들기
      console.log('에러발생')
    }
  }
}
