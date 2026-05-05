import React, { useRef } from "react";
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

// ── Kích thước cố định ─────────────────────────────────────
const CARD_WIDTH = width * 0.44; // nhỏ hơn so với trước (0.55)
const IMAGE_HEIGHT = CARD_WIDTH * 0.8; // ảnh cố định
const CONTENT_HEIGHT = 148; // nội dung cố định → card luôn cùng chiều cao
const CARD_HEIGHT = IMAGE_HEIGHT + CONTENT_HEIGHT;

interface DrinkCardProps {
  name?: string;
  description?: string;
  rating?: number;
  price?: number;
  imageUri?: string;
  onAddToOrder?: () => void;
}

const DrinkCard: React.FC<DrinkCardProps> = ({
  name = "Oatmilk Honey Latte",
  description = "Silky espresso with wild honey and creamy oat milk",
  rating = 4.8,
  price = 6.5,
  imageUri,
  onAddToOrder,
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

  return (
    <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
      {/* ── Ảnh (chiều cao cố định) ── */}
      <View style={styles.imageContainer}>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.coffeeEmoji}>☕</Text>
          </View>
        )}
      </View>

      {/* ── Nội dung (chiều cao cố định, dùng flex để đẩy button xuống đáy) ── */}
      <View style={styles.content}>
        {/* Tên + mô tả chiếm phần trên, cố định số dòng */}
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

        {/* Rating & Price luôn ở giữa */}
        <View style={styles.ratingPriceRow}>
          <View style={styles.ratingContainer}>
            <Text style={styles.star}>★</Text>
            <Text style={styles.ratingValue}>{rating.toFixed(1)}</Text>
          </View>
          <Text style={styles.price}>${price.toFixed(2)}</Text>
        </View>

        {/* Button luôn ở đáy */}
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.85}
          onPress={onAddToOrder}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <Text style={styles.buttonText}>Add to Order</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT, // ← chiều cao cố định, mọi thẻ luôn bằng nhau
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    // Shadow iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    // Shadow Android
    elevation: 8,
  },

  // ── Image ──────────────────────────────────────────────
  imageContainer: {
    width: "100%",
    height: IMAGE_HEIGHT, // cố định
    // backgroundColor: "#1A0F0A",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1A0F0A",
  },
  coffeeEmoji: {
    fontSize: 48,
  },

  // ── Content ────────────────────────────────────────────
  content: {
    height: CONTENT_HEIGHT, // cố định
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 10,
    justifyContent: "space-between", // đẩy các phần đều nhau, button luôn ở đáy
  },

  // Khối text (name + description) có chiều cao cố định
  textBlock: {
    flex: 1, // chiếm phần dư sau khi rating + button lấy chỗ
    overflow: "hidden",
  },
  name: {
    fontFamily: "Georgia",
    fontSize: 13,
    fontWeight: "700",
    color: "#1A1A1A",
    lineHeight: 18,
    letterSpacing: -0.2,
    marginBottom: 3,
  },
  description: {
    fontFamily: "Georgia",
    fontSize: 11,
    color: "#8A8A8A",
    lineHeight: 15,
  },

  // ── Rating & Price ─────────────────────────────────────
  ratingPriceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 6,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  star: {
    fontSize: 12,
    color: "#F4A836",
    lineHeight: 16,
  },
  ratingValue: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1A1A1A",
    lineHeight: 16,
  },
  price: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A1A",
    letterSpacing: -0.4,
  },

  // ── Button ─────────────────────────────────────────────
  button: {
    backgroundColor: "#2D5016",
    borderRadius: 10,
    paddingVertical: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.1,
  },
});

export default DrinkCard;

// ──────────────────────────────────────────────────────────
// USAGE EXAMPLE — render nhiều thẻ cạnh nhau
// ──────────────────────────────────────────────────────────
//
// import { ScrollView } from 'react-native';
// import DrinkCard from './DrinkCard';
//
// const drinks = [
//   { id: '1', name: 'Oatmilk Honey Latte', description: 'Silky espresso with wild honey', rating: 4.8, price: 6.50, imageUri: '...' },
//   { id: '2', name: 'Cold Brew',            description: 'Smooth & bold',                 rating: 4.6, price: 5.00, imageUri: '...' },
//   { id: '3', name: 'Matcha Oat Latte',     description: 'Ceremonial grade matcha...',    rating: 4.9, price: 7.00, imageUri: '...' },
// ];
//
// <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, padding: 16 }}>
//   {drinks.map(d => (
//     <DrinkCard key={d.id} {...d} onAddToOrder={() => console.log('Added', d.id)} />
//   ))}
// </ScrollView>
