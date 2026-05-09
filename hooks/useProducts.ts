import { apiCall } from "@/services/api";
import { Product } from "@/types/product";
import { useCallback, useEffect, useState } from "react";

interface UseProductsResult {
  products: Product[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  refetch: () => Promise<void>;
  loadMore: () => Promise<void>;
}

export function useProducts(endpoint: string | null): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false); // start false so we don't spin if null
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Reset về trang 1 khi đổi category
  useEffect(() => {
    if (!endpoint) return;
    setProducts([]);
    setPage(1);
    setHasMore(true);
    setLoading(true);
  }, [endpoint]);

  const fetchProducts = useCallback(
    async (pageToFetch: number, isRefresh = false) => {
      if (!endpoint) {
        setLoading(false);
        return;
      }
      try {
        isRefresh ? setLoading(true) : setLoadingMore(true);
        setError(null);

        const separator = endpoint.includes("?") ? "&" : "?";
        const url = `${endpoint}${separator}pageNumber=${pageToFetch}&pageSizeAll=8`;

        const data = await apiCall<Product[]>(url);

        if (!Array.isArray(data)) {
          throw new Error(
            "Invalid response format: expected array of products",
          );
        }

        setProducts((prev) => (pageToFetch === 1 ? data : [...prev, ...data]));

        // Trả về ít hơn 9 → hết data
        setHasMore(data.length === 8);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch products";
        setError(errorMessage);
        console.error("Fetch products error:", err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [endpoint],
  );

  // Fetch trang 1 mỗi khi endpoint (category) thay đổi
  useEffect(() => {
    fetchProducts(1, true);
  }, [fetchProducts]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchProducts(nextPage);
  }, [loadingMore, hasMore, page, fetchProducts]);

  const refetch = useCallback(async () => {
    setPage(1);
    await fetchProducts(1, true);
  }, [fetchProducts]);

  return { products, loading, loadingMore, error, hasMore, refetch, loadMore };
}
