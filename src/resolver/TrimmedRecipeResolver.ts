import { Arg, Field, FieldResolver, InputType, Int, Mutation, Query, Resolver, Root } from 'type-graphql';
import { Recipe } from '../scheme/Recipe';
import { TrimmedRecipe } from '../scheme/TrimmedRecipe';
import { getManager } from 'typeorm';
import { openApiCache } from '../cache';
import { SeasonIngredient } from '../scheme/SeasonIngredient';

// TODO InputType 파일 분리 해야할지 말아야할지 결정해야함
@InputType({ description: 'New recipe data' })
class AddTrimmedRecipeInput implements Partial<TrimmedRecipe> {
  @Field({ nullable: true })
  _id: string; // 아이디

  @Field({ nullable: false })
  recipeName: string; // 레시피명

  @Field({ nullable: true })
  recipeId: number; // 레시피아이디

  @Field(() => [Int], { nullable: true })
  seasonIngredientIds: number[]; // 재철 식재료 ID 리스트 레시피에 여러개의 재철 식재료가 들어감

  @Field({ nullable: false })
  cookingLevel: string; // 요리난이도

  @Field({ nullable: false })
  cookingTime: string; // 요리시간

  @Field({ nullable: false })
  category: string; // 음식분류명

  @Field({ nullable: true })
  ingredientCategory: string; // 재료분류
}

@Resolver(TrimmedRecipe)
export default class TrimmedRecipeResolver {
  private manager = getManager();

  @FieldResolver(() => Recipe)
  async recipe(@Root() trimmedRecipe: TrimmedRecipe) {
    try {
      const recipes: any[] = openApiCache.get('recipes');
      return recipes.filter((el) => el.recipeId == trimmedRecipe.recipeId)[0];
    } catch (e) {
      // TODO 에러 처리 모듈 만들기
      console.log('에러발생');
    }
  }

  @FieldResolver(() => [SeasonIngredient])
  async seasonIngredients(@Root() trimmedRecipe: TrimmedRecipe) {
    try {
      const seasonIngredients: SeasonIngredient[] = openApiCache.get('seasonIngredients');
      return seasonIngredients.filter((el) => trimmedRecipe.seasonIngredientIds.indexOf(Number(el._id)) > -1);
    } catch (e) {
      // TODO 에러 처리 모듈 만들기
      console.log(e, '에러발생');
    }
  }

  @Query(() => [TrimmedRecipe])
  async trimmedRecipes(
    @Arg('_id', { nullable: true }) _id?: string,
    @Arg('name', { nullable: true }) name?: string
  ) {
    try {
      // TODO: Entity Manager and Repository TypeORM 둘 차이 체크해야함
      const where: any = {};
      if (name) {
        where.recipeName = { $regex: new RegExp(`${name}`) };
      }
      if (_id) {
        where._id = _id;
      }
      return await this.manager.find(TrimmedRecipe, { where });
    } catch (e) {
      // TODO 에러 처리 모듈 만들기
      console.log('에러발생');
    }
  }

  @Mutation(() => TrimmedRecipe)
  async addTrimmedRecipe(@Arg('data') newData: AddTrimmedRecipeInput): Promise<TrimmedRecipe> {
    const recipe = this.manager.create(TrimmedRecipe, newData);
    return await recipe.save();
  }

  @Mutation(() => TrimmedRecipe)
  async updateTrimmedRecipe(@Arg('data') newData: AddTrimmedRecipeInput): Promise<TrimmedRecipe> {
    try {
      const newDataWithoutId = { ...newData };
      delete newDataWithoutId._id;

      await this.manager.update(TrimmedRecipe, newData._id, newDataWithoutId);
      return await this.manager.findOne(TrimmedRecipe, newData._id);
    } catch (e) {
      console.log(e);
      console.log('에러');
    }
  }
}
