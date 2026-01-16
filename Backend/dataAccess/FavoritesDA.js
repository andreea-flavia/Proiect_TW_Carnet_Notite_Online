import Favorites from '../entities/Favorites.js';
import Notes from '../entities/Notes.js';

async function addFavorite(note_id, user_id){
    const [record, created] = await Favorites.findOrCreate({
        where: { note_id: Number(note_id), user_id: Number(user_id) },
        defaults: { note_id: Number(note_id), user_id: Number(user_id) }
    });
    return record;
}

async function removeFavorite(note_id, user_id){
    return await Favorites.destroy({ where: { note_id: Number(note_id), user_id: Number(user_id) } });
}

async function getFavoritesByUser(user_id){
    const favs = await Favorites.findAll({ where: { user_id: Number(user_id) } });
    const noteIds = favs.map(f => f.note_id);
    if(noteIds.length === 0) return [];
    return await Notes.findAll({ where: { note_id: noteIds }, include: [{ all: true, nested: true }] });
}

export { addFavorite, removeFavorite, getFavoritesByUser };
