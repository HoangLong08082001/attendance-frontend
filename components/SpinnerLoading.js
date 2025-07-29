import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

const SpinnerLoading = () => {
  return (
    <View
      style={{
        backgroundColor: "white",
        position: "absolute",
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        opacity: 0.5,
        zIndex: 100,
      }}
    >
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size={"large"} color={"#25aae1"} />
        <Text
          allowFontScaling={false}
          style={{ textAlign: "center", color: "black", size: 20 }}
        >
          Đang xử lý...
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default SpinnerLoading;
