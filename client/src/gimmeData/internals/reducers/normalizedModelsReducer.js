import { normalize, denormalize } from 'normalizr';
import i from 'icepick';
import {
  API_ACTION_SUCCESS,
  NEW_DATA_RECEIVED,
} from '../constants/reduxConstants';
import { getModelNameFromUrl } from '../urlParsing';
import schemas from '../normalizeSchema';


function updateModelState(modelState, data, modelName) {
  const dataArray = Array.isArray(data) ? data : [data];
  const schema = schemas[modelName];
  if (!schema) {
    return modelState;
  }
  return dataArray.reduce((nextModelState, model) => {
    return i.merge(modelState, normalize(model, schema).entities);
  }, modelState);
}

const initialModels = {};
// This reducer stores all models of data requested with apiAction. For example,
// this could be all the customers that have been requested from the api.
//
// The data is keyed by modelName, and id respectively for quick lookup.
// Visual of data shape:
// {
//    [modelName]: {
//      [id]: model
//    }
// }
export default function allModelsReducer(modelState = initialModels, action) {
  if (action.type === API_ACTION_SUCCESS) {
    const modelName = getModelNameFromUrl(action.meta.url);
    return updateModelState(modelState, action.payload, modelName);
  }

  if (action.type === NEW_DATA_RECEIVED) {
    const urlToModelMap = action.payload;
    return Object.keys(urlToModelMap).reduce((nextModelState, url) => {
      const modelName = getModelNameFromUrl(url);
      return updateModelState(nextModelState, urlToModelMap[url], modelName);
    }, modelState);
  }

  return modelState;
}

export const getDenormalizedModel = (localState, modelName, id) => {
  return denormalize(id, schemas[modelName], localState);
};
