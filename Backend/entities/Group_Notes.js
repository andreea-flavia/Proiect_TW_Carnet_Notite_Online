import db from '../dbConfig.js';
import Sequelize from 'sequelize';

const Group_Notes = db.define('Group_Notes',{
    group_id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'Study_Groups',
            key: 'group_id' 
        },
        onDelete: 'CASCADE',
    },
    note_id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'Notes',
            key: 'note_id'
        },
        onDelete: 'CASCADE',
    },
    created_by:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'user_id'
        }
    },
    updated_by:{
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: 'Users',
            key: 'user_id'
        }
    }
},{
    timestamps: true,
    createdAt: true,
    updatedAt: true
});

export default Group_Notes;