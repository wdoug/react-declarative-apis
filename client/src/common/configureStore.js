import { applyMiddleware, createStore, combineReducers, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import gimmeDataReducer, { stateKey as gimmeDataKey } from '../gimmeData/internals/reducers/gimmeDataReducer';

export default function configureStore(initialState) {
  const rootReducer = combineReducers({
    [gimmeDataKey]: gimmeDataReducer
  });

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  return createStore(
    rootReducer,
    initialState,
    composeEnhancers(
      applyMiddleware(thunkMiddleware)
    )
  );
}
