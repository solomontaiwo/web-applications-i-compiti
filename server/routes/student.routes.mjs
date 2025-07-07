import express from 'express';
import { isStudent } from '../index.mjs';
import {
    getOpenAssignments,
    submitResponse,
    getMyResults
} from '../controllers/student.controller.mjs';
import { validateAssignmentResponse } from '../middleware/validation.middleware.mjs';
import { asyncHandler } from '../middleware/error.middleware.mjs';

const router = express.Router();

// Rotta per ottenere i compiti aperti per lo studente loggato
router.get('/my-open-assignments', isStudent, asyncHandler(getOpenAssignments));

// Rotta per inviare o aggiornare la risposta a un compito
router.put('/assignments/:id/response', isStudent, validateAssignmentResponse, asyncHandler(submitResponse));

// Rotta per ottenere i risultati e la media dello studente
router.get('/my-results', isStudent, asyncHandler(getMyResults));

export default router;
