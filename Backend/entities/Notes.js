import db from '../dbConfig.js';
import Sequelize from 'sequelize';

const Notes = db.define('Notes', {
    note_id :{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    content: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    is_public:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    user_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'user_id'
        },
        onDelete: 'CASCADE',
    },
    subject_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Subjects',
            key: 'subject_id'
        },
        onDelete: 'CASCADE',
    },
    //daca e shared note si editeaza altcineva
    updated_by:{
        type: Sequelize.INTEGER,
        allowNull: true
    }
}, {
    timestamps: true
});

export default Notes;