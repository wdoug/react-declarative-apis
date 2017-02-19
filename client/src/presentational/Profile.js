import React, { PropTypes } from 'react';
import { Link } from 'react-router-dom';

const Profile = ({ customer, loading, url }) => {
  if (customer.pending || !customer.value) {
    return <div>...loading</div>;
  }
  if (customer.rejected) {
    return <div>Failed to load</div>;
  }

  return (
    <div>
      <h3>{customer.value.name}’s Followers</h3>
      <ul>
        {customer.value.followers.map(follower => (
          <li key={follower.id}>
            <Link to={`${url}/followers/${follower.id}`}>
              { follower.name }
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

Profile.propTypes = {
  customer: PropTypes.shape({
    pending: PropTypes.bool,
    rejected: PropTypes.bool,
    value: PropTypes.shape({
      name: PropTypes.string.isRequired,
      followers: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired
      }))
    })
  }),
  url: PropTypes.string.isRequired
};

export default Profile;
