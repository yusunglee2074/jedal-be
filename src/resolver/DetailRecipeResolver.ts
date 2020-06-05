import { FieldResolver, Query, Resolver, Root } from 'type-graphql';
import axios from 'axios';
import { DetailRecipe } from '../scheme/DetailRecipe';
import { Ingredient } from '../scheme/Ingredient';
import { openApiCache } from '../cache';

@Resolver(DetailRecipe)
export default class DetailRecipeResolver {
  @Query(() => [DetailRecipe])
  async detailRecipes() {
    try {
      return openApiCache.get('detailRecipes')
    } catch (e) {
      // TODO 에러 처리 모듈 만들기
      console.log('에러발생');
    }
  }
}
