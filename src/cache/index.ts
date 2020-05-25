import * as NodeCache from 'node-cache';
import axios from 'axios';
import * as fs from 'fs';
import { changeOpenApiObjKey } from '../utils';

export const OPEN_API_BASE_URL =
  'http://211.237.50.150:7080/openapi/356177e65657d63ea1189bb06144ce2d8035cd8b1434845e92abd7b7afe18b52/json';

export enum openApiType {
  recipe = 'Grid_20150827000000000226_1',
  ingredient = 'Grid_20150827000000000227_1',
  seasonIngredient = 'Grid_20171128000000000572_1',
  detailRecipe = 'Grid_20150827000000000228_1',
}

export const openApiCache = new NodeCache({
  checkperiod: 86400,
});

const getOpenApiData = async (apiType: openApiType): Promise<[]> => {
  try {
    const res = await axios.get(OPEN_API_BASE_URL + '/' + apiType + '/1/1000');
    let rows = res.data[apiType].row;
    const totalCount = res.data[apiType].totalCnt;
    let endRow = 1000;
    while (endRow < totalCount) {
      endRow += 1000;
      const res = await axios.get(OPEN_API_BASE_URL + '/' + apiType + `/${endRow - 999}/${endRow}`);
      rows = rows.concat(res.data[apiType].row);
    }
    return rows;
  } catch (e) {
    // TODO 에러 처리 모듈 만들기
    console.log(e);
    console.log('에러발생');
  }
};

const offlineData = fs.readFileSync(__dirname + '/openApiData.txt', 'utf8');
const parsedOfflineData = JSON.parse(offlineData);

const isDataFresh = (): boolean => {
  console.log(parsedOfflineData.createdAt);
  if (!parsedOfflineData.createdAt) return false;
  const yesterday = new Date();
  yesterday.setDate(new Date().getDate() - 1);
  return yesterday.getTime() < new Date(parsedOfflineData.createdAt).getTime();
};

const setCacheFromOfflineFile = (): void => {
  openApiCache.set('recipes', parsedOfflineData['recipes']);
  openApiCache.set('detailRecipes', parsedOfflineData['detailRecipes']);
  openApiCache.set('ingredients', parsedOfflineData['ingredients']);
  openApiCache.set('seasonIngredients', parsedOfflineData['seasonIngredients']);
};

const setCacheDataAndUpdateFileFromOnline = async (): Promise<void> => {
  // TODO: 만약 성능이 만약 부족하다면 아이디로 찾는 재료, 디테일 레시피는
  //  리스트가 아닌 obj 로 저장하므로써 indexing 도 생각해봄
  const recipes = await getOpenApiData(openApiType.recipe);
  const detailRecipes = await getOpenApiData(openApiType.detailRecipe);
  const ingredients = await getOpenApiData(openApiType.ingredient);
  const seasonIngredients = await getOpenApiData(openApiType.seasonIngredient);
  openApiCache.set('recipes', changeOpenApiObjKey(recipes));
  openApiCache.set('detailRecipes', changeOpenApiObjKey(detailRecipes));
  openApiCache.set('ingredients', changeOpenApiObjKey(ingredients));
  openApiCache.set('seasonIngredients', changeOpenApiObjKey(seasonIngredients));
  const offlineData = {
    createdAt: new Date().getTime(),
    recipes,
    detailRecipes,
    ingredients,
    seasonIngredients,
  };
  fs.writeFileSync(__dirname + '/openApiData.txt', JSON.stringify(offlineData));
};

export const initCacheData = async (): Promise<void> => {
  if (isDataFresh()) {
    setCacheFromOfflineFile();
  } else {
    await setCacheDataAndUpdateFileFromOnline();
  }
  require(__dirname + '/../utils/initTrimmedRecipeCollection.ts');
};
