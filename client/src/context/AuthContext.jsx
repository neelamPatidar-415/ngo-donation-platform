
import { createContext, useEffect, useState } from "react";
import api from "../services/api";
import {
  loginDonor,
  registerDonor,
  getCurrentUser,
} from "../services/authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    api.defaults.headers.common.Authorization = `Bearer ${token}`;

    getCurrentUser()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem("token");
        delete api.defaults.headers.common.Authorization;
      })
      .finally(() => setLoading(false));
  }, []);

  const saveSession = (result) => {
    localStorage.setItem("token", result.token);
    api.defaults.headers.common.Authorization = `Bearer ${result.token}`;
    setUser(result.user);
  };

  const register = async (userData) => {
    const result = await registerDonor(userData);
    saveSession(result);
    return result.user;
  };

  const login = async (credentials) => {
    const result = await loginDonor(credentials);
    saveSession(result);
    return result.user;
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common.Authorization;
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, register, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
