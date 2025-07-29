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
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Input from "../components/Input";
import Button from "../components/Button";
import { forgotAPI } from "../services/api";
import Entypo from "@expo/vector-icons/Entypo";
import Notification, { ARRAY_TYPE } from "../components/Notification";
import { useToast } from "react-native-toast-notifications";
import SpinnerLoading from "../components/SpinnerLoading";
export default function Forgot({ navigation }) {
  // const toast = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [notify, setNotify] = useState(false);
  const [notifyFails, setNotifyFails] = useState(false);
  const [status, setStatus] = useState(false);
  const [forgot, setForgot] = useState(false);
  const [empty, setEmpty] = useState(false);

  const handleForgotPassword = async () => {
    setStatus(true);
    if (email === "") {
      setEmpty(true);
      setStatus(false);
    } else {
      try {
        Keyboard.dismiss();
        setLoading(true);
        const data = await forgotAPI(email);
        if (data.status === 200) {
          setStatus(false);
          setLoading(false);
          setNotify(true);
          navigation.navigate("SignIn");
        } else if (data.status === 404) {
          setStatus(false);
          setLoading(false);
          setForgot(true);
          setNotifyFails(true);
        } else {
          setStatus(false);
          setLoading(false);
          setNotifyFails(true);
        }
      } catch (error) {
        setLoading(false);
        throw error;
      }
    }
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"} // Điều chỉnh hành vi cho iOS và Android
    >
      {status === true && <SpinnerLoading />}
      {notify && (
        <Notification
          title={"Gửi mail"}
          message={
            "Gửi mail cấp lại mật khẩu mới thành công! Vui lòng kiểm tra mail"
          }
          duration={3000}
          type={ARRAY_TYPE.success}
          setShow={setNotify}
          show={notify}
        />
      )}
      {empty && (
        <Notification
          title={"Gửi mail"}
          message={"Vui lòng nhập đầy đủ"}
          duration={3000}
          type={ARRAY_TYPE.warning}
          setShow={setEmpty}
          show={empty}
        />
      )}
      {notifyFails && (
        <Notification
          title={"Gửi mail"}
          message={
            forgot === true
              ? "Email chưa tồn tại! Vui lòng kiểm tra lại thông tin mail"
              : "Gửi mail thất bại! Vui lòng kiểm tra lại thông tin mail"
          }
          duration={3000}
          type={ARRAY_TYPE.danger}
          setShow={setNotifyFails}
          show={notifyFails}
        />
      )}

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
              Quên mật khẩu?
            </Text>
            <Text allowFontScaling={false} style={styles.note}>
              Vui lòng nhập địa chỉ email mà bạn đã sử dụng để đăng ký tài
              khoản. Chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu đến email của
              bạn
            </Text>
          </TouchableOpacity>
          <TouchableOpacity disabled={true}>
            <Text allowFontScaling={false} style={styles.label}>
              Email
            </Text>
          </TouchableOpacity>
          <Input
            placeholder="Nhập email bạn đã sử dụng để đăng ký"
            borderColor="blue" // Màu sắc của viền
            borderWidth={0} // Độ dày của viền
            boxShadow={false}
            backgroundColor={"#ffffff"}
            borderRadius={10}
            onChangeText={setEmail}
            height={55}
          />
          <Button
            title="Gửi ngay"
            onPress={() => handleForgotPassword()}
            size={10}
            backgroundColor="#F08314"
            borderRadius={50}
            boxShadow={false}
            margin={0}
            marginVertical={20}
            padding={15}
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
    </KeyboardAvoidingView>
  );
}
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
