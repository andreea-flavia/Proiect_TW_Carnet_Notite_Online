import db from '../dbConfig.js';
import Sequelize from 'sequelize';

const Notifications = db.define('Notifications', {
	notification_id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		allowNull: false
	},
	user_id: {
		type: Sequelize.INTEGER,
		allowNull: false,
		references: {
			model: 'Users',
			key: 'user_id'
		},
		onDelete: 'CASCADE'
	},
	message: {
		type: Sequelize.STRING,
		allowNull: false
	},
	meta: {
		type: Sequelize.TEXT,
		allowNull: true
	},
	is_read: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
}, {
	timestamps: true
});

export default Notifications;
