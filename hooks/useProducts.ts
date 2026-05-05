import { apiCall } from "@/services/api";
import { Product } from "@/types/product";
import { useCallback, useEffect, useState } from "react";

interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useProducts(endpoint: string): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await apiCall<Product[]>(endpoint);

      // Validate response
      if (!Array.isArray(data)) {
        throw new Error("Invalid response format: expected array of products");
      }

      setProducts(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch products";
      setError(errorMessage);
      console.error("Fetch products error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const refetch = useCallback(async () => {
    await fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch };
}
