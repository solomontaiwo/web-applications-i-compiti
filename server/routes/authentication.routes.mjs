import express from 'express';
import passport from 'passport';
import { getSession, logoutUser } from '../controllers/authentication.controller.mjs';

const router = express.Router();

// Rotta per ottenere la sessione
router.get('/session', getSession);

// Rotta per il login
router.post('/login', passport.authenticate('local'), (req, res) => {
    const { password, ...userWithoutPassword } = req.user;
    res.json(userWithoutPassword);
});

// Rotta per il logout
router.post('/logout', logoutUser);

export default router;