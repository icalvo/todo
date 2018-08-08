import { observer } from "mobx-react";
import * as React from 'react';
import { TodoTask } from "src/model/TodoTask";

export interface ITodoViewProps { todo: TodoTask; }

@observer
export class TodoView extends React.Component<ITodoViewProps, {}> {
  public render() {
    const todo = this.props.todo;
    return (
      <li onDoubleClick={ this.onRename }>
        <input
          type='checkbox'
          checked={ todo.completed }
          onChange={ this.onToggleCompleted }
        />
        { todo.description }
        { todo.assignee
          ? <small>{ todo.assignee }</small>
          : null
        }
      </li>
    );
  }

  private onToggleCompleted = () => {
    const todo = this.props.todo;
    todo.completed = !todo.completed;
  }

  private onRename = () => {
    const todo = this.props.todo;
    todo.description = prompt('Task name', todo.description) || todo.description;
  }
}
