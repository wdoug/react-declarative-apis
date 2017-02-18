import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

import TodoList from './TodoList';
import ProfileList from './ProfileList';

const App = () => (
  <Router>
    <div>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/todo">Todo List</Link></li>
        <li><Link to="/react-refetch/followers/1">React Refetch</Link></li>
      </ul>

      <hr/>

      <Route path="/todo" component={TodoList}/>
      <Route path="/:tech/followers/:id" component={ProfileList}/>
    </div>
  </Router>
);

export default App;

