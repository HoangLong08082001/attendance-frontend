import React, { useState, useEffect, useRef } from "react";
import AppIntroSlider from "react-native-app-intro-slider";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from "react-native";
import Svg, { Defs, RadialGradient, Stop, Rect } from "react-native-svg";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const slides = [
  {
    key: 1,
    text: "Check-in/Check-out Nhanh Chóng",
    subText:
      "Chấm công dễ dàng chỉ với một chạm. Theo dõi giờ làm việc của bạn theo thời gian thực.",
    image: require("../assets/clock.png"),
  },
  {
    key: 2,
    text: "Lịch Sử Chấm Công Chi Tiết",
    subText:
      "Xem lại lịch sử làm việc của bạn: từ giờ check-in, check-out đến tổng số giờ làm việc hàng ngày.",
    image: require("../assets/calander.png"),
  },
  {
    key: 3,
    text: "Quản Lý Thông Tin Cá Nhân",
    subText:
      "Cập nhật thông tin cá nhân và theo dõi hiệu suất làm việc ngay trong ứng dụng",
    image: require("../assets/check.png"),
  },
];

const Stack = createNativeStackNavigator();

export default function Iphone4Screen(props) {
  const { navigation } = props;
  const [showRealApp, setShowRealApp] = useState(false);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // Tạo hiệu ứng rung
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        // Rung sang phải
        Animated.timing(shakeAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        // Rung sang trái
        Animated.timing(shakeAnim, {
          toValue: -1,
          duration: 700,
          useNativeDriver: true,
        }),
        // Quay về vị trí ban đầu
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [shakeAnim]);

  const shakeInterpolation = shakeAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [-5, 5], // Độ lệch để tạo hiệu ứng rung
  });

  const _renderItem = ({ item }) => {
    return (
      <View style={styles.slide}>
        <Svg height="350" width="450" style={styles.gradient}>
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

        {/* Sử dụng Animated.Image để áp dụng hiệu ứng */}
        <Animated.Image
          source={item.image}
          style={[
            styles.image,
            { transform: [{ translateX: shakeInterpolation }] },
          ]}
        />
        <Text allowFontScaling={false} style={styles.title}>
          {item.text}
        </Text>
        <Text allowFontScaling={false} style={styles.subText}>
          {item.subText}
        </Text>
      </View>
    );
  };

  const _onDone = () => {
    setShowRealApp(true);
  };

  if (showRealApp) {
    return (
      <View style={styles.container}>
        <Text>Ứng dụng chính hiển thị ở đây!</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <AppIntroSlider
          renderItem={_renderItem}
          data={slides}
          onDone={_onDone}
          showNextButton={false}
          showDoneButton={false}
          dotStyle={styles.dot}
          activeDotStyle={styles.activeDot}
        />

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.navigate("SignIn")}
          >
            <Text allowFontScaling={false} style={styles.createButtonText}>
              Đăng nhập ngay
            </Text>
          </TouchableOpacity>

          <Text allowFontScaling={false} style={styles.haveWalletText}>
            Bạn quên mật khẩu?
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3C82DF",
    justifyContent: "space-between",
  },
  gradient: {
    position: "absolute",
    top: "23%",
    height: "100%",
  },
  dot: {
    marginRight: 3,
    backgroundColor: "#B9BDC1",
    marginTop: -50,
  },
  activeDot: {
    width: 23,
    height: 8,
    borderRadius: 5,
    marginRight: 3,
    backgroundColor: "#FFFFFF",
    marginTop: -50,
  },
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  image: {
    marginTop: 100,
    width: 350,
    height: 350,
    marginBottom: -20,
  },
  title: {
    fontSize: 26,
    color: "#FFFFFF",
    marginBottom: 10,
    textAlign: "center",
    paddingHorizontal: 50,
  },
  subText: {
    fontSize: 12,
    color: "#FFFFFF",
    marginBottom: 60,
    textAlign: "center",
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  buttonsContainer: {
    paddingHorizontal: 20,
    marginBottom: 70,
  },
  createButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 20,
    alignItems: "center",
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#36383A",
  },
  haveWalletButton: {
    // borderColor: '#FFFFFF',
    // borderWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignItems: "center",
  },
  haveWalletText: {
    fontSize: 12,
    color: "#FFFFFF",
    textAlign: "center",
    textDecorationLine: "underline",
  },
});
