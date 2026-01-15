import express from 'express';
import {    
    createUser,  
    getUsers,  
    getUserById,
    getUserWithNotes,
    getUserWithGroups,
    getUserByEmail,
    updateUser,
    deleteUser
} from '../dataAccess/UsersDA.js';

let usersRouter = express.Router();

/*
usersRouter.route('/user').post(async(req,res) => {
    return res.json(await createUser(req.body));
});

usersRouter.route('/user').get(async(req,res) => {
    return res.json(await getUsers());
});

usersRouter.route('/user/:id').get(async(req,res) => {
    return res.json(await getUserById(req.params.id));
});*/

usersRouter.route('/user')
    .post (async (req, res) => {
        try{
            const new_user = await createUser(req.body);
            return res.status(201).json(new_user);
        } catch (error){
            return  res.status(400).json({error: error.message});
        }
    })
    .get (async(req, res) => {
        return res.json(await getUsers());
    });

usersRouter.route('/user/:id')
    .get(async(req, res) => {
        const user = await getUserById(req.params.id);
        if(user) return res.json(user);
        return res.status(404).json({error: 'User not found'});
    })
    .put(async(req, res) => {
        const updated = await updateUser(req.params.id, req.body);
        if(updated) return res.json(updated);
        return res.status(404).json({error: 'User not found'});
    })
    .delete(async(req, res) => {
        const deleted = await deleteUser(req.params.id);
        if(deleted) return res.json(deleted);
        return res.status(404).json({error: 'User not found'});
    });

usersRouter.route('/user/:id/notes').get(async(req, res) => {
    const user_notes = await getUserWithNotes(req.params.id);
    if(user_notes) return res.json(user_notes);
    return res.status(404).json({error: 'User not found'});
});

//ruta pentru login
usersRouter.route('/login').post(async(req, res) => { ///user/search/user_mail
    try{
        const {email, password}  = req.body;
        const user = await getUserByEmail(email);

        if(!user){
            return res.status(404).json({error: 'User not found! Please register first.'});
        }
        /*
        if(user.user_password.trim() !== password.trim()){
            return res.status(401).json({error: 'Invalid password!'});
        }*/

        return res.status(200).json({
            success: true,
            user: {
                id: user.user_id,
                email: user.user_mail,
                firstName: user.user_first_name,
                lastName: user.user_last_name
            }
        });
    } catch(e){
        return res.status(500).json({error: 'Internal server error'});
    }
});

export default usersRouter;