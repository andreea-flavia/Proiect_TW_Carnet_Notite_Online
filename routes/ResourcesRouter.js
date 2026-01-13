import express from 'express';
import { createResource, getResourcesByNote, deleteResource } from '../dataAccess/ResourcesDA.js';

let resourcesRouter = express.Router();

resourcesRouter.route('/resource').post(async (req, res) => {
    try {
        const newResource = await createResource(req.body);
        return res.status(201).json(newResource);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

resourcesRouter.route('/resource/note/:noteId').get(async (req, res) => {
    try {
        const resources = await getResourcesByNote(req.params.noteId);
        return res.json(resources);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

resourcesRouter.route('/resource/:id').delete(async (req, res) => {
    try {
        const deleted = await deleteResource(req.params.id);
        if (deleted) return res.json({ message: "Resource deleted successfully" });
        return res.status(404).json({ message: "Resource not found" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

export default resourcesRouter;