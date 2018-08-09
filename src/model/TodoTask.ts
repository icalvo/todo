import { computed, IReactionDisposer, IReactionPublic, observable, reaction } from "mobx";
import * as uuid from 'node-uuid';

export interface ITodoMemento {
    id: string,
    isDeleted: boolean,
    description: string,
    completed: boolean
}

export class TodoTask {
    @observable public id: string;
    @observable public description: string;
    @observable public completed: boolean;
    @observable public assignee?: string;

    private autoSave = true;
    private saveHandler: IReactionDisposer;

    constructor(description: string, effect: (arg: ITodoMemento, r: IReactionPublic) => void, id = uuid.v4()) {
        this.description = description;
        this.completed = false;
        this.saveHandler = reaction(
            () => this.memento,
            (memento, r) => {
                if (this.autoSave) {
                    effect(memento, r);
                }
            }
        );
    }


    @computed get memento(): ITodoMemento {
        return {
            completed: this.completed,
            description: this.description,
            id: this.id,
            isDeleted: false,
        };
    }

    /**
     * Update this todo with information from the server
     */
    public updateFromJson(json: ITodoMemento) {
        // make sure our changes aren't send back to the server
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