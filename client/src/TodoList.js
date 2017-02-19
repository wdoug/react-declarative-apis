import React from 'react';
import { get } from './common/callApi';

class TodoList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    get('todos').then(todos => {
      this.setState({ todos });
    });
  }

  render() {
    return (
      <div className="TodoList">
        { this.state.todos && this.state.todos.map(todo => (
          <div key={todo.id}>
            { todo.content }
          </div>
        )) }
      </div>
    );
  }
}

export default TodoList;
