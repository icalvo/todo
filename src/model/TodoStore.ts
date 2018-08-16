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

    public async addTodo(description: string) {
        const todo = TodoTask.create(
            description,
            async (memento) => {
                await this.transportLayer.replace("/tasks/" + memento._id, memento);
            });
        await this.transportLayer.replace("/tasks/" + todo.memento._id, todo.memento);
        this.todos.push(todo);
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

    private async updateTodoFromServer(json: ITodoMemento) {
        const todo = TodoTask.fromMemento(
            json,
            async (memento) => {
                await this.transportLayer.replace<ITodoMemento>("/tasks/" + memento._id, memento);
            });
        await this.transportLayer.replace<ITodoMemento>("/tasks/" + todo.memento._id, todo.memento);
        this.todos.push(todo);

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