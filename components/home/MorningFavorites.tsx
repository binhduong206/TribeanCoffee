import { theme } from "@/constants/theme";
import { API_ENDPOINTS } from "@/services/api";
import { Text, View } from "react-native";
import { ProductList } from "./ProductList";

export function MorningFavorites() {
  return (
    <View style={{ marginTop: 60 }}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          color: theme.colors.foreground,
          marginBottom: 20,
        }}
      >
        Morning Favorites
      </Text>
      <ProductList endpoint={API_ENDPOINTS.PRODUCTS} />
    </View>
  );
}
