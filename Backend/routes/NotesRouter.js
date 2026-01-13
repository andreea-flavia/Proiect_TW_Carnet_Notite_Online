import express from 'express';
import { 
    createNote, 
    getNotes, 
    getNoteFullDetails, 
    updateNote, 
    deleteNote 
} from '../dataAccess/NotesDA.js';

let notesRouter = express.Router();

notesRouter.route('/note')
    .post(async (req, res) => {
        try {
            return res.status(201).json(await createNote(req.body));
        } catch (err) {
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

notesRouter.route('/note/:id')
    .put(async (req, res) => {
        const updated = await updateNote(req.params.id, req.body);
        if (updated) return res.json(updated);
        else return res.status(404).json({ error: 'Note not found' });
    })
    .delete(async (req, res) => {
        const deleted = await deleteNote(req.params.id);
        if (deleted) return res.json({ message: 'Note deleted' });
        else return res.status(404).json({ error: 'Note not found' });  
    });

export default notesRouter;