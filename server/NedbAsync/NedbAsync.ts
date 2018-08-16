import * as Nedb from "nedb";
import { CountCursorAsync } from "./CountCursorAsync";
import { CursorAsync } from "./CursorAsync";

export class NedbAsync {
    private nedb: Nedb;

    constructor(pathOrOptions: string| Nedb.DataStoreOptions) {
        this.nedb = new Nedb(pathOrOptions);
    }

    public get persistence(): Nedb.Persistence {
        return this.nedb.persistence;
    }

    public loadDatabase(): Promise<{}> {
        const self = this;
        return new Promise((resolve, reject) => {
            self.nedb.loadDatabase((err) => {
                 if(err !== null) {
                     return reject(err);
                 }
    
                 resolve();
             });
        });
    }

    public getAllData(): any[] {
        return this.nedb.getAllData();
    }

    public resetIndexes(newData: any): void {
        this.nedb.resetIndexes(newData);
    }
    public ensureIndex(options: Nedb.EnsureIndexOptions): Promise<{}> {
        const self = this;
        return new Promise((resolve, reject) => {
            self.nedb.ensureIndex(options, (err) => {
                 if(err !== null) {
                     return reject(err);
                 }
    
                 resolve();
             });
        });
    }

    public removeIndex(fieldName: string): Promise<{}> {
        const self = this;
        return new Promise((resolve, reject) => {
            self.nedb.removeIndex(fieldName, (err) => {
                 if(err !== null) {
                     return reject(err);
                 }
    
                 resolve();
             });
        });
    }

    public addToIndexes<T>(doc: T | T[]): void {
        this.nedb.addToIndexes(doc);
    }

    public removeFromIndexes<T>(doc: T | T[]): void {
        this.nedb.removeFromIndexes(doc);
    }

    public updateIndexes<T>(oldDoc: T, newDoc: T): void {
        this.nedb.updateIndexes(oldDoc, newDoc);
    }

    public getCandidates(query: any): void {
        this.nedb.getCandidates(query);
    }

    public insert<T>(newDoc: T): Promise<T> {
        const self = this;
        return new Promise((resolve, reject) => {
            self.nedb.insert(newDoc, (err, document) => {
                 if(err !== null) {
                     return reject(err);
                 }
    
                 resolve(document);
             });
        });
    }

    public count(query: any): Promise<number> {
        const self = this;
        return new Promise((resolve, reject) => {
            self.nedb.count(query, (err, document) => {
                 if(err !== null) {
                     return reject(err);
                 }
    
                 resolve(document);
             });
        });
    }

    public countc(query: any): Nedb.CursorCount {
        const innerCursor = this.nedb.count(query);
        return new CountCursorAsync(innerCursor);
    }

    public find<T>(query: any, projection?: T): Promise<T[]> {
        const self = this;
        return new Promise((resolve, reject) => {
            self.nedb.find(query, projection, (err, data) => {
                 if(err !== null) {
                     return reject(err);
                 }

                 resolve(data);
             });
        });
    }

    public findc<T>(query: any, projection?: T): CursorAsync<T> {
        const innerCursor = this.nedb.find(query, projection);
        return new CursorAsync<T>(innerCursor);
    }

    public findOne<T>(query: any, projection?: T): Promise<T> {
        const self = this;
        return new Promise((resolve, reject) => {
            self.nedb.findOne(query, projection, (err, data) => {
                 if(err !== null) {
                     return reject(err);
                 }
    
                 resolve(data);
             });
        });
    }

    public update(query: any, updateQuery: any, options: Nedb.UpdateOptions = {}): Promise<[number, boolean]> {
        const self = this;
        return new Promise((resolve, reject) => {
            self.nedb.update(query, updateQuery, options, (err, numberOfUpdated, upsert) => {
                 if(err !== null) {
                     return reject(err);
                 }
    
                 resolve([numberOfUpdated, upsert]);
             });
        });
    }

    public update2<T>(query: any, updateQuery: any, options?: Nedb.UpdateOptions): Promise<[number, any, boolean]> {
        const self = this;
        return new Promise((resolve, reject) => {
            self.nedb.update(query, updateQuery, options, (err, numberOfUpdated, affectedDocuments, upsert) => {
                 if(err !== null) {
                     return reject(err);
                 }
    
                 resolve([numberOfUpdated, affectedDocuments, upsert]);
             });
        });
    }

    public remove(query: any, options?: Nedb.RemoveOptions): Promise<number> {
        const self = this;
        options = options || {};
        options.multi = options.multi || false;
        return new Promise((resolve, reject) => {
            self.nedb.remove(query, options, (err, n) => {
                 if(err !== null) {
                     return reject(err);
                 }
    
                 resolve(n);
             });
        });
    }
}

export default NedbAsync;