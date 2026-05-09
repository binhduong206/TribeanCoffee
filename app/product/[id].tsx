import { useAuth } from "@/context/authContext";
import { useCart } from "@/context/cartContext";
import { API_ENDPOINTS, apiCall, fixImageUrl } from "@/services/api";
import { Product } from "@/types/product";
import { Review } from "@/types/review";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

// ── Types ──────────────────────────────────────────────────
interface Size {
  id: string;
  sizeName: string;
  price: number; // giá cộng thêm
}

function Stars({ count, size = 13 }: { count: number; size?: number }) {
  return (
    <View style={{ flexDirection: "row", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Text
          key={i}
          style={{ fontSize: size, color: i <= count ? "#F4A836" : "#D9D9D9" }}
        >
          ★
        </Text>
      ))}
    </View>
  );
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${d.getFullYear()}`;
}

function calcRatingDistribution(reviews: Review[]) {
  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    const star = Math.round(r.rating) as 1 | 2 | 3 | 4 | 5;
    if (star >= 1 && star <= 5) counts[star]++;
  });
  return counts;
}

export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);

  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState("");
  const { getValidToken } = useAuth();
  const { refreshCartCount } = useCart();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productData, reviewData, sizeData] = await Promise.all([
          apiCall<Product>(`${API_ENDPOINTS.PRODUCTS}/${id}`),
          apiCall<Review[]>(`/api/reviews/${id}`),
          apiCall<Size[]>(`/api/sizes`), // ← chỉnh URL nếu khác
        ]);
        setProduct(productData);
        setReviews(Array.isArray(reviewData) ? reviewData : []);
        // Sắp xếp S → M → L cho dễ nhìn
        const sorted = (Array.isArray(sizeData) ? sizeData : []).sort(
          (a, b) => a.price - b.price,
        );
        setSizes(sorted);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (!loading && product) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [loading, product, fadeAnim, slideAnim]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2D5016" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#888" }}>Product not found.</Text>
      </View>
    );
  }

  const hasDiscount = (product.discount ?? 0) > 0;
  const basePrice = hasDiscount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  const selectedSize = sizes[selectedSizeIndex];
  const sizeExtra = selectedSize?.price ?? 0;
  const totalPrice = basePrice + sizeExtra;

  const ratingDist = calcRatingDistribution(reviews);
  const totalReviews = reviews.length;

  const addToCartHandle = async (productId: string, sizeId: string) => {
    const token = await getValidToken();
    try {
      const response = await apiCall("/api/cart/items", {
        method: "POST",
        token: token ?? undefined, // token login
        body: {
          productId,
          sizeId,
          quantity: 1,
        },
      });

      console.log("Add to cart success:", response);
      refreshCartCount(); // update global badge
    } catch (error) {
      console.error("Add to cart failed:", error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar barStyle="dark-content" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/menu")} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* ── Hero Image ── */}
        <View style={styles.imageWrapper}>
          {(product.mainImgUrl && product.mainImgUrl.trim().length > 0) ? (
            <Image
              source={{ uri: fixImageUrl(product.mainImgUrl) }}
              style={styles.heroImage}
              resizeMode="contain"
            />
          ) : (
            <View style={[styles.heroImage, styles.imagePlaceholder]}>
              <Text style={{ fontSize: 64 }}>☕</Text>
            </View>
          )}
          {hasDiscount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountBadgeText}>-{product.discount}%</Text>
            </View>
          )}
        </View>

        <Animated.View
          style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
        >
          <View style={styles.body}>
            <Text style={styles.productName}>{product.productName}</Text>

            {/* ── Giá + Rating ── */}
            <View style={styles.priceRow}>
              <View style={styles.priceBlock}>
                <Text
                  style={[styles.price, hasDiscount && styles.priceDiscounted]}
                >
                  ${basePrice.toFixed(2)}
                </Text>
                {hasDiscount && (
                  <Text style={styles.originalPrice}>
                    ${product.price.toFixed(2)}
                  </Text>
                )}
              </View>
              <View style={styles.ratingBadge}>
                <Stars count={Math.round(product.rating ?? 0)} size={12} />
                <Text style={styles.ratingText}>
                  {product.rating?.toFixed(1)} ({product.reviewCount} reviews)
                </Text>
              </View>
            </View>

            <Text style={styles.description}>{product.description}</Text>

            {/* ── Size Selector ── */}
            {sizes.length > 0 && (
              <>
                <Text style={styles.sectionLabel}>SELECT SIZE</Text>
                <View style={styles.sizeRow}>
                  {sizes.map((s, i) => (
                    <TouchableOpacity
                      key={s.id}
                      style={[
                        styles.sizeBtn,
                        selectedSizeIndex === i && styles.sizeBtnActive,
                      ]}
                      onPress={() => setSelectedSizeIndex(i)}
                    >
                      <Text
                        style={[
                          styles.sizeLetter,
                          selectedSizeIndex === i && styles.sizeBtnActiveText,
                        ]}
                      >
                        {s.sizeName}
                      </Text>
                      {/* Hiển thị giá cộng thêm, S=0 thì không hiện */}
                      <Text
                        style={[
                          styles.sizeSub,
                          selectedSizeIndex === i && styles.sizeBtnActiveText,
                        ]}
                      >
                        {s.price > 0 ? `+$${s.price.toFixed(2)}` : "Base"}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            {/* ── Community Feedback ── */}
            <Text style={styles.sectionTitle}>Community Feedback</Text>

            <View style={styles.ratingCard}>
              <View style={styles.ratingLeft}>
                <Text style={styles.bigRating}>
                  {product.rating?.toFixed(1)}
                </Text>
                <Stars count={Math.round(product.rating ?? 0)} size={14} />
                <Text style={styles.reviewCount}>{totalReviews} Reviews</Text>
              </View>
              <View style={styles.ratingBars}>
                {([5, 4, 3, 2, 1] as const).map((star) => {
                  const count = ratingDist[star];
                  const ratio = totalReviews > 0 ? count / totalReviews : 0;
                  return (
                    <View key={star} style={styles.barRow}>
                      <Text style={styles.barLabel}>{star}</Text>
                      <View style={styles.barBg}>
                        <View
                          style={[styles.barFill, { width: `${ratio * 100}%` }]}
                        />
                      </View>
                      <Text style={styles.barCount}>{count}</Text>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* ── Review List ── */}
            {totalReviews === 0 ? (
              <Text style={styles.noReview}>Chưa có đánh giá nào.</Text>
            ) : (
              reviews.map((r) => (
                <View key={r.reviewId} style={styles.reviewItem}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.avatarCircle}>
                      <Text style={styles.avatarText}>{r.userName[0]}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.reviewerName}>{r.userName}</Text>
                      <Text style={styles.reviewTime}>
                        {formatDate(r.createdAt)}
                      </Text>
                    </View>
                    <Stars count={r.rating} size={13} />
                  </View>
                  <Text style={styles.reviewText}>{r.comment}</Text>
                </View>
              ))
            )}


          </View>
        </Animated.View>
      </ScrollView>

      {/* ── Bottom Bar — giá thay đổi theo size ── */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.addToCartBtn}
          onPress={() => {
            if (!selectedSize) return;

            addToCartHandle(product.id, selectedSize.id);
          }}
        >
          <Image
            source={require("@/assets/icons/shopping-cart-icon.png")}
            style={styles.cartIcon}
          />
          <Text style={styles.addToCartText}>
            Add to Cart · ${totalPrice.toFixed(2)}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareBtn}>
          <Image
            source={require("@/assets/icons/share-icon.png")}
            style={{ width: 30, height: 30, tintColor: "#2D5016" }}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FAFAF8" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backBtn: { width: 36, height: 36, justifyContent: "center" },
  backIcon: { fontSize: 22, color: "#1A1A1A" },
  headerTitle: { fontSize: 16, fontWeight: "600", color: "#1A1A1A" },
  imageWrapper: { width: width, height: width * 0.72 },
  heroImage: { width: "100%", height: "100%" },
  imagePlaceholder: { alignItems: "center", justifyContent: "center" },
  discountBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "#E53E3E",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  discountBadgeText: { color: "#fff", fontSize: 13, fontWeight: "700" },
  body: { paddingHorizontal: 20, paddingTop: 20 },
  productName: {
    fontFamily: "Roboto",
    fontSize: 26,
    fontWeight: "700",
    color: "#1A1A1A",
    lineHeight: 34,
    marginBottom: 10,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  priceBlock: { flexDirection: "row", gap: 6, alignItems: "flex-end" },
  originalPrice: {
    fontSize: 18,
    color: "#BBBBBB",
    textDecorationLine: "line-through",
    lineHeight: 18,
  },
  price: { fontSize: 24, fontWeight: "700", color: "#1A1A1A" },
  priceDiscounted: { color: "#E53E3E" },
  ratingBadge: { flexDirection: "row", alignItems: "center", gap: 6 },
  ratingText: { fontSize: 12, color: "#888" },
  description: {
    fontSize: 14,
    color: "#555",
    lineHeight: 22,
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#AAA",
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  sizeRow: { flexDirection: "row", gap: 12, marginBottom: 28 },
  sizeBtn: {
    width: 64,
    height: 64,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#DDD",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  sizeBtnActive: { borderColor: "#2D5016" },
  sizeLetter: { fontSize: 16, fontWeight: "700", color: "#1A1A1A" },
  sizeSub: { fontSize: 10, color: "#999", marginTop: 2 },
  sizeBtnActiveText: { color: "#2D5016" },
  sectionTitle: {
    fontFamily: "Roboto",
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 14,
  },
  ratingCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  ratingLeft: { alignItems: "center", marginRight: 20, minWidth: 70 },
  bigRating: {
    fontSize: 40,
    fontWeight: "700",
    color: "#1A1A1A",
    lineHeight: 46,
  },
  reviewCount: { fontSize: 11, color: "#999", marginTop: 4 },
  ratingBars: { flex: 1, justifyContent: "center", gap: 6 },
  barRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  barLabel: { fontSize: 11, color: "#999", width: 10 },
  barBg: {
    flex: 1,
    height: 6,
    backgroundColor: "#F0EDE8",
    borderRadius: 4,
    overflow: "hidden",
  },
  barFill: { height: "100%", backgroundColor: "#2D5016", borderRadius: 4 },
  barCount: { fontSize: 11, color: "#999", width: 16, textAlign: "right" },
  noReview: {
    fontSize: 14,
    color: "#AAA",
    textAlign: "center",
    marginBottom: 20,
  },
  reviewItem: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0EDE8",
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#E8E2D9",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 15, fontWeight: "600", color: "#555" },
  reviewerName: { fontSize: 14, fontWeight: "600", color: "#1A1A1A" },
  reviewTime: { fontSize: 12, color: "#AAA", marginTop: 1 },
  reviewText: { fontSize: 14, color: "#555", lineHeight: 21 },
  writeReviewBox: {
    borderWidth: 1.5,
    borderColor: "#DDD",
    borderStyle: "dashed",
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    backgroundColor: "#fff",
  },
  writeReviewRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  writeIcon: { fontSize: 16 },
  reviewInput: { flex: 1, fontSize: 14, color: "#1A1A1A", minHeight: 36 },
  photoLabel: { fontSize: 13, color: "#AAA" },
  divider: { height: 1, backgroundColor: "#F0EDE8", marginVertical: 10 },
  postBtn: {
    backgroundColor: "#2D5016",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 10,
  },
  postBtnText: { color: "#fff", fontSize: 15, fontWeight: "600" },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    paddingBottom: 28,
    backgroundColor: "#FAFAF8",
    borderTopWidth: 1,
    borderTopColor: "#F0EDE8",
    gap: 12,
  },
  addToCartBtn: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#2D5016",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
  },
  cartIcon: { width: 30, height: 30, tintColor: "#fff" },
  addToCartText: { color: "#fff", fontSize: 15, fontWeight: "600" },
  shareBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#DDD",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
