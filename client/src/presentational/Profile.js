import React from 'react';
import { Link } from 'react-router-dom';

const Profile = ({ customer, followers, url }) => {
  if (customer.pending || followers.pending) {
    return <div>...loading</div>;
  }
  if (customer.rejected || followers.rejected) {
    return <div>Failed to load</div>;
  }

  return (
    <div>
      <h3>{customer.value.name}’s Followers</h3>
      <ul>
        {followers.value.map(follower => (
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

export default Profile;
