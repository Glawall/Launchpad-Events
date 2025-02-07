import React, { createContext, useContext, useState, useCallback } from "react";
import { useAuth as useAuthHook } from "../hooks/api-hooks";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

const USER_STORAGE_KEY = "launchpad_events_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const { validateCredentials } = useAuthHook();

  const login = useCallback(
    async (email, password) => {
      try {
        const response = await validateCredentials({ email, password });
        const decodedToken = jwtDecode(response);
        const userData = {
          token: response,
          email: decodedToken.email,
          role: decodedToken.role,
          id: decodedToken.id,
          name: decodedToken.name,
        };
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
        setUser(userData);
        return userData;
      } catch (error) {
        throw error;
      }
    },
    [validateCredentials]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
  }, []);

  const isAdmin = user?.role === "admin";

  const value = {
    user,
    login,
    logout,
    isAdmin,
    isLoggedIn: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
