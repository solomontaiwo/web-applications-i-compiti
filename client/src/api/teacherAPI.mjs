const BASE_URL = 'http://localhost:3001';

// Recupera lo stato della classe ordinato
export async function getClassStatus(sortBy = 'name') {
    const res = await fetch(`${BASE_URL}/api/teacher/class-status?sortBy=${sortBy}`, {
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Errore nel recupero dello stato della classe');
    return await res.json();
}

// Recupera la lista completa degli studenti
export async function getStudents() {
    const res = await fetch(`${BASE_URL}/api/teacher/students`, {
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Errore nel recupero degli studenti');
    return await res.json();
}

// Crea un nuovo compito
export async function createAssignment(question, studentIds) {
    const res = await fetch(`${BASE_URL}/api/teacher/assignments`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question, studentIds }),
    });
    if (!res.ok) {
        const msg = await res.json();
        throw new Error(msg.error || 'Errore nella creazione del compito');
    }
    return await res.json();
}

// Recupera la risposta di un gruppo ad un compito
export async function getAssignmentResponse(assignmentId) {
    const res = await fetch(`${BASE_URL}/api/teacher/assignments/${assignmentId}/response`, {
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Errore nel recupero della risposta');
    return await res.json();
}

// Valuta un compito
export async function evaluateAssignment(assignmentId, score) {
    const res = await fetch(`${BASE_URL}/api/teacher/assignments/${assignmentId}/evaluate`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ score }),
    });
    if (!res.ok) throw new Error('Errore durante la valutazione');
    return await res.json();
}

// Recupera la lista completa dei compiti assegnati dal docente
export async function getAllAssignments() {
    const res = await fetch(`${BASE_URL}/api/teacher/assignments`, {
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Errore nel recupero dei compiti');
    return await res.json();
}
