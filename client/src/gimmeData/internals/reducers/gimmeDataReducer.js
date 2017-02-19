import { combineReducers } from 'redux';
import normalizedModelsReducer from './normalizedModelsReducer';
import urlDataReducer from './urlDataReducer';
import { getModelNameFromUrl } from '../urlParsing';
import { STALE, FETCHING, FAILED } from '../constants/urlStatuses';

export const stateKey = 'gimmeData';

export default combineReducers({
  normalizedModels: normalizedModelsReducer,
  allUrlData: urlDataReducer
});


// Selectors

function hydrateModels(modelName, normalizedModels, ids) {
  const modelsOfSameType = normalizedModels[modelName];
  if (!modelsOfSameType) {
    return undefined;
  }

  if (Array.isArray(ids)) {
    return ids.reduce((hydratedModels, id) => {
      hydratedModels.push(modelsOfSameType[id]);
      return hydratedModels;
    }, []);
  }
  return modelsOfSameType[ids];
}

export function getModels(state, url) {
  const urlData = state[stateKey].allUrlData[url];

  if (!urlData || urlData.ids === undefined) {
    return undefined;
  }

  const { normalizedModels } = state[stateKey];
  const modelName = getModelNameFromUrl(url);
  return hydrateModels(modelName, normalizedModels, urlData.ids);
}

export function getUrlDataStatus(state, url) {
  const urlData = state[stateKey].allUrlData[url];
  return urlData && urlData.status;
}

export const isUrlDataFetching = (state, url) => getUrlDataStatus(state, url) === FETCHING;

export const shouldFetchUrl = (state, url) => {
  const urlStatus = getUrlDataStatus(state, url);
  return urlStatus === undefined || urlStatus === STALE;
};

export const getHydratedPropsFromPropUrlMap = (state, propsToUrlsMap) => {
  return Object.keys(propsToUrlsMap).reduce((hydratedProps, propKey) => {
    const url = propsToUrlsMap[propKey];
    const urlStatus = getUrlDataStatus(state, url);

    hydratedProps[propKey] = {
      pending: urlStatus === FETCHING,
      rejected: urlStatus === FAILED,
      value: getModels(state, url)
    };
    return hydratedProps;
  }, {});
};
