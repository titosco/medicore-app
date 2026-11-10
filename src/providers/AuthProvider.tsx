"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { authService } from "@/services/auth.service";
import { userService } from "@/services/user.service";
import { User } from "@/types/auth";
import { setAccessToken } from "@/lib/tokenStore";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const started = useRef(false);

  const refreshUser = useCallback(async () => {
    const res = await userService.getMe();
    setUser(res.data);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Even if the API call fails, we still clear the session locally
    } finally {
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem("hasSession");
    }
  }, []);

  // Restore the session on page load using the refresh cookie
  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const restore = async () => {
      if (!localStorage.getItem("hasSession")) {
        setIsLoading(false);
        return;
      }
      try {
        await authService.refresh();
        await refreshUser();
      } catch {
        setUser(null);
        localStorage.removeItem("hasSession");
      } finally {
        setIsLoading(false);
      }
    };

    restore();
  }, [refreshUser]);

  return (
    <AuthContext.Provider value={{ user, isLoading, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
