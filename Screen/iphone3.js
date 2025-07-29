import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, {
  Defs,
  RadialGradient,
  Stop,
  Rect,
  Circle,
} from "react-native-svg";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export default function Iphone3Screen(props) {
  const { navigation } = props;
  // Tạo nhiều giá trị Animated cho các gợn sóng
  const waveAnims = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  // Hàm khởi tạo hiệu ứng gợn sóng cho từng sóng
  useEffect(() => {
    const createWaveAnimation = (animatedValue, delay) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay), // Thời gian chờ trước khi sóng bắt đầu
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 2000, // Thời gian sóng gợn
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 0, // Đặt lại giá trị khi hoàn thành một chu kỳ
            useNativeDriver: true,
          }),
        ])
      );
    };

    // Kích hoạt hiệu ứng gợn sóng với thời gian trễ khác nhau
    waveAnims.forEach((waveAnim, index) => {
      createWaveAnimation(waveAnim, index * 500).start(); // Mỗi sóng bắt đầu cách nhau 500ms
    });
    return () => {
      waveAnims.forEach((waveAnim) => waveAnim.stopAnimation()); // Dừng animation khi unmount
    };
  }, [waveAnims]);

  // Chuyển giá trị animated thành giá trị mở rộng cho các sóng
  const createWaveStyle = (waveAnim) => ({
    r: waveAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [60, 300], // Thay đổi bán kính của vòng tròn
    }),
    opacity: waveAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0], // Giảm dần độ trong suốt của sóng
    }),
  });

  return (
    <LinearGradient colors={["#3C82DF", "#3C82DF"]} style={styles.container}>
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
      <View style={styles.logoContainer}>
        {/* Tạo nhiều gợn sóng bao quanh logo */}
        <Svg height="300" width="300" style={styles.wave}>
          {waveAnims.map((waveAnim, index) => (
            <AnimatedCircle
              key={index}
              cx="150"
              cy="150"
              r={createWaveStyle(waveAnim).r} // Điều chỉnh bán kính theo animation
              stroke="#FFFFFF"
              strokeWidth="1.4"
              fill="none"
              opacity={createWaveStyle(waveAnim).opacity} // Điều chỉnh opacity theo animation
            />
          ))}
        </Svg>

        {/* Logo */}
        <Image source={require("../assets/Frame.png")} style={styles.logo} />
      </View>

      <Text allowFontScaling={false} style={styles.title}>
        <Text allowFontScaling={false} style={styles.bold}>
          Time
        </Text>
        <Text allowFontScaling={false} style={styles.text2}>
          {" "}
          Tracker
        </Text>
      </Text>
      <View style={styles.wrapContext}>
        <Text allowFontScaling={false} style={styles.welcomeText}>
          Chào mừng đến với TimeTracker
        </Text>
        <Text allowFontScaling={false} style={styles.loginText}>
          Giải pháp chấm công hiện đại. Quản lý thời gian làm việc của bạn dễ
          dàng và chính xác, mọi lúc, mọi nơi.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Iphone4")}
        >
          <Text allowFontScaling={false} style={styles.buttonText}>
            Bắt đầu ngay
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

// Sử dụng Animated để tạo hiệu ứng gợn sóng với Circle
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logoContainer: {
    marginTop: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  wave: {
    position: "absolute",
    zIndex: -1, // Đặt sóng phía sau logo
  },
  logo: {
    width: 170,
    height: 160,
  },
  gradient: {
    position: "absolute", // Gradient nằm dưới logo
    top: "20%", // Đẩy gradient xuống khoảng giữa màn hình
    height: "35%", // Chiều cao gradient chiếm 40% màn hình
  },
  title: {
    fontSize: 28,
    color: "#FFFFFF",
    letterSpacing: 1,
    marginTop: 20,
    display: "flex",
  },
  bold: {
    fontWeight: "bold",
  },
  text2: {
    fontWeight: "300",
  },
  wrapContext: {
    marginTop: 100,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: -8,
    textAlign: "center",
  },
  loginText: {
    fontSize: 12,
    color: "#FFFFFF",
    textAlign: "center",
    paddingHorizontal: 30,
    marginTop: 30,
    lineHeight: 20,
  },
  button: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 40,
    alignItems: "center",
    marginTop: 30,
  },
  buttonText: {
    color: "#36383A",
    fontSize: 16,
    fontWeight: "bold",
  },
});
