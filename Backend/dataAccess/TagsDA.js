import Tags from '../entities/Tags.js';
import Notes from '../entities/Notes.js';

async function createTag(tag) {
    return await Tags.create(tag);
}

async function getTags() {
    return await Tags.findAll();
}

async function addTagToNote(noteId, tagIds) {
    // const note = await Notes.findByPk(noteId);
    // const tag = await Tags.findByPk(tagId);
    
    // if (note && tag) {
    //     await note.addTag(tag); 
    //     return { message: `Tag-ul ${tag.tag_name} a fost adaugat notei.` };
    // }
    // return null;
    try {
        const note = await Notes.findByPk(noteId);
        
        if (note) {
            // Acum tagIds va fi recunoscut pentru ca l-am pus in paranteze mai sus
            await note.setTags(tagIds); 
            
            return { 
                success: true, 
                message: `Tag-urile au fost actualizate pentru nota ${noteId}.` 
            };
        }
        return { success: false, message: "Nota nu a fost gasita." };
    } catch (err) {
        console.error("Error in addTagToNote:", err);
        throw err;
    }
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