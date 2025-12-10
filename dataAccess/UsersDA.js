import Users from '../entities/Users.js';

async function createUser(user) {
    return await Users.create(user);
}

async function getUsers() {
    return await Users.findAll();
}

async function getUserById(id) {
    return await Users.findByPk(id);
}

export {
    createUser,
    getUsers,
    getUserById
}