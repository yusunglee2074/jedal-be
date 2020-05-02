import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType({ description: "정부 OPEN API 재철재료" })
export class SeasonIngredient{

  @Field((type) => ID)
  _id: string;// IDNTFC_NO 식품번호
  @Field()
  name: string; // PRDLST_NM 제품명
  @Field()
  month: string; // M_DISTCTNS 제철월
  @Field()
  category: string; // PRDLST_CL 분류
  @Field()
  producedLocations: string; // MTC_NM 주요산지
  @Field()
  producedMonth: string; // PRDCTN__ERA 생산시기
  @Field()
  effect: string; // EFFECT 효능
  @Field()
  purchaseTip: string; // PURCHASE_MTH 구입요령
  @Field()
  cookingTip: string; // COOK_MTH 조리요령
  @Field()
  treatTip: string; // TRT_MTH 손질요령
}
