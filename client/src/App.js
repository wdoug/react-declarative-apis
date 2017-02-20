import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import { ApolloProvider } from 'react-apollo'; // Use in place of react-redux's Provider to get visibility into apollo
import configureStore, { apolloClient } from './common/configureStore';
import ProfileList from './ProfileList';

const store = configureStore();

const App = () => (
  <ApolloProvider store={store} client={apolloClient}>
    <Router>
      <div>
        <ul>
          <li><Link to="/component-state/followers/1">Component State</Link></li>
          <li><Link to="/simple-hoc/followers/1">Simple Higher Order Component</Link></li>
          <li><Link to="/react-refetch/followers/1">React Refetch</Link></li>
          <li><Link to="/gimmeData/followers/1">gimmeData</Link></li>
          <li><Link to="/apollo/followers/1">Apollo Client</Link></li>
        </ul>

        <hr/>
        <Route path="/:tech/followers/:id" component={ProfileList}/>
      </div>
    </Router>
  </ApolloProvider>
);

export default App;

