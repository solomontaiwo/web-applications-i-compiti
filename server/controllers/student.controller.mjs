import {
    getOpenAssignmentsFromDb,
    getStudentResults,
    insertOrUpdateStudentResponse
} from '../dao/student.dao.mjs';
import { ValidationError } from '../middleware/error.middleware.mjs';

// Ottieni i compiti aperti per lo studente loggato
export async function getOpenAssignments(req, res) {
    const assignments = await getOpenAssignmentsFromDb(req.user.id);
    res.json(assignments);
}

// Invia o aggiorna la risposta a un compito
export async function submitResponse(req, res) {
    const { id } = req.params;
    const { answer } = req.body;

    // La validazione di ID e answer è gestita dal middleware
    const assignmentId = id; // Già convertito dal middleware

    const result = await insertOrUpdateStudentResponse(req.user.id, assignmentId, answer);

    // Se il DAO restituisce un errore, lo propaga come ValidationError
    if (result.error) {
        throw new ValidationError(result.error);
    }

    res.status(200).json({ 
        message: 'Risposta salvata con successo',
        assignmentId: assignmentId
    });
}

// Ottieni i risultati e la media dello studente
export async function getMyResults(req, res) {
    const data = await getStudentResults(req.user.id);
    res.json(data);
}