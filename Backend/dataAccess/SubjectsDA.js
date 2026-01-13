import Subjects from "../entities/Subjects.js";

async function createSubject(subject){
    return await Subjects.create(subject);
}

async function getAllSubjects(){
    return await Subjects.findAll();
}

async function getSubjectById(id){
    return await Subjects.findByPk(id);
}

//filtru an si sem
async function getSubjectByTerm(year, semester){
    return await Subjects.findAll({
        where: {
            year: year,
            semester: semester
        }
    });
}

async function updateSubject(id, updatedSubject){
    const subject = await Subjects.findByPk(id);
    if(!subject) return null;
    return await subject.update(updatedSubject);
}

async function deleteSubject(id){
    const subject = await Subjects.findByPk(id);
    if(!subject) return null;
    return await subject.destroy();
}

export {
    createSubject,
    getAllSubjects,
    getSubjectById,
    getSubjectByTerm,
    updateSubject,
    deleteSubject
}