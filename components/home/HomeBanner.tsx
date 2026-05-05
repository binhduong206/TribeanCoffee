import { theme } from "@/constants/theme";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface HomeBannerProps {
  title: string;
  description: string;
  bannerImage: any;
  badge?: string;
  onButtonPress?: () => void;
  buttonLabel?: string;
}

export function HomeBanner({
  title,
  description,
  bannerImage,
  badge = "NEW PRODUCT",
  onButtonPress,
  buttonLabel = "Try now",
}: HomeBannerProps) {
  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        {badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        <TouchableOpacity style={styles.button} onPress={onButtonPress}>
          <Text style={styles.buttonText}>{buttonLabel}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.rightContent}>
        <Image source={bannerImage} style={styles.image} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: theme.spacing[6],
    flexDirection: "row",
    overflow: "hidden",
  },
  leftContent: {
    width: "60%",
    paddingHorizontal: theme.spacing[5],
    paddingVertical: theme.spacing[5],
    flexDirection: "column",
    gap: theme.spacing[2],
    justifyContent: "center",
  },
  rightContent: {
    width: "40%",
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    backgroundColor: "#485639",
    paddingHorizontal: theme.spacing[2],
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
  },
  title: {
    fontSize: 24,
    color: theme.colors.foreground,
    fontWeight: "bold",
  },
  description: {
    color: theme.colors.foreground,
    fontSize: 14,
    lineHeight: 20,
  },
  button: {
    backgroundColor: "#fff",
    alignSelf: "flex-start",
    paddingHorizontal: theme.spacing[5],
    paddingVertical: theme.spacing[1],
    borderRadius: 47,
  },
  buttonText: {
    color: theme.colors.foreground,
    fontWeight: "600",
    fontSize: 14,
  },
  image: {
    transform: [{ rotate: "10deg" }, { translateY: -6 }],
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
});
