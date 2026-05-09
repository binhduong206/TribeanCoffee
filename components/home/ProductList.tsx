import { theme } from "@/constants/theme";
import { useProducts } from "@/hooks/useProducts";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { router } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import DrinkCard from "../ProductCard";

interface ProductListProps {
  title?: string;
  endpoint: string;
  onCategoryPress?: (categoryId: string) => void;
  showRefresh?: boolean;
}

export function ProductList({
  title = "Morning Favorites",
  onCategoryPress,
  showRefresh = true,
  endpoint,
}: ProductListProps) {
  const { products, loading, error, refetch } = useProducts(endpoint);

  const tabBarHeight = useBottomTabBarHeight();
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
          style={styles.loader}
        />
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Oops!</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        {showRefresh && (
          <Text style={styles.retryText} onPress={refetch}>
            Tap to retry
          </Text>
        )}
      </View>
    );
  }

  if (!products || products.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No products available</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
      contentContainerStyle={{
        paddingBottom: tabBarHeight + 30,
      }}
      renderItem={({ item }) => (
        <DrinkCard
          name={item.productName}
          discount={item.discount}
          description={item.description}
          price={item.price}
          rating={item.rating}
          imageUri={item.mainImgUrl}
          onPress={() =>
            router.push({
              pathname: "/product/[id]",
              params: { id: item.id },
            })
          }
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: theme.spacing[12],
  },
  loader: {
    marginBottom: theme.spacing[4],
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.foreground,
    marginTop: theme.spacing[3],
  },
  errorContainer: {
    marginVertical: theme.spacing[8],
    paddingHorizontal: theme.spacing[5],
    paddingVertical: theme.spacing[8],
    backgroundColor: "#FFE5E5",
    borderRadius: theme.spacing[3],
    alignItems: "center",
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.destructive,
    marginBottom: theme.spacing[2],
  },
  errorMessage: {
    fontSize: 14,
    color: theme.colors.foreground,
    marginBottom: theme.spacing[4],
    textAlign: "center",
  },
  retryText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  emptyContainer: {
    marginVertical: theme.spacing[8],
    paddingHorizontal: theme.spacing[5],
    paddingVertical: theme.spacing[8],
    backgroundColor: theme.colors.muted,
    borderRadius: theme.spacing[3],
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.mutedForeground,
  },
});
