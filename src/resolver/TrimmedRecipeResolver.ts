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
import { getManager, In } from 'typeorm';
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

@ArgsType()
class TrimmedRecipesArgs {
  @Field({ nullable: true })
  level?: string;
  @Field({ nullable: true })
  _id?: string;
  @Field({ nullable: true })
  name?: string;
  @Field(() => [String], { nullable: true })
  categories?: string[];
  @Field(() => [String], { nullable: true })
  hateIngredients?: string[];

  // helpers - index calculations
}

const getMonthsFromSeason = (season) => {
  if (season === '봄') {
    return ['3월', '4월', '5월'];
  } else if (season === '여름') {
    return ['6월', '7월', '8월'];
  } else if (season === '가을') {
    return ['9월', '10월', '11월'];
  } else if (season === '겨울') {
    return ['12월', '1월', '2월'];
  }
};

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
  async seasonIngredients(
    @Root() trimmedRecipe: TrimmedRecipe,
    @Arg('season', { nullable: true }) season?: string
  ) {
    try {
      const seasonIngredients: SeasonIngredient[] = openApiCache.get('seasonIngredients');
      if (season) {
        return seasonIngredients
          .filter((el) => trimmedRecipe.seasonIngredientIds.indexOf(Number(el._id)) > -1)
          .filter((el) => getMonthsFromSeason(season).indexOf(el.month) > -1);
      } else {
        return seasonIngredients.filter((el) => trimmedRecipe.seasonIngredientIds.indexOf(Number(el._id)) > -1);
      }
    } catch (e) {
      // TODO 에러 처리 모듈 만들기
      console.log(e, '에러발생');
    }
  }

  @Query(() => [TrimmedRecipe])
  async trimmedRecipes(@Args() args?: TrimmedRecipesArgs) {
    const { level, _id, name, categories, hateIngredients } = args;
    try {
      // TODO: Entity Manager and Repository TypeORM 둘 차이 체크해야함
      const where: any = {};
      if (name) {
        where.recipeName = { $regex: new RegExp(`${name}`) };
      }
      if (_id) {
        where._id = _id;
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
