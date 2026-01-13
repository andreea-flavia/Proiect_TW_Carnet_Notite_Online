import db from '../dbConfig.js';
import Sequelize from 'sequelize';

const Group_Members = db.define('Group_Members', {
    group_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Study_Groups',
            key: 'group_id'
        },
        onDelete: 'CASCADE',
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
    role:{
        type: Sequelize.ENUM('MEMBER', 'ADMIN'),
        allowNull: false
        //MEMBER = membru obisnuit, ADMIN = poate gestiona membrii grupului
    }
},{
    timestamps: true
});

export default Group_Members;