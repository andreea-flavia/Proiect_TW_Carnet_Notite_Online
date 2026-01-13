import Shared_Notes from '../entities/Shared_Notes.js';


async function shareNote(data) {
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

export { 
    shareNote, 
    getSharedWithMe, 
    updatePermissions 
};