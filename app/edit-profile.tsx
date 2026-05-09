import { useAuth } from "@/context/authContext";
import { apiCall, fixImageUrl, uploadImage } from "@/services/api";
import { authStorage } from "@/utils/authStorage";
import * as ImagePicker from "expo-image-picker";
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
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditProfile() {
  const { user, updateUser } = useAuth();
  
  // Initialize from user object
  const nameParts = (user?.fullName || "").trim().split(" ");
  const initialLastName = nameParts.length > 1 ? nameParts.pop() : "";
  const initialFirstName = nameParts.join(" ") || user?.fullName || "";

  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName || "");
  const [birthDay, setBirthDay] = useState(""); // Format: YYYY-MM-DD
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!firstName.trim()) {
      Alert.alert("Error", "First name cannot be empty.");
      return;
    }

    try {
      setLoading(true);
      
      let finalAvatarUrl = user?.avatar || null;

      // If a new image was selected, upload it first
      if (selectedImage) {
        try {
          finalAvatarUrl = await uploadImage(selectedImage);
        } catch (uploadError: any) {
          console.error("Upload Error detail:", uploadError);
          Alert.alert("Upload Error", uploadError?.message || "Failed to upload profile picture.");
          setLoading(false);
          return;
        }
      }

      const payload = {
        firstName: firstName.trim(),
        lastName: lastName.trim() || null,
        birthDay: birthDay.trim() || null,
        phoneNumber: phoneNumber.trim() || null,
        avatarUrl: finalAvatarUrl,
      };

      console.log("[API] Updating profile with payload:", payload);

      // Call API to update profile
      await apiCall("/api/user/profile", {
        method: "PUT",
        body: payload,
      });

      // Update local storage and context
      if (user) {
        const updatedUser = { 
          ...user, 
          fullName: `${firstName.trim()} ${lastName.trim()}`.trim(),
          avatar: finalAvatarUrl || user.avatar
        };
        
        const tokens = {
          accessToken: await authStorage.getAccessToken() || "",
          refreshToken: await authStorage.getRefreshToken() || "",
          accessTokenExpiration: "",
          refreshTokenExpiration: "",
          user: updatedUser,
        };
        await authStorage.save(tokens);
        
        // Update context state so UI reflects changes immediately
        updateUser(updatedUser);
        
        Alert.alert("Success", "Profile updated successfully.", [
          { text: "OK", onPress: () => router.back() }
        ]);
      }
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.replace("/profile")} style={styles.backBtn}>
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Edit Profile</Text>
            <View style={styles.backBtn} />
          </View>
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.avatarSection}>
              <View style={styles.avatarPlaceholder}>
                {(selectedImage || (user?.avatar && user.avatar.trim().length > 0)) ? (
                  <Image source={{ uri: selectedImage ? fixImageUrl(selectedImage) : fixImageUrl(user?.avatar) }} style={styles.avatarImage} />
                ) : (
                  <Text style={styles.avatarText}>{firstName?.[0]?.toUpperCase() || "U"}</Text>
                )}
              </View>
              <TouchableOpacity style={styles.changeAvatarBtn} onPress={pickImage}>
                <Text style={styles.changeAvatarText}>Change Photo</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.formSection}>
              <Text style={styles.label}>FIRST NAME</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="Enter your first name"
                  placeholderTextColor="#BDBDBD"
                />
              </View>
              <Text style={styles.label}>LAST NAME</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Enter your last name"
                  placeholderTextColor="#BDBDBD"
                />
              </View>
              <Text style={styles.label}>PHONE NUMBER</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  placeholder="Enter phone number"
                  placeholderTextColor="#BDBDBD"
                  keyboardType="phone-pad"
                />
              </View>
              <Text style={styles.label}>BIRTHDAY (YYYY-MM-DD)</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  value={birthDay}
                  onChangeText={setBirthDay}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#BDBDBD"
                />
              </View>
            </View>
            <TouchableOpacity
              style={[styles.saveBtn, loading && { opacity: 0.7 }]}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveBtnText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FAFAF8" },
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0EDE8",
    backgroundColor: "#fff",
  },
  backBtn: { width: 36, height: 36, justifyContent: "center" },
  backIcon: { fontSize: 22, color: "#1A1A1A" },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  content: {
    padding: 24,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E8E2D9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  avatarText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#555",
  },
  changeAvatarBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  changeAvatarText: {
    fontSize: 14,
    color: "#5C7A3E",
    fontWeight: "600",
  },
  formSection: {
    marginBottom: 32,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  inputRow: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E8E4DF",
    borderRadius: 8,
    paddingHorizontal: 14,
    marginBottom: 20,
    height: 50,
    justifyContent: "center",
  },
  input: {
    fontSize: 16,
    color: "#1A1A1A",
  },
  saveBtn: {
    backgroundColor: "#5C7A3E",
    borderRadius: 8,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
