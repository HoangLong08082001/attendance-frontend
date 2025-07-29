import { useContext, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import CustomHeaderCalendar from "../components/customHeaderCalendar";
import Input from "../components/Input";
import Button from "../components/Button";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { AuthContext } from "../contexts/AuthContext";
import DialogComponent from "../components/DialogComponent";
import Entypo from "@expo/vector-icons/Entypo";
import SpinnerLoading from "../components/SpinnerLoading";

const ChangePassword = (props) => {
  const { navigation } = props;
  const {
    changePassword,
    isChangeFails,
    isChangeSuccess,
    setIsChangeFails,
    loading,
    setIsChangeSuccess,
  } = useContext(AuthContext);
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [validate, setValidate] = useState(false);
  const [validateRegex, setValidateRegex] = useState(false);
  const [show, setShow] = useState(false);
  const handleChangePassword = () => {
    if (currentPass === "" || newPass === "" || confirmPass === "") {
      setValidate(true);
    } else {
      setValidate(false);
      const regex = /^.{6,}$/;
      if (regex.test(newPass) && regex.test(confirmPass)) {
        setValidateRegex(false);
        if (confirmPass === newPass) {
          changePassword(currentPass, confirmPass);
          setConfirmPass("");
          setCurrentPass("");
          setValidate(false);
          setNewPass("");
          setValidate(false);
        } else {
          setValidate(true);
        }
      } else {
        setValidateRegex(true);
      }
    }
  };
  const handleBack = () => {
    navigation.goBack();
    setConfirmPass("");
    setCurrentPass("");
    setValidate(false);
    setNewPass("");
  };
  const handleHideShow = () => {
    setShow(!show);
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.wrapper}>
          {isChangeSuccess === true && (
            <DialogComponent
              isVisible={isChangeSuccess}
              message={"Thay đổi mật khẩu thành công"}
              onConfirm={() => setIsChangeSuccess(false)}
              title="Đổi mật khẩu"
              isOk={true}
              lotties={1}
              confirmText="Xác nhận"
            />
          )}
          {loading && <SpinnerLoading />}
          {isChangeFails === true && (
            <DialogComponent
              isVisible={isChangeFails}
              message={
                "Thay đổi mật khẩu không thành công!Vui lòng kiểm tra lại"
              }
              onCancel={() => setIsChangeFails(false)}
              title="Đổi mật khẩu"
              isCancel={true}
              lotties={2}
              cancelText="Xác nhận"
            />
          )}
          {validateRegex === true && (
            <DialogComponent
              isVisible={validateRegex}
              message={"Tạo mật khẩu mới tối thiểu 6 kí tự"}
              onCancel={() => setValidateRegex(false)}
              title="Đổi mật khẩu"
              isCancel={true}
              lotties={2}
              cancelText="Xác nhận"
            />
          )}
          <CustomHeaderCalendar
            statusAction={1}
            title="Đổi mật khẩu"
            handleBack={handleBack}
          />
          <ScrollView style={styles.container}>
            <Text allowFontScaling={false} style={styles.title}></Text>
            <TouchableOpacity disabled={true}>
              <Text allowFontScaling={false} style={styles.title}>
                Để bảo vệ tài khoản của bạn, hãy thay đổi mật khẩu thường xuyên.
              </Text>
              <Text allowFontScaling={false} style={styles.label}>
                Mật Khẩu Hiện Tại{" "}
                <Text
                  allowFontScaling={false}
                  style={{ color: "red", fontSize: 18 }}
                >
                  *
                </Text>
              </Text>
            </TouchableOpacity>
            <Input
              placeholder="Nhập mật khẩu hiện tại của bạn"
              borderColor={validate === true ? "red" : "#cccccc"}
              borderWidth={1} // Độ dày của viền
              boxShadow={false}
              value={currentPass}
              onChangeText={setCurrentPass}
              secureTextEntry={show === false ? true : false}
              backgroundColor={"#ffffff"}
              borderRadius={10}
              height={55}
            />
            <TouchableOpacity disabled={true}>
              <Text allowFontScaling={false} style={styles.label}>
                Mật Khẩu Mới{" "}
                <Text
                  allowFontScaling={false}
                  style={{ color: "red", fontSize: 18 }}
                >
                  *
                </Text>
              </Text>
            </TouchableOpacity>
            <Input
              placeholder="Nhập mật khẩu mới của bạn"
              secureTextEntry={show === false ? true : false}
              borderColor={validate === true ? "red" : "#cccccc"}
              borderWidth={1}
              value={newPass}
              onChangeText={setNewPass}
              boxShadow={false}
              backgroundColor={"#ffffff"}
              borderRadius={10}
              height={55}
            />
            <TouchableOpacity disabled={true}>
              <Text allowFontScaling={false} style={styles.label}>
                Xác nhận Mật Khẩu Mới{" "}
                <Text
                  allowFontScaling={false}
                  style={{ color: "red", fontSize: 18 }}
                >
                  *
                </Text>
              </Text>
            </TouchableOpacity>
            <Input
              placeholder="Nhập lại mật khẩu mới của bạn"
              secureTextEntry={show === false ? true : false}
              borderColor={validate === true ? "red" : "#cccccc"}
              borderWidth={1}
              value={confirmPass}
              onChangeText={setConfirmPass}
              boxShadow={false}
              backgroundColor={"#ffffff"}
              borderRadius={10}
              height={55}
            />
            <TouchableOpacity style={{ marginVertical: 20 }} disabled={true}>
              <TouchableOpacity style={styles.note} onPress={handleHideShow}>
                <Entypo
                  name={show === false ? "eye" : "eye-with-line"}
                  size={16}
                  color="gray"
                />
                <Text
                  allowFontScaling={false}
                  style={{
                    fontWeight: "300",
                  }}
                >
                  {show === false ? "Hiện mật khẩu" : "Ẩn mật khẩu"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity disabled={true} style={styles.note}>
                <FontAwesome name="exclamation-circle" size={16} color="gray" />
                <Text
                  allowFontScaling={false}
                  style={{
                    fontWeight: "300",
                  }}
                >
                  Tạo mật khẩu mới tối thiểu 6 kí tự
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
            <Button
              title="Lưu thay đổi"
              size={10}
              backgroundColor="#F08314"
              borderRadius={50}
              boxShadow={false}
              margin={0}
              onPress={handleChangePassword}
              padding={20}
            />
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: "white",
  },
  title: {
    width: "100%",
    fontSize: 15,
    fontWeight: "300",
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
  note: {
    gap: 10,
    flexDirection: "row",
    marginVertical: 10,
  },
});

export default ChangePassword;
