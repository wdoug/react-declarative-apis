import { connect } from 'react-refetch';
import Profile from '../presentational/Profile';

const loggedInId = 1;

const ProfileContainer = connect(({ id }) => ({
  customer: `/api/customers/${id}?filter=${JSON.stringify({ "include": "followers" })}`,
  followClicked: id => ({
    followClickedResponse: {
      url: `/api/customers/${id}/followers/rel/${loggedInId}`,
      method: 'PUT'
    }
  })
}))(Profile);

export default ProfileContainer;
