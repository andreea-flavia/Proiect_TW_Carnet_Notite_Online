import db from '../dbConfig.js';
import Sequelize from 'sequelize';

//nomenclator
const Tags = db.define('Tags',{
    tag_id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    tag_name:{
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    tag_desc:{
        type: Sequelize.STRING,
        allowNull: true
    }
},{
    timestamps: false
});

export default Tags;