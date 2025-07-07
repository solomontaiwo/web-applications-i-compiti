import { openDb } from '../database/assignments.db.mjs';

// Funzione per controllare se il limite di coppie di studenti è stato raggiunto
export async function checkStudentPairLimit(sid1, sid2, teacherId) {
  const db = openDb();
  const get = (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  };
  return await get(`
    SELECT COUNT(*) as cnt
    FROM assignment_groups ag1
    JOIN assignment_groups ag2 ON ag1.assignmentId = ag2.assignmentId
    JOIN assignments a ON ag1.assignmentId = a.id
    WHERE ag1.studentId = ? AND ag2.studentId = ? AND a.teacherId = ?
  `, [sid1, sid2, teacherId]);
}

export async function getStudentNameById(id) {
  const db = openDb();
  const get = (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  };
  return await get('SELECT name FROM users WHERE id = ?', [id]);
}

export async function insertAssignment(question, teacherId) {
  const db = openDb();
  const run = (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  };
  return await run(
    'INSERT INTO assignments (question, status, teacherId) VALUES (?, "open", ?)',
    [question, teacherId]
  );
}

export async function insertAssignmentGroup(assignmentId, studentId) {
  const db = openDb();
  const run = (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  };
  return await run(
    'INSERT INTO assignment_groups (assignmentId, studentId) VALUES (?, ?)',
    [assignmentId, studentId]
  );
}

export async function getAssignmentById(id) {
  const db = openDb();
  const get = (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  };
  return await get('SELECT * FROM assignments WHERE id = ?', [id]);
}

export async function getResponseAndGroup(assignmentId) {
  const db = openDb();
  const get = (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  };
  return await get(`
    SELECT r.answer, ag.studentId AS groupId, u.name AS groupName
    FROM responses r
    JOIN assignment_groups ag ON r.submittedBy = ag.studentId
    JOIN users u ON ag.studentId = u.id
    WHERE r.assignmentId = ?
  `, [assignmentId]);
}

export async function getAssignmentGroupMembers(assignmentId) {
  const db = openDb();
  const all = (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  };
  return await all(`
    SELECT u.id, u.name, u.email
    FROM assignment_groups ag
    JOIN users u ON ag.studentId = u.id
    WHERE ag.assignmentId = ?
  `, [assignmentId]);
}

export async function getAssignmentResponse(assignmentId) {
  const db = openDb();
  const get = (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  };
  return await get('SELECT * FROM responses WHERE assignmentId = ?', [assignmentId]);
}

export async function getAssignmentStatus(assignmentId) {
  const db = openDb();
  const get = (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  };
  return await get('SELECT status FROM assignments WHERE id = ?', [assignmentId]);
}

export async function getAssignmentEvaluation(assignmentId) {
  const db = openDb();
  const get = (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  };
  return await get('SELECT score FROM evaluations WHERE assignmentId = ?', [assignmentId]);
}

export async function insertEvaluation(assignmentId, score) {
  const db = openDb();
  const run = (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  };
  return await run('INSERT INTO evaluations (assignmentId, score) VALUES (?, ?)', [assignmentId, score]);
}

export async function closeAssignment(assignmentId) {
  const db = openDb();
  const run = (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  };
  return await run('UPDATE assignments SET status = "closed" WHERE id = ?', [assignmentId]);
}

export async function getClassStatistics(sortField, teacherId) {
  const db = openDb();
  const all = (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  };
  return await all(`
    SELECT 
      u.id, u.name,
      COUNT(CASE WHEN a.teacherId = ? AND a.status = 'open' THEN 1 END) AS open,
      COUNT(CASE WHEN a.teacherId = ? AND a.status = 'closed' THEN 1 END) AS closed,
      COUNT(CASE WHEN a.teacherId = ? AND (a.status = 'open' OR a.status = 'closed') THEN 1 END) AS total,
      ROUND(
        SUM(
          CASE 
            WHEN a.teacherId = ? AND e.score IS NOT NULL 
            THEN e.score * (1.0 / (SELECT COUNT(*) FROM assignment_groups WHERE assignmentId = a.id)) 
            ELSE 0 
          END
        ) / 
        NULLIF(
          SUM(
            CASE 
              WHEN a.teacherId = ? AND e.score IS NOT NULL 
              THEN 1.0 / (SELECT COUNT(*) FROM assignment_groups WHERE assignmentId = a.id) 
              ELSE 0 
            END
          ), 
        0), 2
      ) AS average
    FROM users u
    LEFT JOIN assignment_groups ag ON ag.studentId = u.id
    LEFT JOIN assignments a ON a.id = ag.assignmentId
    LEFT JOIN evaluations e ON e.assignmentId = a.id
    WHERE u.role = 'student'
    GROUP BY u.id
    ORDER BY ${sortField} COLLATE NOCASE
  `, [teacherId, teacherId, teacherId, teacherId, teacherId]);
}

export async function getAllStudentsFromDb() {
  const db = openDb();
  const all = (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  };
  return await all(`
    SELECT id, name, email
    FROM users
    WHERE role = 'student'
  `);
}

export async function getAllAssignmentsByTeacher(teacherId) {
  const db = openDb();
  const all = (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  };
  return await all(`
    SELECT 
      a.id,
      a.question,
      a.status,
      GROUP_CONCAT(u.name, ', ') as students,
      r.answer IS NOT NULL AS hasResponse,
      r.answer,
      e.score
    FROM assignments a
    JOIN assignment_groups ag ON ag.assignmentId = a.id
    JOIN users u ON ag.studentId = u.id
    LEFT JOIN responses r ON r.assignmentId = a.id
    LEFT JOIN evaluations e ON e.assignmentId = a.id
    WHERE a.teacherId = ?
    GROUP BY a.id
    ORDER BY a.id ASC
  `, [teacherId]);
}