// Middleware per la validazione centralizzata degli input
// Migliora la sicurezza e riduce la duplicazione di codice di validazione

export function validateAssignmentCreation(req, res, next) {
    const { question, studentIds } = req.body;
    
    // Validazione della domanda
    if (!question || typeof question !== 'string' || question.trim().length === 0) {
        return res.status(400).json({ error: 'La domanda è obbligatoria e deve essere una stringa non vuota' });
    }
    
    if (question.length > 1000) {
        return res.status(400).json({ error: 'La domanda non può superare i 1000 caratteri' });
    }
    
    // Validazione degli studenti
    if (!Array.isArray(studentIds)) {
        return res.status(400).json({ error: 'Gli studenti devono essere forniti come array' });
    }
    
    if (studentIds.length < 2 || studentIds.length > 6) {
        return res.status(400).json({ error: 'Il gruppo deve avere da 2 a 6 studenti' });
    }
    
    // Validazione che tutti gli ID siano numeri interi positivi
    const invalidIds = studentIds.filter(id => !Number.isInteger(id) || id <= 0);
    if (invalidIds.length > 0) {
        return res.status(400).json({ error: 'Tutti gli ID studenti devono essere numeri interi positivi' });
    }
    
    // Validazione che non ci siano duplicati
    const uniqueIds = new Set(studentIds);
    if (uniqueIds.size !== studentIds.length) {
        return res.status(400).json({ error: 'Non possono esserci studenti duplicati nel gruppo' });
    }
    
    next();
}

export function validateAssignmentResponse(req, res, next) {
    const { answer } = req.body;
    const { id } = req.params;
    
    // Validazione dell'ID assignment
    const assignmentId = parseInt(id, 10);
    if (isNaN(assignmentId) || assignmentId <= 0) {
        return res.status(400).json({ error: 'ID compito non valido' });
    }
    
    // Validazione della risposta
    if (!answer || typeof answer !== 'string' || answer.trim().length === 0) {
        return res.status(400).json({ error: 'La risposta è obbligatoria e deve essere una stringa non vuota' });
    }
    
    if (answer.length > 5000) {
        return res.status(400).json({ error: 'La risposta non può superare i 5000 caratteri' });
    }
    
    // Sanitizzazione della risposta
    req.body.answer = answer.trim();
    req.params.id = assignmentId;
    
    next();
}

export function validateEvaluation(req, res, next) {
    const { score } = req.body;
    const { id } = req.params;
    
    // Validazione dell'ID assignment
    const assignmentId = parseInt(id, 10);
    if (isNaN(assignmentId) || assignmentId <= 0) {
        return res.status(400).json({ error: 'ID compito non valido' });
    }
    
    // Validazione del punteggio
    if (typeof score !== 'number' || !Number.isInteger(score)) {
        return res.status(400).json({ error: 'Il punteggio deve essere un numero intero' });
    }
    
    if (score < 0 || score > 30) {
        return res.status(400).json({ error: 'Il punteggio deve essere compreso tra 0 e 30' });
    }
    
    req.params.id = assignmentId;
    next();
}

export function validateSortParameter(req, res, next) {
    const { sortBy } = req.query;
    
    // Parametri di ordinamento consentiti per sicurezza
    const allowedSortFields = ['name', 'total', 'average'];
    
    if (sortBy && !allowedSortFields.includes(sortBy)) {
        return res.status(400).json({ error: 'Parametro di ordinamento non valido' });
    }
    
    next();
} 