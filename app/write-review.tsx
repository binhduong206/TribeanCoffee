import { useAuth } from "@/context/authContext";
import { apiCall } from "@/services/api";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WriteReviewScreen() {
  const { orderId, productId, productName, image } = useLocalSearchParams<{
    orderId: string;
    productId: string;
    productName: string;
    image: string;
  }>();

  const { getValidToken } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert("Error", "Please select a rating before submitting.");
      return;
    }

    try {
      setSubmitting(true);
      const token = await getValidToken();
      await apiCall("/api/reviews", {
        method: "POST",
        token: token ?? undefined,
        body: {
          productId,
          orderId,
          rating,
          comment: comment.trim() || null,
        },
      });

      Alert.alert("Thank you!", "Your review has been submitted successfully.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      console.log("Failed to submit review:", error);
      const msg = error?.message || "Could not submit review. Please try again later.";
      Alert.alert("Oops!", msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Write a Review</Text>
        <View style={{ width: 36 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Product Info */}
            <View style={styles.productCard}>
              {(image && image.trim().length > 0) ? (
                <Image source={{ uri: image }} style={styles.productImage} />
              ) : (
                <View style={[styles.productImage, styles.imagePlaceholder]}>
                  <Text style={{ fontSize: 24 }}>☕</Text>
                </View>
              )}
              <View style={styles.productDetails}>
                <Text style={styles.productName} numberOfLines={2}>
                  {productName}
                </Text>
              </View>
            </View>

            {/* Rating Selector */}
            <View style={styles.ratingSection}>
              <Text style={styles.sectionTitle}>How was your drink?</Text>
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setRating(star)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.star, star <= rating ? styles.starSelected : styles.starUnselected]}>
                      ★
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Comment Input */}
            <View style={styles.commentSection}>
              <Text style={styles.sectionTitle}>Add a written review (optional)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="What did you like or dislike?"
                placeholderTextColor="#AAA"
                multiline
                textAlignVertical="top"
                value={comment}
                onChangeText={setComment}
                maxLength={500}
              />
              <Text style={styles.charCount}>{comment.length}/500</Text>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitBtnText}>Submit Review</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAF8" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#FAFAF8",
  },
  backBtn: { width: 36, height: 36, justifyContent: "center" },
  backIcon: { fontSize: 22, color: "#1A1A1A", fontWeight: "600" },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    fontFamily: "Roboto",
  },
  scrollContent: {
    padding: 20,
  },
  productCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    alignItems: "center",
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: "#F0EDE8",
    marginRight: 15,
  },
  imagePlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    fontFamily: "Roboto",
  },
  ratingSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 15,
  },
  starsContainer: {
    flexDirection: "row",
    gap: 10,
  },
  star: {
    fontSize: 48,
  },
  starSelected: {
    color: "#F4A836",
  },
  starUnselected: {
    color: "#E8E2D9",
  },
  commentSection: {
    marginBottom: 30,
  },
  textInput: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    minHeight: 120,
    fontSize: 15,
    color: "#1A1A1A",
    borderWidth: 1,
    borderColor: "#F0EDE8",
  },
  charCount: {
    textAlign: "right",
    fontSize: 12,
    color: "#AAA",
    marginTop: 8,
  },
  submitBtn: {
    backgroundColor: "#2D5016",
    borderRadius: 14,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
  },
  submitBtnDisabled: {
    backgroundColor: "#88A674",
  },
  submitBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});

