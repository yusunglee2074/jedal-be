import { FieldResolver, Query, Resolver, Root } from 'type-graphql';
import { SeasonIngredient } from '../scheme/SeasonIngredient';
import axios from 'axios';
import { openApiCache } from '../cache';

@Resolver(SeasonIngredient)
export default class SeasonIngredientResolver {
  @FieldResolver()
  _id(@Root() seasonIngredient: SeasonIngredient) {
    return seasonIngredient['IDNTFC_NO'];
  }
  @FieldResolver()
  name(@Root() seasonIngredient: SeasonIngredient) {
    return seasonIngredient['PRDLST_NM'];
  }
  @FieldResolver()
  month(@Root() seasonIngredient: SeasonIngredient) {
    return seasonIngredient['M_DISTCTNS'];
  }
  @FieldResolver()
  category(@Root() seasonIngredient: SeasonIngredient) {
    return seasonIngredient['PRDLST_CL'];
  }
  @FieldResolver()
  producedLocations(@Root() seasonIngredient: SeasonIngredient) {
    return seasonIngredient['MTC_NM'];
  }
  @FieldResolver()
  producedMonth(@Root() seasonIngredient: SeasonIngredient) {
    return seasonIngredient['PRDCTN__ERA'];
  }
  @FieldResolver()
  effect(@Root() seasonIngredient: SeasonIngredient) {
    return seasonIngredient['EFFECT'];
  }
  @FieldResolver()
  purchaseTip(@Root() seasonIngredient: SeasonIngredient) {
    return seasonIngredient['PURCHASE_MTH'];
  }
  @FieldResolver()
  cookingTip(@Root() seasonIngredient: SeasonIngredient) {
    return seasonIngredient['COOK_MTH'];
  }
  @FieldResolver()
  treatTip(@Root() seasonIngredient: SeasonIngredient) {
    return seasonIngredient['TRT_MTH'];
  }

  @Query(() => [SeasonIngredient])
  async seasonIngredients() {
    try {
      return openApiCache.get('seasonIngredients');
    } catch (e) {
      // TODO 에러 처리 모듈 만들기
      console.log('에러발생')
    }
  }
}
