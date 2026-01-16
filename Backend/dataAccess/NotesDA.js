import Notes from '../entities/Notes.js';
import Subjects from '../entities/Subjects.js';
import Resources from '../entities/Resources.js';
import Tags from '../entities/Tags.js';

async function createNote(note){
    return await Notes.create(note);
}

async function getNotes() {
    try {
        return await Notes.findAll({
            include: [
                { 
                    model: Subjects, 
                    as: 'subject'
                },
                { 
                    model: Tags, 
                    as: 'tags', // TREBUIE sa fie identic cu alias-ul din index.js
                    through: { attributes: [] } // Aceasta linie curata raspunsul de datele intermediare din notes_tags
                }
            ],
            order: [['createdAt', 'DESC']]
        });
    } catch (err) {
        console.error("Error fetching notes with tags:", err);
        throw err;
    }
}

async function getNoteFullDetails(id) {
    return await Notes.findByPk(id, {
        include: [
            { model: Subjects, as: 'subject' },
            { model: Resources, as: 'resources' },
            { model: Tags, as: 'tags' }
        ]
    });
}

async function updateNote(id, noteData) {
    const note = await Notes.findByPk(id);
    if (!note) return null;
    return await note.update(noteData);
}

async function deleteNote(id) {
    const note = await Notes.findByPk(id);
    if (!note) return null;
    return await note.destroy();
}

export {
    createNote,
    getNotes,
    getNoteFullDetails,
    updateNote,
    deleteNote
};