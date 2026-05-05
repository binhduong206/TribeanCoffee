import { Platform } from "react-native";

// Use IP address instead of localhost for Expo/emulator
// For Android emulator: 10.0.2.2
// For physical device/Expo Go: use your machine IP
const getBaseUrl = () => {
  if (Platform.OS === "android") {
    // If running on Android emulator, use 10.0.2.2
    // If running on physical device, replace with your PC IP
    return "http://10.0.2.2:5262";
  }
  // For iOS or other platforms, use localhost
  return "http://localhost:5262";
};

// Or use this for Expo Go on physical device (replace with your PC IP)
const BASE_URL = "http://192.168.0.102:5262";

export const API_ENDPOINTS = {
  PRODUCTS: "/api/products",
  BESTSELLER_PRODUCTS: "/api/home",
} as const;

export const getFullUrl = (endpoint: string) => {
  return `${BASE_URL}${endpoint}`;
};

interface FetchOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
}

export async function apiCall<T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> {
  const { method = "GET", headers = {}, body, timeout = 30000 } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const fullUrl = getFullUrl(endpoint);
    console.log(`[API] ${method} ${fullUrl}`); // Debug log

    const response = await fetch(fullUrl, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data: T = await response.json();
    console.log(`[API] ${method} ${fullUrl} - Success`); // Debug log
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`[API] Error:`, error.message);
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
