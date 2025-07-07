import { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const BASE_URL = 'http://localhost:3001';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL}/api/auth/session`, { credentials: 'include' })
      .then(res => res.ok ? res.json() : Promise.resolve(null))
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  const login = async (email, password) => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: email, password })
    });
    if (!res.ok) throw new Error('Login failed');
    const user = await res.json();
    setUser(user);
    return user;
  };

  const logout = async () => {
    await fetch(`${BASE_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };