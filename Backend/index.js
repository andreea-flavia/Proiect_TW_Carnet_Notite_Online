import express from 'express';
import env from 'dotenv';
import DB_init from './entities/DB_init.js';
import createDBRouter from './routes/createDBRouter.js';
import usersRouter from './routes/UsersRouter.js';
import subjectsRouter from './routes/SubjectsRouter.js';
import notesRouter from './routes/NotesRouter.js';
import resourcesRouter from './routes/ResourcesRouter.js';
import tagsRouter from './routes/TagsRouter.js';
import collaborationsRouter from './routes/CollaborationsRouter.js';

env.config();

let app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));  //pt a trimite filtre


DB_init();

app.use('/api', createDBRouter); //request Postman GET http://localhost:9000/api/create
app.use('/api', usersRouter);
app.use('/api', subjectsRouter);
app.use('/api', notesRouter);
app.use('/api', resourcesRouter);
app.use('/api', tagsRouter);
app.use('/api', collaborationsRouter);

let port = process.env.PORT || 3000;
app.listen(port);
console.log(`Serverul ruleaza pe portul ${port}`);


// http://localhost:9000/api/create