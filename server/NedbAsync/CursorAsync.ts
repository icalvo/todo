import * as Nedb from "nedb";

export class CursorAsync<T> implements Nedb.Cursor<T> {
    private innerCursor: Nedb.Cursor<T>;
 
    constructor(innerCursor: Nedb.Cursor<T>) {
        this.innerCursor = innerCursor;
    }

    public sort(query: any): Nedb.Cursor<T> {
        this.innerCursor.sort(query);
        return this;
    }

    public skip(n: number): Nedb.Cursor<T> {
        this.innerCursor.skip(n);
        return this;
    }

    public limit(n: number): Nedb.Cursor<T> {
        this.innerCursor.limit(n);
        return this;
    }

    public projection(query: any): Nedb.Cursor<T> {
        this.innerCursor.projection(query);
        return this;
    }

    public exec(): Promise<T[]> {
        const self = this;
        return new Promise((resolve, reject) => {
            self.innerCursor.exec((err, documents) => {
                 if(err !== null) {
                     return reject(err);
                 }
    
                 resolve(documents);
             });
        });
    }
}
