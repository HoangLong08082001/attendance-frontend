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
  splitNumberFormTime,
  isTime1GreaterOrEqual,
  isDate2Greater,
  getValueBefore,
  getValueAfter,
} from "../../services/utils";
import { Dropdown } from "react-native-element-dropdown";

const AbsenceScreen = (props) => {
  const { navigation, route } = props;
  const item = route.params?.item ? route.params?.item : null;
  const leaveTypes = route.params?.leaveTypes ? route.params?.leaveTypes : null;
  // //// // //console.log(leaveTypes);
  const {
    handleInsertResume2,
    resumeSuccess,
    resumeFails,
    setResumeFails,
    setResumeSuccess,
    checkin_setting,
    checkout_setting,
    updateApplication2,
    handleInsertResume20,
    updateApplication20,
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
  const [address, setAddress] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showFromTimePicker, setShowFromTimePicker] = useState(false);
  const [showToTimePicker, setShowToTimePicker] = useState(false);
  // const [showModal, setShowModal] = useState(false); // Quản lý việc hiển thị Modal
  // const [selectedTime, setSelectedTime] = useState(""); // Lưu trữ giờ đã chọn
  const [isSundays, setIsSunday] = useState(false);
  // const id_setting_resume = route.params?.id_setting_resume;
  const resumeId = route.params?.resumeId ? route.params?.resumeId : null;
  const dateStartFromCalendar = route.params?.dateStartFromCalendar;
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
  useEffect(() => {
    if (item) {
      setLeaveType(route.params.leaveTypes);
      if (route.params.leaveTypes === "multiple") {
        setAbsenceDate(new Date(route.params.item?.date_start));
        setReason(getValueBefore(route.params.item?.description));
        setAddress(getValueAfter(route.params.item?.description));
        setFromTime(route.params.item?.time_start?.split(":")[0] || "08");
        setFromMinute(route.params.item?.time_start?.split(":")[1] || "00");
        setToTime(route.params.item?.time_end?.split(":")[0] || "17");
        setToMinute(route.params.item?.time_end?.split(":")[1] || "00");
      } else if (route.params.leaveTypes === "single") {
        setAbsenceDate(new Date(route.params.item?.date_start));
        setAddress(getValueAfter(route.params.item?.description));
        setReason(getValueBefore(route.params.item?.description));
      } else {
        setAbsenceDate(new Date(route.params.item?.date_start));
        setEndDate(new Date(route.params.item?.date_end));
        setReason(getValueBefore(route.params.item?.description));
        setAddress(getValueAfter(route.params.item?.description));
        setFromTime(route.params.item?.time_start?.split(":")[0] || "08");
        setFromMinute(route.params.item?.time_start?.split(":")[1] || "00");
        setToTime(route.params.item?.time_end?.split(":")[0] || "17");
        setToMinute(route.params.item?.time_end?.split(":")[1] || "00");
      }
    }
    if (dateStartFromCalendar) {
      setAbsenceDate(new Date(dateStartFromCalendar));
    }
  }, [route.params]);

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
  // const formatTime = (date) => {
  //   const hours = date.getHours().toString().padStart(2, "0"); // Ensures two-digit hours
  //   const minutes = date.getMinutes().toString().padStart(2, "0"); // Ensures two-digit minutes
  //   return `${hours}:${minutes}`;
  // };
  const onDateChange1 = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === "ios" ? true : false);
    if (selectedDate) {
      setAbsenceDate(selectedDate);
    }
  };
  const onDateChange2 = (event, selectedDate) => {
    setShowEndDatePicker(Platform.OS === "ios" ? true : false);

    if (selectedDate && selectedDate >= absenceDate) {
      if (leaveType === "more") {
        setEndDate(selectedDate);
      } else if (leaveType === "single") {
        setEndDate(absenceDate);
      } else {
        setEndDate(absenceDate);
      }
    } else {
      setShowEndDatePicker(false);
      setEndDate(new Date());
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    const start = absenceDate.toISOString();
    const end =
      leaveType === "single" && leaveType === "multiple"
        ? start
        : endDate.toISOString();
    const from =
      fromTime && fromMinute ? (fromTime + ":" + fromMinute)?.toString() : null;
    const to =
      toTime && toMinute ? (toTime + ":" + toMinute)?.toString() : null;
    if (leaveType === "single") {
      if (start && address && reason) {
        if (resumeId) {
          updateApplication20(
            resumeId,
            start,
            end,
            reason + `\n Nơi công tác: ${address}`
          );
          //// // //console.log("start 2 insert", start);
          //// // //console.log("end 2 insert", end);
          setAbsenceDate(new Date());
          setEndDate(new Date());
          setFromMinute(null);
          setFromTime(null);
          setToMinute(null);
          setIsFocus(false);
          setAddress("");
          setToTime(null);
          setReason("");
          setValidateDate(false);
          navigation.navigate("ListApplication");
        } else {
          handleInsertResume20(
            start,
            start,
            reason + `\n Nơi công tác: ${address}`
          );

          setAbsenceDate(new Date());
          setEndDate(new Date());
          setFromMinute(null);
          setFromTime(null);
          setToMinute(null);
          setIsFocus(false);
          setAddress("");
          setToTime(null);
          setReason("");
          setValidateDate(false);
          navigation.navigate("ListApplication");
        }
      } else {
        setIsFocus(true);
      }
      return;
    } else if (leaveType === "multiple") {
      if (start && to && from && address && reason) {
        if (isTime1GreaterOrEqual(from.toString(), to.toString()) === true) {
          if (resumeId) {
            updateApplication2(
              resumeId,
              start,
              end,
              reason + `\nNơi công tác: ${address}`,
              from,
              to
            );
            setAbsenceDate(new Date());
            setEndDate(new Date());
            setFromMinute(null);
            setFromTime(null);
            setToMinute(null);
            setIsFocus(false);
            setAddress("");
            setToTime(null);
            setReason("");
            setValidateDate(false);
            navigation.navigate("ListApplication");
          } else {
            handleInsertResume2(
              start,
              end,
              reason + `\nNơi công tác: ${address}`,
              from,
              to
            );
            setAbsenceDate(new Date());
            setEndDate(new Date());
            setFromMinute(null);
            setFromTime(null);
            setToMinute(null);
            setAddress("");
            setIsFocus(false);
            setToTime(null);
            setReason("");
            setValidateDate(false);
            navigation.navigate("ListApplication");
          }
        } else {
          setValidateDate(true);
        }
      } else {
        setIsFocus(true);
      }
      return;
    } else {
      if (start && end && address && reason) {
        if (isDate2Greater(start, end) === true) {
          if (resumeId) {
            updateApplication20(
              resumeId,
              start,
              end,
              reason + `\nNơi công tác: ${address}`
            );
            //// // //console.log("start 20 update", start);

            setAbsenceDate(new Date());
            setEndDate(new Date());
            setFromMinute(null);
            setFromTime(null);
            setToMinute(null);
            setAddress("");
            setIsFocus(false);
            setToTime(null);
            setReason("");
            setValidateDate(false);
            navigation.navigate("ListApplication");
          } else {
            handleInsertResume20(
              start,
              end,
              reason + `\n Nơi công tác: ${address}`
            );
            setAbsenceDate(new Date());
            setEndDate(new Date());
            setFromMinute(null);
            setFromTime(null);
            setToMinute(null);
            setIsFocus(false);
            setAddress("");
            setToTime(null);
            setReason("");
            setValidateDate(false);
            navigation.navigate("ListApplication");
          }
        } else {
          setValidateDate(true);
        }
      } else {
        setIsFocus(true);
      }
      return;
    }
  };
  const handleChooseToTime = () => {
    setShowToTimePicker(false);
    if (toMinute === null) {
      setToMinute("00");
    } else if (toTime === checkout_setting.split(":")[0]) {
      setToMinute("00");
    } else {
      setToMinute(toMinute);
    }
  };
  const handleChooseFromTime = () => {
    setShowFromTimePicker(false);
    if (fromMinute === null) {
      setFromMinute("00");
    } else {
      setFromMinute(fromMinute);
    }
  };
  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={
        Platform.OS === "ios" || Platform.OS === "android"
          ? "padding"
          : "height"
      }
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
              confirmText="Xác nhận"
              duration={500}
            />
          )}
          {validateDate === true && (
            <DialogComponent
              isVisible={validateDate}
              message={"Vui lòng kiểm tra lại ngày giờ"}
              onCancel={() => setValidateDate(false)}
              title="Cảnh báo"
              isCancel={true}
              lotties={2}
              cancelText="Đóng"
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
              confirmText="Xác nhận"
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
              cancelText="Xác nhận"
              duration={500}
            />
          )}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => {
                setAbsenceDate(new Date());
                setEndDate(new Date());
                setFromMinute(null);
                setFromTime(null);
                setToMinute(null);
                setIsFocus(false);
                setToTime(null);
                setAddress("");
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
              Tạo mới Đơn công tác
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
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <Text allowFontScaling={false} style={styles.title}>
              Thông tin đơn
            </Text>
            <Text allowFontScaling={false} style={styles.label}>
              Loại đơn
              <Text allowFontScaling={false} style={styles.warning}>
                {" "}
                *
              </Text>
            </Text>
            <Dropdown
              disable={resumeId ? true : false}
              style={styles.dropdown}
              placeholderStyle={styles.textCheck}
              selectedTextStyle={styles.selectedText}
              data={[
                { label: "Một ngày", value: "single" },
                { label: "Nhiều ngày", value: "more" },
                { label: "Theo giờ", value: "multiple" },
              ]}
              labelField="label"
              valueField="value"
              placeholder={"Chọn tùy chọn"}
              value={leaveType}
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
                      {item.content && (
                        <Text
                          allowFontScaling={false}
                          style={styles.descriptionDropdown}
                        >
                          {item.content}
                        </Text>
                      )}
                    </View>
                  </View>
                );
              }}
              onChange={(item) => {
                setAbsenceDate(new Date());
                setEndDate(new Date());
                setFromMinute(null);
                setFromTime(null);
                setToMinute(null);
                setIsFocus(false);
                setAddress("");
                setToTime(null);
                setReason("");
                setValidateDate(false);
                setLeaveType(item.value);
              }}
            />
            <Text allowFontScaling={false} style={styles.label}>
              {leaveType === "more" ? "Ngày nghỉ" : "Ngày vắng mặt"}{" "}
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
                {leaveType === "more" && "Từ ngày"}{" "}
                {absenceDate.toLocaleDateString()}
              </Text>
              <Ionicons name="calendar-outline" size={24} />
            </TouchableOpacity>
            {leaveType === "more" && (
              <>
                <TouchableOpacity
                  onPress={() => setShowEndDatePicker(true)}
                  style={
                    isFocus ? styles.datePickerRegexFails : styles.datePicker
                  }
                >
                  <Text allowFontScaling={false}>
                    Đến ngày {endDate.toLocaleDateString()}
                  </Text>
                  <Ionicons name="calendar-outline" size={24} />
                </TouchableOpacity>
              </>
            )}
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
                visible={showEndDatePicker}
                animationType="fade"
                onRequestClose={() => setShowEndDatePicker(false)}
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
                      value={endDate}
                      textColor="black"
                      onChange={onDateChange2}
                      mode="date" // Chế độ chọn ngày
                      display={Platform.OS === "ios" ? "spinner" : "default"}
                    />
                    <TouchableOpacity
                      onPress={() => setShowEndDatePicker(false)}
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
              showEndDatePicker && (
                <DateTimePicker
                  value={endDate}
                  onChange={onDateChange2}
                  mode="date" // Chế độ chọn ngày
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                />
              )
            )}
            {leaveType === "multiple" && (
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
                        isFocus
                          ? styles.timePickerRegexFails
                          : styles.timePicker
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
                        isFocus
                          ? styles.timePickerRegexFails
                          : styles.timePicker
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
            )}
            {/* {leaveType === "more" && (
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
                        isFocus
                          ? styles.timePickerRegexFails
                          : styles.timePicker
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
                        isFocus
                          ? styles.timePickerRegexFails
                          : styles.timePicker
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
            )} */}

            <Text allowFontScaling={false} style={styles.label}>
              Nơi công tác{" "}
              <Text allowFontScaling={false} style={styles.warning}>
                *
              </Text>
            </Text>
            <TextInput
              allowFontScaling={false}
              onSubmitEditing={() => Keyboard.dismiss}
              returnKeyType="done"
              style={isFocus ? styles.datePickerRegexFails : styles.datePicker}
              placeholder="Nhập đầy đủ địa chỉ nơi công tác..."
              value={address}
              onChangeText={setAddress}
            />
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
              {item === undefined || item === null ? "TẠO ĐƠN" : "CẬP NHẬT"}
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
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 5, marginTop: 20 },
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
    width: "100%",
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timePicker: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
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
  dateInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    height: 100,
    textAlignVertical: "top",
  },
  dateInputRegexFails: {
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
    flexDirection: "column",
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
  dropdown: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    width: "100%",
    marginTop: 7,
    marginBottom: 7,
  },
  textCheck: {
    color: "#B1B2B4",
    fontSize: 14,
  },
  selectedText: {
    fontSize: 14,
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
  scrollContainer: {},
});

export default AbsenceScreen;
