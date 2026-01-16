import express from 'express';
import { addFavorite, removeFavorite, getFavoritesByUser } from '../dataAccess/FavoritesDA.js';

const favRouter = express.Router();

// GET /favorites?user_id=1
favRouter.get('/favorites', async (req, res) => {
	try {
		const user_id = Number(req.query.user_id);
		if (!user_id) return res.status(400).json({ error: 'user_id este necesar' });
		const favs = await getFavoritesByUser(user_id);
		return res.json(favs);
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
});

// POST /favorites/:note_id
favRouter.post('/favorites/:note_id', async (req, res) => {
	try {
		const note_id = Number(req.params.note_id);
		const user_id = Number(req.body.user_id);
		if (!note_id || !user_id) return res.status(400).json({ error: 'note_id și user_id sunt necesare' });
		const created = await addFavorite(note_id, user_id);
		return res.status(201).json(created);
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
});

// DELETE /favorites/:note_id
favRouter.delete('/favorites/:note_id', async (req, res) => {
	try {
		const note_id = Number(req.params.note_id);
		const user_id = Number(req.body.user_id);
		if (!note_id || !user_id) return res.status(400).json({ error: 'note_id și user_id sunt necesare' });
		await removeFavorite(note_id, user_id);
		return res.json({ message: 'removed' });
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
});

export default favRouter;
