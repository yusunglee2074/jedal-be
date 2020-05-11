import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType({ description: '정부 OPEN API 레시피' })
export class Recipe {
  @Field((type) => ID)
  _id: string; // RECIPE_ID 레시피아이디

  @Field()
  name: string; // RECIPE_NM_KO 레시피이름
  @Field()
  summary: string; // SUMRY 레시피 간략소개
  @Field()
  country: string; // NATION_NM 레시피국가 ex)한식, 중식
  @Field()
  category: string; // TY_NM 음식 유형 ex)밥
  @Field()
  cookingTime: string; // COOKING_TIME 조리시간
  @Field()
  calorie: string; // CALORIE 칼로리
  @Field()
  amount: string; // QNT 분량
  @Field()
  cookingLevel: string; // LEVEL_NM 난이도
  @Field()
  ingredientType: string; // IRDNT_CODE 재료분류
  @Field()
  price: string; // PC_NM 가격
  @Field()
  imgUrl: string; // PC_NM 가격
}
