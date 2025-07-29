import React, { useEffect, useRef } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Defs, RadialGradient, Stop, Rect } from "react-native-svg";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export default function Iphone2Screen(props) {
  const { navigation } = props;
  // Tạo một Animated.Value để điều khiển việc xoay
  const spinValue = useRef(new Animated.Value(0)).current;
  const animatedValue = useRef(new Animated.ValueXY({ x: 0, y: -500 })).current;

  //Animation spin
  useEffect(() => {
    // Hàm tạo hiệu ứng xoay ngang liên tục (xoay theo trục Y)
    const spinAnimation = () => {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1, // Xoay từ giá trị 0 đến 1
          duration: 3000, // Thời gian thực hiện một vòng xoay (3 giây)
          useNativeDriver: true, // Sử dụng Native Driver cho hiệu năng tốt hơn
        })
      ).start();
    };

    spinAnimation(); // Kích hoạt hiệu ứng khi component được mount
  }, [spinValue]);

  // Chuyển giá trị Animated thành giá trị xoay theo trục Y (0 -> 360 độ)
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"], // Xoay 360 độ theo trục Y
  });

  //Animation coin rơi từ trên xuống
  useEffect(() => {
    // Animation dịch chuyển logo
    const goDownAnimation = () => {
      Animated.spring(animatedValue, {
        toValue: { x: 160, y: 20 }, // Dịch chuyển logo đến tọa độ mới
        bounciness: 15, // Tạo hiệu ứng nảy khi di chuyển
        speed: 1, // Tốc độ di chuyển
        useNativeDriver: true, // Sử dụng Native Driver để nâng cao hiệu suất
      }).start();
    };

    goDownAnimation();
  }, [animatedValue]);

  //Tự động Điều hướng màn hình sang iphone3
  useEffect(() => {
    // Sau 3 giây tự động chuyển sang HomeScreen
    const timer = setTimeout(() => {
      navigation.navigate("Iphone3"); // Điều hướng đến màn hình Home và xóa màn hình hiện tại khỏi stack
    }, 3000);
  }, [navigation]);

  return (
    <LinearGradient colors={["#3C82DF", "#3C82DF"]} style={styles.container}>
      {/* Radial gradient bọc quanh logo */}
      <Svg height="330" width="350" style={styles.gradient}>
        <Defs>
          <RadialGradient
            id="grad"
            cx="50%"
            cy="50%"
            r="50%"
            fx="50%"
            fy="50%"
            gradientUnits="userSpaceOnUse"
          >
            <Stop
              offset="0%"
              stopColor="rgba(154, 186, 230, 1)"
              stopOpacity="1"
            />
            <Stop
              offset="100%"
              stopColor="rgba(126, 181, 255, 0)"
              stopOpacity="0"
            />
          </RadialGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#grad)" />
      </Svg>

      {/* Logo nằm chính giữa gradient */}
      <View style={styles.logoContainer}>
        {/* Sử dụng Animated.Image để logo có thể xoay ngang như đồng xu và dịch chuyển */}
        <Animated.Image
          source={require("../assets/Frame.png")}
          style={[
            styles.logo,
            {
              // transform: [
              //   { rotateY: spin }, // Áp dụng hiệu ứng xoay ngang
              //   { translateY: animatedValue.y }, // Dịch chuyển theo trục Y
              // ],
            },
          ]}
        />
      </View>

      {/* Văn bản (title) nằm bên dưới logo và gradient */}
      <Text allowFontScaling={false} style={styles.title}>
        <Text allowFontScaling={false} style={styles.bold}>
          Time
        </Text>{" "}
        Tracker
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3C82DF", // Fallback nếu LinearGradient không hoạt động
  },
  gradient: {
    position: "absolute", // Gradient nằm dưới logo
    top: "25%", // Đẩy gradient xuống khoảng giữa màn hình
    height: "35%", // Chiều cao gradient chiếm 40% màn hình
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30, // Tạo khoảng cách giữa logo và title
  },
  logo: {
    height: 200,
    width: 228,
  },
  title: {
    fontSize: 28,
    color: "#FFFFFF",
    letterSpacing: 1,
    marginTop: 40, // Tạo khoảng cách giữa logo và title
  },
  bold: {
    fontWeight: "bold",
  },
});
