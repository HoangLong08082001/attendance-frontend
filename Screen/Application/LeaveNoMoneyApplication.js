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
import { FlatList } from "react-native-gesture-handler";
import { AuthContext } from "../../contexts/AuthContext";
import DialogComponent from "../../components/DialogComponent";
import AntDesign from "@expo/vector-icons/AntDesign";
import { splitNumberFormTime } from "../../services/utils";
// const Stack = createNativeStackNavigator();

const LeaveNoMoneyScreen = (props) => {
  const { navigation, route } = props;
  const item = route.params?.item;
  const {
    handleInsertResume16,
    handleInsertResume18,
    resumeSuccess,
    // resumeFails,
    setResumeSuccess,
    // setResumeFails,
    updateApplication17,
    checkin_setting,
    checkout_setting,
    // loading,
    updateApplication16,
  } = useContext(AuthContext);

  //const [leaveType, setLeaveType] = useState('single');
  const [selectedOption, setSelectedOption] = useState("full-day");

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [fromTime, setFromTime] = useState(null);
  const [toTime, setToTime] = useState(null);
  const [fromMinute, setFromMinute] = useState(null);
  const [toMinute, setToMinute] = useState(null);
  const [reason, setReason] = useState("");
  const [showFromTimePicker, setShowFromTimePicker] = useState(false);
  const [showToTimePicker, setShowToTimePicker] = useState(false);
  const [validateDate, setValidateDate] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [isSundays, setIsSunday] = useState(false);
  const [empty, setEmpty] = useState(false);
  const resumeId = route.params?.resumeId;
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

  useEffect(() => {
    if (item) {
      setStartDate(new Date(item?.date_start));
      setEndDate(new Date(item?.date_end));
      setReason(item?.description);
      setFromTime(item?.time_start?.split(":")[0]);
      setFromMinute(item?.time_start?.split(":")[1]);
      setToTime(item?.time_end?.split(":")[0]);
      setToMinute(item?.time_end?.split(":")[1]);
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
      const end = selectedOption === "by-day" ? endDate.toISOString() : start;
      const from =
        fromTime && fromMinute
          ? (fromTime + ":" + fromMinute)?.toString()
          : checkin_setting;
      const to =
        toTime && toMinute ? (toTime + ":" + toMinute)?.toString() : checkout_setting;

      if (start && end && reason && from && to) {
        if (resumeId) {
          if (selectedOption === "by-hour") {
            if (to >= from) {
              updateApplication17(resumeId, start, end, reason, from, to);
              setStartDate(new Date());
              setEndDate(new Date());
              setFromMinute(null);
              setFromTime(null);
              setToMinute(null);
              setToTime(null);
              setReason("");
              setValidateDate(false);
              navigation.navigate("ListApplication");
            } else {
              setValidateDate(true);
            }
          } else if (selectedOption === "by-day") {
            if (endDate >= startDate) {
              updateApplication17(resumeId, start, end, reason, from, to);
              setStartDate(new Date());
              setEndDate(new Date());
              setFromMinute(null);
              setFromTime(null);
              setToMinute(null);
              setToTime(null);
              setReason("");
              setValidateDate(false);
              navigation.navigate("ListApplication");
            } else {
              setValidateDate(true);
            }
          } else {
            updateApplication16(
              resumeId,
              start,
              end,
              reason,
              checkin_setting,
              checkout_setting
            );
            //// // //console.log("start", start);
            //// // //console.log("end", end);

            setStartDate(new Date());
            setEndDate(new Date());
            setFromMinute(null);
            setFromTime(null);
            setToMinute(null);
            setToTime(null);
            setReason("");
            setValidateDate(false);
            navigation.navigate("ListApplication");
          }
        } else {
          if (selectedOption === "full-day") {
            handleInsertResume16(start, start, reason, checkin_setting, checkout_setting);
            setStartDate(new Date());
            setEndDate(new Date());
            setFromMinute(null);
            setFromTime(null);
            setToMinute(null);
            setToTime(null);
            setReason("");
            setValidateDate(false);
            navigation.navigate("ListApplication");
          }
          if (selectedOption === "by-day") {
            if (endDate >= startDate) {
              handleInsertResume16(start, end, reason, checkin_setting, checkout_setting);
              setStartDate(new Date());
              setEndDate(new Date());
              setFromMinute(null);
              setFromTime(null);
              setToMinute(null);
              setToTime(null);
              setReason("");
              setValidateDate(false);
              navigation.navigate("ListApplication");
            } else {
              setValidateDate(true);
            }
          }
          if (selectedOption === "by-hour") {
            if (to >= from) {
              handleInsertResume18(start, end, reason, from, to);

              setStartDate(new Date());
              setEndDate(new Date());
              setFromMinute(null);
              setFromTime(null);
              setToMinute(null);
              setToTime(null);
              setReason("");
              setValidateDate(false);
              navigation.navigate("ListApplication");
            } else {
              setValidateDate(true);
            }
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
  const handleChooseToTime = () => {
    setShowToTimePicker(false);
    if (toMinute === null) {
      setToMinute("00");
    }
  };
  const handleChooseFromTime = () => {
    setShowFromTimePicker(false);
    if (fromMinute === null) {
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
          {selectedOption === "by-day"
            ? validateDate === true && (
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
              )
            : validateDate === true && (
                <DialogComponent
                  isVisible={validateDate}
                  message={"Giờ vắng mặt đến phải lớn hơn Giờ vắng mặt từ"}
                  onCancel={() => setValidateDate(false)}
                  title="Cảnh báo"
                  isCancel={true}
                  lotties={2}
                  cancelText="Xác nhận"
                  duration={500}
                />
              )}

          {/* {resumeFails && (
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
          )} */}
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
              Tạo mới Đơn nghỉ không dùng phép
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

          {/* <View
            style={{
              flexDirection: "row",
              //alignItems: "center",
              position: "relative",
              width: "100%",
            }}
          >
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.textCheck}
              selectedTextStyle={styles.selectedText}
              data={[
                { label: "Một ngày", value: "full-day" },
                { label: "Nhiều ngày", value: "by-day" },
                { label: "Theo giờ", value: "by-hour" },
              ]}
              labelField="label"
              valueField="value"
              placeholder="Chọn tùy chọn"
              value={selectedOption}
              onChange={(item) => setSelectedOption(item.value)}
            />
            <MaterialIcons name="keyboard-arrow-down" size={28} color="black" style={{position: 'absolute', right: 10, top: 7}}/>
          </View>  */}

          {/* {selectedOption === "full-day" && (
            <>
              <Text allowFontScaling={false} style={styles.label}>
                Ngày nghỉ
                <Text allowFontScaling={false} style={styles.warning}>
                  {" "}
                  *
                </Text>
              </Text>
              <View>
                <TouchableOpacity
                  onPress={() => setShowStartPicker(true)}
                  style={
                    isFocus ? styles.datePickerRegexFails : styles.dateInput
                  }
                >
                  <Text>{startDate.toLocaleDateString()}</Text>
                  <Ionicons
                    name="calendar-outline"
                    size={24}
                    style={styles.icon}
                  />
                </TouchableOpacity>
              </View>
            </>
          )}

          {selectedOption === "by-day" && (
            <>
              <Text allowFontScaling={false} style={styles.label}>
                Thời gian
                <Text allowFontScaling={false} style={styles.warning}>
                  {" "}
                  *
                </Text>
              </Text>
              <View>
                <TouchableOpacity
                  onPress={() => setShowStartPicker(true)}
                  style={
                    isFocus ? styles.datePickerRegexFails : styles.dateInput
                  }
                >
                  <Text>Từ ngày: {startDate.toLocaleDateString()}</Text>
                  <Ionicons
                    name="calendar-outline"
                    size={24}
                    style={styles.icon}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setShowEndPicker(true)}
                  style={
                    isFocus ? styles.datePickerRegexFails : styles.dateInput
                  }
                >
                  <Text>Đến ngày: {endDate.toLocaleDateString()}</Text>
                  <Ionicons
                    name="calendar-outline"
                    size={24}
                    style={styles.icon}
                  />
                </TouchableOpacity>
              </View>
            </>
          )}

          {selectedOption === "by-hour" && (
            <>
              <Text allowFontScaling={false} style={styles.label}>
                Ngày nghỉ
                <Text allowFontScaling={false} style={styles.warning}>
                  {" "}
                  *
                </Text>
              </Text>
              <View>
                <TouchableOpacity
                  onPress={() => setShowStartPicker(true)}
                  style={
                    isFocus ? styles.datePickerRegexFails : styles.dateInput
                  }
                >
                  <Text>{startDate.toLocaleDateString()}</Text>
                  <Ionicons
                    name="calendar-outline"
                    size={24}
                    style={styles.icon}
                  />
                </TouchableOpacity>
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
            </>
          )} */}
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text allowFontScaling={false} style={styles.label}>
              Ngày nghỉ
              <Text allowFontScaling={false} style={styles.warning}>
                {" "}
                *
              </Text>
            </Text>
            <View>
              <TouchableOpacity
                onPress={() => setShowStartPicker(true)}
                style={isFocus ? styles.datePickerRegexFails : styles.dateInput}
              >
                <Text>Từ ngày: {startDate.toLocaleDateString()}</Text>
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
                <Text>Đến ngày: {endDate.toLocaleDateString()}</Text>
                <Ionicons
                  name="calendar-outline"
                  size={24}
                  style={styles.icon}
                />
              </TouchableOpacity>
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
                    style={[
                      isFocus ? styles.timePickerRegexFails : styles.timePicker,
                      fromTime && fromMinute && styles.disabledTimePicker,
                    ]}
                    disabled={!!(fromTime && fromMinute)}
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
                    style={[
                      isFocus ? styles.timePickerRegexFails : styles.timePicker,
                      toTime && toMinute && styles.disabledTimePicker,
                    ]}
                    disabled={!!(toTime && toMinute)}
                  >
                    <Text allowFontScaling={false}>
                      {toTime && toMinute ? toTime + ":" + toMinute : "hh:mm"}
                    </Text>
                    <AntDesign name="clockcircleo" size={24} color="black" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

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
                allowFontScaling={false}
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
    position: "relative",
    flex: 1,
    padding: 16,
    backgroundColor: "#FFFFFF",
    paddingTop: 40,
  },
  dropdown: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    width: "100%",
    marginBottom: 7,
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
    borderRadius: 8,
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
  textInputRegexFails: {
    height: 100,
    borderColor: "#ff0000",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    textAlignVertical: "top",
    marginBottom: 24,
  },

  wrap: {
    //flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  sub_wrap: {},
  warning: {
    color: "red",
  },
  pickerInputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    paddingRight: 30,
    backgroundColor: "#f2f2f2",
    marginBottom: 20,
  },
  pickerInputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "gray",
    borderRadius: 8,
    color: "black",
    backgroundColor: "#f2f2f2",
    marginBottom: 20,
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
  textCheck: {
    color: "#B1B2B4",
    fontSize: 15,
  },
  selectedText: {
    fontSize: 15,
  },
  disabledTimePicker: {
    opacity: 0.7, // mờ đi khi disabled
  },
});

export default LeaveNoMoneyScreen;
