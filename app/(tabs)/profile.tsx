import { useAuth } from "@/context/authContext";
import { fixImageUrl } from "@/services/api";
import { router } from "expo-router";
import { styled } from "nativewind";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Profile = () => {
  const { logout, user } = useAuth();
  
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Text style={styles.headerTitle}>Profile</Text>
      
      <View style={styles.content}>
        <View style={styles.userInfo}>
          <View style={styles.avatarPlaceholder}>
            {(user?.avatar && user.avatar.trim().length > 0) ? (
              <Image source={{ uri: fixImageUrl(user.avatar) }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText}>{user?.fullName?.[0]?.toUpperCase() || "U"}</Text>
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.userName}>{user?.fullName || "Guest User"}</Text>
            <Text style={styles.userRole}>Loyal Customer</Text>
          </View>
          <TouchableOpacity 
            style={styles.editBtn}
            onPress={() => router.push("/edit-profile")}
          >
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Account</Text>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => router.push("/orders")}
        >
          <Text style={styles.menuItemText}>Order History</Text>
          <Text style={styles.menuItemArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.logoutBtn}
          onPress={() => {
            console.log("Dang xuat thanh cong");
            logout();
          }}
        >
          <Text style={styles.logoutBtnText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAF8" },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1A1A1A",
    fontFamily: "Roboto",
    paddingHorizontal: 20,
    paddingVertical: 15,
    textAlign: "center"
  },
  content: {
    paddingHorizontal: 20,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    gap: 15,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E8E2D9",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#555",
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  userRole: {
    fontSize: 14,
    color: "#888",
    marginTop: 2,
  },
  editBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#F5F2EE",
    borderRadius: 20,
  },
  editBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#5C7A3E",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#AAA",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0EDE8",
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1A1A1A",
  },
  menuItemArrow: {
    fontSize: 20,
    color: "#CCC",
  },
  logoutBtn: {
    backgroundColor: "#2D5016",
    borderRadius: 16,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    marginHorizontal: 20,
  },
  logoutBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default Profile;

