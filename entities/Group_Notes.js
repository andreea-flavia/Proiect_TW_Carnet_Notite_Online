import db from '../dbConfig.js';
import Sequelize from 'sequelize';

const Group_Notes = db.define('Group_Notes',{
    group_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Study_Groups',
            key: 'group_id' 
        },
        onDelete: 'CASCADE',
    },
    note_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Notes',
            key: 'note_id'
        },
        onDelete: 'CASCADE',
    },
    created_by:{
        type: Sequelize.INTEGER,
        allowNull: false
    },
    updated_by:{
        type: Sequelize.INTEGER,
        allowNull: true
    }
},{
    timestamps: true
});

export default Group_Notes;