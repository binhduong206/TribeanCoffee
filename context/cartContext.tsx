import { CartItemData } from "@/components/CartItem";
import { apiCall } from "@/services/api";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "./authContext";

interface CartResponse {
  cartId: string;
  userId: string;
  items: CartItemData[];
  totalAmount: number;
}

interface CartContextType {
  cartCount: number;
  refreshCartCount: () => Promise<void>;
}

const CartContext = createContext<CartContextType>({
  cartCount: 0,
  refreshCartCount: async () => {},
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { getValidToken, user, loading } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  const refreshCartCount = useCallback(async () => {
    if (!user?.userId) {
      setCartCount(0);
      return;
    }
    try {
      const token = await getValidToken();
      if (!token) return;
      
      const data = await apiCall<CartResponse>("/api/cart", { token });
      const count = data.items.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(count);
    } catch (error) {
      console.log("Failed to fetch cart count:", error);
    }
  }, [getValidToken, user?.userId]);

  useEffect(() => {
    if (!loading && user?.userId) {
      refreshCartCount();
    } else if (!user?.userId && !loading) {
      setCartCount(0);
    }
  }, [refreshCartCount, user?.userId, loading]);

  return (
    <CartContext.Provider value={{ cartCount, refreshCartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
