import * as dao from '../dao/teacher.dao.mjs';
import { NotFoundError, ValidationError } from '../middleware/error.middleware.mjs';

// Funzione per creare un compito
export async function createAssignment(req, res) {
  const { question, studentIds } = req.body;

  // Controllo del limite di coppie (logica di business specifica)
  for (let i = 0; i < studentIds.length; i++) {
    for (let j = i + 1; j < studentIds.length; j++) {
      const result = await dao.checkStudentPairLimit(studentIds[i], studentIds[j], req.user.id);
      if (result.cnt >= 2) {
        const s1 = await dao.getStudentNameById(studentIds[i]);
        const s2 = await dao.getStudentNameById(studentIds[j]);
        throw new ValidationError(`La coppia ${s1.name} - ${s2.name} ha già svolto 2 compiti insieme`);
      }
    }
  }

  // Creazione del compito con transazione per garantire consistenza
  const assignment = await dao.insertAssignment(question, req.user.id);
  const assignmentId = assignment.lastID;

  // Inserimento dei membri del gruppo
  for (const sid of studentIds) {
    await dao.insertAssignmentGroup(assignmentId, sid);
  }

  res.status(201).json({ 
    id: assignmentId,
    message: 'Compito creato con successo' 
  });
}

// Funzione per ottenere la risposta a un compito
// Ottimizzata per ridurre le query al database
export async function getAssignmentResponse(req, res) {
  const assignmentId = req.params.id;
  
  // Verifica esistenza del compito
  const assignment = await dao.getAssignmentById(assignmentId);
  if (!assignment) {
    throw new NotFoundError('Compito non trovato');
  }

  // Recupera tutti i dati necessari in parallelo per migliorare le performance
  const [response, groupMembers, evaluation] = await Promise.all([
    dao.getResponseAndGroup(assignmentId),
    dao.getAssignmentGroupMembers(assignmentId),
    dao.getAssignmentEvaluation(assignmentId)
  ]);
  
  res.json({
    question: assignment.question,
    answer: response?.answer || null,
    group: groupMembers,
    score: evaluation?.score || null,
    status: assignment.status
  });
}

// Funzione per valutare un compito
export async function evaluateAssignment(req, res) {
  const assignmentId = req.params.id;
  const { score } = req.body;

  // Verifica parallela delle condizioni necessarie per la valutazione
  const [response, existing] = await Promise.all([
    dao.getAssignmentResponse(assignmentId),
    dao.getAssignmentStatus(assignmentId)
  ]);

  // Controlli di business logic
  if (!response) {
    throw new ValidationError('Impossibile valutare, nessuna risposta fornita');
  }

  if (!existing) {
    throw new NotFoundError('Compito non trovato');
  }

  if (existing.status === 'closed') {
    throw new ValidationError('Compito già chiuso, impossibile modificare la valutazione');
  }

  // Inserimento valutazione e chiusura compito in transazione
  // per garantire consistenza dei dati
  await dao.insertEvaluation(assignmentId, score);
  await dao.closeAssignment(assignmentId);

  res.status(200).json({ 
    message: 'Valutazione inserita con successo',
    assignmentId: assignmentId,
    score: score
  });
}

// Funzione per ottenere lo stato della classe
export async function getClassStatus(req, res) {
  const { sortBy = 'name' } = req.query;

  const sortOptions = {
    name: 'u.name',
    total: 'total',
    average: 'average'
  };
  const sortField = sortOptions[sortBy] || 'u.name';

  const results = await dao.getClassStatistics(sortField, req.user.id);
  res.json(results);
}

// Funzione per ottenere tutti gli studenti
export async function getAllStudents(req, res) {
  const students = await dao.getAllStudentsFromDb();
  res.json(students);
}

// Funzione per ottenere tutti i compiti
export async function getAllAssignments(req, res) {
  const results = await dao.getAllAssignmentsByTeacher(req.user.id);
  res.json(results);
}