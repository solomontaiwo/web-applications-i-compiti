import { openDb } from '../database/assignments.db.mjs';

// Funzione per ottenere i compiti aperti per lo studente loggato
export async function getOpenAssignmentsFromDb(studentId) {
    const db = openDb();
    const all = (sql, params = []) => {
        return new Promise((resolve, reject) => {
            db.all(sql, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    };
    const get = (sql, params = []) => {
        return new Promise((resolve, reject) => {
            db.get(sql, params, (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    };

    const assignments = await all(`
        SELECT a.id, a.question, a.status, u.name AS teacher
        FROM assignments a
        JOIN assignment_groups ag ON ag.assignmentId = a.id
        JOIN users u ON u.id = a.teacherId
        WHERE ag.studentId = ? AND a.status = 'open'
    `, [studentId]);

    const results = await Promise.all(assignments.map(async (a) => {
        const groupRows = await all(`
            SELECT u.name
            FROM assignment_groups ag
            JOIN users u ON u.id = ag.studentId
            WHERE ag.assignmentId = ?
        `, [a.id]);

        const response = await get(`
            SELECT answer
            FROM responses
            WHERE assignmentId = ?
        `, [a.id]);

        return {
            ...a,
            group: groupRows.map(g => g.name),
            lastAnswer: response?.answer || null
        };
    }));

    return results;
}

// Funzione per inviare o aggiornare la risposta a un compito
export async function insertOrUpdateStudentResponse(studentId, assignmentId, answer) {
    const db = openDb();
    const get = (sql, params = []) => {
        return new Promise((resolve, reject) => {
            db.get(sql, params, (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    };
    const run = (sql, params = []) => {
        return new Promise((resolve, reject) => {
            db.run(sql, params, function(err) {
                if (err) reject(err);
                else resolve({ lastID: this.lastID, changes: this.changes });
            });
        });
    };

    // Controlla se lo studente è nel gruppo del compito
    const check = await get(`
        SELECT * FROM assignment_groups ag
        JOIN assignments a ON ag.assignmentId = a.id
        WHERE ag.studentId = ? AND a.id = ? AND a.status = 'open'
    `, [studentId, assignmentId]);

    if (!check) {
        return { error: 'Compito non trovato o già chiuso' };
    }

    // Controlla se lo studente ha già inviato una risposta
    const existing = await get('SELECT * FROM responses WHERE assignmentId = ?', [assignmentId]);

    if (existing) {
        await run(
            'UPDATE responses SET answer = ?, submittedBy = ? WHERE assignmentId = ?',
            [answer, studentId, assignmentId]
        );
    } else {
        await run(
            'INSERT INTO responses (assignmentId, answer, submittedBy) VALUES (?, ?, ?)',
            [assignmentId, answer, studentId]
        );
    }

    return { success: true };
}

// Funzione per ottenere i risultati e la media dello studente
export async function getStudentResults(studentId) {
    const db = openDb();
    const all = (sql, params = []) => {
        return new Promise((resolve, reject) => {
            db.all(sql, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    };

    const results = await all(`
        SELECT 
            a.id AS assignmentId, 
            a.question, 
            e.score,
            t.name AS teacherName,
            r.answer,
            (
                SELECT COUNT(*) 
                FROM assignment_groups 
                WHERE assignmentId = a.id
            ) as groupSize
        FROM assignments a
        JOIN assignment_groups ag ON ag.assignmentId = a.id
        JOIN evaluations e ON e.assignmentId = a.id
        JOIN users t ON a.teacherId = t.id
        LEFT JOIN responses r ON r.assignmentId = a.id
        WHERE ag.studentId = ? AND a.status = 'closed'
    `, [studentId]);

    const groupMap = {};
    for (const r of results) {
        const group = await all(`
            SELECT u.name
            FROM assignment_groups ag
            JOIN users u ON ag.studentId = u.id
            WHERE ag.assignmentId = ?
        `, [r.assignmentId]);

        groupMap[r.assignmentId] = group.map(g => g.name);
    }

    // Media ponderata con il numero di studenti del gruppo:
    // sum(score_i / n_i) / sum(1 / n_i)
    //
    // Dove:
    // - score_i è il punteggio del i-esimo compito
    // - n_i è il numero di studenti nel gruppo assegnato al i-esimo compito

    let weightedSum = 0;
    let weightTotal = 0;

    results.forEach(r => {
        const weight = 1.0 / r.groupSize;
        weightedSum += r.score * weight;
        weightTotal += weight;
    });

    const avg = weightTotal > 0 ? (weightedSum / weightTotal).toFixed(2) : null;

    // Restituisce i risultati con il gruppo e il docente
    const resultsWithGroup = results.map(r => ({
        question: r.question,
        score: r.score,
        teacher: r.teacherName,
        answer: r.answer,
        group: groupMap[r.assignmentId]
    }));

    return { results: resultsWithGroup, average: avg };
}