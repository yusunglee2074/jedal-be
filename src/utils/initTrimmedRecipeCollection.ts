// 4가지의 OpenAPI 데이터를 쳐다보고 청명님의 정의한대로 조합해서
// TrimmedRecipe 컬렉션에 집어 넣어주는 스크립트
// 해당 스크립트를 일주일에 한번 정도 돌려주면 OpenAPI 데이터가 업데이트 되더라도 DB는 최신화된다.

import { openApiCache } from '../cache';
import { TrimmedRecipe } from '../scheme/TrimmedRecipe';
import { getManager } from 'typeorm';

const convertCookingLevel = (level) => {
  if (level === '초보환영') return '쉬움';
  else return '보통어려움';
};

const convertCategory = (category) => {
  const obj = {
    '나물/생채/샐러드': '샐러드/밑반찬/김치',
    '밑반찬/김치': '샐러드/밑반찬/김치',
    '만두/면류': '만두/면류/그라탕',
    '그라탕/리조또': '만두/면류/그라탕',
    밥: '밥',
    볶음: '구이/볶음/부침/튀김',
    부침: '구이/볶음/부침/튀김',
    '튀김/커틀릿': '구이/볶음/부침/튀김',
    구이: '구이/볶음/부침/튀김',
    '빵/과자': '간식',
    양념장: '간식',
    '도시락/간식': '간식',
    '떡/한과': '간식',
    음료: '간식',
    조림: '조림/찜',
    찜: '조림/찜',
    '찌개/전골/스튜': '국/찌개',
    국: '국/찌개',
  };
  return obj[category];
};

const convertCookingTime = (time) => {
  if (time.slice(0, 2) < 30) {
    return '30분 이하';
  } else {
    return '30분 초과';
  }
};

(async (): Promise<void> => {
  const seasonIngredients: any[] = openApiCache.get('seasonIngredients');
  const recipes: any[] = openApiCache.get('recipes');
  const ingredients: any[] = openApiCache.get('ingredients');

  const seasonIngredientsObj = {};
  for (let i = 0; i < seasonIngredients.length; i++) {
    const item = seasonIngredients[i];
    seasonIngredientsObj[item.PRDLST_NM] = item;
  }

  const recipesObj = {};
  for (let i = 0; i < recipes.length; i++) {
    const item = recipes[i];
    recipesObj[item.RECIPE_ID] = item;
  }
  const trimmedRecipes = {};

  for (let i = 0; i < ingredients.length; i++) {
    const item = ingredients[i];
    const name = item.IRDNT_NM;
    const recipeId = item.RECIPE_ID;

    if (seasonIngredientsObj[name]) {
      const seasonIngredientId = seasonIngredientsObj[name].IDNTFC_NO;

      const recipe = recipesObj[recipeId];
      if (!recipe) continue;
      const level = recipe.cookingLevel;
      const time = recipe.cookingTime;
      const category = recipe.category;
      const ingredientCategory = recipe.ingredientType;

      if (!trimmedRecipes[recipeId]) {
        trimmedRecipes[recipeId] = {
          seasonIngredientIds: [],
        };
      }

      trimmedRecipes[recipeId] = {
        recipeId,
        ingredientCategory,
        cookingLevel: convertCookingLevel(level),
        cookingTime: convertCookingTime(time),
        category: convertCategory(category),
        recipeName: recipe.RECIPE_NM_KO,
        seasonIngredientIds: [...trimmedRecipes[recipeId].seasonIngredientIds, seasonIngredientId],
      };
    }
  }

  const manager = getManager();
  for (let i = 0; i < Object.keys(trimmedRecipes).length; i++) {
    const recipeId = Object.keys(trimmedRecipes)[i];
    const data = trimmedRecipes[recipeId];
    const alreadyAddedRecipe = await manager.find(TrimmedRecipe, { where: { recipeId } });
    if (alreadyAddedRecipe.length) continue;

    const recipe = manager.create(TrimmedRecipe, data);
    await recipe.save();
  }
}).call(this);
