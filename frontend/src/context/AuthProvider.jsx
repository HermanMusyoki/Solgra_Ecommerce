import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount — verify token and load user
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) { setLoading(false); return; }
      try {
        const { data } = await api.get("/accounts/me/");
        setUser(data);
      } catch {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post("/accounts/token/", { email, password });
    localStorage.setItem("access_token",  data.access);
    localStorage.setItem("refresh_token", data.refresh);
    const profile = await api.get("/accounts/me/");
    setUser(profile.data);
    return profile.data;
  }, []);

  const register = useCallback(async (payload) => {
    const { data } = await api.post("/accounts/register/", payload);
    localStorage.setItem("access_token",  data.tokens.access);
    localStorage.setItem("refresh_token", data.tokens.refresh);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
  }, []);

  const isAdmin = user?.is_staff || user?.is_superuser;

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}
