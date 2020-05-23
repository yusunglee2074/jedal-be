import { FieldResolver, Query, Resolver, Root } from 'type-graphql';
import axios from 'axios';
import { Ingredient } from '../scheme/Ingredient';

@Resolver(Ingredient)
export default class IngredientResolver {
  @FieldResolver()
  recipeId(@Root() ingredient: Ingredient) {
    return ingredient['RECIPE_ID'];
  }
  @FieldResolver()
  step(@Root() ingredient: Ingredient) {
    return ingredient['IRDNT_SN'];
  }
  @FieldResolver()
  name(@Root() ingredient: Ingredient) {
    return ingredient['IRDNT_NM'];
  }
  @FieldResolver()
  amount(@Root() ingredient: Ingredient) {
    return ingredient['IRDNT_CPCTY'];
  }
  @FieldResolver()
  type(@Root() ingredient: Ingredient) {
    return ingredient['IRDNT_TY_NM'];
  }

  @Query(() => [Ingredient])
  async ingredients() {
    try {
      // TODO 하드코딩된 url 분리
      const items = await axios.get(
        'http://211.237.50.150:7080/openapi/356177e65657d63ea1189bb06144ce2d8035cd8b1434845e92abd7b7afe18b52/json/Grid_20150827000000000227_1/1/1000'
      );
      const data = items.data['Grid_20150827000000000227_1'].row;
      return data;
    } catch (e) {
      // TODO 에러 처리 모듈 만들기
      console.log('에러발생');
    }
  }
}
