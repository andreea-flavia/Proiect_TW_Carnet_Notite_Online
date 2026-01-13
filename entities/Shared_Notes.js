import db from '../dbConfig.js';
import Sequelize from 'sequelize';

const Shared_Notes = db.define('Shared_Notes',{
    note_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Notes',
            key: 'note_id'
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
    permission_type:{
        type: Sequelize.ENUM('VIEW', 'EDIT'),
        allowNull: false
        //VIEW = doar vizualizare, EDIT = poate edita
    }
},{
    timestamps: false
});

export default Shared_Notes;