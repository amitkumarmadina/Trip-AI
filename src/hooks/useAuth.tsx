import React, { createContext, useContext, useState, useEffect } from "react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: UserProfile) => void;
  register: (token: string, user: UserProfile) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for stored token on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("tripai:token");
    if (!savedToken) {
      setLoading(false);
      return;
    }

    // Verify token validity with backend
    fetch("/api/auth/me", {
      headers: {
        Authorization: `Bearer ${savedToken}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Session expired");
        return res.json();
      })
      .then((userData) => {
        setToken(savedToken);
        setUser(userData);
      })
      .catch((err) => {
        console.warn("Auth check failed:", err.message);
        localStorage.removeItem("tripai:token");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = (newToken: string, newUser: UserProfile) => {
    localStorage.setItem("tripai:token", newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const register = (newToken: string, newUser: UserProfile) => {
    localStorage.setItem("tripai:token", newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem("tripai:token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
