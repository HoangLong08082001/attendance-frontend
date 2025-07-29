import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from "react-native";
const NotificationCustome = ({ message, onToggle }) => {
  const translateY = new Animated.Value(-100); // Khởi tạo vị trí banner ngoài màn hình

  // Hàm để hiển thị alert
  const toggleAlert = () => {
    // Khi alert đã hiện, hạ xuống
    Animated.timing(translateY, {
      toValue: 0, // Di chuyển đến vị trí top của màn hình
      duration: 300, // Thời gian chuyển động
      useNativeDriver: true,
    }).start();

    if (onToggle) onToggle(true);
  };

  // Hàm để ẩn alert
  const hideAlert = () => {
    // Khi alert đang hiện, di chuyển nó lên ngoài màn hình
    Animated.timing(translateY, {
      toValue: -100, // Di chuyển lên ngoài màn hình
      duration: 300, // Thời gian chuyển động
      useNativeDriver: true,
    }).start();

    if (onToggle) onToggle(false);
  };

  return (
    <Animated.View
      style={[styles.alertBanner, { transform: [{ translateY }] }]}
    >
      <Text allowFontScaling={false} style={styles.alertText}>
        {message}
      </Text>
      <TouchableOpacity onPress={hideAlert}>
        <Text allowFontScaling={false} style={styles.closeButton}>
          Close
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  alertBanner: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "red",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000, // Đảm bảo alert nằm trên cùng màn hình
  },
  alertText: {
    color: "white",
    fontSize: 18,
  },
  closeButton: {
    marginTop: 10,
    color: "white",
    fontSize: 14,
  },
});

export default NotificationCustome;
