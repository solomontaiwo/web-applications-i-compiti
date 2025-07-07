import express from 'express';
import { isTeacher } from '../index.mjs';
import {
  createAssignment,
  getAssignmentResponse,
  evaluateAssignment,
  getClassStatus,
  getAllStudents,
  getAllAssignments
} from '../controllers/teacher.controller.mjs';
import { 
  validateAssignmentCreation, 
  validateEvaluation, 
  validateSortParameter 
} from '../middleware/validation.middleware.mjs';
import { asyncHandler } from '../middleware/error.middleware.mjs';

const router = express.Router();

// Rotta per creare un compito
router.post('/assignments', isTeacher, validateAssignmentCreation, asyncHandler(createAssignment));

// Rotta per ottenere la risposta a un compito
router.get('/assignments/:id/response', isTeacher, asyncHandler(getAssignmentResponse));

// Rotta per valutare un compito
router.put('/assignments/:id/evaluate', isTeacher, validateEvaluation, asyncHandler(evaluateAssignment));

// Rotta per ottenere lo stato della classe
router.get('/class-status', isTeacher, validateSortParameter, asyncHandler(getClassStatus));

// Rotta per ottenere tutti gli studenti
router.get('/students', isTeacher, asyncHandler(getAllStudents));

// Rotta per ottenere tutti i compiti
router.get('/assignments', isTeacher, asyncHandler(getAllAssignments));

export default router;