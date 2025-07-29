import { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  KeyboardAvoidingView,
  Modal,
  FlatList,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { AuthContext } from "../../contexts/AuthContext";
import DialogComponent from "../../components/DialogComponent";
import {
  getHourMinuteFromSetting,
  isSunday,
  splitNumberFormTime,
} from "../../services/utils";

const HourlyLeaveScreen = (props) => {
  const { navigation, route } = props;
  const item = route.params?.item;
  const leaveTypes = route.params?.leaveTypes;
  // //// // //console.log(leaveTypes);
  const {
    handleInsertResume15,
    loading,
    resumeSuccess,
    resumeFails,
    setResumeFails,
    setResumeSuccess,
    checkin_setting,
    checkout_setting,
    updateApplication15,
  } = useContext(AuthContext);

  const [leaveType, setLeaveType] = useState(leaveTypes);
  const [absenceDate, setAbsenceDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [fromTime, setFromTime] = useState(null);
  const [toTime, setToTime] = useState(null);
  const [fromMinute, setFromMinute] = useState(null);
  const [toMinute, setToMinute] = useState(null);
  const [reason, setReason] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const [validateDate, setValidateDate] = useState(false);
  // State variables to control visibility of pickers
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [showFromTimePicker, setShowFromTimePicker] = useState(false);
  const [showToTimePicker, setShowToTimePicker] = useState(false);
  const [showModal, setShowModal] = useState(false); // Quản lý việc hiển thị Modal
  const [selectedTime, setSelectedTime] = useState(""); // Lưu trữ giờ đã chọn
  const [isSundays, setIsSunday] = useState(false);
  const resumeId = route.params?.resumeId;

  // Tạo danh sách giờ từ 00:00 đến 23:00
  const generateTimeList = () => {
    let checkin = splitNumberFormTime(checkin_setting);
    let checkout = splitNumberFormTime(checkout_setting);
    const times = [];
    for (let i = checkin; i <= checkout; i++) {
      const hour = i < 10 ? `0${i}` : `${i}`; // Đảm bảo giờ có 2 chữ số
      times.push(`${hour}`);
    }
    return times;
  };
  const generateMinuteList = () => {
    const times = [];
    for (let i = 0; i <= 59; i++) {
      const hour = i < 10 ? `0${i}` : `${i}`; // Đảm bảo giờ có 2 chữ số
      times.push(`${hour}`);
    }
    return times;
  };

  const timeList = generateTimeList(); // Danh sách giờ
  const minutes = generateMinuteList();
  // Handle Date change
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setAbsenceDate(selectedDate);
      if (leaveType === "single") {
        setEndDate(selectedDate); // End date same as start date for single day leave
      }
    }
  };

  useEffect(() => {
    if (item) {
      if (leaveTypes) {
        setLeaveType(leaveTypes);
        setAbsenceDate(new Date(item?.date_start));
        setEndDate(new Date(item?.date_end));
        setReason(item?.description);
        setFromTime(item?.time_start?.split(":")[0]);
        setFromMinute(item?.time_start?.split(":")[1]);
        setToTime(item?.time_end?.split(":")[0]);
        setToMinute(item?.time_end?.split(":")[1]);
      }
    } else {
      setLeaveType("single");
    }
  }, [route.params]);
  // //// // //console.log("leave screen:", leaveType);
  // Handle Time change
  const onTimeChange = (field, event, selectedTime) => {
    if (field === "from") {
      setShowFromTimePicker(false);
      if (selectedTime) {
        setFromTime(selectedTime);
      }
    } else {
      setShowToTimePicker(false);
      if (selectedTime) {
        setToTime(selectedTime);
      }
    }
  };
  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, "0"); // Ensures two-digit hours
    const minutes = date.getMinutes().toString().padStart(2, "0"); // Ensures two-digit minutes
    return `${hours}:${minutes}`;
  };
  const onDateChange1 = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === "ios" ? true : false);
    if (selectedDate) {
      setAbsenceDate(selectedDate);
    }
  };

  const onDateChange2 = (event, selectedDate) => {
    setShowEndPicker(Platform.OS === "ios" ? true : false);
    if (selectedDate && selectedDate >= absenceDate) {
      setEndDate(selectedDate);
    } else {
      setShowEndPicker(false);
      setEndDate(new Date());
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      // Convert dates to ISO string
      const start = absenceDate.toISOString();
      const end = endDate.toISOString();
      const from =
        fromTime && fromMinute === null
          ? "00"
          : fromMinute
          ? (fromTime + ":" + fromMinute)?.toString()
          : null;
      const to =
        toTime && toMinute ? (toTime + ":" + toMinute)?.toString() : null;

      if (to >= from) {
        if (start && end && reason) {
          if (resumeId) {
            updateApplication15(resumeId, start, end, reason, from, to);
            navigation.navigate("ListApplication");
          } else {
            if (isSunday(start) === false && isSunday(end) === false) {
              handleInsertResume15(
                start,
                end,
                reason,
                getHourMinuteFromSetting(checkin_setting),
                getHourMinuteFromSetting(checkout_setting)
              );
              setAbsenceDate(new Date());
              setFromMinute(null);
              setFromTime(null);
              setToMinute(null);
              setIsFocus(false);
              setToTime(null);
              setReason("");
              setValidateDate(false);
              navigation.navigate("ListApplication");
            } else {
              setIsSunday(true);
            }
          }
        } else {
          setIsFocus(true);
        }
      } else {
        if (start && end && from && to) {
          if (to > from) {
            // handleInsertResume2(start, end, reason, from, to);

            if (resumeId) {
              setAbsenceDate(new Date());
              setEndDate(new Date());
              setFromMinute(null);
              setFromTime(null);
              setToMinute(null);
              setIsFocus(false);
              setToTime(null);
              setReason("");
              setValidateDate(false);
              updateApplication15(resumeId, start, end, reason, from, to);
              // // // //console.log("from", from);
              // // // //console.log("to", to);

              navigation.navigate("ListApplication");
            } else {
              if (start && end) {
                handleInsertResume15(start, end, reason, from, to);

                setAbsenceDate(new Date());
                setFromMinute(null);
                setFromTime(null);
                setToMinute(null);
                setIsFocus(false);
                setToTime(null);
                setReason("");
                setValidateDate(false);
                navigation.navigate("ListApplication");
              } else {
                setIsFocus(true);
              }
            }
          } else {
            if (resumeId) {
              setAbsenceDate(new Date());
              setEndDate(new Date());
              setFromMinute(null);
              setFromTime(null);
              setToMinute(null);
              setIsFocus(false);
              setToTime(null);
              setLeaveType("single");
              setReason("");
              setValidateDate(false);
              updateApplication15(resumeId, start, end, reason, from, to);
              navigation.navigate("ListApplication");
            } else {
              if (start && end && from && to) {
                if (to > from) {
                  handleInsertResume15(start, end, reason, from, to);
                  setAbsenceDate(new Date());
                  setFromMinute(null);
                  setFromTime(null);
                  setToMinute(null);
                  setIsFocus(false);
                  setToTime(null);
                  setReason("");
                  setLeaveType("single");
                  setValidateDate(false);
                  navigation.navigate("ListApplication");
                } else {
                  setValidateDate(true);
                }
              }
            }
          }
        } else {
          setIsFocus(true);
        }
      }
      // Call API to insert the resume
    } catch (error) {
      setIsFocus(true);
    }
  };
  const handleChooseToTime = () => {
    setShowToTimePicker(false);
    if (toMinute === null) {
      setToMinute("00");
    }
  };
  const handleChooseFromTime = () => {
    setShowFromTimePicker(false);
    if (toMinute === null) {
      setFromMinute("00");
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
              message={"Giờ vắng mặt đến phải lớn hơn Giờ vắng mặt từ"}
              onCancel={() => setValidateDate(false)}
              title="Cảnh báo"
              isCancel={true}
              lotties={2}
              cancelText="OK"
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
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => {
                setAbsenceDate(new Date());
                setFromMinute(null);
                setFromTime(null);
                setToMinute(null);
                setIsFocus(false);
                setToTime(null);
                setReason("");
                setValidateDate(false);
                navigation.navigate(
                  resumeId ? "ListApplication" : "CreateScreen"
                );
              }}
            >
              <Ionicons
                name="chevron-back-circle-outline"
                size={30}
                style={styles.backIcon}
              />
            </TouchableOpacity>
            <Text allowFontScaling={false} style={styles.headerText}>
              Tạo mới Đơn xin nghỉ
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
            <View style={styles.leaveTypeContainer}>
              {/* <TouchableOpacity
                style={[
                  styles.leaveTypeButton,
                  leaveType === "single" && styles.selectedButton,
                ]}
                onPress={() => {
                  setLeaveType("single");
                  setReason("");
                  setIsFocus(false);
                  setEndDate(absenceDate); // set the end date to the same as the start date for single day leave
                }}
              >
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.leaveTypeText,
                    leaveType === "single" && styles.selectedText,
                  ]}
                >
                  Full ngày
                </Text>
              </TouchableOpacity> */}
              {/* <TouchableOpacity
                style={[
                  styles.leaveTypeButton,
                  leaveType === "multiple" && styles.selectedButton,
                ]}
                // onPress={() => {
                //   setReason("");
                //   setIsFocus(false);
                //   setLeaveType("multiple");
                // }}
              >
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.leaveTypeText,
                    leaveType === "multiple" && styles.selectedText,
                  ]}
                >
                  Theo giờ
                </Text>
              </TouchableOpacity> */}
            </View>

            <Text allowFontScaling={false} style={styles.label}>
              Ngày vắng mặt{" "}
              <Text allowFontScaling={false} style={styles.warning}>
                {" "}
                *
              </Text>
            </Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={isFocus ? styles.datePickerRegexFails : styles.datePicker}
            >
              <Text allowFontScaling={false}>
                Từ ngày: {absenceDate.toLocaleDateString("vi-VN")}
              </Text>
              <Ionicons name="calendar-outline" size={24} style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowEndPicker(true)}
              style={isFocus ? styles.datePickerRegexFails : styles.datePicker}
            >
              <Text allowFontScaling={false}>
                Đến ngày: {endDate.toLocaleDateString("vi-VN")}
              </Text>
              <Ionicons name="calendar-outline" size={24} style={styles.icon} />
            </TouchableOpacity>
            {Platform.OS === "ios" ? (
              <Modal
                transparent={true}
                visible={showDatePicker}
                animationType="fade"
                onRequestClose={() => setShowDatePicker(false)}
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
                      textColor="black"
                      onChange={onDateChange1}
                      mode="date" // Chế độ chọn ngày
                      display={Platform.OS === "ios" ? "spinner" : "default"}
                    />
                    <TouchableOpacity
                      onPress={() => setShowDatePicker(false)}
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

            <View>
              <View style={styles.wrap}>
                <View style={styles.sub_wrap}>
                  <Text allowFontScaling={false} style={styles.label}>
                    Vắng mặt từ{" "}
                    <Text allowFontScaling={false} style={styles.warning}>
                      {" "}
                      *
                    </Text>
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowFromTimePicker(true)}
                    style={
                      isFocus ? styles.timePickerRegexFails : styles.timePicker
                    }
                  >
                    <Text allowFontScaling={false}>
                      {fromTime && fromMinute
                        ? fromTime + ":" + fromMinute
                        : "hh:mm"}
                    </Text>
                    <AntDesign name="clockcircleo" size={24} color="black" />
                  </TouchableOpacity>
                </View>

                <View style={styles.sub_wrap}>
                  <Text allowFontScaling={false} style={styles.label}>
                    Vắng mặt đến{" "}
                    <Text allowFontScaling={false} style={styles.warning}>
                      {" "}
                      *
                    </Text>
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowToTimePicker(true)}
                    style={
                      isFocus ? styles.timePickerRegexFails : styles.timePicker
                    }
                  >
                    <Text allowFontScaling={false}>
                      {toTime && toMinute ? toTime + ":" + toMinute : "hh:mm"}
                    </Text>
                    <AntDesign name="clockcircleo" size={24} color="black" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={{ marginBottom: 100 }}>
              <Text allowFontScaling={false} style={styles.label}>
                Lí do{" "}
                <Text allowFontScaling={false} style={styles.warning}>
                  *
                </Text>
              </Text>
              <TextInput
                allowFontScaling={false}
                style={isFocus ? styles.textInputRegexFails : styles.textInput}
                placeholder="Nhập lý do của bạn..."
                value={reason}
                onChangeText={setReason}
                multiline
              />
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.updateButton} onPress={handleSubmit}>
            <Text allowFontScaling={false} style={styles.updateButtonText}>
              {item === null ? "TẠO ĐƠN" : "CẬP NHẬT"}
            </Text>
          </TouchableOpacity>

          <Modal
            transparent={true}
            visible={showFromTimePicker}
            animationType="fade"
            onRequestClose={() => setShowFromTimePicker(false)} // Đóng modal khi nhấn ngoài
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View style={styles.dateTimeContainer}>
                  <View style={styles.timeContainer}>
                    <Text allowFontScaling={false} style={styles.modalTitle}>
                      Chọn Giờ
                    </Text>
                    {/* Danh sách giờ */}
                    <FlatList
                      showsVerticalScrollIndicator={false}
                      data={timeList}
                      keyExtractor={(item) => item}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={
                            item === fromTime
                              ? styles.timeItemActive
                              : styles.timeItem
                          }
                          onPress={() => {
                            setFromTime(item);
                          }} // Chọn giờ
                        >
                          <Text
                            allowFontScaling={false}
                            style={
                              item === fromTime
                                ? styles.timeTextActivce
                                : styles.timeText
                            }
                          >
                            {item}
                          </Text>
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                  <View style={styles.timeContainer}>
                    <Text allowFontScaling={false} style={styles.modalTitle}>
                      Chọn phút
                    </Text>
                    {/* Danh sách giờ */}
                    <FlatList
                      showsVerticalScrollIndicator={false}
                      data={minutes}
                      keyExtractor={(item) => item}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={
                            item === fromMinute
                              ? styles.timeItemActive
                              : styles.timeItem
                          }
                          onPress={() => {
                            setShowFromTimePicker(true);
                            if (item) {
                              setFromMinute(item);
                            }
                          }} // Chọn giờ
                        >
                          <Text
                            allowFontScaling={false}
                            style={
                              item === fromMinute
                                ? styles.timeTextActivce
                                : styles.timeText
                            }
                          >
                            {item}
                          </Text>
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={handleChooseFromTime} // Đóng modal khi bấm "Đóng"
                >
                  <Text allowFontScaling={false} style={styles.closeButtonText}>
                    Chọn
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <Modal
            transparent={true}
            visible={showToTimePicker}
            animationType="fade"
            onRequestClose={() => setShowToTimePicker(false)} // Đóng modal khi nhấn ngoài
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View style={styles.dateTimeContainer}>
                  <View style={styles.timeContainer}>
                    <Text allowFontScaling={false} style={styles.modalTitle}>
                      Chọn Giờ
                    </Text>
                    {/* Danh sách giờ */}
                    <FlatList
                      showsVerticalScrollIndicator={false}
                      data={timeList}
                      keyExtractor={(item) => item}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={
                            item === toTime
                              ? styles.timeItemActive
                              : styles.timeItem
                          }
                          onPress={() => {
                            setToTime(item);
                          }} // Chọn giờ
                        >
                          <Text
                            allowFontScaling={false}
                            style={
                              item === toTime
                                ? styles.timeTextActivce
                                : styles.timeText
                            }
                          >
                            {item}
                          </Text>
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                  <View style={styles.timeContainer}>
                    <Text allowFontScaling={false} style={styles.modalTitle}>
                      Chọn phút
                    </Text>
                    {/* Danh sách giờ */}
                    <FlatList
                      showsVerticalScrollIndicator={false}
                      data={minutes}
                      keyExtractor={(item) => item}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={
                            item === toMinute
                              ? styles.timeItemActive
                              : styles.timeItem
                          }
                          onPress={() => {
                            setShowToTimePicker(true);
                            if (item) {
                              setToMinute(item);
                            }
                          }} // Chọn giờ
                        >
                          <Text
                            allowFontScaling={false}
                            style={
                              item === toMinute
                                ? styles.timeTextActivce
                                : styles.timeText
                            }
                          >
                            {item}
                          </Text>
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={handleChooseToTime} // Đóng modal khi bấm "Đóng"
                >
                  <Text allowFontScaling={false} style={styles.closeButtonText}>
                    Chọn
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
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
  timePicker: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timePickerRegexFails: {
    borderWidth: 1,
    borderColor: "#ff0000",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    width: "100%",
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
  updateButton: {
    position: "absolute",
    backgroundColor: "#ff9900",
    padding: 16,
    borderRadius: 50,
    alignItems: "center",
    marginTop: 20,
    bottom: Platform.OS === "ios" ? 20 : 30,
    left: 16,
    right: 16,
  },
  updateButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  wrap: {
    //flexDirection: "row",
    justifyContent: "space-between",
  },
  sub_wrap: {},
  warning: {
    color: "red",
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Màu nền mờ
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    height: 500,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  timeItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  timeItemActive: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#ff9900",
    borderRadius: 5,
  },
  timeText: {
    fontSize: 18,
    textAlign: "center",
  },
  timeTextActivce: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#ff9900",
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  selectedText: {
    color: "#FFFFFF",
  },
  spinnerContainer: {
    zIndex: 0,
  },
  dateTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  timeContainer: {
    height: 400,
  },
});

export default HourlyLeaveScreen;
