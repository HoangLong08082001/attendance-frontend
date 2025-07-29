import React, { useContext, useRef, useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
5;
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
  Modal,
  FlatList,
} from "react-native";
import { AuthContext } from "../contexts/AuthContext";
import SpinnerLoadingHome from "../components/SpinnerLoadingHome";
import CustomHeaderCalendar from "../components/customHeaderCalendar";
import AntDesign from "@expo/vector-icons/AntDesign";
import RBSheet from "react-native-raw-bottom-sheet";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { convertDateFormat, convertMonthYearsString } from "../services/utils";

import Ionicons from "react-native-vector-icons/Ionicons";
const months = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
const Salary = ({ navigation }) => {
  const refRBSheet = useRef(); // Ref cho RBSheet
  const { loadingHome, loadingScreen } = useContext(AuthContext);
  const [tab, setTab] = useState(0);
  const [choose, setChoose] = useState(new Date().getMonth() + 1);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const { listResumeApplication } = useContext(AuthContext);
  const openSheet = () => refRBSheet.current.open();
  const closeSheet = () => refRBSheet.current.close();

  const handleMonthPress = (month) => {
    setChoose(month);
    setSelectedMonth(month);
    closeSheet();
  };
  const filterDataMonthYear = (month, year) => {
    return listResumeApplication.filter((item) => {
      let start = convertMonthYearsString(item.date_start);
      let end = convertMonthYearsString(item.date_end);

      if (month < 10) {
        return (
          `0${month}, năm ${year}` === start || `0${month}, năm ${year}` === end
        );
      } else {
        return (
          `${month}, năm ${year}` === start || `${month}, năm ${year}` === end
        );
      }
    });
  };
  const getIconName = (name) => {
    if (name === 1) {
      return "umbrella-outline"; // Icon cho Đơn công tác
    } else if (name === 2) {
      return "bag-outline"; // Icon cho Đơn nghỉ phép
    } else if (name === 3) {
      return "checkmark-circle-outline";
    } else if (name === 4) {
      return "checkmark-circle-outline";
    } else if (name === 7) {
      return "person-outline";
    } else if (name === 6) {
      return "person-outline";
    } else if (name === 11) {
      return "person-outline";
    } else if (name === "Về sớm 1 giờ rước con học") {
      return "person-outline";
    } else if (name === 9) {
      return "person-outline";
    } else if (name === 8) {
      return "person-outline";
    } else if (name === 7) {
      return "person-outline";
    } else if (name === 12) {
      return "calendar-outline";
    } else if (name === 13) {
      return "log-out-outline";
    } else if (name === "Đơn nghỉ phép không lương") {
      return "free-cancellation";
    } else if (name === 15) {
      return "time-outline";
    } else if (name === 14) {
      return "people-outline";
    } else if (name === 16) {
      return "free-cancellation";
    } else if (name === 20) {
      return "bag-outline";
    } else if (name === 17) {
      return "timer-outline";
    } else if (name === 18) {
      return "calendar-times-o";
    } else if (name === 19) {
      return "timer-outline";
    }
    //return "clockcircleo";
  };
  return (
    <SafeAreaView style={styles.container}>
      {loadingScreen === true && <SpinnerLoadingHome />}
      {/* <FontAwesome name="warning" size={40} color="#FFCC00" />
      <Text allowFontScaling={false} style={styles.text}>
        Tính năng đang phát triển
      </Text> */}
      <CustomHeaderCalendar
        title="Bảng lương"
        statusAction={1}
        handleBack={() => navigation.goBack()}
      />
      <ScrollView
        style={{ width: "100%", height: "100%", paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.top}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text
              allowFontScaling={false}
              style={{ color: "#034887", fontWeight: "500" }}
            >
              Thông tin lương:{" "}
              <Text style={{ fontSize: 18, color: "#27a745" }}>
                {selectedMonth
                  ? "Tháng " + selectedMonth
                  : `Tháng ${new Date().getMonth() + 1}`}
                , năm {selectedYear}
              </Text>
            </Text>
            <TouchableOpacity onPress={openSheet}>
              <AntDesign name="calendar" size={30} color="black" />
            </TouchableOpacity>
          </View>
          <View style={styles.realSalary}>
            <Text allowFontScaling={false} style={{ color: "white" }}>
              Thực nhận:
            </Text>
            <Text
              allowFontScaling={false}
              style={{ color: "white", fontSize: 30, fontWeight: "700" }}
            >
              8.000.000 VND
            </Text>
            <Text
              allowFontScaling={false}
              style={{
                color: "white",
                fontWeight: "400",
                fontSize: 12,
                marginTop: 10,
              }}
            >
              Lương chính thức: 8.000.000 VND
            </Text>
          </View>
        </View>
        <View style={styles.content}>
          <View style={styles.tabNavigate}>
            <TouchableOpacity
              style={
                tab === 0 ? styles.tabContainer1Active : styles.tabContainer1
              }
              onPress={() => setTab(0)}
            >
              <Text
                allowFontScaling={false}
                style={
                  tab === 0 ? styles.textTabHeaderActive : styles.textTabHeader
                }
              >
                Chi tiết
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={
                tab === 1 ? styles.tabContainerActive : styles.tabContainer
              }
              onPress={() => setTab(1)}
            >
              <Text
                allowFontScaling={false}
                style={
                  tab === 1 ? styles.textTabHeaderActive : styles.textTabHeader
                }
              >
                Danh sách đơn
              </Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
              style={
                tab === 2 ? styles.tabContainerActive : styles.tabContainer
              }
              onPress={() => setTab(2)}
            >
              <Text allowFontScaling={false}
                allowFontScaling={false}
                style={
                  tab === 2 ? styles.textTabHeaderActive : styles.textTabHeader
                }
              >
                Lịch sử Lương
              </Text>
            </TouchableOpacity> */}
          </View>
          <View style={styles.tabContent}>
            {tab === 0 ? (
              <ScrollView
                style={{ height: "100%" }}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.infoSalary}>
                  <Text allowFontScaling={false}>
                    Tổng số ngày công trong tháng:{" "}
                  </Text>
                  <Text
                    allowFontScaling={false}
                    style={{ color: "black", fontWeight: "300" }}
                  >
                    12
                  </Text>
                </View>
                <View style={styles.infoSalary}>
                  <Text allowFontScaling={false}>
                    Tổng số ngày công làm việc trong tháng:{" "}
                  </Text>
                  <Text
                    allowFontScaling={false}
                    style={{ color: "black", fontWeight: "300" }}
                  >
                    12
                  </Text>
                </View>
                <View style={styles.infoSalary}>
                  <Text allowFontScaling={false}>Tổng số đơn trong tháng </Text>
                  <Text
                    allowFontScaling={false}
                    style={{ color: "black", fontWeight: "300" }}
                  >
                    12
                  </Text>
                </View>
                <View style={styles.infoSalary}>
                  <Text allowFontScaling={false}>
                    Tổng số ngày nghỉ có phép:{" "}
                  </Text>
                  <Text
                    allowFontScaling={false}
                    style={{ color: "black", fontWeight: "300" }}
                  >
                    12
                  </Text>
                </View>
                <View style={styles.infoSalary}>
                  <Text allowFontScaling={false}>
                    Tổng số ngày nghỉ không phép:{" "}
                  </Text>
                  <Text
                    allowFontScaling={false}
                    style={{ color: "black", fontWeight: "300" }}
                  >
                    12
                  </Text>
                </View>
                <View style={styles.infoSalary}>
                  <Text allowFontScaling={false}>Thời gian nhận lương: </Text>
                  <Text
                    allowFontScaling={false}
                    style={{ color: "black", fontWeight: "300" }}
                  >
                    12
                  </Text>
                </View>
                <View style={styles.infoSalary}>
                  <Text allowFontScaling={false}>
                    Thông tin ngân hàng nhận lương:{" "}
                  </Text>
                  <Text
                    allowFontScaling={false}
                    style={{ color: "black", fontWeight: "300" }}
                  >
                    12
                  </Text>
                </View>
              </ScrollView>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View>
                  {filterDataMonthYear(selectedMonth, selectedYear).map(
                    (item, index) => {
                      return (
                        <TouchableOpacity
                          key={index}
                          onPress={() =>
                            navigation.navigate("DetailScreen", {
                              item,
                              backStatus: 1,
                            })
                          }
                        >
                          <View style={styles.card}>
                            <View style={styles.row}>
                              {item.setting_resume.id_setting_resume === 16 ? (
                                <MaterialIcons
                                  name={getIconName(
                                    item.setting_resume.id_setting_resume
                                  )}
                                  size={24}
                                  color="#4F8EF7"
                                />
                              ) : item.setting_resume.id_setting_resume ===
                                18 ? (
                                <FontAwesome
                                  name={getIconName(
                                    item.setting_resume.id_setting_resume
                                  )}
                                  size={24}
                                  color="#4F8EF7"
                                />
                              ) : (
                                <Ionicons
                                  name={getIconName(
                                    item.setting_resume.id_setting_resume
                                  )}
                                  size={24}
                                  color={
                                    item.setting_resume.id_setting_resume === 13
                                      ? "#D60000"
                                      : "#4F8EF7"
                                  }
                                />
                              )}
                              <View style={styles.info}>
                                <Text
                                  allowFontScaling={false}
                                  style={styles.title}
                                >
                                  {item.setting_resume.name_setting_resume}
                                </Text>
                                <View style={styles.wrap_time}>
                                  <AntDesign
                                    name="clockcircleo"
                                    size={15}
                                    color="97A0A9"
                                    style={styles.icon_time}
                                  />
                                  <Text
                                    allowFontScaling={false}
                                    style={styles.time}
                                  >
                                    {convertDateFormat(item.date_start)}
                                  </Text>
                                </View>
                                <Text
                                  allowFontScaling={false}
                                  style={styles.reason}
                                >
                                  Lý do: {item.description}
                                </Text>
                              </View>
                              <Text
                                allowFontScaling={false}
                                style={
                                  item?.status_resume?.id_status_resume === 1
                                    ? styles.status
                                    : item?.status_resume?.id_status_resume ===
                                      2
                                    ? styles.statusSuccess
                                    : styles.statusCancel
                                }
                              >
                                {item.status_resume.name_status}
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      );
                    }
                  )}
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </ScrollView>

      <RBSheet
        ref={refRBSheet}
        height={450}
        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={{
          container: styles.sheetContainer,
          draggableIcon: styles.draggableIcon,
        }}
      >
        {/* <TouchableOpacity
          style={{
            padding: 10,
            marginVertical: 20,
            backgroundColor: "#F08313",
            borderRadius: 50,
          }}
          onPress={() => handleMonthPress(choose)}
        >
          <Text
            style={{ color: "white", textAlign: "center", fontWeight: "700" }}
          >
            Chọn
          </Text>
        </TouchableOpacity> */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              setSelectedYear(selectedYear - 1);
              setChoose(null);
            }}
          >
            <MaterialIcons
              name="arrow-back-ios-new"
              color="#15bcf5"
              size={20}
              style={styles.icon}
            />
          </TouchableOpacity>
          <Text style={styles.year}>{selectedYear}</Text>
          <TouchableOpacity
            onPress={() => {
              setSelectedYear(selectedYear + 1);
              setChoose(null);
            }}
          >
            <MaterialIcons
              name="arrow-forward-ios"
              color="#15bcf5"
              size={20}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
        <FlatList
          data={months}
          keyExtractor={(item) => item}
          numColumns={3}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={
                item === choose ? styles.monthButtonActive : styles.monthButton
              }
              onPress={() => handleMonthPress(item)}
            >
              <Text
                style={
                  item === choose ? styles.monthTextActive : styles.monthText
                }
              >
                Tháng {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </RBSheet>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginTop: 20,
    textAlign: "center",
    fontWeight: "400",
    fontSize: 20,
    color: "#FFCC00",
  },
  top: {
    backgroundColor: "white",

    paddingVertical: 10,
  },
  content: {
    backgroundColor: "white",
    width: "100%",
  },
  realSalary: {
    backgroundColor: "#F08313",
    marginVertical: 10,
    padding: 10,
    borderRadius: 10,
    shadowColor: "gray",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
  },
  tabNavigate: {
    borderTopWidth: 0.2,
    backgroundColor: "white",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  tabContainer: {
    paddingVertical: 15,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "white",
  },
  textTabHeader: {
    textAlign: "center",
    alignItems: "center",
    fontSize: 15,
    color: "gray",
    fontWeight: "450",
    paddingHorizontal: 10,
  },
  tabContainer1: {
    paddingVertical: 10,
    flex: 0.7,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "white",
  },
  tabContainerActive: {
    paddingVertical: 15,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#034887",
  },
  textTabHeaderActive: {
    textAlign: "center",
    alignItems: "center",
    fontSize: 15,
    color: "#034887",
    fontWeight: "500",
    paddingHorizontal: 10,
  },
  tabContainer1Active: {
    paddingVertical: 10,
    flex: 0.7,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#034887",
  },
  tabContent: {
    marginTop: 10,
    height: 500,
  },
  infoSalary: {
    marginVertical: 5,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomEndRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: "#f1f8ec",
  },
  changeMonthYear: {
    borderRadius: 20,
    paddingHorizontal: 2,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  iconContainer: {
    flex: 0.1,

    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    flex: 1,
    fontSize: 20,
    fontWeight: "350",
    color: "black", // Màu chữ cho header
    textAlign: "center",
  },
  sheetContainer: {
    padding: 20,
    backgroundColor: "#ffffff",
  },
  draggableIcon: {
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  arrow: {
    fontSize: 24,
    color: "#007BFF",
  },
  year: {
    fontSize: 20,
    fontWeight: "bold",
  },
  monthButton: {
    flex: 1,
    margin: 5,
    padding: 15,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    borderRadius: 5,
  },
  monthButtonActive: {
    flex: 1,
    margin: 5,
    padding: 15,
    backgroundColor: "#28A745",
    alignItems: "center",
    borderRadius: 5,
  },
  monthText: {
    fontSize: 16,
  },
  monthTextActive: {
    fontSize: 16,
    color: "white",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#B9BDC1",
    position: "relative",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  info: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
  },
  wrap_time: {
    flexDirection: "row",
  },
  icon_time: {
    marginTop: 9,
    fontSize: 14,
  },
  time: {
    fontSize: 14,
    color: "#B1B2B4",
    marginTop: 5,
  },
  reason: {
    fontSize: 14,
    color: "#888",
    marginTop: 5,
  },
  status: {
    backgroundColor: "#FEF9E1",
    position: "absolute",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
    color: "black",
    fontWeight: "bold",
    top: 0,
    color: "#D4B740",
    right: 0,
  },
  statusSuccess: {
    backgroundColor: "#EDF7E6",
    position: "absolute",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
    color: "black",
    fontWeight: "bold",
    top: 0,
    color: "#28A745",
    right: 0,
  },
  statusCancel: {
    backgroundColor: "#FFE8E8",
    position: "absolute",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
    color: "black",
    fontWeight: "bold",
    top: 0,
    color: "#D60000",
    right: 0,
  },
});

export default Salary;
