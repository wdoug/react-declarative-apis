import gimmeData from './internals/gimmeData';
import Profile from '../presentational/Profile';
import { apiAction } from './internals/actions';

const mapStateToUrlsToProps = (state, props) => ({
  customer: `customers/${props.id}?filter=${JSON.stringify({ "include": "followers" })}`
});

const mapDispatchToProps = (dispatch, props) => {
  const loggedInId = 1; // could get this from props

  return {
    followClicked: (id) => dispatch(apiAction('put', `customers/${id}/followers/rel/${loggedInId}`))
  };
};

export default gimmeData(mapStateToUrlsToProps, null, mapDispatchToProps)(Profile);
