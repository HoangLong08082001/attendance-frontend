import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Alert,
  Linking,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import * as Clipboard from "expo-clipboard";
import { useToast } from "react-native-toast-notifications";
const ContactOutside = ({ navigation }) => {
  const toast = useToast();

  const handleCopyEmail = () => {
    Clipboard.setStringAsync("vikhangit.dev@gmail.com");
    toast.show(`Copy thành công`, {
      type: "success",
      placement: "top",
      duration: 4000,
      offset: 30,
      animationType: "slide-in",
    });
  };
  const handlePhone = () => {
    let phoneNumber = "0976017235";
    if (!phoneNumber) {
      Alert.alert("Lỗi", "Vui lòng nhập số điện thoại");
      return;
    }

    // Tạo URL dạng tel:
    const dialUrl = `tel:${phoneNumber}`;
    Linking.canOpenURL(dialUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(dialUrl);
        } else {
          Alert.alert("Lỗi", "Thiết bị không hỗ trợ mở ứng dụng gọi điện");
        }
      })
      .catch((err) =>
        Alert.alert("Lỗi", `Không thể mở ứng dụng: ${err.message}`)
      );
  };
  const handleZalo = () => {
    const zaloUrl = `https://zalo.me/0976017235`; // URL Zalo
    const appStoreUrl =
      Platform.OS === "ios"
        ? "itms-apps://itunes.apple.com/app/zalo/id579523206" // Link App Store cho Zalo
        : "market://details?id=com.zing.zalo"; // Link Google Play cho Zalo

    Linking.canOpenURL(zaloUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(zaloUrl);
        } else {
          return Linking.openURL(appStoreUrl);
        }
      })
      .catch((err) => {
        Alert.alert(
          "Lỗi",
          "Không thể mở Zalo hoặc App Store/Play Store. Vui lòng kiểm tra lại mạng"
        );
      });
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"} // Điều chỉnh hành vi cho iOS và Android
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.btnBack}
            onPress={() => navigation.navigate("SignIn")}
          >
            <AntDesign name="leftcircleo" style={styles.iconBack} />
            <Text allowFontScaling={false} style={styles.textBack}>
              Quay lại
            </Text>
          </TouchableOpacity>
          <TouchableOpacity disabled={true}>
            <Text allowFontScaling={false} style={styles.title}>
              HỖ TRỢ KỸ THUẬT
            </Text>
            <Text allowFontScaling={false} style={styles.note}>
              Kênh hỗ trợ kỹ thuật: giải quyết các vấn đề về chấm công, tạo đơn,
              duyệt đơn và lỗi hệ thống. Liên hệ qua Zalo hoặc số điện thoại để
              được hỗ trợ nhanh chóng.
            </Text>
          </TouchableOpacity>
          <View
            style={{
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.23,
              shadowRadius: 2.62,
              marginTop: 10,
              borderRadius: 20,
              elevation: 4,
              width: "100%",
              backgroundColor: "white",
              paddingHorizontal: 20,
              paddingVertical: 10,
            }}
          >
            <Text allowFontScaling={false} style={{ color: "gray" }}>
              Thông tin hỗ trợ
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 20,
                marginVertical: 10,
              }}
            >
              <View
                style={{
                  backgroundColor: "#f7f7f7",
                  height: 30,
                  width: 30,
                  borderRadius: 50,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <SimpleLineIcons name="user" size={17} color="black" />
              </View>
              <View>
                <Text
                  allowFontScaling={false}
                  style={{ color: "gray", fontSize: 12 }}
                >
                  Tên kỹ thuật viên
                </Text>
                <Text allowFontScaling={false}>TRẦN VỈ KHANG</Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 20,
                marginVertical: 10,
              }}
            >
              <View
                style={{
                  backgroundColor: "#f7f7f7",
                  height: 30,
                  width: 30,
                  borderRadius: 50,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FontAwesome6 name="envelope" size={17} color="black" />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  allowFontScaling={false}
                  style={{ color: "gray", fontSize: 12 }}
                >
                  Email
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text allowFontScaling={false}>vikhangit.dev@gmail.com</Text>
                  <TouchableOpacity onPress={() => handleCopyEmail()}>
                    <FontAwesome6 name="copy" size={20} color="gray" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 20,
                marginVertical: 10,
              }}
            >
              <View
                style={{
                  backgroundColor: "#f7f7f7",
                  height: 30,
                  width: 30,
                  borderRadius: 50,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Feather name="phone" size={17} color="black" />
              </View>
              <TouchableOpacity onPress={() => handlePhone()}>
                <Text
                  allowFontScaling={false}
                  style={{ color: "gray", fontSize: 12 }}
                >
                  Số điện thoại
                </Text>
                <Text allowFontScaling={false}>0976017235</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.23,
              shadowRadius: 2.62,
              marginTop: 10,
              borderRadius: 20,
              elevation: 4,
              width: "100%",
              backgroundColor: "white",
              paddingHorizontal: 20,
              paddingVertical: 20,
            }}
          >
            <Text allowFontScaling={false} style={{ color: "gray" }}>
              Kênh hỗ trợ
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 20,
                marginVertical: 10,
              }}
            >
              <View
                style={{
                  backgroundColor: "#f7f7f7",
                  height: 30,
                  width: 30,
                  borderRadius: 50,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  style={{ width: "100%", height: "100%" }}
                  source={require("../assets/zalo-icon.png")}
                />
              </View>
              <TouchableOpacity onPress={() => handleZalo()}>
                <Text
                  allowFontScaling={false}
                  style={{ color: "gray", fontSize: 12 }}
                >
                  Zalo
                </Text>
                <Text allowFontScaling={false}>0976017235</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: "#e8f2ff",
  },
  title: {
    width: 250,
    fontSize: 24,
    marginBottom: 20,

    marginTop: 40,
  },
  label: {
    fontWeight: "300",

    marginTop: 20,
  },
  note: {
    fontWeight: "300",
  },
  btnBack: {
    display: "flex",
    flexDirection: "row",
    width: 90,
    justifyContent: "space-between",
    marginTop: 100,
  },
  iconBack: {
    fontSize: 18,
  },
});

export default ContactOutside;
