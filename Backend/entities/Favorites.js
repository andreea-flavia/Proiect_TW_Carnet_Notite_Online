import db from '../dbConfig.js';
import Sequelize from 'sequelize';

const Favorites = db.define('Favorites', {
    note_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Notes',
            key: 'note_id'
        },
        onDelete: 'CASCADE'
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'user_id'
        },
        onDelete: 'CASCADE'
    }
}, {
    timestamps: false
});

export default Favorites;
