import { useProducts } from "@/hooks/useProducts";
import { API_ENDPOINTS } from "@/services/api";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { router } from "expo-router";
import { useRef } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import DrinkCard from "../ProductCard";

interface MenuProductsProps {
  categoryName: string;
}

export default function MenuProducts({ categoryName }: MenuProductsProps) {
  const tabBarHeight = useBottomTabBarHeight();
  const isFirstLoad = useRef(true);

  const { products, loading, loadingMore, hasMore, loadMore } = useProducts(
    `${API_ENDPOINTS.PRODUCTS}?categoryName=${categoryName}`,
  );

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
    <FlatList
      data={products}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={{ justifyContent: "space-between" }}
      contentContainerStyle={{ gap: 12, paddingBottom: tabBarHeight + 30 }}
      keyboardShouldPersistTaps="handled"
      onEndReached={handleEndReached}
      showsVerticalScrollIndicator={false}
      onEndReachedThreshold={0.05}
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
  );
}
