import {
  Arg,
  Args,
  ArgsType,
  Field,
  FieldResolver,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql';
import { Recipe } from '../scheme/Recipe';
import { TrimmedRecipe } from '../scheme/TrimmedRecipe';
import { getManager } from 'typeorm';
import { openApiCache } from '../cache';
import { SeasonIngredient } from '../scheme/SeasonIngredient';
import { ObjectID } from 'mongodb';
import { Ingredient } from '../scheme/Ingredient';
import { History } from '../scheme/History';

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

@ArgsType()
class TrimmedRecipesArgs {
  @Field({ nullable: true })
  userId?: string;
  @Field({ nullable: true })
  level?: string;
  @Field({ nullable: true })
  id?: string;
  @Field({ nullable: true })
  name?: string;
  @Field(() => [String], { nullable: true })
  categories?: string[];
  @Field(() => [String], { nullable: true })
  hateIngredients?: string[];
  @Field(() => [String], { nullable: true })
  seasons?: string[];

  // helpers - index calculations
}

@Resolver(TrimmedRecipe)
export default class TrimmedRecipeResolver {
  private manager = getManager();

  @FieldResolver(() => Recipe)
  async recipe(@Root() trimmedRecipe: TrimmedRecipe) {
    try {
      const recipes: Recipe[] = openApiCache.get('recipes');
      return recipes.filter((el) => Number(el.recipeId) == trimmedRecipe.recipeId)[0];
    } catch (e) {
      // TODO 에러 처리 모듈 만들기
      console.log('에러발생');
    }
  }

  @FieldResolver(() => [Ingredient])
  async ingredients(@Root() trimmedRecipe: TrimmedRecipe) {
    try {
      const ingredients: Ingredient[] = openApiCache.get('ingredients');
      return ingredients.filter((el) => trimmedRecipe.recipeId === Number(el.recipeId));
    } catch (e) {
      // TODO 에러 처리 모듈 만들기
      console.log(e, '에러발생');
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

  @Query(() => [TrimmedRecipe], { nullable: true })
  async trimmedRecipes(@Args() args?: TrimmedRecipesArgs) {
    const { userId, level, id, name, categories, hateIngredients, seasons } = args;
    try {
      // TODO: Entity Manager and Repository TypeORM 둘 차이 체크해야함
      if (id) {
        return this.manager.findOne(TrimmedRecipe, id);
      }
      const where: any = {};
      if (name) {
        where.recipeName = { $regex: new RegExp(`${name}`) };
      }
      if (level) {
        where.cookingLevel = level;
      }
      if (categories) {
        where.category = { $in: categories };
      }
      if (hateIngredients) {
        where.ingredientCategory = { $not: { $in: hateIngredients } };
      }
      if (seasons) {
        where.seasons = { $in: seasons };
      }
      const recipes = await this.manager.find(TrimmedRecipe, { where });
      if (userId) {
        const history = this.manager.create(History, {
          userId: ObjectID(userId),
          trimmedRecipeIds: recipes.map((el) => el._id),
        });
        await history.save();
      }
      return recipes;
    } catch (e) {
      // TODO 에러 처리 모듈 만들기
      console.log('에러발생');
    }
  }

  @Mutation(() => TrimmedRecipe)
  async addTrimmedRecipe(@Arg('data') newData: AddTrimmedRecipeInput): Promise<TrimmedRecipe> {
    const recipe = this.manager.create(TrimmedRecipe, newData);
    await recipe.save();
    return recipe;
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
