import React, { createContext, useContext, useState } from "react";
import { useAuth as useAuthHook } from "../hooks/api-hooks";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const { validateCredentials } = useAuthHook();

  const login = async (email, password) => {
    try {
      const response = await validateCredentials({ email, password });
      const decodedToken = jwtDecode(response);
      const userData = {
        token: response,
        email: decodedToken.email,
        role: decodedToken.role,
        id: decodedToken.id,
      };
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const isAdmin = user?.role === "admin";

  const value = {
    user,
    login,
    logout,
    isAdmin,
    isLoggedIn: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
