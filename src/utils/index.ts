export const changeAttributesName = (obj, key) => {
  const value = obj[key];

  switch (key) {
    case 'IDNTFC_NO':
      obj._id = value;
      break;
    case 'RECIPE_ID':
      obj.recipeId = value;
      break;
    case 'COOKING_NO':
      obj.step = value;
      break;
    case 'COOKING_DC':
      obj.text = value;
      break;
    case 'STRE_STEP_IMAGE_URL':
      obj.imgUrl = value;
      break;
    case 'STEP_TIP':
      obj.tip = value;
      break;
    case 'IRDNT_SN':
      obj.step = value;
      break;
    case 'IRDNT_NM':
      obj.name = value;
      break;
    case 'IRDNT_CPCTY':
      obj.amount = value;
      break;
    case 'IRDNT_TY_NM':
      obj.type = value;
      break;
    case 'RECIPE_NM_KO':
      obj.name = value;
      break;
    case 'SUMRY':
      obj.summary = value;
      break;
    case 'NATION_NM':
      obj.country = value;
      break;
    case 'TY_NM':
      obj.category = value;
      break;
    case 'COOKING_TIME':
      obj.cookingTime = value;
      break;
    case 'CALORIE':
      obj.calorie = value;
      break;
    case 'LEVEL_NM':
      obj.cookingLevel = value;
      break;
    case 'QNT':
      obj.amount = value;
      break;
    case 'IRDNT_CODE':
      obj.ingredientType = value;
      break;
    case 'PC_NM':
      obj.price = value;
      break;
    case 'PRDLST_CL':
      obj.category = value;
      break;
    case 'M_DISTCTNS':
      obj.month = value;
      break;
    case 'PRDLST_NM':
      obj.name = value;
      break;
    case 'MTC_NM':
      obj.producedLocations = value;
      break;
    case 'PRDCTN__ERA':
      obj.producedMonth = value;
      break;
    case 'COOK_MTH':
      obj.cookingTip = value;
      break;
    case 'TRT_MTH':
      obj.treatTip = value;
      break;
    case 'PURCHASE_MTH':
      obj.purchaseTip = value;
      break;
    case 'IMG_URL':
      obj.imgUrl = value;
      break;
  }
  delete obj[key];
};

export const changeOpenApiObjKey = (objArr) => {
  for (let i = 0; i < objArr.length; i++) {
    const obj = objArr[i];
    const objKeys = Object.keys(obj);
    for (let j = 0; j < objKeys.length; j++) {
      const key = objKeys[j];
      changeAttributesName(obj, key);
    }
  }
  return objArr;
};

export const getMonthsFromSeason = (season) => {
  if (season === '봄') {
    return ['3월', '4월', '5월'];
  } else if (season === '여름') {
    return ['6월', '7월', '8월'];
  } else if (season === '가을') {
    return ['9월', '10월', '11월'];
  } else if (season === '겨울') {
    return ['12월', '1월', '2월'];
  }
};

export const getSeasonFromMonth = (month) => {
  if (['3월', '4월', '5월'].indexOf(month) > -1) {
    return '봄';
  } else if (['6월', '7월', '8월'].indexOf(month) > -1) {
    return '여름';
  } else if (['9월', '10월', '11월'].indexOf(month) > -1) {
    return '가을';
  } else if (['12월', '1월', '2월'].indexOf(month) > -1) {
    return '겨울';
  }
};
