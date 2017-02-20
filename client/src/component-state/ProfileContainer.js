import React from 'react';
import Profile from '../presentational/Profile';
import { get } from '../common/callApi';

const transformStateToAcceptedPropsShape = ({ customer, errors }) => {
  return {
    customer: {
      pending: !customer,
      rejected: errors && errors.length > 0,
      value: customer
    }
  };
};

class ProfileContainer extends React.Component {
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
    get(`customers/${props.id}?filter=${JSON.stringify({ "include": "followers" })}`)
      .then(customer => {
        this.setState({ customer });
      })
      .catch(err => { this.setState({ errors: err }); });
  }

  render() {
    const dataProps = transformStateToAcceptedPropsShape(this.state);
    return <Profile {...this.props} {...dataProps}/>;
  }
}

export default ProfileContainer;
