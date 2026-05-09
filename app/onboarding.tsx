import { useAuth } from "@/context/authContext";
import { router } from "expo-router";
import React from "react";
import {
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Onboarding() {
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      router.replace("/(tabs)");
    } else {
      router.replace("/(auth)/sign-in");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" />
      {require("../assets/images/onboarding-bg.png") ? (
        <ImageBackground
          source={require("../assets/images/onboarding-bg.png")}
          style={styles.background}
          resizeMode="cover"
        >
          <View style={styles.overlay}>
            <View style={styles.content}>
              <Text style={styles.title}>Welcome to Tribean</Text>
              <Text style={styles.subtitle}>
                Enjoy rich, carefully selected coffee cups from the finest sourcing regions.
              </Text>

              <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
                <Text style={styles.buttonText}>Get Started</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      ) : (
        <View style={[styles.background, { backgroundColor: "#1A0F0A", justifyContent: "center", alignItems: "center" }]}>
           <Text style={styles.title}>Welcome to Tribean</Text>
           <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
                <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
    paddingBottom: 60,
  },
  content: {
    paddingHorizontal: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 15,
    fontFamily: "serif", // Using serif to match the screenshot's classy look
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#4A6732", // Matching the green in the screenshot
    width: "100%",
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
