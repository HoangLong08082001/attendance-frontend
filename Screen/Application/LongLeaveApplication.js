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
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext } from "../../contexts/AuthContext";
import DialogComponent from "../../components/DialogComponent";

// const Stack = createNativeStackNavigator();

const LongLeaveScreen = (props) => {
  const { navigation, route } = props;
  const item = route.params?.item;
  const {
    handleInsertResume12,
    resumeSuccess,
    // resumeFails,
    setResumeSuccess,
    // setResumeFails,
    // loading,
    updateApplication12,
  } = useContext(AuthContext);

  //const [leaveType, setLeaveType] = useState('single');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [reason, setReason] = useState("");
  const [validateDate, setValidateDate] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [isSundays, setIsSunday] = useState(false);
  const [empty, setEmpty] = useState(false);
  const resumeId = route.params?.resumeId;
  const dateStartFromCalendar = route.params?.dateStartFromCalendar;

  useEffect(() => {
    if (item) {
      setStartDate(new Date(item?.date_start));
      setEndDate(new Date(item?.date_end));
      setReason(item?.description);
    }
    if (dateStartFromCalendar) {
      setStartDate(new Date(dateStartFromCalendar));
    }
  }, [route.params]);
  // const onDateChange = (event, selectedDate, type) => {
  //   if (type === "start") {
  //     setShowStartPicker(false);
  //     if (selectedDate) setStartDate(selectedDate);
  //   } else {
  //     setShowEndPicker(false);
  //     if (selectedDate) setEndDate(selectedDate);
  //   }
  // };
  const onDateChange1 = (event, selectedDate) => {
    setShowStartPicker(Platform.OS === "ios" ? true : false);
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };
  const onDateChange2 = (event, selectedDate) => {
    setShowEndPicker(Platform.OS === "ios" ? true : false);
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };
  const handleSubmit = async () => {
    try {
      // Chuyển đổi startDate và endDate sang chuỗi hoặc bất kỳ định dạng nào bạn muốn
      const start = startDate.toISOString();
      const end = endDate.toISOString();

      if (start && end && reason) {
        if (resumeId) {
          if (end >= start) {
            updateApplication12(resumeId, start, end, reason);
            setStartDate(new Date());
            setEndDate(new Date());
            setReason("");
            setValidateDate(false);
            navigation.navigate("ListApplication");
          } else {
            setValidateDate(true);
          }
        } else {
          if (end >= start) {
            handleInsertResume12(start, end, reason);
            setStartDate(new Date());
            setEndDate(new Date());
            setReason("");
            setValidateDate(false);
            navigation.navigate("ListApplication");
            return;
          } else {
            setValidateDate(true);
            return;
          }
        }
        // Sau khi thành công, bạn có thể điều hướng hoặc hiển thị thông báo
        //navigation.goBack();  // Ví dụ quay lại màn hình trước
      } else {
        setEmpty(true);
        setIsFocus(true);
      }
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
          {validateDate === true && (
            <DialogComponent
              isVisible={validateDate}
              message={"Ngày kết thúc phải lớn hơn ngày bắt đầu"}
              onCancel={() => setValidateDate(false)}
              title="Cảnh báo"
              isCancel={true}
              lotties={2}
              cancelText="OK"
              duration={500}
            />
          )}

          {isSundays === true && (
            <DialogComponent
              isVisible={isSundays}
              message={"Vui lòng không chọn ngày chủ nhật!"}
              onCancel={() => setIsSunday(false)}
              title="Tạo đơn"
              isCancel={true}
              lotties={3}
              cancelText="OK"
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
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => {
                setStartDate(new Date());
                setEndDate(new Date());
                setReason("");
                setValidateDate(false);
                if (dateStartFromCalendar) {
                  navigation.goBack();
                } else {
                  navigation.navigate(
                    resumeId ? "ListApplication" : "CreateScreen"
                  );
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
              Tạo mới Đơn nghỉ dài hạn
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
          {/* <Text allowFontScaling={false} style={styles.label}>Loại chế độ *</Text>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        placeholder="Chọn loại chế độ"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
        onChangeValue={(value) => setValue(value)}
      /> */}
          {/* {value && (
        <Text allowFontScaling={false} style={styles.description}>
          {getDescription(value)}
        </Text>
      )} */}

          {/* Leave Type Toggle
      <View style={styles.leaveTypeContainer}>
        <TouchableOpacity
          style={[
            styles.leaveTypeButton,
            leaveType === "single" && styles.selectedButton,
          ]}
          onPress={() => setLeaveType("single")}
        >
          <Text
            allowFontScaling={false}
            style={[
              styles.leaveTypeText,
              leaveType === "single" && styles.selectedText,
            ]}
          >
            Nghỉ 1 ngày
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.leaveTypeButton,
            leaveType === "multiple" && styles.selectedButton,
          ]}
          onPress={() => setLeaveType("multiple")}
        >
          <Text
            allowFontScaling={false}
            style={[
              styles.leaveTypeText,
              leaveType === "multiple" && styles.selectedText,
            ]}
          >
            Nghỉ dài ngày
          </Text>
        </TouchableOpacity>
      </View> */}

          {/* Date Picker */}
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text allowFontScaling={false} style={styles.label}>
              Thời gian
              <Text allowFontScaling={false} style={styles.warning}>
                {" "}
                *
              </Text>
            </Text>
            {/* {leaveType === "single" ? (
          <TouchableOpacity
            onPress={() => setShowStartPicker(true)}
            style={styles.dateInput}
          >
            <Text>{startDate.toLocaleDateString()}</Text>
            <Ionicons name="calendar-outline" size={24} style={styles.icon} />
          </TouchableOpacity>
        ) : ( */}
            <View>
              <TouchableOpacity
                onPress={() => setShowStartPicker(true)}
                style={isFocus ? styles.datePickerRegexFails : styles.dateInput}
              >
                <Text allowFontScaling={false}>
                  Từ ngày: {startDate.toLocaleDateString()}
                </Text>
                <Ionicons
                  name="calendar-outline"
                  size={24}
                  style={styles.icon}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowEndPicker(true)}
                style={isFocus ? styles.datePickerRegexFails : styles.dateInput}
              >
                <Text allowFontScaling={false}>
                  Đến ngày: {endDate.toLocaleDateString()}
                </Text>
                <Ionicons
                  name="calendar-outline"
                  size={24}
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>
            {/* )} */}

            {/* {showStartPicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="calendar"
            onChange={(e, date) => onDateChange(e, date, "start")}
          />
        )}
        {showEndPicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="calendar"
            onChange={(e, date) => onDateChange(e, date, "end")}
          />
        )} */}
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
                      textColor="black"
                      value={startDate}
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

            {Platform.OS === "ios" ? (
              <Modal
                transparent={true}
                visible={showEndPicker}
                animationType="fade"
                onRequestClose={() => setShowEndPicker(false)}
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
                      textColor="black"
                      value={endDate}
                      onChange={onDateChange2}
                      mode="date" // Chế độ chọn ngày
                      display={Platform.OS === "ios" ? "spinner" : "default"}
                    />
                    <TouchableOpacity
                      onPress={() => setShowEndPicker(false)}
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
              showEndPicker && (
                <DateTimePicker
                  value={endDate}
                  onChange={onDateChange2}
                  mode="date" // Chế độ chọn ngày
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                />
              )
            )}

            {/* Reason Input */}
            <View style={{ marginBottom: 100 }}>
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
            </View>
          </ScrollView>

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
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
  datePickerRegexFails: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ff0000",
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timePickerRegexFails: {
    borderWidth: 1,
    borderColor: "#ff0000",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    width: 180,
    flexDirection: "row",
    justifyContent: "space-between",
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

export default LongLeaveScreen;
