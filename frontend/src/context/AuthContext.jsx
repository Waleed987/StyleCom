import { createContext, useContext, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../api';

const AuthContext = createContext(null);

function readStoredSession() {
  try {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('userData'));
    if (!token || !user) return null;

    const decoded = jwtDecode(token);
    if (decoded.exp && decoded.exp * 1000 <= Date.now()) {
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      return null;
    }
    return { token, user };
  } catch {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    return null;
  }
}

function userFromResponse(data) {
  if (data.user) return data.user;
  const decoded = jwtDecode(data.token);
  return {
    userId: decoded.userId || decoded._id,
    email: decoded.email,
    isAdmin: Boolean(decoded.isAdmin),
  };
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readStoredSession);

  const saveSession = (data) => {
    const nextSession = { token: data.token, user: userFromResponse(data) };
    localStorage.setItem('token', nextSession.token);
    localStorage.setItem('userData', JSON.stringify(nextSession.user));
    setSession(nextSession);
    return nextSession.user;
  };

  const signIn = async (credentials) => {
    const response = await api.post('/api/user/login', credentials);
    return saveSession(response.data);
  };

  const signUp = async (details) => {
    const response = await api.post('/api/user/signup', details);
    return saveSession(response.data);
  };

  const signInWithGoogle = async (credential) => {
    const response = await api.post('/api/user/google-login', { credential });
    return saveSession(response.data);
  };

  const signOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setSession(null);
  };

  const value = {
    token: session?.token || null,
    user: session?.user || null,
    isAuthenticated: Boolean(session?.token),
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
