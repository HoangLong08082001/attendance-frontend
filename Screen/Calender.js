import { useState, useContext, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { AuthContext } from "../contexts/AuthContext";
import RBSheet from "react-native-raw-bottom-sheet";
import AttendHistory from "./AttendHistory";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import { useToast } from "react-native-toast-notifications";

import {
  convertTimeFormat,
  isDateBeforeOrEqualToday,
  timeDifferenceFromEightAM,
  timeDifferenceToFivePM,
  isDateBeforeOrEqualToday1,
  isSunday,
  isBeforeEight,
  validateTimeRange,
  isDateInRange,
} from "../services/utils";
import CustomHeaderCalendar from "../components/customHeaderCalendar";
import { Dropdown } from "react-native-element-dropdown";
import SpinnerLoadingHome from "../components/SpinnerLoadingHome";

LocaleConfig.locales["fr"] = {
  monthNames: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  monthNamesShort: [
    "Jan.",
    "Feb.",
    "Mar.",
    "Apr.",
    "May",
    "Jun.",
    "Jul.",
    "Aug.",
    "Sep.",
    "Oct.",
    "Nov.",
    "Dec.",
  ],
  dayNames: [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ],
  dayNamesShort: ["CN", "T.2", "T.3", "T.4", "T.5", "T.6", "T.7"],
  today: "Aujourd'hui",
};

LocaleConfig.defaultLocale = "fr";

const CalendarScreen = ({ navigation }) => {
  const toast = useToast();

  const refRBSheet = useRef(); // Khai báo refRBSheet
  // const refRBSheetCalendar = useRef(); // Khai báo refRBSheet
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();
  const currentDate = today.getDate();
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  // const [selectedDate, setSelectedDate] = useState(currentDate);
  const [selected, setSelected] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const {
    dateSuccess,
    AttendanceByUser,
    listResumeApplication,
    getListResumeApplication,
    typeResumeCategory,
    // loadingHome,
    loadingScreen,
    checkin_setting,
    checkout_setting,
  } = useContext(AuthContext);
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const [tab, setTab] = useState(0);
  const [choose, setChoose] = useState("");
  const startYear = 2000;
  const [selectedDateForRBSheet, setSelectedDateForRBSheet] = useState(null);
  const [attendanceInfo, setAttendanceInfo] = useState(null);
  
  // const getYears = (limit) => {
  //   return Array.from({ length: limit }, (_, i) => startYear + i);
  // };

  const loadData = async () => {
    setIsRefreshing(true);
    await AttendanceByUser();
    await getListResumeApplication();
    setIsRefreshing(false);
    toast.show(`Đã tải lại trang`, {
      type: "success",
      placement: "top",
      duration: 800,
      offset: 20,
      animationType: "slide-in",
    });
  };
  // // // //console.log("date success", dateSuccess);
  const onMonthChange = (month) => {
    setSelectedMonth(month.month);
    setSelectedYear(month.year);
  };
  const isFutureMonthYear = (month, year) => {
    const today = new Date();
    const currentMonth = today.getMonth() + 1; // getMonth() trả về tháng từ 0-11, nên phải cộng thêm 1
    const currentYear = today.getFullYear();

    // Nếu năm truyền vào lớn hơn năm hiện tại, hoặc năm truyền vào bằng năm hiện tại nhưng tháng truyền vào lớn hơn tháng hiện tại
    if (year > currentYear || (year === currentYear && month > currentMonth)) {
      return true; // Là tháng và năm sau tháng và năm hiện tại
    }

    return false; // Không phải tháng và năm sau tháng năm hiện tại
  };
  const getPointAttendance = (date) => {
    const found = dateSuccess.find(
      (item) =>
        item.day === date.day &&
        item.month === selectedMonth &&
        item.year === selectedYear
    );
    return found
      ? found.point_attandance
      : isFutureMonthYear(selectedMonth, selectedYear) === true
      ? ""
      : 0;
  };

  // //// // //console.log("date success", dateSuccess);
  const onDayPress = (day) => {
    setSelected(day.dateString); // Cập nhật ngày đã chọn
    setSelectedDateForRBSheet(day.dateString); // Lưu vào selectedDateForRBSheet

    // Lấy thông tin chi tiết của ngày đã chọn từ dateSuccess
    const dayInfo = dateSuccess.find(
      (item) =>
        item.day === day.day &&
        item.month === selectedMonth &&
        item.year === selectedYear
    );
    // Nếu tìm thấy thông tin ngày, cập nhật state attendanceInfo
    setAttendanceInfo(dayInfo || null);
    refRBSheet.current.open(); // Mở RBSheet
  };

  const onRBSheetClose = () => {
    // Reset lại ngày đã chọn sau khi RBSheet đóng
    setSelected(""); // Xóa ngày đã chọn
    setAttendanceInfo(null); // Xóa thông tin attendance
    setToggleDropdown(false);
  };
  if (loadingScreen === true) {
    return <SpinnerLoadingHome />;
  }
  return (
    <View>
      <CustomHeaderCalendar
        title="Bảng công"
        statusAction={1}
        handleBack={() => navigation.goBack()}
      />
      <View style={styles.tabNavigate}>
        <TouchableOpacity
          style={tab === 0 ? styles.tabContainerActive : styles.tabContainer}
          onPress={() => setTab(0)}
        >
          <Text
            allowFontScaling={false}
            style={
              tab === 0 ? styles.textTabHeaderActive : styles.textTabHeader
            }
          >
            Công tháng
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tab === 1 ? styles.tabContainerActive : styles.tabContainer}
          onPress={() => setTab(1)}
        >
          <Text
            allowFontScaling={false}
            style={
              tab === 1 ? styles.textTabHeaderActive : styles.textTabHeader
            }
          >
            Lịch sử chấm công
          </Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
            style={tab === 2 ? styles.tabContainerActive : styles.tabContainer}
            // onPress={() => setTab(2)}
            onPress={() => setTab(2)}
          >
            <Text
              allowFontScaling={false}
              style={
                tab === 2 ? styles.textTabHeaderActive : styles.textTabHeader
              }
            >
              Thống kê
            </Text>
          </TouchableOpacity> */}
      </View>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={loadData} />
        }
      >
        {tab === 0 ? (
          <Calendar
            hideArrows={false}
            current={`${currentYear}-${String(currentMonth).padStart(
              2,
              "0"
            )}-01`}
            onMonthChange={onMonthChange}
            hideExtraDays={true}
            renderHeader={() => (
              <View style={styles.containerMonth}>
                <TouchableOpacity style={styles.headerCalendar} disabled={true}>
                  <Text
                    allowFontScaling={false}
                    style={styles.headerText}
                  >{`${selectedMonth}.${selectedYear}`}</Text>
                </TouchableOpacity>
              </View>
            )}
            style={{ height: "100%" }}
            dayComponent={({ date }) => {
              const isToday =
                date.day === currentDate &&
                date.month === currentMonth &&
                date.year === currentYear;

              const isCurrentMonth =
                date.month === selectedMonth && date.year === selectedYear;
              const pointAttendance = isCurrentMonth
                ? getPointAttendance(date)
                : null;
              const isSunday =
                new Date(date.year, date.month - 1, date.day).getDay() === 0;

              let dayStyle = styles.dayContainer;
              let textColor = styles.dayText;

              if (isToday && isCurrentMonth) {
                dayStyle = [dayStyle, { backgroundColor: "#3c82df" }];
                textColor = [textColor, { color: "white" }];
              } else if (pointAttendance > 0 && pointAttendance < 1) {
                dayStyle = [dayStyle, { backgroundColor: "#edf7e6" }];
              } else if (
                isCurrentMonth &&
                isFutureMonthYear(selectedMonth, selectedYear) === false
              ) {
                dayStyle = [dayStyle, { backgroundColor: "#edf7e6" }];
              }

              const displayDate =
                date.day === 1 ? `${date.day}/${date.month}` : date.day;

              return (
                <TouchableOpacity
                  onPress={() => onDayPress(date)}
                  style={[
                    dayStyle,
                    selected === date.dateString && styles.selectedDayContainer,
                  ]}
                >
                  <Text
                    allowFontScaling={false}
                    style={[
                      textColor,
                      date.state === "disabled" && styles.disabledText,
                    ]}
                  >
                    {displayDate}
                  </Text>
                  <Text
                    allowFontScaling={false}
                    style={[
                      isCurrentMonth
                        ? pointAttendance !== 0
                          ? styles.daySucces
                          : styles.dayFails
                        : styles.disabledText,
                      date.state === "disabled" && styles.disabledText,
                      isSunday ? styles.successText : {},
                      isToday && isCurrentMonth ? { color: "white" } : {},
                    ]}
                  >
                    {isCurrentMonth
                      ? isSunday &&
                        isFutureMonthYear(selectedMonth, selectedYear) === false
                        ? "N"
                        : pointAttendance === 0
                        ? 0
                        : pointAttendance
                      : ""}{" "}
                  </Text>
                </TouchableOpacity>
              );
            }}
            markedDates={{
              [selected]: {
                selected: true,
                disableTouchEvent: true,
                selectedDotColor: "blue",
              },
            }}
          />
        ) : (
          tab === 1 && <AttendHistory />
        )}
        <RBSheet
          ref={refRBSheet}
          height={650} // Thay đổi chiều cao để đủ hiển thị thêm thông tin
          openDuration={250}
          customStyles={{
            container: {
              padding: 10,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
            },
          }}
          onClose={onRBSheetClose} // Reset trạng thái khi RBSheet đóng
        >
          <View style={styles.pickerContainerDetail}>
            <View style={styles.headerDetailRBSheet}>
              <Text
                allowFontScaling={false}
                style={styles.textHeaderDetailRBSheet}
              >
                Chi tiết chấm công, {selectedDateForRBSheet}
              </Text>
              <TouchableOpacity onPress={() => refRBSheet.current.close()}>
                <MaterialCommunityIcons
                  name="window-close"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
            </View>
            {isDateBeforeOrEqualToday1(selectedDateForRBSheet) &&
            !isSunday(selectedDateForRBSheet) ? (
              <View>
                <View style={styles.attendBar}>
                  <View
                    style={styles.attend}
                    backgroundColor={
                      isDateBeforeOrEqualToday(selectedDateForRBSheet) &&
                      !attendanceInfo?.checkin_time
                        ? "#ffdede"
                        : isBeforeEight(
                            attendanceInfo?.checkin_time,
                            checkin_setting
                          ) === true
                        ? "#f1f8ec"
                        : "#fff7de"
                    }
                  >
                    <Text allowFontScaling={false} style={styles.title1}>
                      Giờ vào
                    </Text>
                    <Text
                      allowFontScaling={false}
                      style={[
                        styles.title2,
                        {
                          color:
                            isDateBeforeOrEqualToday(selectedDateForRBSheet) &&
                            !attendanceInfo?.checkin_time
                              ? "gray"
                              : isBeforeEight(
                                  attendanceInfo?.checkin_time,
                                  checkin_setting
                                ) === true
                              ? "#27a745"
                              : "#f0da13",
                        },
                      ]}
                    >
                      {attendanceInfo?.checkin_time
                        ? convertTimeFormat(attendanceInfo.checkin_time)
                        : "--:--"}
                    </Text>

                    {isDateBeforeOrEqualToday(selectedDateForRBSheet) &&
                    !attendanceInfo?.checkin_time ? (
                      <Text
                        allowFontScaling={false}
                        style={styles.title3NoRecord}
                      >
                        Không ghi nhận
                      </Text>
                    ) : (
                      <Text allowFontScaling={false} style={styles.title3}>
                        {timeDifferenceFromEightAM(
                          attendanceInfo?.checkin_time,
                          checkin_setting
                        )}
                      </Text>
                    )}
                    {isDateBeforeOrEqualToday(selectedDateForRBSheet) &&
                    !attendanceInfo?.checkin_time ? (
                      <Ionicons name="close-circle" size={24} color="#d72323" />
                    ) : isBeforeEight(
                        attendanceInfo?.checkin_time,
                        checkin_setting
                      ) === true ? (
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color="#27a745"
                      />
                    ) : (
                      <AntDesign name="clockcircle" size={24} color="#f0da13" />
                    )}
                  </View>
                  <View
                    style={styles.attend}
                    backgroundColor={
                      isDateBeforeOrEqualToday(selectedDateForRBSheet) &&
                      !attendanceInfo?.checkout_time
                        ? "#ffdede"
                        : timeDifferenceToFivePM(
                            selectedDateForRBSheet,
                            attendanceInfo?.checkout_time,
                            checkout_setting
                          ).status === true
                        ? "#f1f8ec"
                        : "#fff7de"
                    }
                  >
                    <Text allowFontScaling={false} style={styles.title1}>
                      Giờ ra
                    </Text>
                    <Text
                      allowFontScaling={false}
                      style={[
                        styles.title2,
                        ,
                        {
                          color:
                            isDateBeforeOrEqualToday(selectedDateForRBSheet) &&
                            !attendanceInfo?.checkout_time
                              ? "gray"
                              : timeDifferenceToFivePM(
                                  selectedDateForRBSheet,
                                  attendanceInfo?.checkout_time,
                                  checkout_setting
                                ).status === true
                              ? "#27a745"
                              : "#f0da13",
                        },
                      ]}
                    >
                      {attendanceInfo?.checkout_time
                        ? convertTimeFormat(attendanceInfo.checkout_time)
                        : "--:--"}
                    </Text>
                    {isDateBeforeOrEqualToday(selectedDateForRBSheet) &&
                    !attendanceInfo?.checkout_time ? (
                      <Text
                        allowFontScaling={false}
                        style={styles.title3NoRecord}
                      >
                        Không ghi nhận
                      </Text>
                    ) : (
                      <Text allowFontScaling={false} style={styles.title3}>
                        {
                          timeDifferenceToFivePM(
                            selectedDateForRBSheet,
                            attendanceInfo?.checkout_time,
                            checkout_setting
                          ).message
                        }
                      </Text>
                    )}
                    {isDateBeforeOrEqualToday(selectedDateForRBSheet) &&
                    !attendanceInfo?.checkout_time ? (
                      <Ionicons name="close-circle" size={24} color="#d72323" />
                    ) : timeDifferenceToFivePM(
                        selectedDateForRBSheet,
                        attendanceInfo?.checkout_time,
                        checkout_setting
                      ).status === true ? (
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color="#27a745"
                      />
                    ) : (
                      <AntDesign name="clockcircle" size={24} color="#f0da13" />
                    )}
                  </View>
                  <View style={styles.attend} backgroundColor={"#eaeef6"}>
                    <Text allowFontScaling={false} style={styles.title1}>
                      Tổng giờ làm
                    </Text>
                    <Text allowFontScaling={false} style={styles.title4}>
                      {attendanceInfo?.total_time_working
                        ? attendanceInfo.total_time_working
                        : 0}
                    </Text>
                    <Text allowFontScaling={false} style={styles.title1}>
                      Điểm công
                    </Text>
                    <Text allowFontScaling={false} style={styles.title4}>
                      {attendanceInfo?.point_attandance
                        ? attendanceInfo.point_attandance
                        : 0}
                    </Text>
                  </View>
                </View>

                <View style={styles.Application}>
                  <Text allowFontScaling={false} style={styles.titleList}>
                    Đơn từ trong ngày
                  </Text>
                  {listResumeApplication?.some(
                    (item) => item.date_start === selectedDateForRBSheet
                  ) ? (
                    <TouchableOpacity
                      onPress={() => {
                        setToggleDropdown(!toggleDropdown);
                        // refRBSheet.current.close();
                        // navigation.navigate("CreateScreen", { isCanlendar: 1 });
                      }}
                      style={
                        // isBeforeEight(attendanceInfo?.checkin_time)
                        //   ? styles.btnCreateDisable
                        //   : isBeforeFive(attendanceInfo?.checkout_time)
                        //   ? styles.btnCreateDisable
                        //   : styles.btnCreate
                        styles.btnCreateDisable
                      }
                      disabled={
                        // isBeforeEight(attendanceInfo?.checkin_time)
                        //   ? true
                        //   : isBeforeFive(attendanceInfo?.checkout_time)
                        //   ? true
                        //   : false
                        true
                      }
                    >
                      <Text allowFontScaling={false} style={styles.textCreate}>
                        Bổ sung đơn
                      </Text>
                      <AntDesign
                        name="pluscircle"
                        size={24}
                        color={
                          // isBeforeEight(attendanceInfo?.checkin_time)
                          //   ? "gray"
                          //   : isBeforeFive(attendanceInfo?.checkout_time)
                          //   ? "gray"
                          //   : "white"
                          "gray"
                        }
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        setToggleDropdown(true);
                        // refRBSheet.current.close();
                        // navigation.navigate("CreateScreen", { isCalendar: 1 });
                      }}
                      style={
                        validateTimeRange(
                          attendanceInfo?.checkin_time,
                          attendanceInfo?.checkout_time,
                          selectedDateForRBSheet,
                          checkin_setting,
                          checkout_setting
                        ) === true
                          ? styles.btnCreateDisable
                          : styles.btnCreate
                      }
                      disabled={
                        validateTimeRange(
                          attendanceInfo?.checkin_time,
                          attendanceInfo?.checkout_time,
                          selectedDateForRBSheet,
                          checkin_setting,
                          checkout_setting
                        ) === true
                          ? true
                          : false
                      }
                    >
                      <Text allowFontScaling={false} style={styles.textCreate}>
                        Bổ sung đơn
                      </Text>
                      <AntDesign
                        name="pluscircle"
                        size={24}
                        color={
                          validateTimeRange(
                            attendanceInfo?.checkin_time,
                            attendanceInfo?.checkout_time,
                            selectedDateForRBSheet,
                            checkin_setting,
                            checkout_setting
                          ) === true
                            ? "gray"
                            : "white"
                        }
                      />
                    </TouchableOpacity>
                  )}
                </View>
                {/* <View>
                  <Text
                    allowFontScaling={false}
                    style={styles.titleCreateResume}
                  >
                    Chọn loại đơn cần tạo!
                  </Text>
                </View> */}
                {validateTimeRange(
                  attendanceInfo?.checkin_time,
                  attendanceInfo?.checkout_time,
                  selectedDateForRBSheet,
                  checkin_setting,
                  checkout_setting
                ) === false && toggleDropdown === true ? (
                  <Dropdown
                    style={styles.dropdownContainer}
                    placeholderStyle={styles.textCheck}
                    selectedTextStyle={styles.selectedText}
                    iconStyle={styles.iconStyle}
                    data={typeResumeCategory.filter(
                      (item) =>
                        item.id_setting_resume !== 20 &&
                        item.id_setting_resume !== 16 &&
                        item.id_setting_resume !== 17 &&
                        item.id_setting_resume !== 19
                    )}
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
                              {item?.id_setting_resume === 3
                                ? "Đơn checkin/checkout"
                                : item.name_setting_resume}
                            </Text>
                          </View>
                        </View>
                      );
                    }}
                    labelField="name_setting_resume"
                    valueField="id_setting_resume" // Chắc chắn là đúng, tương thích với key trong data
                    placeholder={"Chọn loại đơn"}
                    value={choose}
                    onChange={(item) => {
                      setChoose(item?.id_setting_resume);
                      switch (item?.id_setting_resume) {
                        case 1:
                          setSelected(""); // Xóa ngày đã chọn
                          setAttendanceInfo(null); // Xóa thông tin attendance
                          setToggleDropdown(false);
                          refRBSheet.current.close();
                          navigation.navigate("LeaveScreen", {
                            dateStartFromCalendar: selectedDateForRBSheet,
                          }); // Navigate to LeaveApplication screen
                          break;
                        case 2:
                          setSelected(""); // Xóa ngày đã chọn
                          setAttendanceInfo(null); // Xóa thông tin attendance
                          setToggleDropdown(false);

                          refRBSheet.current.close();
                          navigation.navigate("AbsenceScreen", {
                            dateStartFromCalendar: selectedDateForRBSheet,
                          });
                          break;
                        case 3:
                          setSelected(""); // Xóa ngày đã chọn
                          setAttendanceInfo(null); // Xóa thông tin attendance
                          setToggleDropdown(false);

                          refRBSheet.current.close();
                          navigation.navigate("CheckScreen", {
                            dateStartFromCalendar: selectedDateForRBSheet,
                          });
                          break;
                        case 7:
                          setSelected(""); // Xóa ngày đã chọn
                          setAttendanceInfo(null); // Xóa thông tin attendance
                          setToggleDropdown(false);

                          refRBSheet.current.close();

                          navigation.navigate("ModeScreen", {
                            dateStartFromCalendar: selectedDateForRBSheet,
                          });
                          break;
                        case 12:
                          setSelected(""); // Xóa ngày đã chọn
                          setAttendanceInfo(null); // Xóa thông tin attendance
                          setToggleDropdown(false);

                          refRBSheet.current.close();
                          navigation.navigate("LongLeaveScreen", {
                            dateStartFromCalendar: selectedDateForRBSheet,
                          });
                          break;
                        case 13:
                          setSelected(""); // Xóa ngày đã chọn
                          setAttendanceInfo(null); // Xóa thông tin attendance
                          setToggleDropdown(false);

                          refRBSheet.current.close();
                          navigation.navigate("ResignationScreen", {
                            dateStartFromCalendar: selectedDateForRBSheet,
                          });
                          break;
                        case 14:
                          setSelected(""); // Xóa ngày đã chọn
                          setAttendanceInfo(null); // Xóa thông tin attendance
                          setToggleDropdown(false);

                          refRBSheet.current.close();
                          navigation.navigate("LeaveProScreen", {
                            dateStartFromCalendar: selectedDateForRBSheet,
                          });
                          break;
                        case 16:
                          setSelected(""); // Xóa ngày đã chọn
                          setAttendanceInfo(null); // Xóa thông tin attendance
                          setToggleDropdown(false);

                          refRBSheet.current.close();
                          navigation.navigate("LeaveNoMoneyScreen", {
                            dateStartFromCalendar: selectedDateForRBSheet,
                          });
                          break;
                        case 17:
                          setSelected(""); // Xóa ngày đã chọn
                          setAttendanceInfo(null); // Xóa thông tin attendance
                          setToggleDropdown(false);

                          refRBSheet.current.close();
                          navigation.navigate("EarlyLeaveScreen", {
                            dateStartFromCalendar: selectedDateForRBSheet,
                          });
                          break;
                        case 18:
                          setSelected(""); // Xóa ngày đã chọn
                          setAttendanceInfo(null); // Xóa thông tin attendance
                          setToggleDropdown(false);

                          refRBSheet.current.close();
                          navigation.navigate("HourlyLeaveNoSalaryScreen", {
                            dateStartFromCalendar: selectedDateForRBSheet,
                          });
                          break;
                        case 19:
                          setSelected(""); // Xóa ngày đã chọn
                          setAttendanceInfo(null); // Xóa thông tin attendance
                          setToggleDropdown(false);

                          refRBSheet.current.close();
                          navigation.navigate("LateScreen", {
                            dateStartFromCalendar: selectedDateForRBSheet,
                          });
                          break;
                        default:
                          break;
                      }
                    }}
                  />
                ) : (
                  ""
                )}

                <View style={styles.listResume}>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    {listResumeApplication?.map((item, index) => {
                      if (
                        isDateInRange(
                          selectedDateForRBSheet,
                          item.date_start,
                          item.date_end
                        )
                      ) {
                        return (
                          <TouchableOpacity
                            key={index}
                            onPress={() => {
                              refRBSheet.current.close();
                              navigation.navigate("DetailScreen", { item });
                            }}
                          >
                            <View style={styles.card}>
                              <View style={styles.row}>
                                {item?.setting_resume?.id_setting_resume ===
                                1 ? (
                                  <View style={styles.iconContainer}>
                                    <Ionicons
                                      name="umbrella-outline"
                                      size={24}
                                      color="#4F8EF7"
                                    />
                                  </View>
                                ) : item?.setting_resume?.id_setting_resume ===
                                  2 ? (
                                  <View style={styles.iconContainer}>
                                    <Ionicons
                                      name="bag-outline"
                                      size={24}
                                      color="#4F8EF7"
                                    />
                                  </View>
                                ) : item?.setting_resume?.id_setting_resume ===
                                  3 ? (
                                  <View style={styles.iconContainer}>
                                    <Ionicons
                                      name="checkmark-circle-outline"
                                      size={24}
                                      color="#4F8EF7"
                                    />
                                  </View>
                                ) : item?.setting_resume?.id_setting_resume ===
                                  4 ? (
                                  <View style={styles.iconContainer}>
                                    <Ionicons
                                      name="checkmark-circle-outline"
                                      size={24}
                                      color="#4F8EF7"
                                    />
                                  </View>
                                ) : item?.setting_resume?.id_setting_resume ===
                                  12 ? (
                                  <View style={styles.iconContainer}>
                                    <Ionicons
                                      name="calendar-outline"
                                      size={24}
                                      color="#4F8EF7"
                                    />
                                  </View>
                                ) : item?.setting_resume?.id_setting_resume ===
                                    6 ||
                                  item?.setting_resume?.id_setting_resume ===
                                    7 ||
                                  item?.setting_resume?.id_setting_resume ===
                                    8 ||
                                  item?.setting_resume?.id_setting_resume ===
                                    9 ||
                                  item?.setting_resume?.id_setting_resume ===
                                    10 ||
                                  item?.setting_resume?.id_setting_resume ===
                                    11 ||
                                  item?.setting_resume?.id_setting_resume ===
                                    14 ||
                                  item?.setting_resume?.id_setting_resume ===
                                    15 ||
                                  item?.setting_resume?.id_setting_resume ===
                                    16 ? (
                                  <View style={styles.iconContainer}>
                                    <Ionicons
                                      name="calendar-outline"
                                      size={24}
                                      color="#4F8EF7"
                                    />
                                  </View>
                                ) : item?.setting_resume?.id_setting_resume ===
                                  18 ? (
                                  <View style={styles.iconContainer}>
                                    <FontAwesome
                                      name={"calendar-times-o"}
                                      size={24}
                                      color={"#4F8EF7"}
                                    />
                                  </View>
                                ) : item?.setting_resume?.id_setting_resume ===
                                  20 ? (
                                  <View style={styles.iconContainer}>
                                    <Ionicons
                                      name="bag-outline"
                                      size={24}
                                      color="#4F8EF7"
                                    />
                                  </View>
                                ) : item?.setting_resume?.id_setting_resume ===
                                    17 ||
                                  item?.setting_resume?.id_setting_resume ===
                                    19 ? (
                                  <View style={styles.iconContainer}>
                                    <Ionicons
                                      name="timer-outline"
                                      size={24}
                                      color="#4F8EF7"
                                    />
                                  </View>
                                ) : (
                                  <View style={styles.iconContainerFails}>
                                    <Ionicons
                                      name="log-out-outline"
                                      size={24}
                                      color="#D60000"
                                    />
                                  </View>
                                )}

                                <View style={styles.info}>
                                  <Text
                                    allowFontScaling={false}
                                    style={styles.title}
                                  >
                                    {item?.setting_resume?.name_setting_resume}
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
                                      {item?.date_start}
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
                                  style={[
                                    item?.status_resume?.id_status_resume === 1
                                      ? styles.status
                                      : item?.status_resume
                                          ?.id_status_resume === 2
                                      ? styles.statusSuccess
                                      : styles.statusFails,
                                    {
                                      backgroundColor:
                                        item?.status_resume
                                          ?.id_status_resume === 1
                                          ? "#FEF9E1"
                                          : item?.status_resume
                                              ?.id_status_resume === 2
                                          ? "#EDF7E6"
                                          : "#FFE8E8",
                                    },
                                  ]}
                                >
                                  {item?.status_resume?.name_status}
                                </Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                        );
                      } else {
                        <View key={index}></View>;
                      }
                    })}
                  </ScrollView>
                </View>
              </View>
            ) : (
              <Text
                allowFontScaling={false}
                style={{
                  textAlign: "center",
                  justifyContent: "center",
                  marginTop: 30,
                }}
              >
                Không có dữ liệu chấm công
              </Text>
            )}
          </View>
        </RBSheet>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    marginBottom: 100,
  },
  header: {
    width: 200,
    padding: 10,
    alignItems: "center",
    backgroundColor: "white", // Màu nền nhẹ
  },
  headerText: {
    fontSize: 18,
    fontWeight: "350",
    color: "black", // Màu chữ cho header
    textAlign: "center",
  },
  dayContainer: {
    width: 50,
    height: 100,
    alignItems: "center",
    margin: 5,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  selectedDayContainer: {
    backgroundColor: "#14ae5c", // Tô đỏ cho ngày đã chọn
  },
  dayText: {
    color: "#2d4150",
    marginTop: 10,
  },
  dayFails: { color: "red", marginTop: 5 },
  daySucces: { color: "#ffc107", marginTop: 5 },
  disabledText: {
    color: "#d9e1e8",
  },
  successText: {
    color: "#28A745",
  },
  pickerContainer: {
    padding: 5,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  tabNavigate: {
    backgroundColor: "#e8f2ff",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
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
    fontSize: 12,
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
    fontSize: 12,
    color: "#034887",
    fontWeight: "450",
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

  iconContainer: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: "#E8F2FF",
  },
  iconContainerFails: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: "#FFE8E8",
  },
  icon: {
    fontSize: 16,
    fontWeight: "700",
    color: "black",
  },
  headerCalendar: {
    flex: 1,
  },
  pickerItem: {
    fontSize: 18,
    padding: 10,
    textAlign: "center",
  },
  pickerContainerDetail: {
    height: 300,
  },
  headerDetailRBSheet: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 0.2,
  },
  textHeaderDetailRBSheet: {
    flex: 1,
    textAlign: "center",
  },
  attendBar: {
    marginTop: 20,
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
  },
  attend: {
    flex: 1,
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  title3: {
    fontSize: 10,
    marginBottom: 10,
  },
  title3NoRecord: {
    fontSize: 10,
    marginBottom: 10,
    color: "#d72323",
  },
  title1: {
    fontSize: 12,
    marginBottom: 10,
  },
  title2: {
    fontSize: 20,
    marginBottom: 10,
  },
  title4: {
    fontSize: 22,
    marginBottom: 10,
  },
  Application: {
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleList: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "300",
  },
  btnCreate: {
    flexDirection: "row",
    padding: 10,
    gap: 10,
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: "#3c82df",
  },
  btnCreateDisable: {
    backgroundColor: "#dfdfdf",
    flexDirection: "row",
    padding: 10,
    gap: 10,
    alignItems: "center",
    borderRadius: 5,
  },
  textCreate: {
    color: "white",
  },
  containerMonth: {
    marginTop: 25,
    marginBottom: 25,
  },
  listResume: {
    height: 240,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#B9BDC1",
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
    fontSize: 12,
    color: "#D4B740",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  statusSuccess: {
    fontSize: 12,
    color: "#28A745",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  statusFails: {
    fontSize: 12,
    color: "#D60000",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  status2: {
    fontSize: 12,
    color: "#28A745",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  status3: {
    fontSize: 12,
    color: "#D60000",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    overflow: "hidden",
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
  titleCreateResume: {
    paddingVertical: 10,
    fontWeight: "300",
  },
});
export default CalendarScreen;
