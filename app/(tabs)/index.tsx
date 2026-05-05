import { CuratedCollection } from "@/components/home";
import { BestSeller } from "@/components/home/BestSeller";
import { Header } from "@/components/home/Header";
import { HomeBanner } from "@/components/home/HomeBanner";
import { MorningFavorites } from "@/components/home/MorningFavorites";
import { HOME_BANNER, HOME_CATEGORIES, HOME_USER_NAME } from "@/constants/home";
import { theme } from "@/constants/theme";
import "@/global.css";
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function HomeScreen() {
  const handleAvatarPress = () => {
    // TODO: Navigate to profile
  };

  const handleCartPress = () => {
    // TODO: Navigate to cart
  };

  const handleBannerButtonPress = () => {
    // TODO: Navigate to product details
  };

  const handleCategoryPress = (categoryId: string) => {
    // TODO: Navigate to category details
    console.log("Category pressed:", categoryId);
  };

  const categoriesWithHandlers = HOME_CATEGORIES.map((category) => ({
    ...category,
    onPress: () => handleCategoryPress(category.id),
  }));

  const handleProductPress = (productId: string) => {
    // TODO: Navigate to product details
    console.log("Product pressed:", productId);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Header
            userName={HOME_USER_NAME}
            onAvatarPress={handleAvatarPress}
            onCartPress={handleCartPress}
            showSearchBox
          />

          <View style={styles.body}>
            <HomeBanner
              title={HOME_BANNER.title}
              description={HOME_BANNER.description}
              bannerImage={HOME_BANNER.image}
              badge={HOME_BANNER.badge}
              buttonLabel={HOME_BANNER.buttonLabel}
              onButtonPress={handleBannerButtonPress}
            />

            <CuratedCollection
              title="Curated Collection"
              viewAllHref="/categories"
              categories={categoriesWithHandlers}
            />

            {/* <ProductList onCategoryPress={handleProductPress} /> */}
            <MorningFavorites />
            <BestSeller />
          </View>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  body: {
    flex: 1,
    marginTop: theme.spacing[7],
    paddingHorizontal: theme.spacing[5],
  },
});
