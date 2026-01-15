import mysql from 'mysql2/promise';
import env from 'dotenv';
import Users from './Users.js';
import Subjects from './Subjects.js';
import Notes from './Notes.js';
import Resources from './Resources.js';
import Tags from './Tags.js';
import Notes_Tags from './Notes_Tags.js';
import Shared_Notes from './Shared_Notes.js';
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

    Study_Groups.belongsToMany(Notes,{through: Group_Notes, foreignKey: 'group_id', as:'groupNotes'});
    Notes.belongsToMany(Study_Groups,{through: Group_Notes, foreignKey: 'note_id', as:'inGroups'});

}

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
}

export default DB_Init;