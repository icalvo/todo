import { computed, observable } from "mobx";
import { RestClient } from 'typed-rest-client';
import { ITodoMemento, TodoTask } from "./TodoTask";

class TodoStore {
    @observable public todos: TodoTask[] = [];
    @observable public pendingRequests: number = 0;
    @observable public isLoading = true;
    private transportLayer: RestClient;

    constructor(transportLayer: RestClient) {
        this.transportLayer = transportLayer;
    }

    @computed get completedTodosCount(): number {
        return this.todos.filter(
            (todo) => todo.completed).length;
    }

    @computed  get report(): string {
        if (this.todos.length === 0) {
            return "<none>";
        }

        return `Next todo: "${this.todos[0].description}". ` +
            `Progress: ${this.completedTodosCount}/${this.todos.length}`;
    }
    public addTodo(description: string) {
        this.todos.push(
            new TodoTask(
                description,
                async (memento) => {
                    await this.transportLayer.create("/tasks", memento);
            }));
    }

    public async deleteTodo(id: string) {
        const todo = this.todos.find(x => x.id === id);
        if (todo != null) {
            await this.transportLayer.del("/tasks/"+ todo.id);
            this.removeTodo(todo);
        }
    }

    
    public loadTodos() {
        this.isLoading = true;
        this.transportLayer.get<ITodoMemento[]>('/tasks').then((res) =>{
            if (res.result != null) {
                res.result.forEach((json) => {
                    this.updateTodoFromServer(json);
                });
            }
    
            this.isLoading = false;
        },
        (reason) => {
            this.isLoading = false;
        });
    }

    private updateTodoFromServer(json: ITodoMemento) {
        let todo = this.todos.find(x => x.id === json.id);
        if (!todo) {
            todo = new TodoTask(
                json.description,
                (memento) => {
                    this.transportLayer.create<ITodoMemento>("/tasks", memento);
                },
                json.id);
            this.todos.push(todo);
        }

        if (json.isDeleted) {
            this.removeTodo(todo);
        }
        else {
            todo.updateFromJson(json);
        }
    }

    /**
     * A todo was somehow deleted, clean it from the client memory
     */
    private removeTodo(todo: TodoTask) {
        this.todos.splice(this.todos.indexOf(todo), 1);
        todo.dispose();
    }    
}

export default TodoStore;