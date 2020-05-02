import { FieldResolver, Query, Resolver, Root } from 'type-graphql';
import axios from 'axios';
import { DetailRecipe } from '../scheme/DetailRecipe';

@Resolver(DetailRecipe)
export default class DetailRecipeResolver {
  @FieldResolver()
  recipeId(@Root() detailRecipe: DetailRecipe) {
    return detailRecipe['RECIPE_ID'];
  }

  @FieldResolver()
  step(@Root() detailRecipe: DetailRecipe) {
    return detailRecipe['COOKING_NO'];
  }
  @FieldResolver()
  text(@Root() detailRecipe: DetailRecipe) {
    return detailRecipe['COOKING_DC'];
  }
  @FieldResolver()
  imgUrl(@Root() detailRecipe: DetailRecipe) {
    return detailRecipe['STRE_STEP_IMAGE_URL'];
  }
  @FieldResolver()
  tip(@Root() detailRecipe: DetailRecipe) {
    return detailRecipe['STEP_TIP'];
  }


  @Query(() => [DetailRecipe])
  async detailRecipes() {
    try {
      // TODO 하드코딩된 url 분리
      const items = await axios.get(
        'http://211.237.50.150:7080/openapi/356177e65657d63ea1189bb06144ce2d8035cd8b1434845e92abd7b7afe18b52/json/Grid_20150827000000000228_1/1/1000'
      );
      const data = items.data['Grid_20150827000000000228_1'].row;
      return data;
    } catch (e) {
      // TODO 에러 처리 모듈 만들기
      console.log('에러발생')
    }
  }
}
