import { Arg, Field, FieldResolver, InputType, Mutation, Query, Resolver, Root } from 'type-graphql';
import axios from 'axios';
import { Recipe } from '../scheme/Recipe';
import { TrimmedRecipe } from '../scheme/TrimmedRecipe';
import { getManager } from 'typeorm';

// TODO InputType 파일 분리 해야할지 말아야할지 결정해야함
@InputType({ description: "New recipe data" })
class AddTrimmedRecipeInput implements Partial<TrimmedRecipe> {
  @Field()
  season: string;

}

@Resolver(TrimmedRecipe)
export default class TrimmedRecipeResolver {

  private manager = getManager();

  @FieldResolver(() => Recipe)
  async recipeName(@Root() trimmedRecipe: TrimmedRecipe) {
    try {
      const item = await axios.get(
        'http://211.237.50.150:7080/openapi/356177e65657d63ea1189bb06144ce2d8035cd8b1434845e92abd7b7afe18b52/json/Grid_20150827000000000226_1/1/1',
        {
          params: {
            RECIPE_NM_KO: trimmedRecipe.recipeName
          }
        }
      );
      const [data] = item.data['Grid_20171128000000000572_1'].row;
      return data;
    } catch (e) {
      // TODO 에러 처리 모듈 만들기
      console.log('에러발생')
    }
  }

  @Query(() => [TrimmedRecipe])
  async trimmedRecipes() {
    try {
      return this.manager.find(TrimmedRecipe);
    } catch (e) {
      // TODO 에러 처리 모듈 만들기
      console.log('에러발생')
    }
  }

  @Mutation(() => TrimmedRecipe)
  async addTrimmedRecipe(@Arg("data") newData: AddTrimmedRecipeInput): Promise<TrimmedRecipe> {
    const recipe = this.manager.create(TrimmedRecipe, newData);
    return await recipe.save();
  }
}
