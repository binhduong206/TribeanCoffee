import { theme } from "@/constants/theme";
import { API_ENDPOINTS } from "@/services/api";
import { Text, View } from "react-native";
import { ProductList } from "./ProductList";

export function BestSeller() {
  return (
    <View style={{ marginTop: -30 }}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          color: theme.colors.foreground,
          marginBottom: 20,
        }}
      >
        Best Seller
      </Text>
      <ProductList endpoint={API_ENDPOINTS.BESTSELLER_PRODUCTS} />
    </View>
  );
}
