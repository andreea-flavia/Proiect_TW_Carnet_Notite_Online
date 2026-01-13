import Resources from '../entities/Resources.js';

async function createResource(resource) {
    return await Resources.create(resource);
}

async function getResourcesByNote(noteId) {
    return await Resources.findAll({
        where: { note_id: noteId }
    });
}

async function deleteResource(id) {
    const resource = await Resources.findByPk(id);
    if (!resource) return null;
    return await resource.destroy();
}

export {
    createResource,
    getResourcesByNote,
    deleteResource
};