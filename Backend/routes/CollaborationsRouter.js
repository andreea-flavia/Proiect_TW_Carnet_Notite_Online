
import express from 'express';
import { shareNote, updatePermissions, getNoteCollaborators } from '../dataAccess/SharedNotesDA.js';
import { createGroup, addMemberToGroup, addNoteToGroup, getFullGroupDetails, removeMemberFromGroup } from '../dataAccess/StudyGroupsDA.js';
import { getUserByEmail } from '../dataAccess/UsersDA.js';
import Notes from '../entities/Notes.js';
import { addNotification } from '../dataAccess/NotificationsDA.js';
import Group_Notes from '../entities/Group_Notes.js';

let collabRouter = express.Router();

// --- SHARED NOTES ---
collabRouter.route('/share').post(async (req, res) => {
    try {
        return res.status(201).json(await shareNote(req.body));
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// Compatibilitate cu frontend: trimite invitație la notă (când frontend folosește /api/note/share)
collabRouter.route('/note/share').post(async (req, res) => {
    try {
        const { note_id, email, owner_id, permission_type } = req.body;
        if (!note_id || !email) {
            return res.status(400).json({ error: 'note_id și email sunt necesare', message: 'note_id și email sunt necesare' });
        }

        const noteIdNum = Number(note_id);
        if (Number.isNaN(noteIdNum)) {
            return res.status(400).json({ error: 'note_id invalid', message: 'note_id invalid' });
        }

        const note = await Notes.findByPk(noteIdNum);
        if (!note) {
            return res.status(404).json({ error: 'Notița nu a fost găsită', message: 'Notița nu a fost găsită' });
        }

        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ error: 'Utilizatorul invitat nu a fost găsit', message: 'Utilizatorul invitat nu a fost găsit' });
        }

        if (owner_id && Number(owner_id) === Number(user.user_id)) {
            return res.status(400).json({ error: 'Nu poți invita proprietarul notei', message: 'Nu poți invita proprietarul notei' });
        }

        const shareData = {
            note_id: noteIdNum,
            user_id: user.user_id,
            permission_type: permission_type || 'VIEW'
        };

        const created = await shareNote(shareData);
        await addNotification(
            user.user_id,
            `Ai fost invitat(ă) la notița "${note.title}"`,
            { note_id: noteIdNum }
        );
        return res.status(201).json(created);
    } catch (err) {
        console.error('Error in POST /note/share:', err);
        return res.status(500).json({ error: err.message, message: err.message });
    }
});

// Lista colaboratorilor pentru o notiță
collabRouter.route('/note/:id/collaborators').get(async (req, res) => {
    try {
        const noteIdNum = Number(req.params.id);
        if (Number.isNaN(noteIdNum)) {
            return res.status(400).json({ error: 'note_id invalid', message: 'note_id invalid' });
        }

        const collaborators = await getNoteCollaborators(noteIdNum);
        if (collaborators === null) {
            return res.status(404).json({ error: 'Notița nu a fost găsită', message: 'Notița nu a fost găsită' });
        }

        return res.json(collaborators);
    } catch (err) {
        console.error('Error in GET /note/:id/collaborators:', err);
        return res.status(500).json({ error: err.message, message: err.message });
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
        const { user_id, group_code } = req.body;
        const result = await addMemberToGroup(user_id, group_code);
        return res.status(201).json(result);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
});

//Stergere membru din grup
collabRouter.route('/group/:groupId/member/:memberId').delete(async (req, res) => {
    try {
        const { groupId, memberId } = req.params;
        const result = await removeMemberFromGroup(groupId, memberId);
        return res.status(200).json({ message: "Member removed successfully", data: result });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
});

//Adaugare nota in grup
collabRouter.post('/group/note', async (req, res) => {
    try {
        const {group_id, note_id, created_by} = req.body;
        console.log("!!! RUTA GASITA !!!", {group_id, note_id, created_by});

        if (!group_id || !note_id || !created_by) {
            return res.status(400).json({ error: "Incomplete data!" });
        }

        const newLink = await Group_Notes.create({
            group_id: group_id,
            note_id: note_id,
            created_by: created_by
        });

        return res.status(201).json({
            message: "Successfully added note to group.",
            data: newLink
        });
    } catch(e){
        console.error("Backend Error: ", e);

        if(e.name === 'SequelizeUniqueConstraintError')
            return res.status(400).json({ message: "Note already added to this group." });
        return res.status(500).json({ message: e.message });
    }
});

collabRouter.route('/group/:groupId/full').get(async (req, res) => {
    try {
        const { groupId } = req.params;
        const groupDetails = await getFullGroupDetails(groupId);
        
        if (!groupDetails) {
            return res.status(404).json({ error: "Group not found" });
        }
        
        return res.status(200).json(groupDetails);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

export default collabRouter;