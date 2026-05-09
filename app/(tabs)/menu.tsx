import MenuProducts from "@/components/menu/menuProduct";
import { theme } from "@/constants/theme";
import { router, useLocalSearchParams } from "expo-router";
import { styled } from "nativewind";
import { useEffect, useState } from "react";
import {
  Image,
  Keyboard,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);

const buttons = [
  {
    image: require("@/assets/icons/coffee-icon.png"),
    title: "COFFEE",
    category: "coffee",
  },
  {
    image: require("@/assets/icons/tea-icon.png"),
    title: "TEA",
    category: "tea",
  },
  {
    image: require("@/assets/icons/milk-tea-icon.png"),
    title: "MILK TEA",
    category: "milk tea",
  },
  {
    image: require("@/assets/icons/cake-icon.png"),
    title: "CAKE",
    category: "cake",
  },
];

const Menu = () => {
  const { category } = useLocalSearchParams<{ category: string }>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  // Tự động chọn category nếu có truyền từ trang khác sang
  useEffect(() => {
    if (category) {
      const index = buttons.findIndex((b) => b.category === category);
      if (index !== -1) {
        setSelectedIndex(index);
      }
    }
  }, [category]);

  const handleSearchSubmit = () => {
    if (searchQuery.trim().length > 0) {
      router.push({ pathname: "/search", params: { q: searchQuery.trim() } });
      setSearchQuery("");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        {/* ── Header ── */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Menu</Text>
        </View>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View>
            <View style={styles.searchBox}>
              <View style={styles.searchIcon}>
                <Image
                  source={require("@/assets/icons/search-icon.png")}
                  style={styles.searchIconImage}
                />
              </View>
              <TextInput
                style={styles.searchInput}
                placeholder="Search for your drinks..."
                placeholderTextColor="#ADB3B2"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearchSubmit}
                returnKeyType="search"
              />
            </View>

            {/* Category */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 20,
              }}
            >
              {buttons.map((item, index) => (
                <View
                  key={index}
                  style={{
                    gap: 6,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => setSelectedIndex(index)}
                    style={{
                      width: 64,
                      height: 64,
                      backgroundColor:
                        selectedIndex === index ? "#334529" : "#fff",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 50,
                    }}
                  >
                    <Image
                      source={item.image}
                      style={{
                        width: 30,
                        height: 30,
                        tintColor: selectedIndex === index ? "#fff" : "#000",
                      }}
                    />
                  </TouchableOpacity>
                  <Text>{item.title}</Text>
                </View>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>

        {/* ── Menu list ── */}
        <View style={{ flex: 1, marginTop: 16 }}>
          <MenuProducts categoryName={buttons[selectedIndex].category} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 20,
  },
    header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    fontFamily: "Roboto",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 47,
    paddingHorizontal: 8,
    height: 50,
    marginBottom: theme.spacing[2],
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

export default Menu;
