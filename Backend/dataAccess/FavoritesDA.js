import Favorites from '../entities/Favorites.js';
import Notes from '../entities/Notes.js';
import Users from '../entities/Users.js';
import Subjects from '../entities/Subjects.js';
import Tags from '../entities/Tags.js';

async function addFavorite(note_id, user_id){
    return await Favorites.create({ note_id, user_id });
}

async function removeFavorite(note_id, user_id){
    return await Favorites.destroy({ where: { note_id, user_id } });
}

async function getFavoritesByUser(user_id){
    return await Notes.findAll({
        include: [
            { model: Users, as: 'favoritedBy', where: { user_id }, through: { attributes: [] } },
            { model: Subjects, as: 'subject' },
            { model: Tags, as: 'tags', through: { attributes: [] } }
        ],
        order: [['createdAt', 'DESC']]
    });
}

export { addFavorite, removeFavorite, getFavoritesByUser };
