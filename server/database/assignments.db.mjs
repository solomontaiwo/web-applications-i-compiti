import sqlite3 from 'sqlite3';

export function openDb() {
  return new sqlite3.Database('./database/assignments.db');
}

// Creazione delle tabelle per gli utenti, i compiti, i gruppi di compiti, le risposte e le valutazioni
export async function createTables() {
  const db = openDb();
  
  const exec = (sql) => {
    return new Promise((resolve, reject) => {
      db.exec(sql, (err) => {
        if (err) reject(err);
        else resolve();
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

  await exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT CHECK(role IN ('student', 'teacher')) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS assignments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,  
            question TEXT NOT NULL,
            status TEXT CHECK(status IN ('open', 'closed')) DEFAULT 'open',
            teacherId INTEGER NOT NULL,
            FOREIGN KEY (teacherId) REFERENCES users(id)
        );

    CREATE TABLE IF NOT EXISTS assignment_groups (
        assignmentId INTEGER NOT NULL,
        studentId INTEGER NOT NULL,
        PRIMARY KEY (assignmentId, studentId),
        FOREIGN KEY (assignmentId) REFERENCES assignments(id),
        FOREIGN KEY (studentId) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS responses (
        assignmentId INTEGER PRIMARY KEY,
        answer TEXT,
        submittedBy INTEGER NOT NULL,
        FOREIGN KEY (assignmentId) REFERENCES assignments(id),
        FOREIGN KEY (submittedBy) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS evaluations (
        assignmentId INTEGER PRIMARY KEY,
        score INTEGER CHECK(score BETWEEN 0 AND 30),
        FOREIGN KEY (assignmentId) REFERENCES assignments(id)
    );
  `);

  await close();
}
