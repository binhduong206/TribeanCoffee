import { useAuth } from "@/context/authContext";
import { API_ENDPOINTS, apiCall } from "@/services/api";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
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

export default function OrderScreen() {
  const { getValidToken } = useAuth();

  const [receiverName, setReceiverName] = useState("");
  const [receiverPhoneNumber, setReceiverPhoneNumber] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "Online">("COD");
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    if (!receiverName || !receiverPhoneNumber || !receiverAddress) {
      Alert.alert("Thông báo", "Vui lòng điền đầy đủ thông tin giao hàng!");
      return;
    }

    setLoading(true);
    try {
      const token = await getValidToken();
      if (!token) {
        Alert.alert("Lỗi", "Bạn cần đăng nhập để đặt hàng!");
        return;
      }

      await apiCall(API_ENDPOINTS.ORDERS, {
        method: "POST",
        token: token,
        body: {
          receiverName,
          receiverPhoneNumber,
          receiverAddress,
          paymentMethod,
        },
      });

      Alert.alert("Thành công", "Đơn hàng của bạn đã được tạo!", [
        {
          text: "OK",
          onPress: () => {
            // Reset form
            setReceiverName("");
            setReceiverPhoneNumber("");
            setReceiverAddress("");
            setPaymentMethod("COD");
            // Navigate back to home
            router.navigate("/(tabs)");
          },
        },
      ]);
    } catch (error) {
      console.error("Order placement error:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 36 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: 20 },
            ]}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Delivery Information</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Receiver Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter receiver name"
                  value={receiverName}
                  onChangeText={setReceiverName}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter phone number"
                  keyboardType="phone-pad"
                  value={receiverPhoneNumber}
                  onChangeText={setReceiverPhoneNumber}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Delivery Address</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Enter full delivery address"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  value={receiverAddress}
                  onChangeText={setReceiverAddress}
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Payment Method</Text>

              <View style={styles.paymentMethods}>
                <TouchableOpacity
                  style={[
                    styles.paymentBtn,
                    paymentMethod === "COD" && styles.paymentBtnActive,
                  ]}
                  onPress={() => setPaymentMethod("COD")}
                >
                  <Text
                    style={[
                      styles.paymentBtnText,
                      paymentMethod === "COD" && styles.paymentBtnTextActive,
                    ]}
                  >
                    Cash on Delivery (COD)
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.paymentBtn,
                    paymentMethod === "Online" && styles.paymentBtnActive,
                  ]}
                  onPress={() => setPaymentMethod("Online")}
                >
                  <Text
                    style={[
                      styles.paymentBtnText,
                      paymentMethod === "Online" && styles.paymentBtnTextActive,
                    ]}
                  >
                    Online Payment
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handlePlaceOrder}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitBtnText}>Place Order</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FAFAF8" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#FAFAF8",
    borderBottomWidth: 1,
    borderBottomColor: "#F0EDE8",
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
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 16,
    fontFamily: "Roboto",
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F9F9F9",
    borderWidth: 1,
    borderColor: "#EAEAEA",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: "#1A1A1A",
  },
  textArea: {
    height: 80,
    paddingTop: 12,
  },
  paymentMethods: {
    gap: 12,
  },
  paymentBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: "#EAEAEA",
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  paymentBtnActive: {
    borderColor: "#2D5016",
    backgroundColor: "#F4F7F0",
  },
  paymentBtnText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#666",
  },
  paymentBtnTextActive: {
    color: "#2D5016",
  },
  submitBtn: {
    backgroundColor: "#2D5016",
    borderRadius: 16,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  submitBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});

