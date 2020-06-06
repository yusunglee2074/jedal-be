// 4가지의 OpenAPI 데이터를 쳐다보고 청명님의 정의한대로 조합해서
// TrimmedRecipe 컬렉션에 집어 넣어주는 스크립트
// TODO: CRON 적용 해당 스크립트를 일주일에 한번 정도 돌려주면 OpenAPI 데이터가 업데이트 되더라도 DB는 최신화된다.

import { openApiCache } from '../cache';
import { TrimmedRecipe } from '../scheme/TrimmedRecipe';
import { getManager } from 'typeorm';
import { SeasonIngredient } from '../scheme/SeasonIngredient';
import { Ingredient } from '../scheme/Ingredient';
import { Recipe } from '../scheme/Recipe';
import { getSeasonFromMonth } from './index';

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
    '밥': '밥',
    '볶음': '구이/볶음/부침/튀김',
    '부침': '구이/볶음/부침/튀김',
    '튀김/커틀릿': '구이/볶음/부침/튀김',
    '구이': '구이/볶음/부침/튀김',
    '빵/과자': '간식',
    '양념장': '간식',
    '도시락/간식': '간식',
    '떡/한과': '간식',
    '음료': '간식',
    '조림': '조림/찜',
    '찜': '조림/찜',
    '찌개/전골/스튜': '국/찌개',
    '국': '국/찌개',
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
  const seasonIngredients: SeasonIngredient[] = openApiCache.get('seasonIngredients');
  const recipes: Recipe[] = openApiCache.get('recipes');
  const ingredients: Ingredient[] = openApiCache.get('ingredients');

  const seasonIngredientsObj = {};
  for (let i = 0; i < seasonIngredients.length; i++) {
    const item = seasonIngredients[i];
    seasonIngredientsObj[item.name] = item;
  }

  const recipesObj = {};
  for (let i = 0; i < recipes.length; i++) {
    const item = recipes[i];
    recipesObj[item.recipeId] = item;
  }
  const trimmedRecipes = {};

  for (let i = 0; i < ingredients.length; i++) {
    const item = ingredients[i];
    const name = item.name;
    const recipeId = item.recipeId;

    if (seasonIngredientsObj[name]) {
      const seasonIngredientId = seasonIngredientsObj[name]._id;

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

      let seasons = trimmedRecipes[recipeId].seasons;
      const season = getSeasonFromMonth(seasonIngredientsObj[name].month);

      if (!seasons) {
        trimmedRecipes[recipeId].seasons = [];
        seasons = trimmedRecipes[recipeId].seasons;
      } else if (seasons.indexOf(season) === -1) {
        seasons = [...seasons, season];
      }

      trimmedRecipes[recipeId] = {
        recipeId,
        ingredientCategory,
        cookingLevel: convertCookingLevel(level),
        cookingTime: convertCookingTime(time),
        category: convertCategory(category),
        recipeName: recipe.name,
        seasonIngredientIds: [...trimmedRecipes[recipeId].seasonIngredientIds, seasonIngredientId],
        seasons,
      };
    }
  }

  const manager = getManager();
  for (let i = 0; i < Object.keys(trimmedRecipes).length; i++) {
    const recipeId = Object.keys(trimmedRecipes)[i];
    const data = trimmedRecipes[recipeId];
    const alreadyAddedRecipe = await manager.find(TrimmedRecipe, { where: { recipeId: Number(recipeId) } });
    if (alreadyAddedRecipe.length > 0) continue;

    const recipe = manager.create(TrimmedRecipe, data);
    await recipe.save();
  }
}).call(this);
