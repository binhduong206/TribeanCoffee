import type { Category } from "@/constants/home";
import { theme } from "@/constants/theme";
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { CategoryItem } from "./CategoryItem";

interface CuratedCollectionProps {
  categories: Category[];
  viewAllHref?: string;
  title?: string;
}

export function CuratedCollection({
  categories,
  viewAllHref = "/",
  title = "Curated Collection",
}: CuratedCollectionProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Link href={viewAllHref} style={styles.viewAllLink}>
          View All
        </Link>
      </View>

      <View style={styles.categoriesGrid}>
        {categories.map((category) => (
          <CategoryItem
            key={category.id}
            icon={category.icon}
            label={category.label}
            onPress={category.onPress}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: theme.spacing[12],
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing[3],
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.foreground,
  },
  viewAllLink: {
    color: theme.colors.foreground,
    fontSize: 14,
    fontWeight: "500",
  },
  categoriesGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
