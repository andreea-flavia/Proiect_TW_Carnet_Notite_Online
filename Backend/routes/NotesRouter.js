import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { 
    createNote, 
    getNotes, 
    getNoteFullDetails, 
    updateNote, 
    deleteNote 
} from '../dataAccess/NotesDA.js';

import { addTagToNote } from '../dataAccess/TagsDA.js';
import { createResource } from '../dataAccess/ResourcesDA.js';

let notesRouter = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'Backend', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, unique + '-' + file.originalname);
    }
});

const upload = multer({ storage });

notesRouter.route('/note')
    .post(upload.array('attachments'), async (req, res) => {
        try {
            const body = req.body || {};
            const notePayload = {
                title: body.title,
                content: body.content,
                user_id: body.user_id ? Number(body.user_id) : null,
                subject_id: body.subject_id ? Number(body.subject_id) : null,
                is_public: body.is_public === 'true' || body.is_public === true || body.is_public === '1'
            };

            const note = await createNote(notePayload);

            if (note && body.tagIds) {
                let tags = body.tagIds;
                if (typeof tags === 'string') {
                    try { tags = JSON.parse(tags); } catch(e) { tags = [tags]; }
                }
                if (Array.isArray(tags)) {
                    await addTagToNote(note.note_id, tags);
                }
            }

            if (req.files && req.files.length > 0) {
                for (const f of req.files) {
                    await createResource({
                        note_id: note.note_id,
                        resource_url: `/uploads/${f.filename}`,
                        resource_type: 'FILE',
                        resource_name: f.originalname
                    });
                }
            }

            return res.status(201).json(note);
        } catch (err) {
            console.error("Error in POST /note:", err);
            return res.status(500).json({ error: err.message });
        }
    })
    .get(async (req, res) => {
        return res.json(await getNotes());
    });

notesRouter.route('/note/:id/details')
    .get(async (req, res) => {
        try{
            const note = await getNoteFullDetails(req.params.id);
            if(note) return res.json(note);
            else return res.status(404).json({error: 'Note not found'});
        } catch(err){
            return res.status(500).json({error: err.message});
        }
    });

// Support updating a note and appending new attachments
notesRouter.route('/note/:id')
    .put(async (req, res) => {
        try {
            if (req.is && req.is('multipart/form-data')) {
                await new Promise((resolve, reject) => {
                    upload.array('attachments')(req, res, (err) => {
                        if (err) return reject(err);
                        resolve();
                    });
                });
            }

            const body = req.body || {};
            const noteData = {};
            if (Object.prototype.hasOwnProperty.call(body, 'title')) noteData.title = body.title;
            if (Object.prototype.hasOwnProperty.call(body, 'content')) noteData.content = body.content;
            if (Object.prototype.hasOwnProperty.call(body, 'user_id')) noteData.user_id = body.user_id ? Number(body.user_id) : null;
            if (Object.prototype.hasOwnProperty.call(body, 'subject_id')) noteData.subject_id = body.subject_id ? Number(body.subject_id) : null;
            if (Object.prototype.hasOwnProperty.call(body, 'is_public')) noteData.is_public = (body.is_public === 'true' || body.is_public === true || body.is_public === '1');

            const updated = await updateNote(req.params.id, noteData);
            if (!updated) return res.status(404).json({ error: 'Note not found' });

            if (body.tagIds) {
                let tags = body.tagIds;
                if (typeof tags === 'string') {
                    try { tags = JSON.parse(tags); } catch(e) { tags = [tags]; }
                }
                if (Array.isArray(tags)) {
                    await addTagToNote(req.params.id, tags);
                }
            }

            if (req.files && req.files.length > 0) {
                for (const f of req.files) {
                    await createResource({
                        note_id: Number(req.params.id),
                        resource_url: `/uploads/${f.filename}`,
                        resource_type: 'FILE',
                        resource_name: f.originalname
                    });
                }
            }

            return res.json(updated);
        } catch (err) {
            console.error('Error in PUT /note/:id', err);
            return res.status(500).json({ error: err.message });
        }
    })
    .delete(async (req, res) => {
        const deleted = await deleteNote(req.params.id);
        if (deleted) return res.json({ message: 'Note deleted' });
        else return res.status(404).json({ error: 'Note not found' });  
    });

export default notesRouter;