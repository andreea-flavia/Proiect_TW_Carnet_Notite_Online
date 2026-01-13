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
}

export default DB_Init;