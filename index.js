import express from 'express';
import env from 'dotenv';
import DB_init from './entities/DB_init.js';
import createDBRouter from './routes/createDBRouter.js';
import usersRouter from './routes/UsersRouter.js';

env.config();

let app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));  //pt a trimite filtre

DB_init();

app.use('/api', createDBRouter);
app.use('/api', usersRouter);

let port = process.env.PORT || 3000;
app.listen(port);
console.log(`Serverul ruleaza pe portul ${port}`);


// http://localhost:9000/api/create