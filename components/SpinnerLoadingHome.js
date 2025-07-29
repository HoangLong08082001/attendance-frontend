import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { axiosApiInstance } from "../services/axios";

const SpinnerLoadingHome = () => {
  const [progress, setProgress] = useState(0); // Tiến trình tải
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const callAPIWithProgress = async () => {
    let interval; // Khởi tạo biến interval

    try {
      const token = await AsyncStorage.getItem("userToken");
      const now = new Date();

      // Bắt đầu mô phỏng tiến trình
      let fakeProgress = 0;
      interval = setInterval(() => {
        if (fakeProgress < 95) {
          fakeProgress += 5; // Tăng tiến trình mỗi 100ms
          setProgress(fakeProgress);
        }
      }, 100);

      // Gọi API
      await axiosApiInstance.post(
        "/attendance/getattendancebyuserdatenow",
        {
          date: now.getDate(),
          month: now.getMonth() + 1,
          year: now.getFullYear(),
        },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      // Khi API hoàn thành, cập nhật tiến trình đến 100%
      clearInterval(interval); // Xóa interval mô phỏng
      setProgress(100);
      setMessage("API gọi thành công!");
    } catch (error) {
      // Xử lý lỗi
      setMessage("Có lỗi xảy ra khi gọi API.");
      setProgress(0);
    } finally {
      clearInterval(interval); // Đảm bảo xóa interval khi hoàn tất
      setTimeout(() => setLoading(false), 0); // Thực hiện tiếp ngay lập tức
    }
  };

  useEffect(() => {
    callAPIWithProgress();
  }, []);

  return (
    <View style={styles.overlay}>
      <View style={styles.content}>
        <ActivityIndicator size={"large"} color={"#25aae1"} />
        <Text style={styles.text}>
          Đang tải dữ liệu {progress}%{progress < 100 && "..."}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: "white",
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    opacity: 1,
    zIndex: 100,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    textAlign: "center",
    color: "black",
    fontSize: 16,
    marginTop: 10,
  },
});

export default SpinnerLoadingHome;
