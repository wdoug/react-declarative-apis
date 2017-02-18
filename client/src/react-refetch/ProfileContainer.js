import { connect } from 'react-refetch';
import Profile from '../presentational/Profile';

const ProfileContainer = connect(({ id }) => ({
  customer: `/api/customers/${id}`,
  followers: `/api/customers/${id}/followers`
}))(Profile);

export default ProfileContainer;
