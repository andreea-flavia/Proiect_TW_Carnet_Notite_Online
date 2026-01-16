import db from '../dbConfig.js';
import Sequelize from 'sequelize';

const Favorites = db.define('Favorites', {
	user_id: {
		type: Sequelize.INTEGER,
		allowNull: false,
		primaryKey: true,
		references: {
			model: 'Users',
			key: 'user_id'
		},
		onDelete: 'CASCADE'
	},
	note_id: {
		type: Sequelize.INTEGER,
		allowNull: false,
		primaryKey: true,
		references: {
			model: 'Notes',
			key: 'note_id'
		},
		onDelete: 'CASCADE'
	}
}, {
	timestamps: false
});

export default Favorites;
