import { AuthTokens } from "@/utils/authStorage";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";

const getBaseUrl = () => {
  // 1. Try environment variable first
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  
  // 2. If envUrl exists and is NOT localhost, use it (e.g. Cloudflare tunnel)
  if (envUrl && !envUrl.includes("localhost") && !envUrl.includes("127.0.0.1")) {
    return envUrl;
  }

  // 3. If we are on localhost/missing, try to detect the host IP for Expo Go
  const hostUri = Constants.expoConfig?.hostUri || "";
  const hostIp = hostUri.split(":")[0];

  if (hostIp) {
    return `http://${hostIp}:5262`;
  }

  // 4. Final fallback
  return envUrl || "http://localhost:5262";
};

const BASE_URL = getBaseUrl();

let refreshPromise: Promise<string | null> | null = null;

export async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const refreshToken = await SecureStore.getItemAsync("auth_refresh_token");
    const accessToken = await SecureStore.getItemAsync("auth_access_token");

    if (!refreshToken) {
      return null;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({
          accessToken: accessToken,
          refreshToken: refreshToken,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("Refresh API failed with status:", response.status);
        console.error("Refresh API response:", errText);
        throw new Error("Refresh failed");
      }

      const data: AuthTokens = await response.json();

      // save token mới, ép kiểu sang chuỗi để tránh lỗi SecureStore
      const promises = [
        SecureStore.setItemAsync("auth_access_token", String(data.accessToken)),
        SecureStore.setItemAsync("auth_refresh_token", String(data.refreshToken)),
      ];

      if (data.accessTokenExpiration) {
        promises.push(SecureStore.setItemAsync("auth_access_token_expiration", String(data.accessTokenExpiration)));
      }
      
      if (data.refreshTokenExpiration) {
        promises.push(SecureStore.setItemAsync("auth_refresh_token_expiration", String(data.refreshTokenExpiration)));
      }

      if (data.user) {
        promises.push(SecureStore.setItemAsync("auth_user", JSON.stringify(data.user)));
      }

      await Promise.all(promises);

      return data.accessToken;
    } catch (e) {
      console.log("Refresh token failed", e);
      // await SecureStore.deleteItemAsync("auth_access_token");
      // await SecureStore.deleteItemAsync("auth_refresh_token");
      return null;
    }
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}
