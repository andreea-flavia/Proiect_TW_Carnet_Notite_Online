import Study_Groups from '../entities/Study_Groups.js';
import Group_Members from '../entities/Group_Members.js';
import Group_Notes from '../entities/Group_Notes.js';

async function createGroup(groupData) {
    return await Study_Groups.create(groupData);
}

async function addMemberToGroup(memberData) {
    return await Group_Members.create(memberData);
}

async function addNoteToGroup(groupNoteData) {
    return await Group_Notes.create(groupNoteData);
}

async function getGroupById(id) {
    return await Study_Groups.findByPk(id);
}

async function getFullGroupDetails(groupId) {
    return await Study_Groups.findByPk(groupId, {
        include:[
            {
                model: Users,
                as: 'members',
                through: { attributes: ['role'] }
            },
            {
                model: Notes,
                as: 'groupNotes'
            }
        ]
    });
}

export { 
    createGroup, 
    addMemberToGroup, 
    addNoteToGroup, 
    getGroupById,
    getFullGroupDetails
};