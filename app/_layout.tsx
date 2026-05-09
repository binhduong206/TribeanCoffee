import { AuthProvider, useAuth } from "@/context/authContext";
import { CartProvider } from "@/context/cartContext";
import "@/global.css";
import { Slot, useSegments, useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

function RootNavigator() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const isOnboarding = segments[0] === "onboarding";
    const isIndex = (segments as string[]).length === 0;

    console.log("[Navigation] DEBUG:", { 
      segments, 
      inAuthGroup, 
      isOnboarding,
      isIndex, 
      hasUser: !!user 
    });

    if (!user && !inAuthGroup && !isOnboarding && !isIndex) {
      console.log("[Navigation] Redirecting to Onboarding");
      router.replace("/onboarding");
    } else if (user && (inAuthGroup || isOnboarding)) {
      console.log("[Navigation] Redirecting to Tabs");
      router.replace("/(tabs)");
    }
  }, [user, loading, segments]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#FAFAF8", // Màu nền sáng cho đỡ bị màn hình đen
        }}
      >
        <ActivityIndicator size="large" color="#5C7A3E" />
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
        <RootNavigator />
      </CartProvider>
    </AuthProvider>
  );
}
