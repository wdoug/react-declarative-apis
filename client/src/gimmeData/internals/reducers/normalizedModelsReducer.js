import {
  API_ACTION_SUCCESS,
  NEW_DATA_RECEIVED,
} from '../constants/reduxConstants';
import { getModelNameFromUrl } from '../urlParsing';

function updateModels(modelState, data) {
  const nextModelState = { ...modelState };
  const dataArray = Array.isArray(data) ? data : [data];

  dataArray.forEach(model => {
    nextModelState[model.id] = modelState ? { ...modelState[model.id], ...model } : model;
  });

  return nextModelState;
}

const initialModels = {};
// This reducer stores all models of data requested with apiAction. For example,
// this could be all the events that have been requested from the api.
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
    return {
      ...modelState,
      [modelName]: updateModels(modelState[modelName], action.payload)
    };
  }

  if (action.type === NEW_DATA_RECEIVED) {
    const urlToModelMap = action.payload;
    const newModelPartialState = Object.keys(urlToModelMap).reduce((modelPartialState, url) => {
      const modelName = getModelNameFromUrl(url);
      modelPartialState[modelName] = updateModels(modelState[modelName], urlToModelMap[url]);
      return modelPartialState;
    }, {});

    return {
      ...modelState,
      ...newModelPartialState
    };
  }

  return modelState;
}
