import { observer } from "mobx-react";
import * as React from 'react';
import TodoView from "src/components/TodoView";
import TodoStore from "src/model/TodoStore";
import './TodoList.css';

export interface ITodoListProps { store: TodoStore; }

@observer
export class TodoList extends React.Component<ITodoListProps, {}> {
  public render() {
    const store = this.props.store;
    return (
      <div>
        <p>{ store.report }</p>
        <input type="text" />
        <ul>
        { store.todos.map(
          (todo, idx) => <TodoView todo={ todo } key={ idx } />
        ) }
        </ul>
        { store.pendingRequests > 0 ? <strong>Loading...</strong> : null }
        <button onClick={ this.onNewTodo }>New Todo</button>
        <small> (double-click a todo to edit)</small>
      </div>
    );
  }

  private onNewTodo = () => {
    this.props.store.addTodo(prompt('Enter a new todo:', 'coffee plz') || "");
  }
}

export default TodoList;