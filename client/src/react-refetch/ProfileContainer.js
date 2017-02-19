import { connect } from 'react-refetch';
import Profile from '../presentational/Profile';

const ProfileContainer = connect(({ id }) => ({
  customer: `/api/customers/${id}?filter=${JSON.stringify({ "include": "followers" })}`
}))(Profile);

export default ProfileContainer;
