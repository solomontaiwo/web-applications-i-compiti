// Import delle librerie
import cors from 'cors';
import bcrypt from 'bcrypt';
import morgan from 'morgan'
import express from 'express';
import passport from 'passport';
import session from 'express-session';
import LocalStrategy from 'passport-local';
import { initDb } from './database/init.db.mjs';
import { createTables, openDb } from './database/assignments.db.mjs';

// Import delle rotte per l'autenticazione e le operazioni degli studenti e dei docenti
import authRoutes from './routes/authentication.routes.mjs';
import teacherRoutes from './routes/teacher.routes.mjs';
import studentRoutes from './routes/student.routes.mjs';

// Import dei middleware per la gestione degli errori
import { 
  errorHandler, 
  notFoundHandler 
} from './middleware/error.middleware.mjs';

// Configurazione del server e della porta del client
const app = new express();
const port = 3001;
const clientPort = 5173;

// Middleware per la gestione delle richieste CORS
app.use(cors({
  origin: `http://localhost:${clientPort}`,
  optionsSuccessStatus: 200,
  credentials: true 
}));

app.use(session({
  secret: 'secret-aw1-2025',
  resave: false,
  saveUninitialized: false,
}));

// Middleware per la gestione del body delle richieste
app.use(express.json()); 

// Middleware per il logging delle richieste
app.use(morgan('dev'));

// Configurazione e autenticazione di Passport per la gestione dell'autenticazione
app.use(passport.initialize());
app.use(passport.session());

// Strategia di autenticazione per Passport
passport.use(new LocalStrategy(async function verify(email, password, done) {
  const db = openDb();
  const get = (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  };
  
  try {
    const user = await get('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) return done(null, false, { message: 'Errore: utente non trovato' });

    // Confronto della password inserita con la password dell'utente
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return done(null, false, { message: 'Errore: password errata' });

    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

// Serializzazione e deserializzazione dell'utente per Passport
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const db = openDb();
  const get = (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  };
  
  try {
    const user = await get('SELECT * FROM users WHERE id = ?', [id]);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Middleware per la verifica dell'autenticazione
export function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  return res.status(401).json({ error: 'Errore: non autenticato' });
}

// Middleware per la verifica del ruolo docente
export function isTeacher(req, res, next) {
  if (req.isAuthenticated() && req.user.role === 'teacher') return next();
  return res.status(403).json({ error: 'Errore: accesso riservato ai docenti' });
}

// Middleware per la verifica del ruolo studente
export function isStudent(req, res, next) {
  if (req.isAuthenticated() && req.user.role === 'student') return next();
  return res.status(403).json({ error: 'Errore: accesso riservato agli studenti' });
}

// Routes per l'autenticazione e le operazioni degli studenti e dei docenti
app.get('/', (req, res) => {
  res.send('Server active');
});

app.use('/api/auth', authRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/student', studentRoutes);

// Middleware per la gestione degli errori
app.use(notFoundHandler); // Gestisce rotte non trovate
app.use(errorHandler);    // Gestisce tutti gli altri errori

// Avvio del server e del DB
createTables().then(async () => {
  await initDb();
  app.listen(port, () => {
    console.log(`Server in ascolto sulla porta http://localhost:${port}`);
  });
});