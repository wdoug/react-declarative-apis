import { get, post, put, patch, del } from '../../common/callApi';
import {
  API_ACTION_START,
  API_ACTION_SUCCESS,
  API_ACTION_FAIL,
  NEW_DATA_REQUESTED,
  NEW_DATA_RECEIVED,
  NEW_DATA_FAILED,
} from './constants/reduxConstants';
import { shouldFetchUrl } from './reducers/gimmeDataReducer';

const api = { get, put, post, patch, delete: del };

function createAction(type) {
  return (payload, metaData) => {
    return { type, payload, meta: metaData };
  };
}

function createErrorAction(type, message) {
  return (data, metaData) => {
    return {
      type,
      payload: data,
      error: true,
      meta: {
        errorMessage: message || data.message,
        ...metaData
      }
    };
  };
}


export const apiActionStart = createAction(API_ACTION_START);
export const apiActionSuccess = createAction(API_ACTION_SUCCESS);
export const apiActionFail = createErrorAction(API_ACTION_FAIL);

// example: apiAction('put', 'users/1/eventsAttending/rel/1')
// example: apiAction('post', (state) => 'users/1/events', { body: eventData })
// urlFn can be either a string, or a function that resolves to a string
export function apiAction(method, urlFn, { body, onSuccess } = {}) {
  return async (dispatch, getState) => {
    const url = (typeof urlFn === 'function') ? urlFn(getState()) : urlFn;
    const metaData = { method, url, body };

    try {
      dispatch(apiActionStart(null, metaData));
      const response = await api[method](url, { body });
      dispatch(apiActionSuccess(response, metaData));

      if (typeof onSuccess === 'function') {
        onSuccess(response, getState());
      }
    } catch (apiError) {
      dispatch(apiActionFail(apiError, metaData));
    }
  };
}

const newDataFetched = createAction(NEW_DATA_REQUESTED);
const newDataReceived = createAction(NEW_DATA_RECEIVED);
const newDataFailed = createErrorAction(NEW_DATA_FAILED);


export function newDataRequested(urlsIterable) {
  return async (dispatch, getState) => {
    const state = getState();
    const urls = Array.from(urlsIterable).filter(url => shouldFetchUrl(state, url));
    if (urls.length === 0) {
      return;
    }

    const metaData = { method: 'get', urls };

    try {
      const fetches = urls.map(url => get(url));
      dispatch(newDataFetched(null, metaData));
      const results = await Promise.all(fetches);
      const urlToModelMap = urls.reduce((map, url, idx) => {
        map[url] = results[idx];
        return map;
      }, {});
      dispatch(newDataReceived(urlToModelMap, metaData));
    } catch (error) {
      dispatch(newDataFailed(error, metaData));
    }
  };
}
