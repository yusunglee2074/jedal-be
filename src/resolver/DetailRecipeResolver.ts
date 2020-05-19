import { FieldResolver, Query, Resolver, Root } from 'type-graphql';
import axios from 'axios';
import { DetailRecipe } from '../scheme/DetailRecipe';
import { Ingredient } from '../scheme/Ingredient';
import { openApiCache } from '../cache';

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
      return openApiCache.get('detailRecipes')
    } catch (e) {
      // TODO 에러 처리 모듈 만들기
      console.log('에러발생');
    }
  }
}
