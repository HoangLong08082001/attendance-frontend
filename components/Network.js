import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Linking,
  Platform,
  TouchableOpacity,
  BackHandler,
  ActivityIndicator,
} from "react-native";
import Button from "./Button";
import { axiosApiInstance, updateBaseURL } from "../services/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Network = ({ navigation }) => {
  const [disconnected, setDisconnected] = useState(false);
  const handleSetting = () => {
    Linking.openURL(
      Platform.OS === "ios"
        ? "App-Prefs:WIFI"
        : "android.settings.WIFI_SETTINGS"
    );
  };
  const fetchApiCheckNetwork = async () => {
    try {
      setDisconnected(true);
      await updateBaseURL();
      const token = await AsyncStorage.getItem("userToken");
      let response = await axiosApiInstance.get("/attendance/testnetwork");
      if (response) {
        setDisconnected(false);
        navigation.navigate("Main");
      }
    } catch (error) {
      setDisconnected(false);
    }
  };

  return (
    <View
      style={{ flex: 1, justifyContent: "center", backgroundColor: "white" }}
    >
      {disconnected === false ? (
        <>
          <Text allowFontScaling={false} style={{ textAlign: "center" }}>
            Mất kết nối mạng! Vui lòng kiểm tra lại
          </Text>
          <TouchableOpacity
            onPress={handleSetting}
            style={{
              width: 100,
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 5,
              marginTop: 10,
              marginHorizontal: "auto",
              backgroundColor: "#007BFF",
            }}
          >
            <Text
              allowFontScaling={false}
              style={{ color: "white", textAlign: "center" }}
            >
              Cài đặt
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={fetchApiCheckNetwork}
            style={{
              width: 150,
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 5,
              marginTop: 10,
              marginHorizontal: "auto",
              backgroundColor: "#F08314",
            }}
          >
            <Text
              allowFontScaling={false}
              style={{ color: "white", textAlign: "center" }}
            >
              Tải lại trang
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <View>
          <ActivityIndicator size={"large"} color={"#25aae1"} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({});

export default Network;
