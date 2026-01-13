import db from '../dbConfig.js';
import Sequelize from 'sequelize';

const Resources = db.define('Resources',{
    resource_id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
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
    resource_url:{
        type: Sequelize.STRING,
        allowNull: false
    },
    resource_type:{
        type: Sequelize.ENUM('FILE', 'LINK'),
        allowNull: false
        //FILE = incarcae locala, LINK = link extern
    },
    resource_name:{
        type: Sequelize.STRING,
        allowNull: false
    }

},{
    timestamps: true
});

export default Resources;
