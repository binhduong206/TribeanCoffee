import { CartItem, CartItemData } from "@/components/CartItem";
import { useAuth } from "@/context/authContext";
import { useCart } from "@/context/cartContext";
import { apiCall } from "@/services/api";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface CartResponse {
  cartId: string;
  userId: string;
  items: CartItemData[];
  totalAmount: number;
}

export default function CartScreen() {
  const { getValidToken, loading: authLoading } = useAuth();
  const { refreshCartCount } = useCart();
  const [items, setItems] = useState<CartItemData[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const tabBarHeight = useBottomTabBarHeight();

  // ── Fetch giỏ hàng ──────────────────────────────────────
  const fetchCart = useCallback(async () => {
    try {
      const token = await getValidToken();
      console.log("token dùng để fetch cart:", token); // ← thêm dòng này
      const data = await apiCall<CartResponse>("/api/cart", {
        token: token ?? undefined,
      });
      setItems(data.items);
      setTotalAmount(data.totalAmount);
    } catch (e) {
      console.error("Fetch cart error:", e);
    } finally {
      setLoading(false);
    }
  }, [getValidToken]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    if (!authLoading) {
      // ← chờ auth xong mới fetch
      fetchCart();
    }
  }, [fetchCart, authLoading]);

  // ── Tăng số lượng ────────────────────────────────────────
  const handleIncrease = async (productId: string, sizeId: string) => {
    // Optimistic update
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId && item.sizeId === sizeId
          ? {
              ...item,
              quantity: item.quantity + 1,
              total: item.finalPrice * (item.quantity + 1),
            }
          : item,
      ),
    );
    try {
      const token = await getValidToken();
      await apiCall("/api/cart/items", {
        method: "POST",
        token: token ?? undefined,
        body: { productId, sizeId, quantity: 1 },
      });
      fetchCart(); // sync lại total từ server
      refreshCartCount(); // update global badge
    } catch (e) {
      console.error("Increase error:", e);
      fetchCart(); // rollback nếu lỗi
      refreshCartCount();
    }
  };

  // ── Giảm số lượng ────────────────────────────────────────
  const handleDecrease = async (productId: string, sizeId: string) => {
    const item = items.find(
      (i) => i.productId === productId && i.sizeId === sizeId,
    );
    if (!item) return;

    if (item.quantity === 1) {
      // Về 0 → xoá luôn
      handleRemove(productId, sizeId);
      return;
    }

    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId && i.sizeId === sizeId
          ? {
              ...i,
              quantity: i.quantity - 1,
              total: i.finalPrice * (i.quantity - 1),
            }
          : i,
      ),
    );
    try {
      const token = await getValidToken();
      await apiCall("/api/cart/items", {
        method: "POST",
        token: token ?? undefined,
        body: { productId, sizeId, quantity: -1 },
      });
      fetchCart();
      refreshCartCount(); // update global badge
    } catch (e) {
      console.error("Decrease error:", e);
      fetchCart();
      refreshCartCount();
    }
  };

  // ── Xoá item ─────────────────────────────────────────────
  const handleRemove = async (productId: string, sizeId: string) => {
    setItems((prev) =>
      prev.filter((i) => !(i.productId === productId && i.sizeId === sizeId)),
    );
    try {
      const token = await getValidToken();
      // ← query params thay vì path params
      await apiCall(`/api/cart/items?productId=${productId}&sizeId=${sizeId}`, {
        method: "DELETE",
        token: token ?? undefined,
      });
      fetchCart();
      refreshCartCount(); // update global badge
    } catch (e) {
      console.error("Remove error:", e);
      fetchCart();
      refreshCartCount();
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2D5016" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cart</Text>
      </View>

      {/* ── List ── */}
      <FlatList
        data={items}
        keyExtractor={(item) => `${item.productId}-${item.sizeId}`}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <CartItem
            item={item}
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
            onRemove={handleRemove}
          />
        )}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 8,
          paddingBottom: 20,
        }}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Image
              source={require("@/assets/icons/shopping-cart-icon.png")}
              style={{ width: 60, height: 60 }}
            />
            <Text style={styles.emptyText}>Giỏ hàng trống</Text>
          </View>
        }
      />

      {/* ── Footer ── */}
      {items.length > 0 && (
        <View style={[styles.footer, { paddingBottom: tabBarHeight + 60 }]}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${totalAmount.toFixed(2)}</Text>
          </View>
          <TouchableOpacity
            style={styles.checkoutBtn}
            activeOpacity={0.85}
            onPress={() => router.push("/checkout")}
          >
            <Text style={styles.checkoutText}>Checkout →</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FAFAF8" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    fontFamily: "Roboto",
  },
  emptyBox: { alignItems: "center", paddingTop: 80, gap: 12 },
  emptyEmoji: { fontSize: 48 },
  emptyText: { fontSize: 15, color: "#AAA" },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: "#F0EDE8",
    backgroundColor: "#FAFAF8",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  totalLabel: { fontSize: 16, fontWeight: "700", color: "#1A1A1A" },
  totalValue: { fontSize: 20, fontWeight: "700", color: "#2D5016" },
  checkoutBtn: {
    backgroundColor: "#2D5016",
    borderRadius: 16,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
  },
  checkoutText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});

