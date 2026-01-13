import db from '../dbConfig.js';
import Sequelize from 'sequelize';

const Notes_Tags = db.define('Notes_Tags',{
    note_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Notes',
            key: 'note_id'
        },
        onDelete: 'CASCADE',
    },
    tag_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {  
            model: 'Tags',
            key: 'tag_id'
        },
        onDelete: 'RESTRICT',
    }
},{
    timestamps: false
})

export default Notes_Tags;