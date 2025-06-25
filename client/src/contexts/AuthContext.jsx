import { createContext, useState, useEffect } from 'react';
import API from '../API/API.mjs';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      const loggedUser = await API.getUser();
      setUser(loggedUser);
    })();
  }, []);

  const login = async (credentials) => {
    const loggedUser = await API.login(credentials);
    setUser(loggedUser);
  };

  const logout = async () => {
    await API.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
