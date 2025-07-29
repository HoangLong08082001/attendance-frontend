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
import { Dropdown } from "react-native-element-dropdown";
import { AuthContext } from "../../contexts/AuthContext";
import DialogComponent from "../../components/DialogComponent";
import AntDesign from "@expo/vector-icons/AntDesign";
import { ReactNativeModal } from "react-native-modal"; // Import Modal component
import AsyncStorage from "@react-native-async-storage/async-storage";
// const Stack = createNativeStackNavigator();

const getLateOrEarlyMessage = (time, defaultTime, messagePrefix) => {
  // Nếu time là null hoặc undefined, gán giá trị mặc định
  if (!time) {
    time = defaultTime;
  }

  // Chuyển đổi time và defaultTime thành đối tượng Date để tính toán
  const timeDate = new Date(`1970-01-01T${time}Z`);
  const defaultDate = new Date(`1970-01-01T${defaultTime}Z`);

  // Tính sự chênh lệch thời gian (millisecond)
  const diffInMilliseconds = timeDate - defaultDate;

  // Nếu không có sự chênh lệch (bằng 0), không cần hiển thị thông báo
  if (diffInMilliseconds === 0) {
    return "";
  }

  // Chuyển đổi sự chênh lệch từ milliseconds sang giờ và phút
  const diffInMinutes = Math.floor(Math.abs(diffInMilliseconds) / 60000);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const remainingMinutes = diffInMinutes % 60;

  // Tạo thông báo đi trễ hoặc về sớm
  let message = messagePrefix;
  if (diffInMilliseconds > 0) {
    // Trễ
    message += " Được đi trễ";
  } else {
    // Về sớm
    message += " Được về sớm";
  }

  // Thêm phần giờ và phút
  if (diffInHours > 0) {
    message += ` ${diffInHours} tiếng`;
  }
  if (remainingMinutes > 0) {
    message += ` ${remainingMinutes} phút`;
  }

  return message;
};

const ModeScreen = (props) => {
  const { navigation, route } = props;

  const item = route.params?.item;
  //const [leaveType, setLeaveType] = useState('single');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [reason, setReason] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [validateDate, setValidateDate] = useState(false);
  const [isSundays, setIsSunday] = useState(false);
  const [valueName, setValueName] = useState("");
  const [empty, setEmpty] = useState(false);
  const id_setting_resume = route.params?.id_setting_resume;
  const name_setting_resume = route.params?.name_setting_resume;
  const dateStartFromCalendar = route.params?.dateStartFromCalendar;

  const { listModeResume, checkin_setting, checkout_setting } =
    useContext(AuthContext);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [hasClickedMode, setHasClickedMode] = useState(false);

  const closeModal = () => {
    setIsModalVisible(false);
    setHasClickedMode(false);
  };

  useEffect(() => {
    if (item) {
      setStartDate(new Date(item?.date_start));
      setEndDate(new Date(item?.date_end));
      setValue(item?.setting_resume?.id_setting_resume);
      setReason(item?.description);
      setValueName(item?.setting_resume?.name_setting_resume);
    }
    if (dateStartFromCalendar) {
      setStartDate(new Date(dateStartFromCalendar));
    }
  }, [route.params]);

  //// // //console.log(item?.description);

  useEffect(() => {
    // Check if it's the user's first time visiting this screen
    const checkFirstVisit = async () => {
      const hasVisited = await AsyncStorage.getItem("hasVisitedModeScreen");
      if (!hasVisited) {
        // This is the first time user is visiting this screen
        setIsModalVisible(true);
        // Mark that the user has visited this screen before
        await AsyncStorage.setItem("hasVisitedModeScreen", "true");
      }
    };

    checkFirstVisit();
  }, []);
  const {
    listTypeModeApplication,
    handleCreateModeResumeApplication,
    // loading,
    resumeSuccess,
    resumeFails,
    setResumeSuccess,
    setResumeFails,
    updateResumeOther,
  } = useContext(AuthContext);
  const resumeId = route.params?.resumeId || null;

  const onDateChange1 = (event, selectedDate) => {
    setShowStartPicker(Platform.OS === "ios" ? true : false);
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };
  const onDateChange2 = (event, selectedDate) => {
    setShowEndPicker(Platform.OS === "ios" ? true : false);
    if (selectedDate && startDate && selectedDate >= startDate) {
      setEndDate(selectedDate);
    } else {
      setShowEndPicker(false);
      setEndDate(new Date());
    }
  };

  const handleCreateModeApplication = () => {
    if (startDate && endDate && value && reason) {
      if (endDate >= startDate) {
        if (resumeId) {
          updateResumeOther(
            resumeId,
            valueName,
            id_setting_resume,
            startDate.toISOString(),
            endDate.toISOString(),
            reason
          );
          setValue(null);
          setValueName("");
          setStartDate(new Date());
          setEndDate(new Date());
          setReason("");
          setValidateDate(false);
          navigation.navigate("ListApplication");
        } else {
          handleCreateModeResumeApplication(
            value,
            valueName,
            startDate.toISOString(),
            endDate.toISOString(),
            reason
          );

          setValue(null);
          setStartDate(new Date());
          setEndDate(new Date());
          setReason("");
          setValueName("");
          setValidateDate(false);
          navigation.navigate("ListApplication");
        }
      }
    } else {
      setEmpty(true);
      setIsFocus(true);
    }
  };
  //// // //console.log("value name", valueName);
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
                setValue(null);
                setStartDate(new Date());
                setEndDate(new Date());
                setReason("");
                setIsFocus(false);
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
              Tạo mới Đơn chế độ
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
          <View style={styles.wrap_sub_title}>
            <Text allowFontScaling={false} style={styles.sectionTitle}>
              Thông tin chung {"  "}
            </Text>
            <TouchableOpacity
              style={styles.warningIcon}
              onPress={() => {
                if (!hasClickedMode) {
                  // Set the state to show the modal
                  setIsModalVisible(true);
                  setHasClickedMode(true);
                }
              }}
            >
              <AntDesign name="exclamationcircleo" size={20} color="orange" />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text allowFontScaling={false} style={styles.label}>
              Loại chế độ
              <Text allowFontScaling={false} style={styles.warning}>
                {" "}
                *
              </Text>
            </Text>
            <Dropdown
              style={
                isFocus
                  ? styles.dropdownContainerRegexFails
                  : styles.dropdownContainer
              }
              placeholderStyle={styles.textCheck}
              selectedTextStyle={styles.selectedText}
              iconStyle={styles.iconStyle}
              data={listTypeModeApplication}
              itemTextStyle={styles.itemText}
              itemContainerStyle={styles.itemContainer}
              search={false}
              maxHeight={300}
              renderItem={(item) => {
                return (
                  <View style={styles.itemDropdown}>
                    <View style={styles.item}>
                      <Text
                        allowFontScaling={false}
                        style={styles.labelDropdown}
                      >
                        Đơn {item.name_setting_resume}
                      </Text>

                      <Text
                        allowFontScaling={false}
                        style={styles.descriptionDropdown}
                      >
                        {item.description}
                      </Text>
                      <Text
                        allowFontScaling={false}
                        style={styles.descriptionTime}
                      >
                        {item?.starttime !== null &&
                          `Đi trễ lúc ${item.starttime} `}
                        {item?.endtime !== null && `Về sớm lúc ${item.endtime}`}
                      </Text>
                    </View>
                  </View>
                );
              }}
              labelField="name_setting_resume"
              valueField="id_setting_resume" // Chắc chắn là đúng, tương thích với key trong data
              placeholder={
                name_setting_resume ? name_setting_resume : "Chọn loại chế độ"
              }
              value={value} // Truyền giá trị vào dropdown
              onChange={(item) => {
                setValue(item.id_setting_resume);
                setValueName(item?.name_setting_resume);
              }}
            />

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
                style={isFocus ? styles.dateInputRegexFails : styles.dateInput}
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
                style={isFocus ? styles.dateInputRegexFails : styles.dateInput}
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
                      onChange={onDateChange1}
                      textColor="black"
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
                      value={startDate}
                      onChange={onDateChange2}
                      textColor="black"
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
                  value={startDate}
                  onChange={onDateChange2}
                  mode="date" // Chế độ chọn ngày
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                />
              )
            )}

            {/* Reason Input */}
            <View style={{ marginBottom: 100 }}>
              <Text allowFontScaling={false} style={styles.label}>
                Lý do
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
                multiline
                onChangeText={setReason}
              />
            </View>
          </ScrollView>

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleCreateModeApplication}
          >
            <Text allowFontScaling={false} style={styles.submitButtonText}>
              {item === undefined ? "TẠO ĐƠN" : "CẬP NHẬT"}
            </Text>
          </TouchableOpacity>
          <ReactNativeModal
            isVisible={isModalVisible}
            onBackdropPress={closeModal}
            onBackButtonPress={closeModal}
          >
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Đặc quyền</Text>
              {/* <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}> */}
              <View style={styles.scrollContainer}>
                <FlatList
                  data={listTypeModeApplication}
                  keyExtractor={(item) => item.id_setting_resume}
                  renderItem={({ item, index }) => (
                    <View
                      style={[styles.modalItem, styles.modalItemWithBorder]}
                    >
                      <View style={styles.wrapText}>
                        <Text style={styles.modalText}>
                          {item.name_setting_resume}:{" "}
                          <Text style={styles.description}>
                            {item.description}
                          </Text>
                        </Text>
                        <View style={styles.wrapTime}>
                          {item.starttime && (
                            <Text style={styles.modalTextTime}>
                              {item.starttime &&
                                getLateOrEarlyMessage(
                                  item.starttime,
                                  checkin_setting,
                                  ""
                                )}
                            </Text>
                          )}
                          {item.endtime && (
                            <Text style={styles.modalTextTime}>
                              {item.endtime &&
                                getLateOrEarlyMessage(
                                  item.endtime,
                                  checkout_setting,
                                  ""
                                )}
                            </Text>
                          )}
                        </View>
                      </View>
                    </View>
                  )}
                />
              </View>
              {/* </ScrollView> */}
              <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
                <Text style={styles.modalButtonText}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </ReactNativeModal>
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
    alignContent: "center",
    alignItems: "center",
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
  dropdownContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    marginTop: 2,
    marginBottom: 10,
  },
  dropdownContainerRegexFails: {
    borderWidth: 1,
    borderColor: "#ff0000",
    padding: 12,
    borderRadius: 8,
    marginTop: 2,
    marginBottom: 10,
  },
  textCheck: {
    color: "#B1B2B4",
    fontSize: 15,
  },
  selectedText: {
    fontSize: 15,
  },
  itemText: {
    fontSize: 15,
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
  descriptionTime: {
    marginVertical: 10,
    fontStyle: "normal",
    color: "#ff0000",
    fontSize: 12,
  },

  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  scrollContainer: {
    height: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
  },
  modalTextTime: {
    fontSize: 14,
    color: "gray",
  },
  modalButton: {
    marginTop: 15,
    backgroundColor: "#F08313",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
  },
  description: {
    color: "gray",
  },
  wrapText: {
    // flexDirection: "row",
    // justifyContent: "space-between",
  },
  wrapTime: {
    marginLeft: -3,
    marginTop: 4,
    marginBottom: 7,
  },
  modalItem: {
    marginTop: 10,
    // borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    // borderBottomWidth: 1
  },
  modalItemWithBorder: {
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
    borderBottomWidth: 1,
  },
  warningIcon: {
    // position: 'absolute',
    // top: 10,
    // right: 10
  },
  wrap_sub_title: {
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
  },
});

export default ModeScreen;
