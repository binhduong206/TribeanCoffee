export interface Category {
  id: string;
  label: string;
  icon: any;
  onPress?: () => void;
}

export const HOME_CATEGORIES: Category[] = [
  {
    id: "coffee",
    label: "COFFEE",
    icon: require("@/assets/icons/coffee-icon.png"),
  },
  {
    id: "tea",
    label: "TEA",
    icon: require("@/assets/icons/tea-icon.png"),
  },
  {
    id: "milk tea",
    label: "MILK TEA",
    icon: require("@/assets/icons/milk-tea-icon.png"),
  },
  {
    id: "cake",
    label: "CAKE",
    icon: require("@/assets/icons/cake-icon.png"),
  },
];

export const HOME_BANNER = {
  title: "Matcha Special",
  description: "Authentic Japanese organic matcha blended with smooth",
  image: require("@/assets/images/banner/matcha-tea.png"),
  badge: "NEW PRODUCT",
  buttonLabel: "Try now",
};

export const HOME_MORNING_PRODUCTS = {};

export const HOME_USER_NAME = "Penguin";
