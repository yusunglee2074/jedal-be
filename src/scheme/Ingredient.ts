import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType({ description: '정부 OPEN API 일반재료' })
export class Ingredient {
  @Field((type) => ID)
  _id: string; // RECIPE_ID + _ + IRDNT_SN 아이디(임의로 만든 아이디)
  @Field()
  recipeId: string; // RECIPE_ID 레시피아이디
  @Field()
  step: string; // IRDNT_SN 재료순번
  @Field()
  name: string; // IRDNT_NM 재료명
  @Field()
  amount: string; // IRDNT_CPCTY 재료량
  @Field()
  type: string; // IRDNT_TY_NM 주재료 부재료
}
