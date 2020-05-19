import * as NodeCache from 'node-cache';
import axios from 'axios';
import * as fs from 'fs';

enum openApiType {
  recipe = 'Grid_20150827000000000226_1',
  ingredient = 'Grid_20150827000000000227_1',
  seasonIngredient = 'Grid_20171128000000000572_1',
  detailRecipe = 'Grid_20150827000000000228_1',
}

export const openApiCache = new NodeCache({
  checkperiod: 86400,
});

const getOpenApiData = async (apiType: openApiType): Promise<[]> => {
  const baseUrl =
    'http://211.237.50.150:7080/openapi/356177e65657d63ea1189bb06144ce2d8035cd8b1434845e92abd7b7afe18b52/json';
  try {
    const res = await axios.get(baseUrl + '/' + apiType + '/1/1000');
    let rows = res.data[apiType].row;
    const totalCount = res.data[apiType].totalCnt;
    let endRow = 1000;
    while (endRow < totalCount) {
      endRow += 1000;
      const res = await axios.get(baseUrl + '/' + apiType + `/${endRow - 999}/${endRow}`);
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
  const recipes = await getOpenApiData(openApiType.recipe);
  const detailRecipes = await getOpenApiData(openApiType.detailRecipe);
  const ingredients = await getOpenApiData(openApiType.ingredient);
  const seasonIngredients = await getOpenApiData(openApiType.seasonIngredient);
  openApiCache.set('recipes', recipes);
  openApiCache.set('detailRecipes', detailRecipes);
  openApiCache.set('ingredients', ingredients);
  openApiCache.set('seasonIngredients', seasonIngredients);
  const offlineData = {
    createdAt: new Date().getTime(),
    recipes,
    detailRecipes,
    ingredients,
    seasonIngredients,
  };
  // TODO: 에러 났을 때 다시  데이터 다운받을 수 있도록 createdAt 초기화 해야함
  fs.writeFileSync(__dirname + '/openApiData.txt', JSON.stringify(offlineData));
};

export const initCacheData = (): void => {
  if (isDataFresh()) {
    setCacheFromOfflineFile();
  } else {
    setCacheDataAndUpdateFileFromOnline();
  }
};
