import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  ActivityIndicator,
} from "react-native";
import ClipLoader from "react-spinners/ClipLoader";
import { AuthContext } from "../contexts/AuthContext";
import { updateBaseURLNet } from "../services/axios";

export default function LoadingScreen({ navigation }) {
  const [loadingError, setLoadingError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { attendanceDates, loadingHome } = useContext(AuthContext);
  // const fetchData = () => {
  //   setLoading(true); // Bắt đầu loading
  //   setTimeout(() => {
  //     setLoading(false); // Kết thúc loading sau 3 giây
  //   }, 3000);
  // };
  // useEffect(() => {
  //   if (loadingHome === false) {
  //     navigation.navigate("Main");
  //   }
  // }, [loadingHome]);

  //console.log(loadingError);
  return (
    <View style={styles.container}>
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#25aae1" />
        <Text
          style={{ textAlign: "center", color: "gray", size: 20 }}
          allowFontScaling={false}
        >
          Đang tải...
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 10,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: "absolute",
    backgroundColor: "white",
  },
});
