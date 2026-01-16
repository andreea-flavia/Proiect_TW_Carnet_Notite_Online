import Notifications from '../entities/Notifications.js';

function serializeMeta(meta) {
    if (meta === null || meta === undefined) return null;
    try { return JSON.stringify(meta); } catch { return null; }
}

function deserializeMeta(meta) {
    if (!meta) return null;
    try { return JSON.parse(meta); } catch { return null; }
}

async function addNotification(user_id, message, meta = null){
    const created = await Notifications.create({
        user_id,
        message,
        meta: serializeMeta(meta)
    });
    return {
        ...created.toJSON(),
        meta: deserializeMeta(created.meta)
    };
}

async function getNotificationsByUser(user_id){
    const list = await Notifications.findAll({
        where: { user_id },
        order: [['createdAt', 'DESC']]
    });
    return list.map(n => ({
        ...n.toJSON(),
        meta: deserializeMeta(n.meta)
    }));
}

async function markAsRead(notification_id){
    const notif = await Notifications.findByPk(notification_id);
    if (!notif) return null;
    const updated = await notif.update({ is_read: true });
    return {
        ...updated.toJSON(),
        meta: deserializeMeta(updated.meta)
    };
}

export { addNotification, getNotificationsByUser, markAsRead };
