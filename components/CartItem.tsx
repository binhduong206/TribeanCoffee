import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { fixImageUrl } from "@/services/api";

export interface CartItemData {
  productId: string;
  categoryName: string;
  productName: string;
  image: string;
  sizeId: string;
  sizeName: string;
  price: number;
  discount: number;
  finalPrice: number;
  quantity: number;
  total: number;
}

interface CartItemProps {
  item: CartItemData;
  onIncrease: (productId: string, sizeId: string) => void;
  onDecrease: (productId: string, sizeId: string) => void;
  onRemove: (productId: string, sizeId: string) => void;
}

export function CartItem({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemProps) {
  const hasDiscount = item.discount > 0;

  return (
    <View style={styles.card}>
      {/* ── Ảnh ── */}
      <View style={styles.imageWrapper}>
        {(item.image && item.image.trim().length > 0) ? (
          <Image
            source={{ uri: fixImageUrl(item.image) }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={{ fontSize: 28 }}>☕</Text>
          </View>
        )}
      </View>

      {/* ── Info ── */}
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>
            {item.productName}
          </Text>
          <View style={styles.priceBlock}>
            {hasDiscount && (
              <Text style={styles.originalPrice}>${item.price.toFixed(2)}</Text>
            )}
            <Text style={styles.finalPrice}>${item.finalPrice.toFixed(2)}</Text>
          </View>
        </View>

        <Text style={styles.size}>Size: {item.sizeName}</Text>

        {/* ── Quantity + Delete ── */}
        <View style={styles.actionRow}>
          <View style={styles.qtyBox}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => onDecrease(item.productId, item.sizeId)}
            >
              <Text style={styles.qtyBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.qtyValue}>{item.quantity}</Text>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => onIncrease(item.productId, item.sizeId)}
            >
              <Text style={styles.qtyBtnText}>+</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => onRemove(item.productId, item.sizeId)}
          >
            <Image
              source={require("@/assets/icons/delete-icon.png")}
              style={{ width: 20, height: 20 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    alignItems: "center",
    gap: 12,
  },
  imageWrapper: {
    width: 90,
    height: 90,
    borderRadius: 12,
    overflow: "hidden",
    flexShrink: 0,
  },
  image: { width: "100%", height: "100%" },
  imagePlaceholder: {
    flex: 1,
    backgroundColor: "#F0EDE8",
    alignItems: "center",
    justifyContent: "center",
  },
  info: { flex: 1 },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 2,
  },
  name: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A1A",
    fontFamily: "Roboto",
    flex: 1,
    marginRight: 8,
  },
  priceBlock: { alignItems: "flex-end" },
  originalPrice: {
    fontSize: 11,
    color: "#BBB",
    textDecorationLine: "line-through",
    lineHeight: 14,
  },
  finalPrice: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  size: { fontSize: 12, color: "#AAA", marginBottom: 8 },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  qtyBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F2EE",
    borderRadius: 20,
    paddingHorizontal: 4,
    paddingVertical: 2,
    gap: 2,
  },
  qtyBtn: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyBtnText: {
    fontSize: 18,
    color: "#1A1A1A",
    fontWeight: "400",
    lineHeight: 22,
  },
  qtyValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1A1A",
    minWidth: 24,
    textAlign: "center",
  },
  deleteBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteIcon: { fontSize: 18 },
});

