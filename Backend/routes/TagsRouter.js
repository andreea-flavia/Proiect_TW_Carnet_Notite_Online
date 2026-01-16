import express from 'express';
import { createTag, getTags, addTagToNote, removeTagFromNote } from '../dataAccess/TagsDA.js';

let tagsRouter = express.Router();

tagsRouter.route('/tag')
    .post(async (req, res) => {
        try {
            return res.status(201).json(await createTag(req.body));
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    })
    .get(async (req, res) => {
        return res.json(await getTags());
    });

    tagsRouter.route('/tag/assign/note/:noteId/tag/:tagId').post(async (req, res) => {
    try {
        const result = await addTagToNote(req.params.noteId, req.params.tagId);
        if (result) return res.json(result);
        return res.status(404).json({ message: "Note or Tag not found" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

    tagsRouter.route('/tag/assign/note/:noteId/tag/:tagId').delete(async (req, res) => {
        try {
            const result = await removeTagFromNote(req.params.noteId, req.params.tagId);
            if (result) return res.json(result);
            return res.status(404).json({ message: "Note or Tag not found" });
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    });

export default tagsRouter;