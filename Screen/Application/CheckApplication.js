import { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
  KeyboardAvoidingView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Dropdown } from "react-native-element-dropdown";
import { AuthContext } from "../../contexts/AuthContext";
import DialogComponent from "../../components/DialogComponent";
const Stack = createNativeStackNavigator();

const CheckScreen = (props) => {
  const { navigation, route } = props;
  const item = route.params?.item;
  const {
    handleCreateCheckinApplication,
    handleCreateCheckoutApplication,
    // resumeSuccess,
    resumeFails,
    setResumeFails,
    // setResumeSuccess,
    // loading,
    resumeLimitCheckIn,
    resumeLimitCheckOut,
    updateApplication3,
    updateApplication4,
    checkinSuccessResume,
    setCheckinSuccessResume,
    // exitsResume,
    // setExitsResume,
  } = useContext(AuthContext);
  const [dataDropdown, setDataDropdown] = useState([
    {
      id: 3,
      label: "Checkin",
      content: `Tối đa 3 lần 1 tháng / Bạn còn:${resumeLimitCheckIn} lần`,
    },
    {
      id: 4,
      label: "Checkout",
      content: `Tối đa 3 lần 1 tháng / Bạn còn:${resumeLimitCheckOut} lần`,
    },
  ]);
  const [value, setValue] = useState(null);
  const [absenceDate, setAbsenceDate] = useState(new Date());
  const [fromTime, setFromTime] = useState(null);
  const [toTime, setToTime] = useState(null);
  const [reason, setReason] = useState("");
  // const [statusCheckInLimit, setStatusCheckInLimit] = useState(false);
  // const [statusCheckOutLimit, setStatusCheckOutLimit] = useState(false);
  // State variables to control visibility of pickers
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showFromTimePicker, setShowFromTimePicker] = useState(false);
  const [showToTimePicker, setShowToTimePicker] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [limitFails, setLimitFails] = useState(false);
  const [open, setOpen] = useState(false);
  const [empty, setEmpty] = useState(false);
  const resumeId = route.params?.resumeId;
  const id_setting_resume = route.params?.id_setting_resume;
  const name_setting_resume = route.params?.name_setting_resume;
  const dateStartFromCalendar = route.params?.dateStartFromCalendar;

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === "ios" ? true : false);
    if (selectedDate) {
      setAbsenceDate(selectedDate);
    }
  };

  // const onTimeChange = (field, event, selectedTime) => {
  //   if (field === "from") {
  //     setShowFromTimePicker(false);
  //     if (selectedTime) {
  //       setFromTime(selectedTime);
  //     }
  //   } else {
  //     setShowToTimePicker(false);
  //     if (selectedTime) {
  //       setToTime(selectedTime);
  //     }
  //   }
  // };
  const closeModal = () => {
    setShowDatePicker(false);
  };
  useEffect(() => {
    if (item) {
      setReason(item?.description);
      setAbsenceDate(new Date(item?.date_start) || new Date(item?.date_end));
      setValue(item?.id_setting_resume);
    }
    if (dateStartFromCalendar) {
      setAbsenceDate(new Date(dateStartFromCalendar));
    }
  }, [route.params]);

  const handleSubmit = () => {
    if (absenceDate && reason?.length > 0) {
      if (value === 3) {
        if (resumeId) {
          updateApplication3(resumeId, absenceDate, absenceDate, reason);
          navigation.navigate("ListApplication");
        } else {
          if (resumeLimitCheckIn > 0) {
            handleCreateCheckinApplication(
              absenceDate.toISOString(),
              absenceDate.toISOString(),
              reason
            );
            setAbsenceDate(new Date());
            setReason("");
            setValue(1);
            //setValidateDate(false);
            navigation.navigate("ListApplication");
          } else {
            setLimitFails(true);
          }
        }
      } else {
        if (resumeId) {
          updateApplication4(resumeId, absenceDate, absenceDate, reason);
          navigation.navigate("ListApplication");
        } else {
          if (resumeLimitCheckOut > 0) {
            handleCreateCheckoutApplication(
              absenceDate.toISOString(),
              absenceDate.toISOString(),
              reason
            );
            setAbsenceDate(new Date());
            setValue(3);
            setReason("");
            //setValidateDate(false);
            navigation.navigate("ListApplication");
          } else {
            setLimitFails(true);
          }
        }
      }
    } else {
      setEmpty(true);
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
          {checkinSuccessResume === true && (
            <DialogComponent
              isVisible={checkinSuccessResume}
              message={"Tạo đơn thành công"}
              onConfirm={() => setCheckinSuccessResume(false)}
              title="Tạo đơn"
              isOk={true}
              lotties={1}
              confirmText="Xác nhận"
              duration={500}
            />
          )}

          {limitFails === true && (
            <DialogComponent
              isVisible={limitFails}
              message={"Đã quá giới hạn đơn cho phép tạo"}
              onConfirm={() => setLimitFails(false)}
              title="Tạo đơn"
              isOk={true}
              lotties={3}
              confirmText="Xác nhận"
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
                setIsFocus(false);
                setValue(null);
                setAbsenceDate(new Date());
                setReason("");
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
              Tạo mới Đơn checkin/out
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

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
          >
            <Text allowFontScaling={false} style={styles.title}>
              Thông tin đơn
            </Text>
            <Text allowFontScaling={false} style={styles.label}>
              Ngày bổ sung checkin/out{" "}
              <Text allowFontScaling={false} style={styles.warning}>
                {""}*
              </Text>
            </Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={isFocus ? styles.datePickerRegexFails : styles.datePicker}
            >
              <Text allowFontScaling={false}>
                {absenceDate.toLocaleDateString("vi-VN")}
              </Text>
              <Ionicons name="calendar-outline" size={24} style={styles.icon} />
            </TouchableOpacity>
            <Text allowFontScaling={false} style={styles.label}>
              Loại đơn{" "}
              <Text allowFontScaling={false} style={styles.warning}>
                {" "}
                *
              </Text>
            </Text>

            <Dropdown
              style={
                isFocus
                  ? styles.DropdownPickerRegexFails
                  : styles.DropdownPicker
              }
              placeholderStyle={styles.textCheck}
              selectedTextStyle={styles.selectedText}
              iconStyle={styles.iconStyle}
              data={dataDropdown}
              disable={id_setting_resume && true}
              itemTextStyle={styles.itemText}
              itemContainerStyle={styles.itemContainer}
              search={false}
              renderItem={(item) => {
                return (
                  <View style={styles.itemDropdown}>
                    <View style={styles.item}>
                      <Text
                        allowFontScaling={false}
                        style={styles.labelDropdown}
                      >
                        Đơn {item.label}
                      </Text>
                      <Text
                        allowFontScaling={false}
                        style={styles.descriptionDropdown}
                      >
                        {item.content}
                      </Text>
                    </View>
                  </View>
                );
              }}
              maxHeight={300}
              labelField={"label"}
              valueField="id" // Chắc chắn là đúng, tương thích với key trong data
              placeholder={
                name_setting_resume
                  ? name_setting_resume
                  : "Check in hoặc Check out"
              }
              value={value} // Truyền giá trị vào dropdown
              onChange={(item) => {
                setValue(item.id);
              }}
            />

            <Text allowFontScaling={false} style={styles.label}>
              Lí do{" "}
              <Text allowFontScaling={false} style={styles.warning}>
                {""}*
              </Text>
            </Text>
            <TextInput
              allowFontScaling={false}
              style={isFocus ? styles.textInputRegexFails : styles.textInput}
              placeholder="Nhập lí do của bạn..."
              value={reason}
              onChangeText={setReason}
              multiline
            />
          </ScrollView>

          {/* Nút cập nhật */}
          <TouchableOpacity style={styles.updateButton} onPress={handleSubmit}>
            <Text allowFontScaling={false} style={styles.updateButtonText}>
              {item === undefined ? "TẠO ĐƠN" : "CẬP NHẬT"}
            </Text>
          </TouchableOpacity>

          {Platform.OS === "ios" ? (
            <Modal
              transparent={true}
              visible={showDatePicker}
              animationType="fade"
              onRequestClose={closeModal}
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
                    value={absenceDate}
                    onChange={onDateChange}
                    textColor="black"
                    mode="date" // Chế độ chọn ngày
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                  />
                  <TouchableOpacity
                    onPress={closeModal}
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
            showDatePicker && (
              <DateTimePicker
                value={absenceDate}
                onChange={onDateChange}
                textColor="black"
                mode="date" // Chế độ chọn ngày
                display={Platform.OS === "ios" ? "spinner" : "default"}
              />
            )
          )}
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
    backgroundColor: "#fff",
    paddingTop: 40,
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
    flex: 3,
    fontSize: 18,

    fontWeight: "bold",
  },
  headerIcons: {
    flex: 1,

    flexDirection: "row",
    marginLeft: 0,
  },
  icon: {
    marginHorizontal: 10,
  },
  underline: {
    height: 1,
    backgroundColor: "#EAEAEA",
    marginTop: -10,
  },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 16, marginTop: 20 },
  label: { fontSize: 14, color: "#333", marginTop: 16 },
  datePicker: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  datePickerRegexFails: {
    borderWidth: 1,
    borderColor: "#ff0000",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  DropdownPickerRegexFails: {
    borderWidth: 1,
    borderColor: "#ff0000",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  DropdownPicker: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  timePicker: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    width: 180,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    height: 100,
    textAlignVertical: "top",
  },
  textInputRegexFails: {
    borderWidth: 1,
    borderColor: "#ff0000",
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    height: 100,
    textAlignVertical: "top",
  },
  textCheck: {
    color: "#B1B2B4",
    fontSize: 12,
  },
  updateButton: {
    position: "absolute",
    backgroundColor: "#ff9900",
    padding: 16,
    borderRadius: 50,
    alignItems: "center",
    marginTop: 20,
    bottom: Platform.OS === "ios" ? 50 : 30,
    left: 16,
    right: 16,
  },
  updateButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },

  wrap: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sub_wrap: {},

  warning: {
    color: "red",
  },
  scrollContainer: {
    paddingBottom: 150, // Add padding at the bottom for scrollable content
  },
  selectedText: {
    fontSize: 12,
  },
  itemText: {
    fontSize: 12,
  },
  spinnerContainer: {
    zIndex: 0,
  },
  itemDropdown: {
    padding: 10,
  },
  item: {
    borderBottomWidth: 0.2,
    borderBottomColor: "gray",
    paddingVertical: 5,
  },
  descriptionDropdown: {
    marginTop: 10,
    fontStyle: "italic",
    color: "gray",
    fontSize: 12,
  },
});

export default CheckScreen;
