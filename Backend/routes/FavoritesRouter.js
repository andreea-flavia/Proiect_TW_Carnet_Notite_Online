import express from 'express';
import Favorites from '../entities/Favorites.js';
import { addFavorite, removeFavorite, getFavoritesByUser } from '../dataAccess/FavoritesDA.js';

const favRouter = express.Router();

// Safe sync for Favorites table (non-destructive for other tables)
favRouter.get('/favorites/sync', async (req, res) => {
  try {
    await Favorites.sync();
    return res.json({ message: 'Favorites table synced' });
  } catch (err) {
    console.error('Error syncing Favorites table', err);
    return res.status(500).json({ error: err.message });
  }
});

// Get favorites for a user: /api/favorites?user_id=123
favRouter.get('/favorites', async (req, res) => {
  const user_id = req.query.user_id;
  if (!user_id) return res.status(400).json({ error: 'Missing user_id' });
  try {
    const notes = await getFavoritesByUser(user_id);
    return res.json(notes);
  } catch (err) {
    console.error('Error fetching favorites', err);
    return res.status(500).json({ error: err.message });
  }
});

// Add favorite: POST /api/favorites/:note_id  body: { user_id }
favRouter.post('/favorites/:note_id', async (req, res) => {
  const { note_id } = req.params;
  const { user_id } = req.body || {};
  if (!user_id) return res.status(400).json({ error: 'Missing user_id' });
  try {
    const created = await addFavorite(note_id, user_id);
    return res.status(201).json(created);
  } catch (err) {
    console.error('Error adding favorite', err);
    return res.status(500).json({ error: err.message });
  }
});

// Remove favorite: DELETE /api/favorites/:note_id  body: { user_id }
favRouter.delete('/favorites/:note_id', async (req, res) => {
  const { note_id } = req.params;
  const { user_id } = req.body || {};
  if (!user_id) return res.status(400).json({ error: 'Missing user_id' });
  try {
    await removeFavorite(note_id, user_id);
    return res.json({ message: 'removed' });
  } catch (err) {
    console.error('Error removing favorite', err);
    return res.status(500).json({ error: err.message });
  }
});

export default favRouter;
