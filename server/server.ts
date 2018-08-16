import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as express from "express";
import * as morgan from "morgan";
import NedbAsync from "./NedbAsync/NedbAsync";

const app = express();
const port = 3001;

const db = new NedbAsync({ filename: 'build/todo.db', autoload: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(cors());

app.route('/tasks')
    .get(async (req, res) => {
        const result = await db.find({});
        res.status(200);
        res.json(result);
      });

app.route('/tasks/:taskId')
    .get(async (req, res) => {
        const id = req.params.taskId;
        const task = await db.findOne({ _id: id });
        if (!task) {
            res.status(404);
            res.end();
        }
        else {
            res.status(200);
            res.json(task);
        }
    })
    .put(async (req, res) => {
        const id = req.params.taskId;

        req.body._id = id;

        await db.update({ _id: id }, req.body, { upsert: true });
        res.status(200);
        res.json(req.body);
    })
    .delete(async (req, res) => {
        const id = req.params.taskId;

        await db.remove({ _id: id });
        res.status(204);
        res.end();
    });

app.listen(port);

console.log('todo list RESTful API server started on: ' + port);
