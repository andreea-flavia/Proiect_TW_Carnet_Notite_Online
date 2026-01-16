import Users from '../entities/Users.js';
import Notes from '../entities/Notes.js';
import Subjects from '../entities/Subjects.js';
import Study_Groups from '../entities/Study_Groups.js';
import Tags from '../entities/Tags.js';

async function createUser(user) {
    return await Users.create(user);
}

async function getUsers() {
    return await Users.findAll();
}

async function getUserById(id) {
    return await Users.findByPk(id);
}

//ret un user cu toate notitele sale
async function getUserWithNotes(id){
    return await Users.findByPk( id, {
        include: [{
            model: Notes,
            as: 'myNotes',
            include: [
                { 
                    model: Subjects, 
                    as: 'subject' 
                },
                { 
                    model: Tags, 
                    as: 'tags' ,
                    attributes: ['tag_id', 'tag_name', 'tag_desc']
                }
            ]
        }]
    });
}

//ret un user cu toate grupurile de care apartine
async function getUserWithGroups(id){
    return await Users.findByPk(id, {
        include: [
            {
                model: Study_Groups,
                as: 'memberOf',
                through: {
                    attributes: ['role']
                }
            }
        ]
    });
}

//gaseste user dupa mail
async function getUserByEmail(email){
    return await Users.findOne({where: {user_mail: email}});
}

//actualizare date user
async function updateUser(id, userData){
    const user = await Users.findByPk(id);
    if(!user){
        return null;
    }
    return await user.update(userData);
}

//sterge user
async function deleteUser(id){
    const user = await Users.findByPk(id);
    if(!user){
        return null;
    }
    return await user.destroy();
}

export {
    createUser,
    getUsers,
    getUserById,
    getUserWithNotes,
    getUserWithGroups,
    getUserByEmail,
    updateUser,
    deleteUser
}