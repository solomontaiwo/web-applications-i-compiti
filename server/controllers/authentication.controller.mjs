export function getSession(req, res) {
    if (req.isAuthenticated()) {
        const { password, ...userWithoutPassword } = req.user;
        res.json(userWithoutPassword);
    } else {
        res.status(401).json({ error: 'Errore: non autorizzato' });
    }
}

export function logoutUser(req, res) {
    req.logout(() => res.status(200).end());
}