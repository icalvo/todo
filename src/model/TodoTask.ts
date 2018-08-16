import { computed, IReactionDisposer, observable, reaction } from "mobx";
import * as uuid from 'uuid';

export interface ITodoMemento {
    _id: string,
    isDeleted: boolean,
    description: string,
    completed: boolean
}

export class TodoTask {
    public static create(description: string, createFunc: (arg: ITodoMemento) => void) {
        return new this(description, createFunc);
    }

    public static fromMemento(memento: ITodoMemento, createFunc: (arg: ITodoMemento) => void) {
        return new this(memento, createFunc);
    }

    @observable public id: string;
    @observable public description: string;
    @observable public completed: boolean;
    @observable public assignee?: string;

    private autoSave = true;
    private saveHandler: IReactionDisposer;

    private constructor(description: string | ITodoMemento, createFunc: (arg: ITodoMemento) => void) {
        if (typeof description === "string") {
            this.id = uuid.v4();
            this.description = description;
        }
        else {
            this.id = description._id;
            this.description = description.description;
            this.completed = description.completed;
        }

        this.saveHandler = reaction(
            () => this.memento,
            (memento, r) => {
                if (this.autoSave) {
                    createFunc(memento);
                }
            }
        );
    }

    @computed get memento(): ITodoMemento {
        return {
            _id: this.id,
            completed: this.completed,
            description: this.description,
            isDeleted: false,
        };
    }

    /**
     * Update this todo with information from the server
     */
    public updateFromJson(json: ITodoMemento) {
        // make sure our changes aren't sent back to the server
        this.autoSave = false;
        this.completed = json.completed;
        this.description = json.description;
        this.autoSave = true;
    }

    public dispose() {
        // clean up the observer
        this.saveHandler();
    }    
}

export default TodoTask;