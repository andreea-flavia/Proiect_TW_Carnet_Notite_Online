import db from '../dbConfig.js';
import Sequelize from 'sequelize';

const Study_Groups = db.define('Study_Groups',{
    group_id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    group_name:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    group_desc:{
        type: Sequelize.STRING,
        allowNull: true
    },
    group_code:{
        type: Sequelize.STRING(10), 
        allowNull: false,
        unique: true
    },
    created_by:{
        type: Sequelize.INTEGER,
        allowNull: false
    }
},{
    timestamps: true
});

export default Study_Groups;