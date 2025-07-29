import { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";

import * as Device from "expo-device";
import Notification, { ARRAY_TYPE } from "../components/Notification";
import Input from "../components/Input";
import Button from "../components/Button";
import { loginAPI } from "../services/api";
import { AuthContext } from "../contexts/AuthContext";
import Entypo from "@expo/vector-icons/Entypo";

import Spinner from "react-native-loading-spinner-overlay";
import NotificationCustome from "../components/NotificationCustome";
import { useToast } from "react-native-toast-notifications";
// import { useNotification } from "../contexts/NotificationProvider";

export default function SignInScreen(props) {
  const toast = useToast();
  const { navigation } = props;
  const [notify, setNotify] = useState(false);
  const [ip, setIp] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, isLoggedIn } = useContext(AuthContext);
  const [show, setShow] = useState(false);
  const fetchDevice = async () => {
    const osView = Device.osBuildId;

    setIp(osView);
  };
  useEffect(() => {
    fetchDevice();
  }, []);
  const handleLogin = async () => {
    setNotify(true);
    if (phone === "" || password === "") {
      setNotify(false);
      toast.show(`Vui lòng nhập đầy đủ`, {
        type: "danger",
        placement: "top",
        duration: 4000,
        offset: 30,
        animationType: "slide-in",
      });
    } else {
      try {
        Keyboard.dismiss();
        setLoading(true);
        const data = await loginAPI(phone, password, ip?.length > 0 ? ip : ""); // Gọi API với phone và password
        if (data.data.message === "Success") {
          setLoading(false);
          toast.show(`Đăng nhập thành công`, {
            type: "success",
            placement: "top",
            duration: 4000,
            offset: 30,
            animationType: "slide-in",
          });
          login(data.data.token);

          if (isLoggedIn) {
            navigation.navigate("Main");
          }
        }
        if (data.status === 404) {
          setLoading(false);
          console.log("123", data.data.error);
          toast.show(data.data.error, {
            type: "danger",
            placement: "top",
            duration: 4000,
            offset: 30,
            animationType: "slide-in",
          });
        }
        if (data.status === 400) {
          setLoading(false);
          console.log("123", data.data.error);
          toast.show(data.data.error, {
            type: "danger",
            placement: "top",
            duration: 4000,
            offset: 30,
            animationType: "slide-in",
          });
        }
      } catch (error) {
        console.log("12", error);
        setLoading(false);
        toast.show(`Đăng nhập thất bại`, {
          type: "danger",
          placement: "top",
          duration: 4000,
          offset: 30,
          animationType: "slide-in",
        });
      }
    }
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"} // Điều chỉnh hành vi cho iOS và Android
    >
      {/* {loading === true ? <LoadingScreen /> : ""} */}
      {loading === true ? <Spinner visible={loading} /> : ""}
      {notify && (
        <NotificationCustome
          message="This is an important alert!"
          onToggle={() => setNotify(false)}
        />
      )}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <TouchableOpacity disabled={true}>
            <Text allowFontScaling={false} style={styles.title}>
              Chào mừng bạn! Mời bạn đăng nhập
            </Text>

            {/* <Text allowFontScaling={false} style={styles.label}>
              {expoPushToken ? expoPushToken : ""}
            </Text> */}

            <Text allowFontScaling={false} style={styles.label}>
              Email hoặc số điện thoại
            </Text>
          </TouchableOpacity>

          <Input
            placeholder="Nhập email hoặc số điện thoại"
            value={phone}
            onChangeText={setPhone}
            borderColor="blue" // Màu sắc của viền
            borderWidth={0} // Độ dày của viền
            boxShadow={false}
            backgroundColor={"#ffffff"}
            borderRadius={10}
            height={55}
            allowFontScaling={false}
          />
          <TouchableOpacity disabled={true}>
            <Text allowFontScaling={false} style={styles.label}>
              Mật khẩu
            </Text>
          </TouchableOpacity>
          <View
            style={{
              position: "relative",
            }}
          >
            <Input
              placeholder="Nhập mật khẩu"
              allowFontScaling={false}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={show === false ? true : false}
              borderColor="blue"
              borderWidth={0}
              boxShadow={false}
              backgroundColor={"#ffffff"}
              borderRadius={10}
              height={55} // Đảm bảo Input có chiều cao xác định
            />
            <TouchableOpacity
              onPress={() => setShow(!show)}
              style={{
                position: "absolute",
                right: 10, // Cách lề phải một khoảng nhất định
                top: 0,
                bottom: 0,
                justifyContent: "center", // Căn giữa theo chiều dọc
                alignItems: "center", // Căn giữa nội dung bên trong
              }}
            >
              <Feather
                name={show === false ? "eye" : "eye-off"}
                size={24}
                color="gray"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity disabled={true}>
            <Text
              allowFontScaling={false}
              style={styles.link}
              onPress={() => navigation.navigate("Forgot")}
            >
              Quên mật khẩu!
            </Text>
          </TouchableOpacity>
          <Button
            title="Đăng Nhập"
            onPress={() => handleLogin()}
            size={10}
            backgroundColor="#F08314"
            borderRadius={50}
            boxShadow={false}
            margin={0}
            padding={20}
          />
        </View>
      </TouchableWithoutFeedback>
      <TouchableOpacity
        onPress={() => navigation.navigate("ContactOutside")}
        style={{
          position: "absolute",
          top: 50,
          right: 0,
          marginRight: 10,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Entypo name="help-with-circle" size={20} color="black" />
        <Text allowFontScaling={false}> Hỗ trợ</Text>
      </TouchableOpacity>
      {/* <View
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          paddingVertical: 20,
        }}
      >
        <Text style={{ textAlign: "center", color: "gray" }}>
          Được thiết kế bởi team Dev Apec Global
        </Text>
      </View> */}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: "#e8f2ff",
  },
  title: {
    width: 210,
    fontSize: 24,
    marginBottom: 20,
  },
  label: {
    fontWeight: "300",
    marginTop: 15,
  },
  link: {
    marginTop: 15,
    marginBottom: 15,
    marginRight: 16,
    color: "#6366f1",
    fontWeight: "350",
    textDecorationLine: "underline",
  },
});
