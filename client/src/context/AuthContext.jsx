import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

const readStoredAuth = () => {
  const token = localStorage.getItem('authToken');
  const userRaw = localStorage.getItem('authUser');
  let user = null;

  if (userRaw) {
    try {
      user = JSON.parse(userRaw);
    } catch (error) {
      user = null;
    }
  }

  return { token, user };
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => readStoredAuth());

  const login = ({ token, user }) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('authUser', JSON.stringify(user));
    setAuth({ token, user });
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setAuth({ token: null, user: null });
  };

  const updateUser = (user) => {
    localStorage.setItem('authUser', JSON.stringify(user));
    setAuth((prev) => ({ ...prev, user }));
  };

  const value = useMemo(
    () => ({
      token: auth.token,
      user: auth.user,
      isAuthenticated: Boolean(auth.token),
      login,
      logout,
      updateUser,
    }),
    [auth.token, auth.user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
