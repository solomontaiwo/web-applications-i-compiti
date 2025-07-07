// Middleware per la gestione centralizzata degli errori
// Fornisce risposte uniformi al client e logging essenziale

// Middleware per wrappare le funzioni async e catturare errori
export function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}

// Middleware per gestire errori del database
export function handleDatabaseError(error, req, res, next) {
    // Log essenziale per debugging
    console.error('DATABASE ERROR:', error.message);
    
    // Errori SQLite specifici
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return res.status(409).json({ 
            error: 'Conflitto: il dato inserito violerebbe un vincolo di unicità' 
        });
    }
    
    if (error.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
        return res.status(400).json({ 
            error: 'Errore: riferimento a dati non esistenti' 
        });
    }
    
    // Errore generico del database
    res.status(500).json({ 
        error: 'Errore interno del database' 
    });
}

// Middleware principale per gestione errori
export function errorHandler(error, req, res, next) {
    // Log essenziale dell'errore
    console.error('ERROR:', error.message);
    
    // Se è un errore di database, usa il gestore specifico
    if (error.code && error.code.startsWith('SQLITE')) {
        return handleDatabaseError(error, req, res, next);
    }
    
    // Gestione errori di validazione
    if (error.name === 'ValidationError') {
        return res.status(400).json({ 
            error: error.message 
        });
    }
    
    // Gestione errori di autenticazione
    if (error.name === 'UnauthorizedError') {
        return res.status(401).json({ 
            error: 'Accesso non autorizzato' 
        });
    }
    
    // Gestione errori di autorizzazione
    if (error.name === 'ForbiddenError') {
        return res.status(403).json({ 
            error: 'Accesso negato' 
        });
    }
    
    // Gestione errori di risorsa non trovata
    if (error.name === 'NotFoundError') {
        return res.status(404).json({ 
            error: 'Risorsa non trovata' 
        });
    }
    
    // Errore generico del server
    res.status(500).json({ 
        error: 'Errore interno del server' 
    });
}

// Middleware per gestire rotte non trovate
export function notFoundHandler(req, res) {
    res.status(404).json({ 
        error: 'Endpoint non trovato' 
    });
}

// Utility per creare errori personalizzati
export class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'AppError';
    }
}

// Errori specifici
export class ValidationError extends AppError {
    constructor(message) {
        super(message, 400);
        this.name = 'ValidationError';
    }
}

export class NotFoundError extends AppError {
    constructor(message = 'Risorsa non trovata') {
        super(message, 404);
        this.name = 'NotFoundError';
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = 'Accesso non autorizzato') {
        super(message, 401);
        this.name = 'UnauthorizedError';
    }
}

export class ForbiddenError extends AppError {
    constructor(message = 'Accesso negato') {
        super(message, 403);
        this.name = 'ForbiddenError';
    }
} 