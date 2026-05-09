import * as SecureStore from "expo-secure-store";

const KEYS = {
  ACCESS_TOKEN: "auth_access_token",
  REFRESH_TOKEN: "auth_refresh_token",
  ACCESS_TOKEN_EXPIRATION: "auth_access_token_expiration",
  REFRESH_TOKEN_EXPIRATION: "auth_refresh_token_expiration",
  USER: "auth_user",
};

export interface AuthUser {
  userId: string;
  fullName: string;
  avatar: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiration: string;
  refreshTokenExpiration: string;
  user: AuthUser;
}

export const authStorage = {
  async save(tokens: AuthTokens) {
    const promises = [
      SecureStore.setItemAsync(KEYS.ACCESS_TOKEN, String(tokens.accessToken)),
      SecureStore.setItemAsync(KEYS.REFRESH_TOKEN, String(tokens.refreshToken)),
    ];

    if (tokens.accessTokenExpiration) {
      promises.push(
        SecureStore.setItemAsync(
          KEYS.ACCESS_TOKEN_EXPIRATION,
          String(tokens.accessTokenExpiration)
        )
      );
    }

    if (tokens.refreshTokenExpiration) {
      promises.push(
        SecureStore.setItemAsync(
          KEYS.REFRESH_TOKEN_EXPIRATION,
          String(tokens.refreshTokenExpiration)
        )
      );
    }

    if (tokens.user) {
      promises.push(
        SecureStore.setItemAsync(KEYS.USER, JSON.stringify(tokens.user))
      );
    }

    await Promise.all(promises);
  },

  async getAccessToken(): Promise<string | null> {
    return SecureStore.getItemAsync(KEYS.ACCESS_TOKEN);
  },

  async getRefreshToken(): Promise<string | null> {
    return SecureStore.getItemAsync(KEYS.REFRESH_TOKEN);
  },

  async getUser(): Promise<AuthUser | null> {
    const raw = await SecureStore.getItemAsync(KEYS.USER);
    return raw ? JSON.parse(raw) : null;
  },

  // true = còn hạn, false = hết hạn
  async isAccessTokenValid(): Promise<boolean> {
    const exp = await SecureStore.getItemAsync(KEYS.ACCESS_TOKEN_EXPIRATION);
    if (!exp) return false;
    const parsed = new Date(exp);
    if (isNaN(parsed.getTime())) return true; // Fallback to let backend decide if unparseable
    return parsed > new Date();
  },

  async isRefreshTokenValid(): Promise<boolean> {
    const exp = await SecureStore.getItemAsync(KEYS.REFRESH_TOKEN_EXPIRATION);
    if (!exp) return false;
    const parsed = new Date(exp);
    if (isNaN(parsed.getTime())) return true; // Fallback to let backend decide if unparseable
    return parsed > new Date();
  },

  async clear() {
    await Promise.all([
      SecureStore.deleteItemAsync(KEYS.ACCESS_TOKEN),
      SecureStore.deleteItemAsync(KEYS.REFRESH_TOKEN),
      SecureStore.deleteItemAsync(KEYS.ACCESS_TOKEN_EXPIRATION),
      SecureStore.deleteItemAsync(KEYS.REFRESH_TOKEN_EXPIRATION),
      SecureStore.deleteItemAsync(KEYS.USER),
    ]);
  },
};
