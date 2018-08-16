import * as Nedb from "nedb";


export class CountCursorAsync implements Nedb.CursorCount {
    private innerCursor: Nedb.CursorCount;
 
    constructor(innerCursor: Nedb.CursorCount) {
        this.innerCursor = innerCursor;
    }

    public exec(): Promise<number> {
        const self = this;
        return new Promise((resolve, reject) => {
            self.innerCursor.exec((err, n) => {
                 if(err !== null) {
                     return reject(err);
                 }
    
                 resolve(n);
             });
        });
    }
}
