import express from 'express';
import { shareNote, updatePermissions } from '../dataAccess/SharedNotesDA.js';
import { createGroup, addMemberToGroup, addNoteToGroup } from '../dataAccess/StudyGroupsDA.js';

let collabRouter = express.Router();

// --- SHARED NOTES ---
collabRouter.route('/share').post(async (req, res) => {
    try {
        return res.status(201).json(await shareNote(req.body));
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// --- STUDY GROUPS ---
collabRouter.route('/group').post(async (req, res) => {
    try {
        return res.status(201).json(await createGroup(req.body));
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

//Adaugare membru
collabRouter.route('/group/member').post(async (req, res) => {
    try {
        return res.status(201).json(await addMemberToGroup(req.body));
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

//Adaugare nota in grup
collabRouter.route('/group/note').post(async (req, res) => {
    try {
        return res.status(201).json(await addNoteToGroup(req.body));
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

export default collabRouter;