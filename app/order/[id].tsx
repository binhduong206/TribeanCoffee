import { useAuth } from "@/context/authContext";
import { apiCall, fixImageUrl } from "@/services/api";
import { useLocalSearchParams, router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface OrderItem {
  productId: string;
  productName: string;
  image: string;
  sizeName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface OrderDetail {
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

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getValidToken } = useAuth();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const token = await getValidToken();
        const response = await apiCall<OrderDetail>(`/api/orders/${id}`, {
          token: token ?? undefined,
        });
        setOrder(response);
      } catch (error) {
        console.error("Failed to fetch order details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetail();
  }, [id, getValidToken]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order Details</Text>
          <View style={{ width: 36 }} />
        </View>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#2D5016" />
        </View>
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order Details</Text>
          <View style={{ width: 36 }} />
        </View>
        <View style={styles.center}>
          <Text style={styles.errorText}>Order not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const confirmReceived = async () => {
    try {
      setLoading(true); // Re-use loading state for simplicity or add a new one
      const token = await getValidToken();
      await apiCall(`/api/orders/${id}/confirm-delivered`, {
        method: "PUT",
        token: token ?? undefined,
      });
      // Refresh order
      setOrder({ ...order!, status: "Delivered" });
    } catch (error) {
      console.error("Confirm received error:", error);
    } finally {
      setLoading(false);
    }
  };

  const statusColor = getStatusColor(order.status);
  const isShipping = order.status.toLowerCase() === "shipping";
  const isDelivered = order.status.toLowerCase() === "delivered";

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Order Header Info */}
        <View style={styles.section}>
          <View style={styles.orderHeaderRow}>
            <Text style={styles.orderIdTitle}>Order #{order.orderId.split("-")[0].toUpperCase()}</Text>
            <View style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}>
              <Text style={[styles.statusText, { color: statusColor.text }]}>
                {order.status}
              </Text>
            </View>
          </View>
          <Text style={styles.orderDateLabel}>Date: <Text style={styles.orderDateValue}>{formatDate(order.orderDate)}</Text></Text>
        </View>

        {/* Delivery Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Receiver</Text>
            <Text style={styles.infoValue}>{order.receiverName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>{order.receiverPhoneNumber}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Address</Text>
            <Text style={styles.infoValue}>{order.receiverAddress}</Text>
          </View>
        </View>

        {/* Items List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Items ({order.items.reduce((sum, item) => sum + item.quantity, 0)})</Text>
          {order.items.map((item, index) => (
            <View key={index} style={styles.itemContainer}>
              <View style={styles.itemRow}>
                {(item.image && item.image.trim().length > 0) ? (
                  <Image source={{ uri: fixImageUrl(item.image) }} style={styles.itemImage} />
                ) : (
                  <View style={[styles.itemImage, styles.imagePlaceholder]}>
                    <Text style={{ fontSize: 24 }}>☕</Text>
                  </View>
                )}
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName} numberOfLines={2}>{item.productName}</Text>
                  <Text style={styles.itemSize}>Size: {item.sizeName}</Text>
                  <View style={styles.itemPriceRow}>
                    <Text style={styles.itemPrice}>${item.unitPrice.toFixed(2)} x {item.quantity}</Text>
                    <Text style={styles.itemTotal}>${item.total.toFixed(2)}</Text>
                  </View>
                </View>
              </View>
              
              {/* Review Button if Delivered */}
              {isDelivered && (
                <TouchableOpacity 
                  style={styles.reviewBtn}
                  onPress={() => router.push({
                    pathname: "/write-review",
                    params: {
                      orderId: id,
                      productId: item.productId,
                      productName: item.productName,
                      image: fixImageUrl(item.image),
                    }
                  })}
                >
                  <Text style={styles.reviewBtnText}>Write a Review</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {/* Summary */}
        <View style={[styles.section, isShipping ? {} : { marginBottom: 30 }]}>
          <Text style={styles.sectionTitle}>Payment Summary</Text>
          <View style={styles.infoRow}>
            <Text style={styles.summaryLabel}>Payment Status</Text>
            <Text style={[styles.summaryValue, order.paymentStatus.toLowerCase() === 'paid' ? { color: "#2E7D32", fontWeight: "700" } : { color: "#E67E22", fontWeight: "700" }]}>
              {order.paymentStatus}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>${order.totalPrice.toFixed(2)}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        {isShipping && (
          <TouchableOpacity 
            style={styles.confirmBtn}
            onPress={confirmReceived}
          >
            <Text style={styles.confirmBtnText}>Confirm Received</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
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
  scrollContent: {
    padding: 20,
  },
  section: {
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
  orderHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  orderIdTitle: {
    fontSize: 18,
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
  orderDateLabel: {
    fontSize: 14,
    color: "#888",
  },
  orderDateValue: {
    color: "#1A1A1A",
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
    fontFamily: "Roboto",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: "#888",
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: "#1A1A1A",
    fontWeight: "500",
    flex: 2,
    textAlign: "right",
  },
  itemRow: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "center",
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: "#F0EDE8",
    marginRight: 12,
  },
  imagePlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  itemSize: {
    fontSize: 13,
    color: "#888",
    marginBottom: 4,
  },
  itemPriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemPrice: {
    fontSize: 14,
    color: "#555",
  },
  itemTotal: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  divider: {
    height: 1,
    backgroundColor: "#F0EDE8",
    marginVertical: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#555",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2D5016",
  },
  errorText: {
    fontSize: 16,
    color: "#E53E3E",
  },
  itemContainer: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0EDE8",
    paddingBottom: 16,
  },
  reviewBtn: {
    marginTop: 12,
    alignSelf: "flex-end",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2D5016",
  },
  reviewBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2D5016",
  },
  confirmBtn: {
    backgroundColor: "#2D5016",
    borderRadius: 14,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  confirmBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
