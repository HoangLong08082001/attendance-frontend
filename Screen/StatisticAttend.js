import React from "react";
import { StyleSheet, Text, View } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const StatisticAttend = () => {
  return (
    <View style={styles.container}>
      <FontAwesome name="warning" size={40} color="#FFCC00" />
      <Text allowFontScaling={false} style={styles.text}>
        Tính năng đang phát triển
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 750,
  },
  text: {
    marginTop: 20,
    textAlign: "center",
    fontWeight: "400",
    fontSize: 20,
    color: "#FFCC00",
  },
});

export default StatisticAttend;
