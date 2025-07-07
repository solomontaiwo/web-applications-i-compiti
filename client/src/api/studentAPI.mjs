const BASE_URL = 'http://localhost:3001';

// Recupera i compiti aperti dello studente
export async function getMyOpenAssignments() {
    const res = await fetch(`${BASE_URL}/api/student/my-open-assignments`, {
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Errore nel recupero dei compiti');
    return await res.json();
}

// Invia o aggiorna una risposta
export async function submitResponse(assignmentId, answer) {
    const res = await fetch(`${BASE_URL}/api/student/assignments/${assignmentId}/response`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ answer })
    });
    if (!res.ok) throw new Error("Errore nell'invio della risposta");
    return await res.json();
}

// Recupera i risultati dello studente
export async function getMyResults() {
    const res = await fetch(`${BASE_URL}/api/student/my-results`, {
        credentials: 'include'
    });
    if (!res.ok) throw new Error('Errore nel recupero dei risultati');
    return await res.json();
}
