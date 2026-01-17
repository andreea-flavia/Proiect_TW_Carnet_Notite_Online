import Study_Groups from '../entities/Study_Groups.js';
import Group_Members from '../entities/Group_Members.js';
import Group_Notes from '../entities/Group_Notes.js';
import Users from '../entities/Users.js';
import Notes from '../entities/Notes.js';
import Subjects from '../entities/Subjects.js';
import Tags from '../entities/Tags.js';

const generateGroupCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};

async function createGroup(groupData) {
    groupData.group_code = generateGroupCode();
    const newGroup = await Study_Groups.create(groupData);

    if (newGroup && newGroup.group_id) {
        await Group_Members.create({
            user_id: groupData.created_by,
            group_id: newGroup.group_id,
            role: 'ADMIN'
        });
    }
    return newGroup;
}

async function addMemberToGroup(userId, groupCode) {
    const group = await Study_Groups.findOne({ where: { group_code: groupCode } });
    if (!group) throw new Error("Codul este invalid.");

    const isMember = await Group_Members.findOne({
        where: { user_id: userId, group_id: group.group_id }
    });
    if (isMember) throw new Error("Esti deja membru in acest grup.");

    return await Group_Members.create({
        user_id: userId,
        group_id: group.group_id,
        role: 'MEMBER'
    });
}

async function addNoteToGroup(noteId, groupId, userId) {
    const existing = await Group_Notes.findOne({ where: { note_id: noteId } });

    if (existing) {
        console.log("Nota exista deja intr-un grup. Actualizam asocierea...");
        return await existing.update({
            group_id: parseInt(groupId),
        });
    }
    try {
        console.log("Date primite in DA:", { noteId, groupId, userId });

        return await Group_Notes.create({
            group_id: parseInt(groupId),
            note_id: parseInt(noteId),
            created_by: parseInt(userId)
        });
    } catch (err) {
        console.error("Eroare Sequelize in DA:", err);
        throw err;
    }
}

async function getGroupById(id) {
    return await Study_Groups.findByPk(id);
}

async function removeMemberFromGroup(groupId, memberId) {
    const member = await Group_Members.findOne({
        where: { group_id: groupId, user_id: memberId }
    });

    if (!member) throw new Error("Member not found in this group");
    if (member.role === 'ADMIN') throw new Error("Cannot remove admin members");

    return await member.destroy();
}

async function getFullGroupDetails(groupId) {
    return await Study_Groups.findByPk(groupId, {
        include: [
            {
                model: Users,
                as: 'members',
                through: { attributes: ['role'] }
            },
            {
                model: Notes,
                as: 'groupNotes',
                include: [
                    { model: Users, as: 'author', attributes: ['user_first_name', 'user_last_name'] },
                    { model: Subjects, as: 'subject', attributes: ['subject_id', 'subject_name'] },
                    { model: Tags, as: 'tags', through: { attributes: [] } }
                ]
            }
        ]
    });
}

async function leaveGroup(groupId, userId) {
    try {
        return await Group_Members.destroy({
            where: {
                user_id: userId,
                group_id: groupId
            }
        });
    } catch (e) {
        console.error("Error leaving group:", e);
        throw e;
    }
}

async function deleteGroup(groupId) {
    try {
        return await Study_Groups.destroy({
            where: { group_id: groupId }
        });
    } catch (e) {
        console.error("Error deleting group:", e);
        throw e;
    }
}


export {
    createGroup,
    addMemberToGroup,
    addNoteToGroup,
    getGroupById,
    removeMemberFromGroup,
    getFullGroupDetails,
    deleteGroup
};