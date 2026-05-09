import React, { useRef } from "react";
import { fixImageUrl } from "@/services/api";
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const CARD_WIDTH = width * 0.44;
const IMAGE_HEIGHT = CARD_WIDTH * 0.8;
const CONTENT_HEIGHT = 120;
const CARD_HEIGHT = IMAGE_HEIGHT + CONTENT_HEIGHT;

interface DrinkCardProps {
  name?: string;
  description?: string;
  rating?: number;
  price?: number;
  discount?: number; // 0–100 (%)
  imageUri?: string;
  onAddToOrder?: () => void;
  onPress?: () => void;
}

const DrinkCard: React.FC<DrinkCardProps> = ({
  name = "Oatmilk Honey Latte",
  description = "Silky espresso with wild honey and creamy oat milk",
  rating = 4.8,
  price = 6.5,
  discount = 0,
  imageUri,
  onAddToOrder,
  onPress,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const hasDiscount = discount > 0;
  const discountedPrice = hasDiscount ? price * (1 - discount / 100) : price;

  return (
    <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
      {/* ── Ảnh + badge giảm giá ── */}
      <TouchableOpacity
        style={styles.imageContainer}
        activeOpacity={0.9}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {(imageUri && imageUri.trim().length > 0) ? (
          <Image
            source={{ uri: fixImageUrl(imageUri) }}
            style={styles.image}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.coffeeEmoji}>☕</Text>
          </View>
        )}

        {/* Badge % hiện ra góc trên trái khi có discount */}
        {hasDiscount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountBadgeText}>-{discount}%</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* ── Nội dung ── */}
      <View style={styles.content}>
        <View style={styles.textBlock}>
          <Text style={styles.name} numberOfLines={2} ellipsizeMode="tail">
            {name}
          </Text>
          <Text
            style={styles.description}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {description}
          </Text>
        </View>

        <View style={styles.ratingPriceRow}>
          <View style={styles.ratingContainer}>
            <Text style={styles.star}>★</Text>
            <Text style={styles.ratingValue}>{rating.toFixed(1)}</Text>
          </View>

          {/* Giá: nếu có discount → hiện giá gốc gạch ngang + giá mới */}
          <View style={styles.priceBlock}>
            <Text style={[styles.price, hasDiscount && styles.priceDiscounted]}>
              ${discountedPrice.toFixed(2)}
            </Text>
              {hasDiscount && (
              <Text style={styles.originalPrice}>${price.toFixed(2)}</Text>
            )}
          </View>
        </View>

      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 8,
  },
  imageContainer: {
    width: "100%",
    height: IMAGE_HEIGHT,
  },
  image: { width: "100%", height: "100%" },
  imagePlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1A0F0A",
  },
  coffeeEmoji: { fontSize: 48 },

  // Badge giảm giá
  discountBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#E53E3E",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  discountBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.2,
  },

  content: {
    height: CONTENT_HEIGHT,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 10,
    justifyContent: "space-between",
  },
  textBlock: { flex: 1, overflow: "hidden" },
  name: {
    fontFamily: "Roboto",
    fontSize: 13,
    fontWeight: "700",
    color: "#1A1A1A",
    lineHeight: 18,
    letterSpacing: -0.2,
    marginBottom: 3,
  },
  description: {
    fontFamily: "Roboto",
    fontSize: 11,
    color: "#8A8A8A",
    lineHeight: 15,
  },
  ratingPriceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 6,
  },
  ratingContainer: { flexDirection: "row", alignItems: "center", gap: 2 },
  star: { fontSize: 12, color: "#F4A836", lineHeight: 16 },
  ratingValue: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1A1A1A",
    lineHeight: 16,
  },

  // Khối giá
  priceBlock: { alignItems: "flex-end", flexDirection: "row", justifyContent: "space-between" , gap: 5},
  originalPrice: {
    fontSize: 11,
    color: "#BBBBBB",
    textDecorationLine: "line-through",
    lineHeight: 14,
  },
  price: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A1A",
    letterSpacing: -0.4,
  },
  priceDiscounted: {
    color: "#E53E3E", // đỏ khi đang giảm giá
  },

});

export default React.memo(DrinkCard);

