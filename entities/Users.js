import db from '../dbConfig.js';
import Sequelize from 'sequelize';

const Users = db.define('Users', {
    UserId:{  //Nu se pune in Postman fiindca e auto - increment
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },

    UserMail: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },

    UserPassword: { 
        type: Sequelize.STRING,
        allowNull: false
    },

    UserFirstName: {
        type: Sequelize.STRING,
        allowNull: false
    },

    UserLastName: {
        type: Sequelize.STRING,
        allowNull: false
    },
/*
        UserCreatedAt: {
        type: Sequelize.,
        allowNull: false
    },
        UserUpdatedAt: {
        type: Sequelize.,
        allowNull: false
    }*/
});

export default Users;