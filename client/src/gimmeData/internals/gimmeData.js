import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import withSideEffect from 'react-side-effect';
import { newDataRequested } from './actions';
import { getHydratedPropsFromPropUrlMap } from './reducers/gimmeDataReducer';

function isObject(o) {
  return o !== null && typeof o === 'object';
}

function getUniqueUrlsToFetchFromPropsList(propsList) {
  return propsList.reduce((uniqueUrlsToFetch, props) => {
    return props.urlsToFetch
      .reduce((uniqueUrlsToFetch, urls) => {
        return uniqueUrlsToFetch.add(urls);
      }, uniqueUrlsToFetch);
  }, new Set());
}

function reducePropsToState(propsList) {
  const uniqueUrlsToFetch = getUniqueUrlsToFetchFromPropsList(propsList);
  const dispatchNewDataRequested = propsList[0] && propsList[0].dispatchNewDataRequested;

  return {
    dispatchNewDataRequested,
    uniqueUrlsToFetch
  };
}

function handleStateChangeOnClient({ uniqueUrlsToFetch, dispatchNewDataRequested }) {
  if (uniqueUrlsToFetch.size > 0) {
    dispatchNewDataRequested && dispatchNewDataRequested(uniqueUrlsToFetch);
  }
}

const fetchDataWrapper = withSideEffect(
  reducePropsToState,
  handleStateChangeOnClient
);

// This is a higher order component that will handle fetching data from a
// loopback api endpoint, and pass that data into the resulting wrapped component.
//
// The first argument is a function that returns an object with values of urls,
// and keys of corresponding props for the data returned from those urls
// e.g.
// const dynamicUrlFn = (state, props) => { propName: `events/${props.eventId}` };
// const ComponentContainer = gimmeData(dynamicUrlFn)(Component);
//
// If additional data or actions need to be passed to the component, `gimmeData`
// optionally takes the same mapStateToProps or mapDispatchToProps args that
// redux's `connect` higher order component takes.
// e.g.
// const mapStateToProps = (state) => {
//   return { stuff: getSomeDataFromState(state) };
// };
// const mapDispatchToProps = {
//   doSomething: someReduxAction
// };
// const ComponentContainer = gimmeData(
//   'events',
//   mapStateToProps,
//   mapDispatchToProps
// )(Component);
export default function gimmeData(mapStateToUrlsToProps, mapStateToProps, mapDispatchToProps) {
  const innerMapStateToProps = (state, props) => {
    const propsToUrlsMap = mapStateToUrlsToProps(state, props);
    const urlsToFetch = Object.values(propsToUrlsMap);
    const urlProps = getHydratedPropsFromPropUrlMap(state, propsToUrlsMap);

    return {
      ...urlProps,
      urlsToFetch,
    };
  };

  const innerMapDispatchToProps = (dispatch) => {
    let mappedDispatchProps;
    if (typeof mapDispatchToProps === 'function') {
      mappedDispatchProps = mapDispatchToProps(dispatch);
    } else if (isObject(mapDispatchToProps)) {
      mappedDispatchProps = bindActionCreators(mapDispatchToProps, dispatch);
    }

    return {
      ...mappedDispatchProps,
      dispatchNewDataRequested: (...args) => dispatch(newDataRequested(...args))
    };
  };

  return (ComposedComponent) => {
    const EnhancedFetchingComponent = compose(
      connect(innerMapStateToProps, innerMapDispatchToProps),
      fetchDataWrapper
    )(ComposedComponent);

    return EnhancedFetchingComponent;
  };
}
