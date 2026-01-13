import db from '../dbConfig.js';
import Sequelize from 'sequelize';

const Users = db.define('Users', {
    user_id:{  //Nu se pune in Postman fiindca e auto - increment
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },

    user_mail: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
            isAseEmail(value) {
                if(!value.endsWith('@stud.ase.ro')) {
                    throw new Error('Trebuie sa folositi adresa de mail institutionala @stud.ase.ro');
                }
            }
        }
    },

    user_password: { 
        type: Sequelize.STRING,
        allowNull: false
    },

    user_first_name: {
        type: Sequelize.STRING,
        allowNull: false
    },

    user_last_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
}, {
    timestamps:true
});

export default Users;