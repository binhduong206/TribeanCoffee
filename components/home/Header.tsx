import { theme } from "@/constants/theme";
import { styled } from "nativewind";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

interface HeaderProps {
  userName?: string;
  onAvatarPress?: () => void;
  onCartPress?: () => void;
  showSearchBox?: boolean;
  onSearch?: (text: string) => void;
  searchPlaceholder?: string;
}

export function Header({
  userName = "Penguin",
  onAvatarPress,
  onCartPress,
  showSearchBox = true,
  searchPlaceholder = "Search our seasonal blends...",
}: HeaderProps) {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerBar}>
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={onAvatarPress}
          >
            <Image
              source={require("@/assets/avatar/penguin_avatar.png")}
              style={styles.avatar}
            />
          </TouchableOpacity>
          <Text style={styles.title}>TriBeanCoffee</Text>
          <TouchableOpacity onPress={onCartPress}>
            <Image
              source={require("@/assets/icons/shopping-cart-icon.png")}
              style={styles.cartIcon}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.welcomeText}>Good morning, {userName}</Text>
        <Text style={styles.subtitleText}>Your daily ritual starts here</Text>

        {showSearchBox && (
          <View style={styles.searchBox}>
            <View style={styles.searchIcon}>
              <Image
                source={require("@/assets/icons/search-icon.png")}
                style={styles.searchIconImage}
              />
            </View>
            <Text style={styles.searchPlaceholder}>{searchPlaceholder}</Text>
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
  },
  avatar: {
    width: 40,
    height: 40,
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
    paddingHorizontal: theme.spacing[3],
    marginBottom: theme.spacing[2],
    height: 50,
  },
  searchIcon: {
    backgroundColor: "#485639",
    width: 34,
    height: 34,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing[3],
  },
  searchIconImage: {
    width: 20,
    height: 20,
    tintColor: "#fff",
  },
  searchPlaceholder: {
    fontSize: 16,
    color: "#ADB3B2",
  },
});
