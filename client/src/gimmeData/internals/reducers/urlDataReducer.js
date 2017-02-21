import i from 'icepick';
import {
  API_ACTION_START,
  API_ACTION_SUCCESS,
  API_ACTION_FAIL,
  NEW_DATA_REQUESTED,
  NEW_DATA_RECEIVED,
  NEW_DATA_FAILED,
} from '../constants/reduxConstants';
import {
  CURRENT,
  FAILED,
  FETCHING,
  STALE
} from '../constants/urlStatuses';

function urlDataFetching(urlDataState, url) {
  return i.setIn(urlDataState, [url, 'status'], FETCHING);
}

function urlDataReceived(urlDataState, url, data) {
  const ids = Array.isArray(data) ? data.map(model => model.id) : data.id;
  return i.updateIn(urlDataState, [url], (urlData) => ({
    ...urlData,
    ids,
    status: CURRENT
  }));
}

function urlDataFailed(urlDataState, url) {
  return i.setIn(urlDataState, [url, 'status'], FAILED);
}

function handleGetRequest(urlDataState, action) {
  const url = action.meta && action.meta.url;
  const urls = action.meta && action.meta.urls;
  switch (action.type) {
    case API_ACTION_START:
      return urlDataFetching(urlDataState, url);

    case API_ACTION_SUCCESS:
      return urlDataReceived(urlDataState, url, action.payload);

    case API_ACTION_FAIL:
      return urlDataFailed(urlDataState, url);


    case NEW_DATA_REQUESTED:
      return urls.reduce((newUrlDataState, url) => {
        return urlDataFetching(newUrlDataState, url);
      }, urlDataState);

    case NEW_DATA_RECEIVED:
      const urlToModelMap = action.payload || {};
      return urls.reduce((newUrlDataState, url) => {
        return urlDataReceived(newUrlDataState, url, urlToModelMap[url]);
      }, urlDataState);

    case NEW_DATA_FAILED:
      return urls.reduce((newUrlDataState, url) => {
        return urlDataFailed(newUrlDataState, url);
      }, urlDataState);

    default:
      return urlDataState;
  }
}

function handleUpdateRequest(urlDataState, action) {
  const pessimisticallyRefetchUrlFn = () => true;
  const refetchUrlIfMatch = action.meta && action.meta.onlyRefetchMatchingUrls || pessimisticallyRefetchUrlFn;

  return Object.keys(urlDataState).reduce((newState, url) => {
    return refetchUrlIfMatch(url) ? i.setIn(newState, [url, 'status'], STALE) : newState;
  }, urlDataState);
}


const initialUrlData = {};

// This reducer stores the status of different api url GET requests and the ids
// of the corresponding model returned from each request
//
// The data shape is as follows:
// {
//  [url]: {
//    ids: [ids] | id,
//    status: STALE | FETCHING | CURRENT | FAILED
//  }
// }
export default function urlDataReducer(urlDataState = initialUrlData, action) {
  const method = action.meta && action.meta.method;

  if (method === 'get') {
    return handleGetRequest(urlDataState, action);
  }

  if (['put', 'patch', 'post', 'delete'].indexOf(method) !== -1) {
    return handleUpdateRequest(urlDataState, action);
  }

  return urlDataState;
}
