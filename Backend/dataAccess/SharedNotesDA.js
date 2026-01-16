import Shared_Notes from '../entities/Shared_Notes.js';
import Users from '../entities/Users.js';
import Notes from '../entities/Notes.js';


async function shareNote(data) {
    const existing = await Shared_Notes.findOne({
        where: { note_id: data.note_id, user_id: data.user_id }
    });
    if (existing) return existing;
    return await Shared_Notes.create(data);
}


async function getSharedWithMe(userId) {
    return await Shared_Notes.findAll({
        where: { user_id: userId }
    });
}


async function updatePermissions(noteId, userId, newPermission) {
    const share = await Shared_Notes.findOne({
        where: { note_id: noteId, user_id: userId }
    });
    if (!share) return null;
    return await share.update({ permission_type: newPermission });
}

async function getNoteCollaborators(noteId) {
    const note = await Notes.findByPk(noteId, {
        include: [{
            model: Users,
            as: 'sharedWith',
            attributes: ['user_id', 'user_first_name', 'user_last_name', 'user_mail'],
            through: { attributes: ['permission_type'] }
        }]
    });
    if (!note) return null;

    return (note.sharedWith || []).map(u => ({
        user_id: u.user_id,
        user_first_name: u.user_first_name,
        user_last_name: u.user_last_name,
        email: u.user_mail,
        permission_type: u.Shared_Notes?.permission_type
    }));
}

export { 
    shareNote, 
    getSharedWithMe, 
    updatePermissions,
    getNoteCollaborators
};