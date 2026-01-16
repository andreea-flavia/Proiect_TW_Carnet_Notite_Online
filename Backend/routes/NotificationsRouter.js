import express from 'express';
import { addNotification, getNotificationsByUser, markAsRead } from '../dataAccess/NotificationsDA.js';

const notifRouter = express.Router();

// GET /notifications?user_id=1
notifRouter.get('/notifications', async (req, res) => {
	try {
		const user_id = Number(req.query.user_id);
		if (!user_id) return res.status(400).json({ error: 'user_id este necesar' });
		const list = await getNotificationsByUser(user_id);
		return res.json(list);
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
});

// POST /notifications (optional)
notifRouter.post('/notifications', async (req, res) => {
	try {
		const { user_id, message, meta } = req.body;
		if (!user_id || !message) return res.status(400).json({ error: 'user_id și message sunt necesare' });
		const created = await addNotification(Number(user_id), message, meta);
		return res.status(201).json(created);
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
});

// PUT /notifications/:id/read
notifRouter.put('/notifications/:id/read', async (req, res) => {
	try {
		const id = Number(req.params.id);
		if (!id) return res.status(400).json({ error: 'notification_id invalid' });
		const updated = await markAsRead(id);
		if (!updated) return res.status(404).json({ error: 'Notificare inexistentă' });
		return res.json(updated);
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
});

export default notifRouter;
