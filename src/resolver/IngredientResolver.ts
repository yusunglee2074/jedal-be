import { Query, Resolver } from 'type-graphql';
import { Ingredient } from '../scheme/Ingredient';
import { openApiCache } from '../cache';

@Resolver(Ingredient)
export default class IngredientResolver {

  @Query(() => [Ingredient])
  async ingredients() {
    try {
      return openApiCache.get('ingredients')
    } catch (e) {
      // TODO 에러 처리 모듈 만들기
      console.log('에러발생');
    }
  }
}
