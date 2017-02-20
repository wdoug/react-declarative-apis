import { applyMiddleware, createStore, combineReducers, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import gimmeDataReducer, { stateKey as gimmeDataKey } from '../gimmeData/internals/reducers/gimmeDataReducer';

const graphqlUrl = 'http://localhost:3001/graphql';

export const apolloClient = new ApolloClient({
  networkInterface: createNetworkInterface({ uri: graphqlUrl }),
  dataIdFromObject: (result) => {
    if (result.id && result.__typename) {
      return result.__typename + result.id;
    }
    return null;
  }
});

export default function configureStore(initialState) {
  const rootReducer = combineReducers({
    [gimmeDataKey]: gimmeDataReducer,
    apollo: apolloClient.reducer(),
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
