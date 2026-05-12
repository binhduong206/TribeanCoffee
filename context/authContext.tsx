import { apiCall } from "@/services/api";
import { refreshAccessToken } from "@/services/authService";
import { AuthTokens, AuthUser, authStorage } from "@/utils/authStorage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
interface AuthContextType {
  user: AuthUser | null;
  accessToken: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getValidToken: () => Promise<string | null>;
  updateUser: (user: AuthUser) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  accessToken: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  getValidToken: async () => null,
  updateUser: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(async () => {
    try {
      await authStorage.clear();
    } catch (e) {
      console.error("Error clearing auth storage:", e);
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  }, []);

  const tryRefresh = useCallback(async (): Promise<string | null> => {
    try {
      const refreshToken = await authStorage.getRefreshToken();
      const isRefreshValid = await authStorage.isRefreshTokenValid();

      if (!refreshToken || !isRefreshValid) {
        console.warn(`[Auth] Logout trigger 1: refreshToken=${!!refreshToken}, isRefreshValid=${isRefreshValid}`);
        await logout();
        return null;
      }

      const newToken = await refreshAccessToken();
      
      if (!newToken) {
        console.warn(`[Auth] Logout trigger 2: refreshAccessToken returned null`);
        await logout();
        return null;
      }

      const savedUser = await authStorage.getUser();
      setAccessToken(newToken);
      if (savedUser) setUser(savedUser);
      return newToken;
    } catch (e) {
      console.warn(`[Auth] Logout trigger 3: Exception in tryRefresh:`, e);
      await logout();
      return null;
    }
  }, [logout]);

  // Trả về token hợp lệ — tự refresh nếu access token hết hạn
  const getValidToken = useCallback(async (): Promise<string | null> => {
    const isValid = await authStorage.isAccessTokenValid();

    if (isValid) {
      // Đọc thẳng từ SecureStore, không dùng state
      return authStorage.getAccessToken();
    }

    // Refresh xong → tryRefresh đã save vào SecureStore
    // Đọc lại từ SecureStore sau khi refresh
    const newToken = await tryRefresh();
    return newToken; // tryRefresh đã trả về token mới rồi
  }, [tryRefresh]);

  // Khôi phục session khi mở app
  useEffect(() => {
    const restore = async () => {
      try {
        const savedUser = await authStorage.getUser();
        if (!savedUser) return; // chưa từng login

        const isAccessValid = await authStorage.isAccessTokenValid();

        if (isAccessValid) {
          // Access token còn hạn → dùng luôn
          const token = await authStorage.getAccessToken();
          setAccessToken(token);
          setUser(savedUser);
        } else {
          // Access token hết hạn → thử refresh
          const newToken = await tryRefresh();
          if (!newToken) return; // refresh thất bại → đã logout trong tryRefresh
        }
      } catch (e) {
        console.error("Restore session error:", e);
        await logout();
      } finally {
        setLoading(false);
      }
    };

    restore();
  }, []);

  const login = async (email: string, password: string) => {
    const data = await apiCall<AuthTokens>("/api/auth/login", {
      method: "POST",
      body: { email, password },
    });
    await authStorage.save(data);
    setAccessToken(data.accessToken);
    setUser(data.user);
  };

  const updateUser = (updatedUser: AuthUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{ user, accessToken, loading, login, logout, getValidToken, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
