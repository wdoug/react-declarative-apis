import React from 'react';
import { Route } from 'react-router-dom';

import ReactRefetchProfile from './react-refetch/ProfileContainer';
import GimmeDataProfile from './gimmeData/ProfileContainer';

const techContainers = {
  'react-refetch': ReactRefetchProfile,
  gimmeData: GimmeDataProfile,
};

const NoMatch = () => (
  <div>
    No Match for url tech
  </div>
);

const FollowersList = ({ match }) => {
  const tech = match.url.split('/')[1];
  const ProfileContainer = techContainers[tech] || NoMatch;

  return (
    <div>
      <ProfileContainer id={match.params.id} url={match.url} />
      <Route path={`${match.url}/followers/:id`} component={FollowersList}/>
    </div>
  );
};

export default FollowersList;
