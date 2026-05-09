import { CuratedCollection } from "@/components/home";
import { BestSeller } from "@/components/home/BestSeller";
import { Header } from "@/components/home/Header";
import { HomeBanner } from "@/components/home/HomeBanner";
import { MorningFavorites } from "@/components/home/MorningFavorites";
import { HOME_BANNER, HOME_CATEGORIES } from "@/constants/home";
import { theme } from "@/constants/theme";
import "@/global.css";
import { router } from "expo-router";
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function HomeScreen() {
  const handleAvatarPress = () => {
    router.push("/profile");
  };

  const handleCartPress = () => {
    router.push("/cart");
  };

  const handleBannerButtonPress = () => {
    // TODO: Navigate to product details
  };

  const handleCategoryPress = (categoryId: string) => {
    // Chuyển sang tab Menu và truyền category
    router.push({
      pathname: "/menu",
      params: { category: categoryId },
    });
  };

  const categoriesWithHandlers = HOME_CATEGORIES.map((category) => ({
    ...category,
    onPress: () => handleCategoryPress(category.id),
  }));



  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Header
            // userName={HOME_USER_NAME}
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
              viewAllHref={"/categories" as any}
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
