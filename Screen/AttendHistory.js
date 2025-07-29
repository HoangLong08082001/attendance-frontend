import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { AuthContext } from "../contexts/AuthContext";
import {
  calculateDurationHistory,
  convertTimeFormat,
  isSaturdayOrOutsideWorkingHours,
  isTimeBetween8And5,
} from "../services/utils";

const AttendHistory = () => {
  const currentMonth = new Date().getMonth() + 1; // Lấy tháng hiện tại (từ 1 đến 12)
  const currentYear = new Date().getFullYear(); // Lấy năm hiện tại
  const [month, setMonth] = useState(currentMonth); // Khởi tạo tháng hiện tại là tháng hiện tại
  const [year, setYear] = useState(currentYear); // Khởi tạo năm hiện tại
  const {
    dateSuccess,
    userInfo,
    // timeCheckin,
    // timeCheckout,
    checkin_setting,
    checkout_setting,
  } = useContext(AuthContext);
  const [timeCheckinSetting, setTimeCheckinSetting] = useState(checkin_setting);
  const [timeCheckoutSetting, setTimeCheckoutSetting] =
    useState(checkout_setting);

  // Hàm để lọc dữ liệu theo tháng
  const filterDataByMonth = (month) => {
    return dateSuccess.filter((item) => {
      const itemMonth = parseInt(item.time.split(".")[1]);
      return itemMonth === month;
    });
  };
  useEffect(() => {
    setTimeCheckinSetting(checkin_setting);
    setTimeCheckoutSetting(checkout_setting);
  }, [checkin_setting, checkout_setting]);
  // Hàm để xử lý tháng tiếp theo
  const handleNextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear(year + 1); // Tăng năm khi qua tháng 12
    } else {
      setMonth(month + 1);
    }
  };

  // Hàm để xử lý tháng trước
  const handlePreviousMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear(year - 1); // Giảm năm khi qua tháng 1
    } else {
      setMonth(month - 1);
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={handlePreviousMonth}
        >
          <MaterialIcons
            name="arrow-back-ios-new"
            color="#15bcf5"
            style={styles.icon}
          />
        </TouchableOpacity>
        <Text allowFontScaling={false} style={styles.headerText}>
          {month}.{year} {/* Hiển thị tháng và năm hiện tại */}
        </Text>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={handleNextMonth}
        >
          <MaterialIcons
            name="arrow-forward-ios"
            color="#15bcf5"
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.listHistory}
        showsVerticalScrollIndicator={false}
      >
        {filterDataByMonth(month)?.length > 0 ? (
          filterDataByMonth(month).map((item, index) => {
            if (item) {
              return (
                <View key={index} style={styles.itemHistory}>
                  <View style={styles.childItem}>
                    <Text allowFontScaling={false} style={styles.dateAttend}>
                      {item.time}
                    </Text>
                    <Text
                      allowFontScaling={false}
                      style={styles.totalDateAttend}
                    >
                      {item?.checkin_time === null &&
                      item?.checkout_time === null &&
                      item?.point_attandance === 1
                        ? "Cả ngày 08 tiếng"
                        : calculateDurationHistory(
                            item?.checkin_time,
                            item?.checkout_time,
                            item?.created_at,
                            checkin_setting,
                            checkout_setting
                          )}
                    </Text>
                  </View>
                  <View style={styles.childItem}>
                    <View style={styles.childInChildItem}>
                      <View style={styles.viewIn}>
                        <Text
                          allowFontScaling={false}
                          style={{ color: "white" }}
                        >
                          VÀO
                        </Text>
                      </View>
                      <View style={styles.viewOut}>
                        <Text
                          allowFontScaling={false}
                          style={{ color: "white" }}
                        >
                          RA
                        </Text>
                      </View>
                    </View>
                    {item?.checkin_time === null &&
                    item?.checkout_time === null &&
                    item?.point_attandance === 1 ? (
                      <View style={styles.childInChildItem}>
                        {userInfo?.userCheck === true ? (
                          <Text
                            allowFontScaling={false}
                            style={
                              isTimeBetween8And5(
                                item?.checkin_time,
                                checkin_setting,
                                checkout_setting
                              ) === true
                                ? styles.timeInLate
                                : styles.timeIn
                            }
                          >
                            {item?.checkin_time === null &&
                            item?.point_attandance === 1
                              ? "08:00"
                              : convertTimeFormat(item?.checkin_time)}
                          </Text>
                        ) : (
                          <Text
                            allowFontScaling={false}
                            style={
                              isTimeBetween8And5(
                                timeCheckinSetting,
                                checkin_setting,
                                checkout_setting
                              ) === true
                                ? styles.timeInLate
                                : styles.timeIn
                            }
                          >
                            {timeCheckinSetting
                              ? convertTimeFormat(timeCheckinSetting)
                              : "--:--"}
                          </Text>
                        )}
                        {isSaturdayOrOutsideWorkingHours(
                          item?.checkout_time,
                          item?.time,
                          checkout_setting
                        ) === true || userInfo?.userCheck === true ? (
                          <Text allowFontScaling={false} style={styles.timeIn}>
                            {checkout_setting}
                          </Text>
                        ) : (
                          <Text
                            allowFontScaling={false}
                            style={
                              isSaturdayOrOutsideWorkingHours(
                                timeCheckoutSetting,
                                item?.time,
                                checkout_setting
                              ) === false
                                ? styles.timeInLate
                                : styles.timeIn
                            }
                          >
                            {timeCheckoutSetting
                              ? convertTimeFormat(timeCheckoutSetting)
                              : "--:--"}
                          </Text>
                        )}
                      </View>
                    ) : (
                      <View style={styles.childInChildItem}>
                        {userInfo?.userCheck === true ? (
                          <Text
                            allowFontScaling={false}
                            style={
                              isTimeBetween8And5(
                                item?.checkin_time,
                                checkin_setting,
                                checkout_setting
                              ) === true
                                ? styles.timeInLate
                                : styles.timeIn
                            }
                          >
                            {item?.checkin_time === null &&
                            item?.point_attandance === 1
                              ? "8:00"
                              : convertTimeFormat(item?.checkin_time)}
                          </Text>
                        ) : (
                          <Text
                            allowFontScaling={false}
                            style={
                              isTimeBetween8And5(
                                timeCheckinSetting,
                                checkin_setting,
                                checkout_setting
                              ) === true
                                ? styles.timeInLate
                                : styles.timeIn
                            }
                          >
                            {timeCheckinSetting
                              ? convertTimeFormat(timeCheckinSetting)
                              : "--:--"}
                          </Text>
                        )}
                        {isSaturdayOrOutsideWorkingHours(
                          item?.checkout_time,
                          item?.time,
                          checkout_setting
                        ) === true || userInfo?.userCheck === true ? (
                          <Text
                            allowFontScaling={false}
                            style={
                              isSaturdayOrOutsideWorkingHours(
                                item?.checkout_time,
                                item?.time,
                                checkout_setting
                              ) === false
                                ? styles.timeInLate
                                : styles.timeIn
                            }
                          >
                            {item?.checkout_time
                              ? convertTimeFormat(item?.checkout_time)
                              : "--:--"}
                          </Text>
                        ) : (
                          <Text
                            allowFontScaling={false}
                            style={
                              isSaturdayOrOutsideWorkingHours(
                                timeCheckoutSetting,
                                item?.time,
                                checkout_setting
                              ) === false
                                ? styles.timeInLate
                                : styles.timeIn
                            }
                          >
                            {timeCheckoutSetting
                              ? convertTimeFormat(timeCheckoutSetting)
                              : "--:--"}
                          </Text>
                        )}
                      </View>
                    )}
                  </View>
                </View>
              );
            } else {
              return (
                <View>
                  <Text style={{ textAlign: "center" }}>
                    Chưa có dữ liệu chấm công
                  </Text>
                </View>
              );
            }
          })
        ) : (
          <View
            style={{
              flex: 1,
            }}
          >
            <Text
              style={{
                justifyContent: "center",
                alignContent: "center",
                textAlign: "center",
                marginVertical: 30,
                color: "gray",
              }}
            >
              Không có dữ liệu chấm công
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    fontSize: 16,
    fontWeight: "700",
  },
  header: {
    width: 200,
    padding: 10,
    alignItems: "center",
    backgroundColor: "white", // Màu nền nhẹ
  },
  headerText: {
    flex: 1,
    fontSize: 20,
    fontWeight: "350",
    color: "black", // Màu chữ cho header
    textAlign: "center",
  },
  listHistory: {
    height: 600,
  },
  itemHistory: {
    borderWidth: 0.2,
    padding: 10,
    display: "flex",
    flexDirection: "row",
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 5,
  },
  childItem: {
    flex: 1,

    padding: 10,
  },
  attendBar: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    display: "flex",
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-around",
  },
  checkInBar: {
    flex: 1,
    backgroundColor: "#f1f8ec",
    padding: 20,
    borderRadius: 10,
  },
  checkOutBar: {
    flex: 1,
    backgroundColor: "#fef2e8",
    padding: 20,
    borderRadius: 10,
  },
  titleCheckIn: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 10,
    color: "#2e2a36",
    fontWeight: "300",
  },
  childInChildItem: {
    gap: 10,
    padding: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  viewIn: {
    backgroundColor: "#f08314",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  viewOut: {
    borderWidth: 0.1,
    backgroundColor: "#034887",
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 20,
  },
  timeIn: {
    marginRight: 5,
  },
  timeInLate: {
    marginRight: 5,
    color: "red",
  },
  timeOut: {
    marginRight: 5,
    color: "red",
  },
  timeOutLate: {
    marginRight: 5,
    color: "red",
  },
  wrapper: {
    paddingHorizontal: 10,
    marginTop: 15,
    width: "100%",
  },
  container: {
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 2,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  iconContainer: {
    flex: 0.1,

    alignItems: "center",
    justifyContent: "center",
  },
});

export default AttendHistory;
