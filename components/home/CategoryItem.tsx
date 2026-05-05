import { theme } from "@/constants/theme";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CategoryItemProps {
  icon: any;
  label: string;
  onPress?: () => void;
}

export function CategoryItem({ icon, label, onPress }: CategoryItemProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.iconContainer}>
        <Image source={icon} style={styles.icon} />
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    gap: theme.spacing[1],
  },
  iconContainer: {
    width: 64,
    height: 64,
    backgroundColor: theme.colors.muted,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 30,
    height: 30,
  },
  label: {
    fontSize: 14,
    color: theme.colors.foreground,
    fontWeight: "500",
  },
});
