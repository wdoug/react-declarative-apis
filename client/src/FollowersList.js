import React from 'react';
import { Route } from 'react-router-dom';

import Followers from './Followers';

const FollowersList = ({ match }) => {
  return (
    <div>
      <Followers id={match.params.id} url={match.url} />
      <Route path={`${match.url}/followers/:id`} component={FollowersList}/>
    </div>
  );
};

export default FollowersList;
