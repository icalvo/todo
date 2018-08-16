import DevTools from 'mobx-react-devtools';
import * as React from 'react';
import TodoList from 'src/components/TodoList';
import { RestClient } from 'typed-rest-client/RestClient';
import './App.css';
import logo from './logo.svg';
import TodoStore from './model/TodoStore';

const client = new RestClient("todosapp", "http://localhost:3001");
const todoStore = new TodoStore(client);

todoStore.loadTodos();
class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <DevTools />
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Todo</h1>
        </header>
        <div className="App-intro">
        <TodoList store={ todoStore } />
        </div>
      </div>
    );
  }
}

export default App;
