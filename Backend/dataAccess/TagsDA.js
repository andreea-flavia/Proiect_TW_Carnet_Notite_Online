import Tags from '../entities/Tags.js';
import Notes from '../entities/Notes.js';

async function createTag(tag) {
    return await Tags.create(tag);
}

async function getTags() {
    return await Tags.findAll();
}

async function addTagToNote(noteId, tagId) {
    const note = await Notes.findByPk(noteId);
    const tag = await Tags.findByPk(tagId);
    
    if (note && tag) {
        await note.addTag(tag); 
        return { message: `Tag-ul ${tag.tag_name} a fost adaugat notei.` };
    }
    return null;
}

async function removeTagFromNote(noteId, tagId) {
    const note = await Notes.findByPk(noteId);
    const tag = await Tags.findByPk(tagId);

    if (note && tag) {
        await note.removeTag(tag);
        return { message: `Tag-ul ${tag.tag_name} a fost scos din notita.` };
    }
    return null;
}

export {
    createTag,
    getTags,
    addTagToNote
    , removeTagFromNote
};