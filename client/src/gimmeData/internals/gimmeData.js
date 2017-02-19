import { compose } from 'redux';
import { connect } from 'react-redux';
import withSideEffect from 'react-side-effect';
import { newDataRequested } from './actions';
import { getModels, getUrlDataStatus, shouldFetchUrl } from './reducers/gimmeDataReducer';
import { FETCHING, FAILED } from './constants/urlStatuses';

function isObject(o) {
  return o !== null && typeof o === 'object';
}

function reducePropsToState(propsList) {
  const latestShouldFetchUrl = propsList[propsList.length - 1].shouldFetchUrl;
  const allUrlsToFetch = propsList.reduce((allUrlsToFetch, props) => {
    return props.urlsToFetch
      .filter(url => latestShouldFetchUrl(url))
      .reduce((allUrlsToFetch, urls) => {
        return allUrlsToFetch.add(urls);
      }, allUrlsToFetch);
  }, new Set());

  const dispatchNewDataRequested = propsList[0].dispatchNewDataRequested;

  return {
    dispatchNewDataRequested,
    allUrlsToFetch
  };
}

function handleStateChangeOnClient({ allUrlsToFetch, dispatchNewDataRequested }) {
  allUrlsToFetch.size > 0 && dispatchNewDataRequested(allUrlsToFetch);
}

const fetchDataWrapper = withSideEffect(
  reducePropsToState,
  handleStateChangeOnClient
);

// This is a higher order component that will handle fetching data from a
// loopback api endpoint, and pass that data into the resulting wrapped component.
//
// Simple usage:
// const ComponentContainer = gimmeData('events')(Component);
//
// The first argument can be either a url string, or a function that returns a
// url string.
// e.g.
// const dynamicUrlFn = (state, props) => `events/${props.eventId}`;
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
export default function gimmeData(mapStateToUrlsToProps) {
  const innerMapStateToProps = (state, props) => {
    const propsToUrlsMap = mapStateToUrlsToProps(state, props);
    const urls = Object.values(propsToUrlsMap);
    const urlsToFetch = urls.filter(url => shouldFetchUrl(state, url));
    const urlProps = Object.keys(propsToUrlsMap).reduce((urlProps, propKey) => {
      const url = propsToUrlsMap[propKey];
      const urlStatus = getUrlDataStatus(state, url);

      urlProps[propKey] = {
        pending: urlStatus === FETCHING,
        rejected: urlStatus === FAILED,
        value: getModels(state, url)
      };
      return urlProps;
    }, {});

    return {
      ...urlProps,
      urlsToFetch,
      shouldFetchUrl: shouldFetchUrl.bind(null, state)
    };
  };

  const innerMapDispatchToProps = (dispatch) => {
    // let mappedDispatchProps;
    // if (typeof mapDispatchToProps === 'function') {
    //   mappedDispatchProps = mapDispatchToProps(dispatch);
    // } else if (isObject(mapDispatchToProps)) {
    //   mappedDispatchProps = bindActionCreators(mapDispatchToProps, dispatch);
    // }

    return {
      // ...mappedDispatchProps,
      dispatchNewDataRequested: (...args) => dispatch(newDataRequested(...args))
    };
  };

  return (ComposedComponent) => {
    // class DataWrapper extends React.Component {
    //   static propTypes = {
    //     apiAction: PropTypes.func.isRequired,
    //     url: PropTypes.string.isRequired,
    //     shouldFetchUrl: PropTypes.bool.isRequired
    //   };

    //   componentDidMount() {
    //     this.props.apiAction('get', this.props.url);
    //   }

    //   componentWillReceiveProps(nextProps) {
    //     if (nextProps.shouldFetchUrl) {
    //       nextProps.apiAction('get', nextProps.url);
    //     }
    //   }

    //   render() {
    //     return <ComposedComponent {...this.props} />;
    //   }
    // }


    const enhancedFetchingComponent = compose(
      connect(innerMapStateToProps, innerMapDispatchToProps),
      fetchDataWrapper
    )(ComposedComponent);

    return enhancedFetchingComponent;
  };
}
