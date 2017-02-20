import React from 'react';
import { get } from '../../common/callApi';

const transformStateToAcceptedPropsShape = ({ customer, errors }) => {
  return {
    customer: {
      pending: !customer,
      rejected: errors && errors.length > 0,
      value: customer
    }
  };
};

const fetchData = getUrlFromProps => Component => (
  class FetchDataWrapper extends React.Component {
    constructor(props) {
      super(props);
      this.state = {};
    }

    componentDidMount() {
      this._fetchData(this.props);
    }

    componentWillReceiveProps(nextProps) {
      this._fetchData(nextProps);
    }

    _fetchData(props) {
      get(getUrlFromProps(props))
        .then(customer => {
          this.setState({ customer });
        })
        .catch(err => { this.setState({ errors: err }); });
    }

    render() {
      const dataProps = transformStateToAcceptedPropsShape(this.state);
      return <Component {...this.props} {...dataProps}/>;
    }
  }
);

export default fetchData;
