import { apiCall } from "@/services/api";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setError("");
      setLoading(true);
      await apiCall("/api/auth/register", {
        method: "POST",
        body: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          password: password,
        },
      });
      
      Alert.alert(
        "Registration Successful",
        "Your account has been created successfully. Please sign in.",
        [
          { text: "OK", onPress: () => router.replace("/(auth)/sign-in") }
        ]
      );
    } catch (e: any) {
      setError(e?.message ?? "Registration failed. Please try again.");
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
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* ── Header ── */}
            <View style={styles.headerWrapper}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>
                Experience clarity and professional utility at your fingertips.
              </Text>
            </View>

            {/* ── Form ── */}
            <View style={styles.card}>
              <View style={styles.row}>
                {/* First Name */}
                <View style={[styles.flex1, { marginRight: 8 }]}>
                  <Text style={styles.label}>FIRST NAME</Text>
                  <View style={styles.inputRow}>
                    <TextInput
                      style={styles.input}
                      placeholder="Nguyen"
                      placeholderTextColor="#BDBDBD"
                      value={firstName}
                      onChangeText={setFirstName}
                      autoCorrect={false}
                    />
                  </View>
                </View>

                {/* Last Name */}
                <View style={[styles.flex1, { marginLeft: 8 }]}>
                  <Text style={styles.label}>LAST NAME</Text>
                  <View style={styles.inputRow}>
                    <TextInput
                      style={styles.input}
                      placeholder="Van A"
                      placeholderTextColor="#BDBDBD"
                      value={lastName}
                      onChangeText={setLastName}
                      autoCorrect={false}
                    />
                  </View>
                </View>
              </View>

              {/* Email Address */}
              <Text style={styles.label}>EMAIL ADDRESS</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  placeholder="you@gmail.com"
                  placeholderTextColor="#BDBDBD"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              {/* Password */}
              <Text style={styles.label}>PASSWORD</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  placeholder="At least 8 characters"
                  placeholderTextColor="#BDBDBD"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Image
                    source={
                      showPassword 
                        ? require("@/assets/icons/eye-on-icon.png") // Ensure you have this icon, otherwise you might need to use a different one or text
                        : require("@/assets/icons/eye-off-icon.png")
                    }
                    style={styles.eyeIcon}
                    defaultSource={require("@/assets/icons/eye-on-icon.png")}
                    // Fallback to avoid crash if icon doesn't exist
                    onError={(e) => console.log('Icon missing')}
                  />
                </TouchableOpacity>
              </View>

              {/* Confirm Password */}
              <Text style={styles.label}>CONFIRM PASSWORD</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  placeholder="............"
                  placeholderTextColor="#BDBDBD"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
              </View>

              {/* Error */}
              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              {/* Create Account button */}
              <TouchableOpacity
                style={[styles.primaryBtn, loading && { opacity: 0.7 }]}
                onPress={handleRegister}
                disabled={loading}
                activeOpacity={0.85}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.primaryBtnText}>Create account</Text>
                )}
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Or continue with</Text>
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

            {/* ── Sign in link ── */}
            <View style={styles.signInRow}>
              <Text style={styles.signInLabel}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/sign-in")}>
                <Text style={styles.signInLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FAFAF8" },
  container: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },

  // Header
  headerWrapper: { marginBottom: 28 },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1A1A1A",
    fontFamily: "Roboto",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
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

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  flex1: {
    flex: 1,
  },

  label: { fontSize: 11, fontWeight: "700", color: "#666", marginBottom: 8, letterSpacing: 0.5 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E8E4DF",
    borderRadius: 8,
    paddingHorizontal: 14,
    marginBottom: 20,
    height: 48,
  },
  input: { flex: 1, fontSize: 14, color: "#1A1A1A" },
  eyeIcon: { width: 20, height: 20, tintColor: "#1A1A1A", opacity: 0.7 },

  errorText: {
    fontSize: 13,
    color: "#E53E3E",
    marginBottom: 16,
    textAlign: "center",
  },

  primaryBtn: {
    backgroundColor: "#7D9F5E", // matches the green in the design
    borderRadius: 8,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  primaryBtnText: { color: "#fff", fontSize: 15, fontWeight: "600" },

  dividerRow: { flexDirection: "row", alignItems: "center", marginBottom: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#E8E4DF" },
  dividerText: { fontSize: 13, color: "#888", marginHorizontal: 12 },

  socialRow: { flexDirection: "column", gap: 12 },
  socialBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E8E4DF",
    backgroundColor: "#fff",
  },
  socialIcon: { width: 20, height: 20 },
  socialText: { fontSize: 14, fontWeight: "600", color: "#1A1A1A" },

  // Sign in
  signInRow: { flexDirection: "row", justifyContent: "center", marginTop: 32 },
  signInLabel: { fontSize: 14, color: "#666" },
  signInLink: { fontSize: 14, color: "#2B5EE3", fontWeight: "600" },
});
