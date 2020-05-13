import * as NodeCache from 'node-cache';
import axios from 'axios';

export enum openApiType {
  recipe = 'Grid_20150827000000000226_1',
  ingredient = 'Grid_20150827000000000227_1',
  seasonIngredient = 'Grid_20171128000000000572_1',
  detailRecipe = 'Grid_20150827000000000228_1',
}

const openApiCache = new NodeCache({
  checkperiod: 86400,
});

export const getOpenApiData = async (apiType: openApiType): Promise<[]> => {
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

export const initCacheData = async (): Promise<void> => {
  // TODO: 처음 서버 실행시킬때 10초 가까이 걸리므로 해결방법을 찾아야함
  console.log('오픈 API 데이터를 가져오는 중 입니다.');
  openApiCache.set('recipes', await getOpenApiData(openApiType.recipe));
  openApiCache.set('detailRecipes', await getOpenApiData(openApiType.detailRecipe));
  openApiCache.set('ingredients', await getOpenApiData(openApiType.ingredient));
  openApiCache.set('seasonIngredients', await getOpenApiData(openApiType.seasonIngredient));
  console.log('데이터 가져오기 완료했습니다.');
};
