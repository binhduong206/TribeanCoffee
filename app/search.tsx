import DrinkCard from "@/components/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { API_ENDPOINTS } from "@/services/api";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SearchScreen() {
  const { q } = useLocalSearchParams<{ q: string }>();
  const [searchQuery, setSearchQuery] = useState(q || "");
  const [activeQuery, setActiveQuery] = useState(q || "");
  const isFirstLoad = useRef(true);

  // Fetch products using activeQuery (updates only on submit)
  const { products, loading, loadingMore, hasMore, loadMore } = useProducts(
    activeQuery ? `${API_ENDPOINTS.PRODUCTS}?ProductName=${encodeURIComponent(activeQuery)}` : null,
  );

  useEffect(() => {
    if (q) {
      setSearchQuery(q);
      setActiveQuery(q);
    }
  }, [q]);

  const handleSearchSubmit = () => {
    if (searchQuery.trim().length > 0) {
      setActiveQuery(searchQuery.trim());
      Keyboard.dismiss();
    }
  };

  const handleEndReached = () => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    if (!loading && !loadingMore && hasMore) {
      loadMore();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* ── Header with Search Bar ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        
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
            autoFocus={!q} // autoFocus only if opened without a query
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")} style={styles.clearBtn}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          {/* ── Status Header ── */}
          {activeQuery ? (
            <Text style={styles.resultsText}>
              Search results for "{activeQuery}"
            </Text>
          ) : (
            <Text style={styles.resultsText}>Type something to search</Text>
          )}

          {/* ── Content ── */}
          {loading ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color="#2D5016" />
            </View>
          ) : (
            <FlatList
              data={products}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: "space-between" }}
              contentContainerStyle={styles.listContent}
              keyboardShouldPersistTaps="handled"
              onEndReached={handleEndReached}
              onEndReachedThreshold={0.05}
              ListEmptyComponent={
                activeQuery ? (
                  <View style={styles.emptyBox}>
                    <Image
                      source={require('@/assets/icons/search-icon.png')}
                      style={{width: 50, height: 50}}
                    />
                    <Text style={styles.emptyText}>No products found.</Text>
                    <Text style={styles.emptySubText}>Try searching with a different keyword.</Text>
                  </View>
                ) : null
              }
              ListFooterComponent={
                loadingMore ? (
                  <View style={{ paddingVertical: 16 }}>
                    <ActivityIndicator color="#334529" />
                  </View>
                ) : null
              }
              renderItem={({ item }) => (
                <DrinkCard
                  name={item.productName}
                  description={item.description}
                  price={item.price}
                  rating={item.rating}
                  imageUri={item.mainImgUrl}
                  discount={item.discount}
                  onPress={() =>
                    router.push({
                      pathname: "/product/[id]",
                      params: { id: item.id },
                    })
                  }
                />
              )}
            />
          )}
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAF8" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#FAFAF8",
    gap: 15,
  },
  backBtn: { width: 36, height: 36, justifyContent: "center" },
  backIcon: { fontSize: 22, color: "#1A1A1A" },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 47,
    paddingHorizontal: 8,
    height: 46,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  searchIcon: {
    backgroundColor: "#485639",
    width: 32,
    height: 32,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    flexShrink: 0,
  },
  searchIconImage: {
    width: 16,
    height: 16,
    tintColor: "#fff",
  },
  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: 14,
    color: "#1A1A1A",
  },
  clearBtn: {
    padding: 8,
  },
  clearIcon: {
    fontSize: 16,
    color: "#AAA",
  },
  resultsText: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontSize: 15,
    fontWeight: "500",
    color: "#555",
    fontFamily: "Roboto",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 12,
  },
  emptyBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: "#888",
  },
});

