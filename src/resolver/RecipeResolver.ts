import { FieldResolver, Query, Resolver, Root } from 'type-graphql';
import axios from 'axios';
import { Recipe } from '../scheme/Recipe';

@Resolver(Recipe)
export default class RecipeResolver {
  @FieldResolver()
  _id(@Root() recipe: Recipe) {
    return recipe['RECIPE_ID'];
  }
  @FieldResolver()
  name(@Root() recipe: Recipe) {
    return recipe['RECIPE_NM_KO'];
  }
  @FieldResolver()
  summary(@Root() recipe: Recipe) {
    return recipe['SUMRY'];
  }
  @FieldResolver()
  country(@Root() recipe: Recipe) {
    return recipe['NATION_NM'];
  }
  @FieldResolver()
  category(@Root() recipe: Recipe) {
    return recipe['TY_NM'];
  }
  @FieldResolver()
  cookingTime(@Root() recipe: Recipe) {
    return recipe['COOKING_TIME'];
  }
  @FieldResolver()
  calorie(@Root() recipe: Recipe) {
    return recipe['CALORIE'];
  }
  @FieldResolver()
  amount(@Root() recipe: Recipe) {
    return recipe['QNT'];
  }
  @FieldResolver()
  cookingLevel(@Root() recipe: Recipe) {
    return recipe['LEVEL_NM'];
  }
  @FieldResolver()
  ingredientType(@Root() recipe: Recipe) {
    return recipe['IRDNT_CODE'];
  }
  @FieldResolver()
  price(@Root() recipe: Recipe) {
    return recipe['PC_NM'];
  }
  @FieldResolver()
  imgUrl(@Root() recipe: Recipe) {
    return recipe['IMG_URL'];
  }

  @Query(() => [Recipe])
  async recipes() {
    try {
      // TODO 하드코딩된 url 분리
      const items = await axios.get(
        'http://211.237.50.150:7080/openapi/356177e65657d63ea1189bb06144ce2d8035cd8b1434845e92abd7b7afe18b52/json/Grid_20150827000000000226_1/1/1000'
      );
      const data = items.data['Grid_20150827000000000226_1'].row;
      return data;
    } catch (e) {
      // TODO 에러 처리 모듈 만들기
      console.log('에러발생')
    }
  }
}
