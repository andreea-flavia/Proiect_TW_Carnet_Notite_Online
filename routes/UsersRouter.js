import express from 'express';
import {    createUser,  getUsers,  getUserById } from '../dataAccess/UsersDA.js';
//D:\Proiecte VS Code\Proiect TW Flavia Niko\dataAccess\UsersDA.js
let usersRouter = express.Router();

usersRouter.route('/user').post(async(req,res) => {
    return res.json(await createUser(req.body));
});

usersRouter.route('/user').get(async(req,res) => {
    return res.json(await getUsers());
});

usersRouter.route('/user/:id').get(async(req,res) => {
    return res.json(await getUserById(req.params.id));
});

export default usersRouter;