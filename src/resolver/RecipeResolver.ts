import { Arg, FieldResolver, Query, Resolver, Root } from 'type-graphql';
import { Recipe } from '../scheme/Recipe';
import { openApiCache } from '../cache';

@Resolver(Recipe)
export default class RecipeResolver {
  @FieldResolver()
  async detailRecipes(@Root() recipe) {
    try {
      const data: any[] = openApiCache.get('detailRecipes');
      return data.filter((el) => {
        return el.recipeId == recipe.recipeId;
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
        return el.recipeId == recipe.recipeId;
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
      // TODO: 페이지네이션?
      const data: any[] = openApiCache.get('recipes');
      if (_id) {
        return data.filter(el => el._id === _id);
      } else if (name) {
        return data.filter(el => el.name.indexOf(name) > -1);
      }
      return data;
    } catch (e) {
      // TODO 에러 처리 모듈 만들기
      console.log('에러발생');
    }
  }
}
