import { useAuth } from "@/context/authContext";
import { apiCall } from "@/services/api";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Interfaces from API response
interface OrderItem {
  productId: string;
  productName: string;
  image: string;
  sizeName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Order {
  orderId: string;
  orderDate: string;
  totalPrice: number;
  status: string;
  paymentStatus: string;
  receiverName: string;
  receiverAddress: string;
  receiverPhoneNumber: string;
  items: OrderItem[];
}

interface OrderResponse {
  orders: Order[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return { bg: "#FFF4E5", text: "#E67E22" };
    case "delivered":
      return { bg: "#E8F5E9", text: "#2E7D32" };
    case "cancelled":
      return { bg: "#FFEBEE", text: "#C62828" };
    default:
      return { bg: "#F0EDE8", text: "#555" };
  }
};

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getFullYear()} ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
};

export default function OrdersScreen() {
  const { getValidToken } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      const token = await getValidToken();
      const response = await apiCall<OrderResponse>("/api/orders", {
        token: token ?? undefined,
      });
      setOrders(response.orders || []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [getValidToken]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const renderOrderItem = ({ item }: { item: Order }) => {
    const statusColor = getStatusColor(item.status);

    return (
      <TouchableOpacity 
        style={styles.orderCard}
        activeOpacity={0.8}
        onPress={() => router.push({ pathname: "/order/[id]", params: { id: item.orderId } })}
      >
        <View style={styles.orderHeader}>
          <Text style={styles.orderId}>
            Order #{item.orderId.split("-")[0].toUpperCase()}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}>
            <Text style={[styles.statusText, { color: statusColor.text }]}>
              {item.status}
            </Text>
          </View>
        </View>

        <Text style={styles.orderDate}>{formatDate(item.orderDate)}</Text>

        <View style={styles.divider} />

        <View style={styles.itemsPreview}>
          {item.items.slice(0, 2).map((prod, idx) => (
            <View key={idx} style={styles.productRow}>
              <View style={styles.productInfo}>
                <Text style={styles.productQuantity}>{prod.quantity}x</Text>
                <Text style={styles.productName} numberOfLines={1}>
                  {prod.productName} ({prod.sizeName})
                </Text>
              </View>
              <Text style={styles.productPrice}>${prod.total.toFixed(2)}</Text>
            </View>
          ))}
          {item.items.length > 2 && (
            <Text style={styles.moreItemsText}>
              + {item.items.length - 2} more item(s)
            </Text>
          )}
        </View>

        <View style={styles.divider} />

        <View style={styles.orderFooter}>
          <View>
            <Text style={styles.paymentStatusText}>
              {item.paymentStatus} • {item.items.reduce((sum, i) => sum + i.quantity, 0)} items
            </Text>
          </View>
          <Text style={styles.totalPrice}>${item.totalPrice.toFixed(2)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/profile")} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order History</Text>
        <View style={{ width: 36 }} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#2D5016" />
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.orderId}
          contentContainerStyle={styles.listContent}
          renderItem={renderOrderItem}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#2D5016"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyEmoji}>📦</Text>
              <Text style={styles.emptyText}>You don't have any orders yet</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAF8" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#FAFAF8",
  },
  backBtn: { width: 36, height: 36, justifyContent: "center" },
  backIcon: { fontSize: 22, color: "#1A1A1A" },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    fontFamily: "Roboto",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingBottom: 40,
  },
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  orderId: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  orderDate: {
    fontSize: 13,
    color: "#888",
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "#F0EDE8",
    marginVertical: 12,
  },
  itemsPreview: {
    gap: 8,
  },
  productRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingRight: 15,
  },
  productQuantity: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    width: 24,
  },
  productName: {
    fontSize: 14,
    color: "#1A1A1A",
    flex: 1,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1A1A1A",
  },
  moreItemsText: {
    fontSize: 13,
    color: "#888",
    fontStyle: "italic",
    marginTop: 4,
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  paymentStatusText: {
    fontSize: 13,
    color: "#555",
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2D5016",
  },
  emptyBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
  },
});

