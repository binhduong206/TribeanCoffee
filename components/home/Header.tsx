import { theme } from "@/constants/theme";
import { useAuth } from "@/context/authContext";
import { useCart } from "@/context/cartContext";
import { fixImageUrl } from "@/services/api";
import { router } from "expo-router";
import { styled } from "nativewind";
import { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

interface HeaderProps {
  onAvatarPress?: () => void;
  onCartPress?: () => void;
  showSearchBox?: boolean;
  onSearch?: (text: string) => void;
  searchPlaceholder?: string;
}

export function Header({
  onAvatarPress,
  onCartPress,
  showSearchBox = true,
  onSearch,
  searchPlaceholder = "Search our seasonal blends...",
}: HeaderProps) {
  const { user } = useAuth();
  const { cartCount } = useCart();

  // Lấy tên đầu tiên để hiển thị "Good morning, Binh"
  const firstName = user?.fullName?.split(" ")[0] ?? "Friend";

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = () => {
    if (searchQuery.trim().length > 0) {
      if (onSearch) {
        onSearch(searchQuery.trim());
      } else {
        router.push({ pathname: "/search", params: { q: searchQuery.trim() } });
      }
      setSearchQuery("");
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerBar}>
          {/* Avatar: dùng ảnh từ API nếu có, fallback về ảnh local */}
          {user?.avatar && console.log("[Header] Current Avatar URL:", fixImageUrl(user.avatar))}
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={onAvatarPress}
          >
            {(user?.avatar && user.avatar.trim().length > 0) ? (
              <Image source={{ uri: fixImageUrl(user.avatar) }} style={styles.avatar} />
            ) : (
              <Image
                source={require("@/assets/avatar/penguin_avatar.png")}
                style={styles.avatar}
              />
            )}
          </TouchableOpacity>

          <Text style={styles.title}>TriBeanCoffee</Text>

          <TouchableOpacity
            onPress={onCartPress}
            style={{ position: "relative" }}
          >
            <Image
              source={require("@/assets/icons/shopping-cart-icon.png")}
              style={styles.cartIcon}
            />
            {cartCount >= 0 && (
              <Text style={styles.cartBadge}>{cartCount}</Text>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.welcomeText}>Good morning, {firstName}</Text>
        <Text style={styles.subtitleText}>Your daily ritual starts here</Text>

        {showSearchBox && (
          <View style={styles.searchBox}>
            <View style={styles.searchIcon}>
              <Image
                source={require("@/assets/icons/search-icon.png")}
                style={styles.searchIconImage}
              />
            </View>
            <TextInput
              style={styles.searchInput}
              placeholder={searchPlaceholder}
              placeholderTextColor="#ADB3B2"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearchSubmit}
              returnKeyType="search"
            />
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.primary,
    borderBottomLeftRadius: theme.spacing[6],
    borderBottomRightRadius: theme.spacing[6],
  },
  safeArea: {
    flexDirection: "column",
    gap: theme.spacing[2],
    paddingHorizontal: theme.spacing[7],
  },
  headerBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing[1],
  },
  avatarContainer: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    borderRadius: 50,
    overflow: "hidden", // ảnh tròn đẹp hơn
  },
  avatar: {
    width: 60,
    height: 60,
  },
  title: {
    color: theme.colors.foreground,
    fontSize: 28,
    fontWeight: "bold",
  },
  cartIcon: {
    width: 30,
    height: 30,
  },
  cartBadge: {
    backgroundColor: "#485639",
    color: "#fff",
    width: 20,
    height: 20,
    borderRadius: 50,
    textAlign: "center",
    position: "absolute",
    top: -5,
    right: -10,
    fontSize: 12,
    lineHeight: 20,
  },
  welcomeText: {
    fontSize: 18,
    color: theme.colors.foreground,
    fontWeight: "500",
  },
  subtitleText: {
    color: theme.colors.foreground,
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: theme.spacing[1],
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 47,
    paddingHorizontal: 8,
    height: 50,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  searchIcon: {
    backgroundColor: "#485639",
    width: 34,
    height: 34,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    flexShrink: 0,
  },
  searchIconImage: {
    width: 18,
    height: 18,
    tintColor: "#fff",
  },
  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: 14,
    color: "#1A1A1A",
  },
});
