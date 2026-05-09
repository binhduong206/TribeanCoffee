import { useAuth } from "@/context/authContext";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignIn() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Vui lòng nhập email và mật khẩu.");
      return;
    }
    try {
      setError("");
      setLoading(true);
      await login(email.trim(), password);
    } catch (e: any) {
      setError(e?.message ?? "Đăng nhập thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          {/* ── Logo ── */}
          <View style={styles.logoWrapper}>
            <View style={styles.logoCircle}>
              <Image
                source={require("@/assets/icons/coffee-icon.png")}
                style={styles.logoIcon}
              />
            </View>
            <Text style={styles.brandName}>Tribean Coffee</Text>
            <Text style={styles.welcomeText}>Welcome back</Text>
          </View>

          {/* ── Form ── */}
          <View style={styles.card}>
            {/* Email */}
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputRow}>
              <Image
                source={require("@/assets/icons/email-icon.png")}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Your email address"
                placeholderTextColor="#BDBDBD"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Password */}
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputRow}>
              <Image
                source={require("@/assets/icons/padlock-icon.png")}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter password"
                placeholderTextColor="#BDBDBD"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            {/* Error */}
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {/* Forgot password */}
            <TouchableOpacity
              style={styles.forgotRow}
              onPress={() => router.push("/forgot-password")}
            >
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            {/* Sign In button */}
            <TouchableOpacity
              style={[styles.signInBtn, loading && { opacity: 0.7 }]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.signInText}>Sign In</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social buttons */}
            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialBtn}>
                <Image
                  source={require("@/assets/icons/google-icon.png")}
                  style={styles.socialIcon}
                />
                <Text style={styles.socialText}>Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialBtn}>
                <Image
                  source={require("@/assets/icons/facebook-icon.png")}
                  style={styles.socialIcon}
                />
                <Text style={styles.socialText}>Facebook</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ── Sign up link ── */}
          <View style={styles.signUpRow}>
            <Text style={styles.signUpLabel}>Don&apos;t have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/sign-up")}>
              <Text style={styles.signUpLink}>Sign up now</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FAFAF8" },
  container: { flex: 1, paddingHorizontal: 24, justifyContent: "center" },

  // Logo
  logoWrapper: { alignItems: "center", marginBottom: 28 },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#3B1F0E",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  logoIcon: { width: 36, height: 36, tintColor: "#fff" },
  brandName: {
    fontSize: 16,
    color: "#5C7A3E",
    fontWeight: "600",
    marginBottom: 4,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1A1A1A",
    fontFamily: "Roboto",
  },

  // Card
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 16,
    elevation: 5,
  },

  label: { fontSize: 13, fontWeight: "600", color: "#1A1A1A", marginBottom: 8 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F2EE",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
    height: 48,
  },
  inputIcon: { width: 18, height: 18, tintColor: "#BDBDBD", marginRight: 10 },
  input: { flex: 1, fontSize: 14, color: "#1A1A1A" },

  errorText: {
    fontSize: 13,
    color: "#E53E3E",
    marginBottom: 8,
    textAlign: "center",
  },

  forgotRow: { alignItems: "flex-end", marginBottom: 20 },
  forgotText: { fontSize: 13, color: "#5C7A3E", fontWeight: "500" },

  signInBtn: {
    backgroundColor: "#5C7A3E",
    borderRadius: 14,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  signInText: { color: "#fff", fontSize: 16, fontWeight: "700" },

  dividerRow: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#E8E4DF" },
  dividerText: { fontSize: 12, color: "#BDBDBD", marginHorizontal: 10 },

  socialRow: { flexDirection: "row", gap: 12 },
  socialBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#E8E4DF",
    backgroundColor: "#fff",
  },
  socialIcon: { width: 20, height: 20 },
  socialText: { fontSize: 14, fontWeight: "600", color: "#1A1A1A" },

  // Sign up
  signUpRow: { flexDirection: "row", justifyContent: "center", marginTop: 24 },
  signUpLabel: { fontSize: 14, color: "#888" },
  signUpLink: { fontSize: 14, color: "#1A1A1A", fontWeight: "700" },
});

