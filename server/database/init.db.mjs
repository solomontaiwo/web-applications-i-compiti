import bcrypt from 'bcrypt';
import { openDb } from './assignments.db.mjs';

// Hash della password
const saltRounds = 10;
const plainPassword = 'password';

// Funzione per inizializzare il database
export async function initDb() {
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
    
    const close = () => {
        return new Promise((resolve, reject) => {
            db.close((err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    };

    try {
        // Controlla se il database è già inizializzato con degli utenti
        const count = await get('SELECT COUNT(*) as count FROM users');
        if (count.count > 0) {
            console.log('Database già inizializzato con', count.count, 'utenti');
            await close();
            return;
        }
    } catch (error) {
        console.log('Database vuoto, inizializzazione...');
    }

    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

    // Creazione di 2 docenti con i loro ID
    const teacherIds = [];
    for (let i = 1; i <= 2; i++) {
        const result = await run(
            'INSERT OR IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [`Docente 0${i}`, `docente${i}@aw1.it`, hashedPassword, 'teacher']
        );
        if (result.lastID) {
            teacherIds.push(result.lastID);
        } else {
            // Se l'inserimento è stato ignorato, otteniamo l'ID dell'utente esistente
            const existing = await get('SELECT id FROM users WHERE email = ?', [`docente${i}@aw1.it`]);
            teacherIds.push(existing.id);
        }
    }

    // Creazione di 20 studenti con i loro ID
    const studentIds = [];
    for (let i = 1; i <= 20; i++) {
        const padded = String(i).padStart(2, '0');
        const result = await run(
            'INSERT OR IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [`Studente ${padded}`, `studente${padded}@aw1.it`, hashedPassword, 'student']
        );
        if (result.lastID) {
            studentIds.push(result.lastID);
        } else {
            // Se l'inserimento è stato ignorato, otteniamo l'ID dell'utente esistente
            const existing = await get('SELECT id FROM users WHERE email = ?', [`studente${padded}@aw1.it`]);
            studentIds.push(existing.id);
        }
    }

    // Creazione di 2 compiti: uno chiuso e uno aperto
    const [teacherId] = teacherIds;

    // Compito 1 (chiuso)
    const assignment1 = await run(
        'INSERT OR IGNORE INTO assignments (question, status, teacherId) VALUES (?, ?, ?)',
        ['Spiega il funzionamento di una REST API', 'closed', teacherId]
    );

    const assignment1Id = assignment1.lastID || (await get('SELECT id FROM assignments WHERE question = ? AND teacherId = ?', 
        ['Spiega il funzionamento di una REST API', teacherId])).id;
    
    const group1 = studentIds.slice(0, 3);
    for (const sid of group1) {
        await run('INSERT OR IGNORE INTO assignment_groups (assignmentId, studentId) VALUES (?, ?)', [assignment1Id, sid]);
    }

    await run(
        'INSERT OR IGNORE INTO responses (assignmentId, answer, submittedBy) VALUES (?, ?, ?)',
        [assignment1Id, 'La REST API espone risorse tramite HTTP.', group1[0]]
    );

    await run(
        'INSERT OR IGNORE INTO evaluations (assignmentId, score) VALUES (?, ?)',
        [assignment1Id, 27]
    );

    // Compito 2 (aperto)
    const assignment2 = await run(
        'INSERT OR IGNORE INTO assignments (question, status, teacherId) VALUES (?, ?, ?)',
        ['Descrivi i vantaggi delle SPA (Single Page Applications)', 'open', teacherId]
    );

    const assignment2Id = assignment2.lastID || (await get('SELECT id FROM assignments WHERE question = ? AND teacherId = ?', 
        ['Descrivi i vantaggi delle SPA (Single Page Applications)', teacherId])).id;
    
    const group2 = studentIds.slice(3, 6);
    for (const sid of group2) {
        await run('INSERT OR IGNORE INTO assignment_groups (assignmentId, studentId) VALUES (?, ?)', [assignment2Id, sid]);
    }

    await close();
}