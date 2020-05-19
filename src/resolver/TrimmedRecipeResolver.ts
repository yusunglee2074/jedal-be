import { Arg, Field, FieldResolver, InputType, Mutation, Query, Resolver, Root } from 'type-graphql';
import axios from 'axios';
import { Recipe } from '../scheme/Recipe';
import { TrimmedRecipe } from '../scheme/TrimmedRecipe';
import { getManager, Like } from 'typeorm';
import { openApiCache } from '../cache';

// TODO InputType 파일 분리 해야할지 말아야할지 결정해야함
@InputType({ description: 'New recipe data' })
class AddTrimmedRecipeInput implements Partial<TrimmedRecipe> {
  @Field({ nullable: true })
  _id: string; // 아이디

  @Field({ nullable: false })
  recipeName: string; // 레시피명

  @Field({ nullable: true })
  recipeId: number; // 레시피아이디

  @Field({ nullable: true })
  seasonIngredientId: number; // 재철 식재료 ID

  @Field({ nullable: true })
  seasonIngredientName: string; // 재철 식재료 이름

  @Field({ nullable: false })
  seasonMonth: number; // 재철 식재료 월

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
  async recipeId(@Root() trimmedRecipe: TrimmedRecipe) {
    try {
      const recipes: any[] = openApiCache.get('recipes');
      return recipes.filter((el) => el.RECIPE_ID == trimmedRecipe.recipeId)[0];
    } catch (e) {
      // TODO 에러 처리 모듈 만들기
      console.log('에러발생');
    }
  }

  @Query(() => [TrimmedRecipe])
  async trimmedRecipes(
    @Arg('_id', { nullable: true }) _id?: string,
    @Arg('name', { nullable: true }) name?: string
  ) {
    try {
      // TODO trimmed Recipe 다시 해야함 청명님 정제 데이터가 듀플리케이션되어있음.
      return await this.manager.find(TrimmedRecipe, {
        where: {
          recipeName: { $regex: new RegExp(`${name}`) },
        },
      });
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
      // TODO 코드가 깔끔하지 못함
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
