import { Field, ObjectType } from 'type-graphql';

@ObjectType({ description: '정부 OPEN API 레시피 디테일' })
export class DetailRecipe {
  @Field()
  recipeId: string; // RECIPE_ID 레시피아이디
  @Field()
  step: string; // COOKING_NO 요리설명순서
  @Field()
  text: string; // COOKING_DC 조리설명
  @Field()
  imgUrl: string; // STRE_STEP_IMAGE_URL 과정 이미지 URL
  @Field()
  tip: string; // STEP_TIP 과정팁
}
