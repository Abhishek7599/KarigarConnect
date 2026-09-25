import { createContext, useContext, useEffect, useState } from "react";
const AuthContext = createContext(null);
const API = "http://localhost:5000";
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("karigar-user") || "null"));
  const [token, setToken] = useState(() => localStorage.getItem("karigar-token"));
  useEffect(() => {
    const originalFetch = window.fetch;
    window.fetch = (input, init = {}) => {
      const url = typeof input === "string" ? input : input?.url;
      if (token && url?.startsWith(API)) {
        const headers = new Headers(init.headers || {}); headers.set("Authorization", `Bearer ${token}`);
        return originalFetch(input, { ...init, headers });
      }
      return originalFetch(input, init);
    };
    return () => { window.fetch = originalFetch; };
  }, [token]);
  const authenticate = async (mode, payload) => {
    const response = await fetch(`${API}/api/users/${mode}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await response.json(); if (!response.ok) throw new Error(data.message || "Authentication failed.");
    setUser(data.user); setToken(data.token); localStorage.setItem("karigar-user", JSON.stringify(data.user)); localStorage.setItem("karigar-token", data.token); return data.user;
  };
  const signOut = () => { setUser(null); setToken(null); localStorage.removeItem("karigar-user"); localStorage.removeItem("karigar-token"); };
  return <AuthContext.Provider value={{ user, authenticate, signOut, setUser }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
