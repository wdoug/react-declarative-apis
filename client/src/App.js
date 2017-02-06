import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { get } from './utils/callApi';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    get('todos').then(todos => {
      this.setState({
        todos
      });
    });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <div className="App-intro">
          { this.state.todos && this.state.todos.map(todo => (
            <div key={todo.id}>
              { todo.content }
            </div>
          )) }
        </div>
      </div>
    );
  }
}

export default App;
