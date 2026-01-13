import db from '../dbConfig.js';
import Sequelize from 'sequelize';

//nomenclator
const Subjects = db.define('Subjects', {
    subject_id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    subject_code:{      //SELF_STUDY va avea toate year si semester 0 ig
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    subject_name:{
        type: Sequelize.STRING,
        allowNull: false
    },
    year: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 3
        }
    },
    semester: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 2 
        }
    }
}, {
    timestamps: false 
});

export default Subjects;