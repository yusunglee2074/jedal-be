import { Arg, FieldResolver, Query, Resolver, Root } from 'type-graphql';
import { Recipe } from '../scheme/Recipe';
import { openApiCache } from '../cache';

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
  @FieldResolver()
  async detailRecipes(@Root() recipe) {
    try {
      const data: any[] = openApiCache.get('detailRecipes');
      return data.filter((el) => {
        return el.RECIPE_ID == recipe.RECIPE_ID;
      });
    } catch (e) {
      // TODO 에러 처리 모듈 만들기
      console.log(e);
      console.log('에러발생');
    }
  }
  @FieldResolver()
  async ingredients(@Root() recipe) {
    try {
      const data: any[] = openApiCache.get('ingredients');
      return data.filter((el) => {
        return el.RECIPE_ID == recipe.RECIPE_ID;
      });
    } catch (e) {
      // TODO 에러 처리 모듈 만들기
      console.log(e);
      console.log('에러발생');
    }
  }

  @Query(() => [Recipe])
  async recipes(@Arg('_id', { nullable: true }) _id?: string, @Arg('name', { nullable: true }) name?: string) {
    try {
      // TODO: 페이지네이션
      const data: any[] = openApiCache.get('recipes');
      if (_id) {
        return data.filter(el => el.RECIPE_ID === _id);
      } else if (name) {
        return data.filter(el => el.RECIPE_NM_KO.indexOf(name) > -1);
      }
      return data;
    } catch (e) {
      // TODO 에러 처리 모듈 만들기
      console.log('에러발생');
    }
  }
}
