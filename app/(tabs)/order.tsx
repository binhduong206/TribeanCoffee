import { styled } from "nativewind";
import React from "react";
import { Text } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);
const Order = () => {
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text>Order Screen</Text>
    </SafeAreaView>
  );
};
export default Order;
