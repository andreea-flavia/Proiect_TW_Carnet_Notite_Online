import express from 'express';
import {
    createSubject,
    getAllSubjects,
    getSubjectById,
    getSubjectByTerm,
    updateSubject,
    deleteSubject
} from '../dataAccess/SubjectsDA.js';

let subjectsRouter = express.Router();

subjectsRouter.route('/subject')
    .post(async(req,res) => {
        try{
            return res.status(201).json(await createSubject(req.body));
        } catch(err){
            return res.status(500).json({error: err.message});
        }
    })
    .get(async(req,res) => {
        return res.json(await getAllSubjects());
    });

subjectsRouter.route('/subject/filter')
    .get(async(req,res) => {
        try{
            const {year, semester} = req.query;
            return res.json(await getSubjectByTerm(year, semester));
        } catch(err){
            return res.status(500).json({error: err.message});
        }
    });

subjectsRouter.route('/subject/:id')
    .get(async(req,res) => {
        const subject = await getSubjectById(req.params.id);
        if(subject) return res.json(subject);
        else  return res.status(404).json({error: 'Subject not found'});
    })
    .put(async(req,res) => {
        const updated = await updateSubject(req.params.id, req.body);
        if(updated) return  res.json(updated);
        else return res.status(404).json({error: 'Subject not found'});
    })
    .delete(async(req,res) => {
        const deleted = await deleteSubject(req.params.id);
        if(deleted) return res.json({message: 'Subject deleted'});
        else return res.status(404).json({error: 'Subject not found'});
    })

    export default subjectsRouter;