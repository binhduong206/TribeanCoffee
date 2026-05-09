import * as SecureStore from "expo-secure-store";
import { refreshAccessToken } from "./authService";
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

export const API_ENDPOINTS = {
  PRODUCTS: "/api/products",
  BESTSELLER_PRODUCTS: "/api/home",
  REVIEWS: "/api/reviews",
  ORDERS: "/api/orders",
} as const;

export const getFullUrl = (endpoint: string) => `${BASE_URL}${endpoint}`;

/**
 * Sửa lỗi URL ảnh nếu server trả về localhost thay vì IP
 */
export const fixImageUrl = (url: string | null | undefined): string => {
  if (!url || typeof url !== "string" || url.trim().length === 0) return "";
  
  // Nếu là ảnh cục bộ (file://) hoặc base64 (data:) thì giữ nguyên
  if (url.startsWith("file://") || url.startsWith("data:")) {
    return url;
  }

  // Nếu đã là URL đầy đủ (bắt đầu bằng http)
  if (url.startsWith("http")) {
    // Nếu chứa cổng 5262 hoặc localhost/127.0.0.1, thay thế origin bằng BASE_URL hiện tại
    if (url.includes(":5262") || url.includes("localhost") || url.includes("127.0.0.1")) {
      try {
        const origin = url.split('/').slice(0, 3).join('/'); 
        return url.replace(origin, BASE_URL);
      } catch (e) {
        return url;
      }
    }
    return url;
  }

  // Nếu là đường dẫn tương đối, đảm bảo có dấu / ở đầu và nối với BASE_URL
  const cleanUrl = url.startsWith("/") ? url : `/${url}`;
  return `${BASE_URL}${cleanUrl}`;
};

interface FetchOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  token?: string;
}

export async function apiCall<T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> {
  const {
    method = "GET",
    headers = {},
    body,
    timeout = 30000,
    token,
  } = options;

  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeout);

  try {
    const fullUrl = getFullUrl(endpoint);

    console.log(`[API] ${method} ${fullUrl}`);

    // Lấy token từ param hoặc SecureStore
    let storedToken =
      token ?? (await SecureStore.getItemAsync("auth_access_token"));

    // Hàm request dùng lại được
    const makeRequest = async (accessToken?: string | null) => {
      console.log(
        "Authorization header:",
        accessToken ? `Bearer ${accessToken.substring(0, 20)}...` : "MISSING",
      );

      return fetch(fullUrl, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(accessToken
            ? {
                Authorization: `Bearer ${accessToken}`,
              }
            : {}),
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });
    };

    // Request lần đầu
    let response = await makeRequest(storedToken);

    // Nếu token hết hạn
    if (response.status === 401) {
      console.log("[API] Access token expired. Refreshing...");

      const newToken = await refreshAccessToken();

      // Refresh fail
      if (!newToken) {
        throw new Error("Session expired");
      }

      console.log("[API] Retry request with new token");

      // Retry request với token mới
      response = await makeRequest(newToken);
    }

    // Sau retry vẫn fail
    if (!response.ok) {
      let errorMessage = `API Error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.message) errorMessage = errorData.message;
        else if (errorData.error) errorMessage = errorData.error;
        else if (typeof errorData === "string") errorMessage = errorData;
      } catch (e) {
        // Fallback to default message
      }
      throw new Error(errorMessage);
    }

    // API không trả body
    if (response.status === 204) {
      return null as T;
    }

    const data: T = await response.json();

    console.log(`[API] ${method} ${fullUrl} - Success`);

    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.log("[API] Error:", error.message);

      if (error.name === "AbortError") {
        throw new Error("API request timeout");
      }

      throw error;
    }

    throw new Error("Unknown API error");
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function uploadImage(uri: string): Promise<string> {
  const makeUploadRequest = async (token: string | null) => {
    const formData = new FormData();
    const filename = uri.split("/").pop();
    const match = /\.(\w+)$/.exec(filename || "");
    const type = match ? `image/${match[1]}` : `image`;

    formData.append("file", {
      uri,
      name: filename,
      type,
    } as any);

    return fetch(getFullUrl("/api/user/profile/avatar"), {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });
  };

  try {
    let storedToken = await SecureStore.getItemAsync("auth_access_token");
    let response = await makeUploadRequest(storedToken);

    // Nếu token hết hạn (401), thử refresh và gọi lại
    if (response.status === 401) {
      console.log("[API] Upload token expired. Refreshing...");
      const newToken = await refreshAccessToken();
      
      if (!newToken) {
        throw new Error("Session expired. Please login again.");
      }
      
      console.log("[API] Retrying upload with new token");
      response = await makeUploadRequest(newToken);
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[API] Upload failed:", response.status, errorText);
      throw new Error(`Upload failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log("[API] Upload Image Response:", data);
    
    const url = data.url || data.avatarUrl || data.avatar || data.data?.url;
    if (!url || typeof url !== 'string') {
      console.warn("[API] No URL found in upload response:", data);
      return "";
    }
    
    // Nếu Server trả về URL đầy đủ, ta cắt bỏ phần origin để chỉ lưu đường dẫn tương đối
    if (url.startsWith("http")) {
      try {
        const origin = url.split('/').slice(0, 3).join('/'); 
        const relativePath = url.replace(origin, "");
        console.log("[API] Storing relative path:", relativePath);
        return relativePath;
      } catch (e) {
        return url;
      }
    }
    
    return url;
  } catch (error) {
    console.error("[API] uploadImage Error:", error);
    throw error;
  }
}
