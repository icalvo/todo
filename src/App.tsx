import * as React from 'react';
import { TodoList } from 'src/components/TodoList';
import './App.css';
import logo from './logo.svg';
import { TodoStore } from './model/TodoStore';

const todoStore = new TodoStore();

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <div className="App-intro">
        <TodoList store={ todoStore } />
        </div>
      </div>
    );
  }
}

export default App;
