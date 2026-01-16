import mysql from 'mysql2/promise';
import env from 'dotenv';
import Users from './Users.js';
import Subjects from './Subjects.js';
import Notes from './Notes.js';
import Resources from './Resources.js';
import Tags from './Tags.js';
import Notes_Tags from './Notes_Tags.js';
import Shared_Notes from './Shared_Notes.js';
import Favorites from './Favorites.js';
import Notifications from './Notifications.js';
import Study_Groups from './Study_Groups.js';
import Group_Members from './Group_Members.js';
import Group_Notes from './Group_Notes.js';

env.config();

function DB_Create(){
let conn;

    mysql.createConnection({
    user : process.env.DB_USERNAME,
    password : process.env.DB_PASSWORD
    })
    .then((connection) => {
    conn = connection
    return connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_DATABASE}`)
    })
    .then(() => {
    return conn.end()
    })
    .catch((err) => {
    console.warn(err.stack)
    })
}

function PK_Config(){  
    //------------- 1-n -------------//
    Users.hasMany(Notes,{foreignKey: 'user_id', as:'myNotes', onDelete: 'CASCADE'});
    Notes.belongsTo(Users,{foreignKey: 'user_id', as:'author'});

    Notes.hasMany(Resources,{foreignKey: 'note_id', as:'resources', onDelete: 'CASCADE'});
    Resources.belongsTo(Notes,{foreignKey: 'note_id'});

    Subjects.hasMany(Notes,{foreignKey: 'subject_id', as:'notes'});
    Notes.belongsTo(Subjects,{foreignKey: 'subject_id', as:'subject'});

    //------------- n-n -------------//
    Notes.belongsToMany(Tags,{through: Notes_Tags, foreignKey: 'note_id', as:'tags'});
    Tags.belongsToMany(Notes,{through: Notes_Tags, foreignKey: 'tag_id', as:'notes'});

    Users.belongsToMany(Study_Groups,{through: Group_Members, foreignKey: 'user_id', as:'memberOf'});
    Study_Groups.belongsToMany(Users,{through: Group_Members, foreignKey: 'group_id', as:'members'});

    Users.belongsToMany(Notes,{through: Shared_Notes, foreignKey: 'user_id', as:'sharedNotes'});
    Notes.belongsToMany(Users,{through: Shared_Notes, foreignKey: 'note_id', as:'sharedWith'});

        // Favorites
        Users.belongsToMany(Notes, { through: Favorites, foreignKey: 'user_id', as: 'favoriteNotes' });
        Notes.belongsToMany(Users, { through: Favorites, foreignKey: 'note_id', as: 'favoritedBy' });

    Study_Groups.belongsToMany(Notes,{through: Group_Notes, foreignKey: 'group_id', as:'groupNotes'});
    Notes.belongsToMany(Study_Groups,{through: Group_Notes, foreignKey: 'note_id', as:'inGroups'});

}

/*
function DB_Init(){
    DB_Create();
    PK_Config();
    // seed default subjects if table is empty
    try {
        Subjects.findAll().then(list => {
            if(!list || list.length === 0){
                Subjects.bulkCreate([
                    { subject_code: 'BIO101', subject_name: 'Biology', year: 1, semester: 1 },
                    { subject_code: 'MATH101', subject_name: 'Mathematics', year: 1, semester: 1 },
                    { subject_code: 'CS101', subject_name: 'Computer Science', year: 1, semester: 1 },
                    { subject_code: 'HIST101', subject_name: 'History', year: 1, semester: 1 },
                    { subject_code: 'PHYS101', subject_name: 'Physics', year: 1, semester: 1 }
                ]).then(() => console.log('Default subjects seeded')).catch(err => console.warn('Seeding subjects failed', err));
            }
        }).catch(err => console.warn('Failed to check subjects for seeding', err));
    } catch(e){
        console.warn('Error during subjects seeding', e);
    }
}*/

function DB_Init(){
    DB_Create();
    PK_Config();
    
    try {
        Subjects.findAll().then(list => {
            if(!list || list.length === 0){
                Subjects.bulkCreate([
                    // Semestrul 1 - Anul 3
                    { subject_code: 'MM31', subject_name: 'Multimedia', year: 3, semester: 1 },
                    { subject_code: 'DAM31', subject_name: 'Mobile Devices and Applications', year: 3, semester: 1 },
                    { subject_code: 'TW31', subject_name: 'Web Technologies', year: 3, semester: 1 },
                    { subject_code: 'ECO31', subject_name: 'Econometrics', year: 3, semester: 1 },
                    { subject_code: 'DSAD31', subject_name: 'Software Development for Data Analysis', year: 3, semester: 1 },
                    { subject_code: 'PSI31', subject_name: 'Information Systems Design', year: 3, semester: 1 },

                    // Semestrul 2 - Anul 3
                    { subject_code: 'RC32', subject_name: 'Computer Networks', year: 3, semester: 2 },
                    { subject_code: 'SIE32', subject_name: 'Economic Information Systems', year: 3, semester: 2 },
                    { subject_code: 'PS32', subject_name: 'Software Packages', year: 3, semester: 2 },
                    { subject_code: 'DA32', subject_name: 'Business Law', year: 3, semester: 2 },
                    { subject_code: 'CTS32', subject_name: 'Software Quality and Testing', year: 3, semester: 2 },
                    { subject_code: 'SOC32', subject_name: 'Sociology', year: 3, semester: 2 },
                    { subject_code: 'ST32', subject_name: 'Time Series', year: 3, semester: 2 },

                    // Materia speciala
                    { subject_code: 'SELF00', subject_name: 'Self Study', year: 0, semester: 0 }
                ]).then(() => console.log('CSIE Year 3 subjects seeded')).catch(err => console.warn('Seeding subjects failed', err));
            }
        }).catch(err => console.warn('Failed to check subjects for seeding', err));
    } catch(e){
        console.warn('Error during subjects seeding', e);
    }

    //Populare Tags
    try {
        Tags.findAll().then(list => {
            if(!list || list.length === 0){
                Tags.bulkCreate([
                    { tag_name: 'Important', tag_desc: '#EF4444' },    // Rosu (Tailwind red-500)
                    { tag_name: 'Exam', tag_desc: '#F59E0B' },         // Portocaliu (amber-500)
                    { tag_name: 'Laboratory', tag_desc: '#3B82F6' },   // Albastru (blue-500)
                    { tag_name: 'Seminar', tag_desc: '#10B981' },      // Verde (emerald-500)
                    { tag_name: 'Course', tag_desc: '#8B5CF6' },       // Mov (violet-500)
                    { tag_name: 'Project', tag_desc: '#EC4899' },      // Roz (pink-500)
                    { tag_name: 'To Review', tag_desc: '#6B7280' }     // Gri (gray-500)
                ]).then(() => console.log('Tags seeded with colors in description'))
                .catch(err => console.warn('Seeding tags failed', err));
            }
        }).catch(err => console.warn('Failed to check tags table', err));
    } catch(e) {
        console.warn('Error during tags initialization', e);
    }
}




export default DB_Init;