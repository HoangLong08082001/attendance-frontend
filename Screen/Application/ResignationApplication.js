import { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext } from "../../contexts/AuthContext";
import DialogComponent from "../../components/DialogComponent";

const Stack = createNativeStackNavigator();

const ResignationScreen = (props) => {
  const { navigation, route } = props;
  const item = route.params?.item;
  const {
    handleInsertResume13,
    resumeSuccess,
    resumeFails,
    setResumeSuccess,
    setResumeFails,
    loading,
    updateApplication13,
  } = useContext(AuthContext);

  //const [leaveType, setLeaveType] = useState('single');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [reason, setReason] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const [empty, setEmpty] = useState(false);
  const resumeId = route.params?.resumeId;
  const dateStartFromCalendar = route.params?.dateStartFromCalendar;

  useEffect(() => {
    if (item) {
      setStartDate(new Date(item?.date_start));
      setReason(item?.description);
    }
    if (dateStartFromCalendar) {
      setStartDate(new Date(dateStartFromCalendar));
    }
  }, [route.params]);
  const onDateChange = (event, selectedDate, type) => {
    if (type === "start") {
      setShowStartPicker(false);
      if (selectedDate) setStartDate(selectedDate);
    } else {
      setShowEndPicker(false);
      if (selectedDate) setEndDate(selectedDate);
    }
  };
  const onDateChange1 = (event, selectedDate) => {
    setShowStartPicker(Platform.OS === "ios" ? true : false);
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const handleSubmit = async () => {
    try {
      // Chuyển đổi startDate và endDate sang chuỗi hoặc bất kỳ định dạng nào bạn muốn
      const start = startDate.toISOString();

      // Gọi hàm handleInsertResume1 từ context và truyền tham số
      if (start && reason) {
        if (resumeId) {
          updateApplication13(resumeId, start, reason);
          navigation.navigate("ListApplication");
        } else {
          if (start && reason) {
            handleInsertResume13(start, reason);
            setStartDate(new Date());
            setReason("");

            navigation.navigate("ListApplication");
          } else {
            setIsFocus(true);
          }
        }
      } else {
        setEmpty(true);
      }

      // Sau khi thành công, bạn có thể điều hướng hoặc hiển thị thông báo
      //navigation.goBack();  // Ví dụ quay lại màn hình trước
    } catch (error) {
      setIsFocus(true);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {resumeSuccess === true && (
            <DialogComponent
              isVisible={resumeSuccess}
              message={"Tạo đơn thành công"}
              onConfirm={() => setResumeSuccess(false)}
              title="Tạo đơn"
              isOk={true}
              lotties={1}
              confirmText="OK"
              duration={500}
            />
          )}
          {empty && (
            <DialogComponent
              isVisible={empty}
              message={"Vui lòng nhập đầy đủ thông tin đơn"}
              onConfirm={() => setEmpty(false)}
              title="Tạo đơn"
              isOk={true}
              lotties={3}
              confirmText="OK"
              duration={500}
            />
          )}

          {resumeFails && (
            <DialogComponent
              isVisible={resumeFails}
              message={"Tạo đơn thất bại"}
              onConfirm={() => setResumeFails(false)}
              title="Tạo đơn"
              isOk={true}
              lotties={3}
              confirmText="OK"
              duration={500}
            />
          )}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => {
                {
                  setEndDate(new Date());
                  setStartDate(new Date());
                  setReason("");
                  if (dateStartFromCalendar) {
                    navigation.goBack();
                  } else {
                    navigation.navigate(
                      resumeId ? "ListApplication" : "CreateScreen"
                    );
                  }
                }
              }}
            >
              <Ionicons
                name="chevron-back-circle-outline"
                size={30}
                style={styles.backIcon}
              />
            </TouchableOpacity>
            <Text allowFontScaling={false} style={styles.headerText}>
              Tạo mới Đơn nghỉ việc
            </Text>
            <View style={styles.headerIcons}>
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={24}
                style={styles.icon}
              />
              <Ionicons
                name="notifications-outline"
                size={24}
                style={styles.icon}
              />
            </View>
          </View>
          <View style={styles.underline} />
          <Text allowFontScaling={false} style={styles.sectionTitle}>
            Thông tin chung
          </Text>

          {/* Date Picker */}
          <Text allowFontScaling={false} style={styles.label}>
            Thời gian nộp đơn
            <Text allowFontScaling={false} style={styles.warning}>
              {" "}
              *
            </Text>
          </Text>

          <View>
            <TouchableOpacity
              onPress={() => setShowStartPicker(true)}
              style={isFocus ? styles.dateInputRegexFails : styles.dateInput}
            >
              <Text allowFontScaling={false}>
                {startDate.toLocaleDateString()}
              </Text>
              <Ionicons name="calendar-outline" size={24} style={styles.icon} />
            </TouchableOpacity>
          </View>
          {/* )} */}

          {Platform.OS === "ios" ? (
            <Modal
              transparent={true}
              visible={showStartPicker}
              animationType="fade"
              onRequestClose={() => setShowStartPicker(false)}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
              >
                <View
                  style={{
                    backgroundColor: "white",
                    padding: 20,
                    borderRadius: 10,
                  }}
                >
                  <DateTimePicker
                    value={startDate}
                    textColor="black"
                    onChange={onDateChange1}
                    mode="date" // Chế độ chọn ngày
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                  />
                  <TouchableOpacity
                    onPress={() => setShowStartPicker(false)}
                    style={{ marginTop: 10 }}
                  >
                    <Text
                      allowFontScaling={false}
                      style={{ color: "blue", textAlign: "center" }}
                    >
                      OK
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          ) : (
            showStartPicker && (
              <DateTimePicker
                value={startDate}
                onChange={onDateChange1}
                mode="date" // Chế độ chọn ngày
                display={Platform.OS === "ios" ? "spinner" : "default"}
              />
            )
          )}

          {/* Reason Input */}
          <Text allowFontScaling={false} style={styles.label}>
            Lí do
            <Text allowFontScaling={false} style={styles.warning}>
              {" "}
              *
            </Text>
          </Text>
          <TextInput
            style={isFocus ? styles.textInputRegexFails : styles.textInput}
            placeholder="Nhập lí do của bạn..."
            value={reason}
            onChangeText={setReason}
            multiline
          />

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => handleSubmit()}
          >
            <Text allowFontScaling={false} style={styles.submitButtonText}>
              {item === undefined ? "TẠO ĐƠN" : "CẬP NHẬT"}
            </Text>
          </TouchableOpacity>
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
    position: "relative",
    flex: 1,
    padding: 16,
    backgroundColor: "#FFFFFF",
    paddingTop: 40,
  },
  dropdown: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  placeholderText: {
    color: "#666",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  dropdownList: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 8,
    paddingVertical: 8,
  },
  option: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  optionLabel: {
    fontWeight: "bold",
    fontSize: 16,
  },
  optionDescription: {
    color: "#666",
    fontSize: 14,
    marginTop: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  backIcon: {
    marginRight: 10,
  },
  headerText: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
  },
  headerIcons: {
    flexDirection: "row",
  },
  icon: {
    marginHorizontal: 10,
  },
  underline: {
    height: 1,
    backgroundColor: "#EAEAEA",
    marginTop: -10,
  },
  warning: {
    color: "red",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#034887",
    marginBottom: 16,
    marginTop: 20,
  },
  leaveTypeContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  leaveTypeButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 8,
    alignItems: "center",
    marginRight: 8,
  },
  selectedButton: {
    backgroundColor: "#034887",
  },
  leaveTypeText: {
    fontSize: 14,
    color: "#B1B2B4",
  },
  selectedText: {
    color: "#FFFFFF",
  },
  label: {
    fontSize: 14,
    color: "#333333",
    marginBottom: 8,
  },
  dateInput: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateInputRegexFails: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ff0000",
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textInput: {
    height: 100,
    borderColor: "#DDD",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    textAlignVertical: "top",
    marginBottom: 24,
  },
  submitButton: {
    position: "absolute",
    backgroundColor: "#FF8C00",
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: "center",
    bottom: Platform.OS === "ios" ? 50 : 30,
    left: 16,
    right: 16,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  textInputRegexFails: {
    height: 100,
    borderColor: "#ff0000",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    textAlignVertical: "top",
    marginBottom: 24,
  },
});

export default ResignationScreen;
