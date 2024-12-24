import { createContext, useContext, useState, useEffect } from "react";
import { useAuth as useAuthApi } from "../hooks/api-hooks";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const { validateCredentials } = useAuthApi();

  useEffect(() => {
    localStorage.removeItem("user");
    sessionStorage.clear();
    setUser(null);
  }, []);

  const login = async (credentials) => {
    try {
      const userData = await validateCredentials(credentials);
      const { password, ...userWithoutPassword } = userData;
      setUser(userWithoutPassword);
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    sessionStorage.clear();
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAdmin: user?.role === "admin" }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
