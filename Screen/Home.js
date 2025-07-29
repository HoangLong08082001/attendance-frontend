import { useContext, useEffect, useState } from "react";

import {
  Animated,
  Dimensions,
  Image,
  Linking,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import moment from "moment-timezone";
import Entypo from "@expo/vector-icons/Entypo";

import { AuthContext } from "../contexts/AuthContext";
import Button from "../components/Button";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import * as Location from "expo-location";

import {
  getDayName,
  convertTimeFormat,
  calculateDurationHistory,
  isSunday,
  isBeforeFive,
  isBeforeEight,
  isTimeBetween8And5,
  isSaturdayOrOutsideWorkingHours,
  isBeforeCurrentTime,
  getHourMinuteFromSetting,
} from "../services/utils";
import DialogComponent from "../components/DialogComponent";
import SpinnerLoading from "../components/SpinnerLoading";
import { AttendanceContext } from "../contexts/AttendanceContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useToast } from "react-native-toast-notifications";
import { useNotification } from "../contexts/NotificationProvider";
import SpinnerLoadingHome from "../components/SpinnerLoadingHome";
import Holidays from "date-holidays";

const HomeScreen = ({ navigation }) => {
  // const [loading, setLoading] = useState(false);
  const {
    checkIn,
    checkOut,
    attendanceDates,
    timeCheckin,
    timeCheckout,
    success,
    setSuccess,
    fails,
    text,
    Switch,
    setFails,
    userInfo,
    scoreAttend,
    // dateSuccess,
    totalHourAttend,
    // loading,
    avatar,
    isCheck,
    // setIsCheck,
    checkin_setting,
    checkout_setting,
    // notifySuccess,
    // notifyFails,
    // setNotifyFails,
    // setNotifySuccess,
    // userArray,
    // userToken,
    loadingScreen,
    statusCheck,
    // alertNetword,
    // setAlertNetword,
    loadingHome,
    // setLoadingHome,
    AttendanceByUser,
    // AttendenceToday,
    // setErrorLog,
    // errorLog,
    // all,
    // seen,
    sending,
    // resumeSelect,
    isAnnual,
  } = useContext(AuthContext);
  const { expoPushToken } = useNotification();
  const { setLoading, load } = useContext(AttendanceContext);
  const [sure, setSure] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [notifyAlert, setNotifyAlert] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [timeCheckinSetting, setTimeCheckinSetting] = useState(checkin_setting);
  const [timeCheckoutSetting, setTimeCheckoutSetting] =
    useState(checkout_setting);
  // const [dataAttends, setDataAttends] = useState([]);
  const [statusLoadLocation, setStatusLoadLocation] = useState(false);
  const [dis1, setDis1] = useState(false);
  const [dis2, setDis2] = useState(false);
  // const [checked, setChecked] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const toast = useToast();
  const [tok, setTok] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const [homeLoading, setHomeLoading] = useState(loadingHome);
  useEffect(() => {
    setTimeCheckinSetting(checkin_setting);
    setTimeCheckoutSetting(checkout_setting);
  }, [checkin_setting, checkout_setting]);
  // const toggleModal = () => {
  //   setLoading();
  // };
  // useEffect(() => {
  //   if (loadingHome === true) {
  //     navigation.navigate("LoadingScreen");
  //   } else {
  //     navigation.navigate("Main");
  //   }
  // }, [loadingHome]);

  // Hàm xác nhận
  const onConfirm = () => {
    setModalVisible(false); // Đóng modal
  };
  const onConfirm1 = () => {
    setSuccess(false); // Đóng modal
  };
  const onConfirm2 = () => {
    setFails(false); // Đóng modal
  };
  // Hàm hủy
  const onCancel = () => {
    setModalVisible(false); // Đóng modal
  };
  const onCancel1 = () => {
    setSuccess(false); // Đóng modal
  };
  const onCancel2 = () => {
    setFails(false); // Đóng modal
  };
  // const isMounted = true;
  const getLocation = async () => {
    try {
      setLoadingLocation(true); // Đánh dấu việc đang lấy vị trí

      // Yêu cầu quyền truy cập vị trí
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setErrorMsg("Quyền truy cập vị trí bị từ chối");
        return null; // Nếu không được cấp quyền, trả về null
      }

      // Lấy vị trí hiện tại
      let currentLocation = await Location.getCurrentPositionAsync({});

      // Kiểm tra nếu có tọa độ hợp lệ
      if (
        currentLocation?.coords?.latitude &&
        currentLocation?.coords?.longitude
      ) {
        setLatitude(currentLocation?.coords?.latitude);
        setLongitude(currentLocation?.coords?.longitude);
      } else {
        setErrorMsg("Không thể lấy vị trí hiện tại");
        return null;
      }
    } catch (error) {
      setErrorMsg("Đã xảy ra lỗi khi lấy vị trí");
      return null;
    } finally {
      setLoadingLocation(false); // Kết thúc trạng thái loading
    }
  };
  useEffect(() => {
    // Biến này để kiểm tra xem component có còn mount hay không
    //  let isMounted = true;
    getLocation();

    // return () => {
    //   isMounted = false;
    // };
  }, []);
  const handleCheckIn = async () => {
    setDis1(true);
    try {
      if (latitude !== "" && longitude !== "") {
        checkIn(latitude, longitude);
        setDis1(false);
      } else {
        setErrorMsg("Đã xảy ra lỗi khi CheckIn");
        setDis1(false);
      }
      // Thực hiện hành động CheckIn
    } catch (error) {
      setErrorMsg("Đã xảy ra lỗi khi CheckIn");
      setDis1(false);
    } finally {
      setDis1(false); // Kích hoạt lại nút CheckIn
    }
  };
  const handleCheckOut = async () => {
    setDis2(true);
    try {
      if (latitude !== "" && longitude !== "") {
        checkOut(latitude, longitude);
        setDis2(false);
      } else {
        setErrorMsg("Đã xảy ra lỗi khi CheckOut");
        setDis2(false);
      }
    } catch (error) {
      setErrorMsg("Đã xảy ra lỗi khi CheckOut");
    } finally {
      setDis2(false); // Kích hoạt lại nút CheckOut
    }
  };
  const checkoutHandle = () => {
    if (isBeforeCurrentTime(checkout_setting) === true) {
      setSure(true);
    } else {
      handleCheckOut();
    }
  };
  // const { width, height } = Dimensions.get("window"); // Lấy kích thước màn hình

  const [opacity] = useState(new Animated.Value(1));

  const handleScroll = (event) => {
    const contentOffsetY = event.nativeEvent.contentOffset.y;

    const opacityValue = contentOffsetY > 250 ? 0 : 1 - contentOffsetY / 250;
    opacity.setValue(opacityValue); // Cập nhật giá trị opacity
    // //// // //console.log('handleScroll called, contentOffsetY:', contentOffsetY);
  };
  const onRefresh = async () => {
    setIsRefreshing(true);
    await AttendanceByUser();
    setIsRefreshing(false);
    toast.show(`Đã tải lại trang`, {
      type: "success",
      placement: "top",
      duration: 800,
      offset: 20,
      animationType: "slide-in",
      style: {
        marginTop: Platform.OS === "ios" ? 0 : 50, // Thêm marginTop tùy chỉnh
      },
    });
  };
  return (
    <SafeAreaView style={styles.container}>
      {success === true && (
        <DialogComponent
          isVisible={success}
          message={
            Switch === true
              ? `Checkin thành công lúc \n ${new Date().getHours()} giờ ${new Date().getMinutes()} phút ${new Date().getSeconds()} giây`
              : `Checkout thành công lúc \n ${new Date().getHours()} giờ ${new Date().getMinutes()} phút ${new Date().getSeconds()} giây`
          }
          onConfirm={onConfirm1}
          onCancel={onCancel1}
          title="Chấm công"
          isOk={true}
          lotties={1}
          confirmText="Thoát"
          duration={500} // Thời gian hiệu ứng (500ms)
        />
      )}

      {fails === true && (
        <DialogComponent
          isVisible={fails}
          message={text}
          onConfirm={onConfirm2}
          onCancel={onCancel2}
          title={Switch === true ? "Checkin thất bại" : "Checkout thất bại"}
          isCancel={true}
          lotties={2}
          cancelText="Thoát"
          duration={500} // Thời gian hiệu ứng (500ms)
        />
      )}
      {statusLoadLocation === true && (
        <DialogComponent
          isVisible={statusLoadLocation}
          icon="ios-information-circle"
          message="Không thể chấm công vì chưa cho phép bật vị trí! Vui lòng bật vị trí ứng dụng"
          onConfirm={() => {
            if (Platform.OS === "ios") {
              // Mở cài đặt ứng dụng trên iOS
              Linking.openURL("app-settings:");
            } else {
              // Mở cài đặt chung trên Android
              Linking.openSettings().catch(() => {
                Alert.alert("Lỗi", "Không thể mở cài đặt");
              });
            }
          }}
          onCancel={() => setStatusLoadLocation(false)}
          title="Thông báo"
          isWarning={true}
          isOk={true}
          confirmText="Bật thông báo"
          lotties={3}
          isCancel={true}
          cancelText={"Thoát"}
          duration={500} // Thời gian hiệu ứng (500ms)
        />
      )}
      {sure === true && (
        <DialogComponent
          isVisible={sure}
          icon="ios-information-circle"
          message="Chưa đến giờ về, bạn có chắc chắn muốn checkout"
          onConfirm={() => {
            setSure(false);
            handleCheckOut();
          }}
          onCancel={() => setSure(false)}
          title="Cảnh báo"
          isWarning={true}
          isOk={true}
          confirmText="Đồng ý"
          lotties={3}
          isCancel={true}
          cancelText={"Huỷ"}
          duration={500} // Thời gian hiệu ứng (500ms)
        />
      )}
      {loadingScreen === true && <SpinnerLoadingHome />}
      {statusCheck === true && <SpinnerLoading />}
      {isModalVisible === true && (
        <DialogComponent
          isVisible={isModalVisible}
          icon="ios-information-circle"
          message="Tính năng đang được phát triển"
          onConfirm={onConfirm}
          onCancel={onCancel}
          title="Thông báo"
          isWarning={true}
          lotties={3}
          isCancel={true}
          cancelText={"Thoát"}
          duration={500} // Thời gian hiệu ứng (500ms)
        />
      )}
      {/* <TouchableOpacity
        onPress={() => navigation.openDrawer()}
        style={{
          position: "absolute",
          backgroundColor: "black",
          opacity: 0.7,
          zIndex: 100,
          width: 30,
          height: 50,
          justifyContent: "center",
          borderBottomRightRadius: 10,
          borderTopRightRadius: 10,
          top: 500,
        }}
      >
        <MaterialCommunityIcons
          name={"menu-right"}
          size={30}
          color="white"
        />
      </TouchableOpacity> */}

      <View style={styles.header}>
        <View style={styles.wrapper}>
          <TouchableOpacity
            style={styles.formImage}
            onPress={() => navigation.openDrawer()}
          >
            <Image
              style={styles.image}
              source={
                avatar
                  ? {
                      uri: `data:image/gif;base64,${avatar}`,
                    }
                  : userInfo?.avatar
                  ? {
                      uri: `${userInfo?.avatar}`,
                    }
                  : require("../assets/avatar/user_default.png")
              }
            />
          </TouchableOpacity>
          <View style={styles.middle}>
            <Text allowFontScaling={false} style={{ fontSize: 12 }}>
              Xin Chào !
            </Text>
            <Text allowFontScaling={false} style={styles.title}>
              {userInfo?.name ? userInfo?.name : ""}
            </Text>
            <Text allowFontScaling={false} style={styles.dateTime}>
              {getDayName()}, {new Date().getDate()}.{new Date().getMonth() + 1}
              .{new Date().getFullYear()}
            </Text>
          </View>
        </View>
        <View style={styles.action}>
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => setNotifyAlert(true)}
          >
            <Ionicons name="chatbubble-outline" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => navigation.navigate("ListNotification")}
          >
            {sending === 0 ? (
              ""
            ) : (
              <View
                style={{
                  zIndex: 1000,
                  position: "absolute",
                  top: 0,
                  left: 0,
                  backgroundColor: "red",
                  width: 20,
                  height: 20,
                  paddingVertical: 5,
                  borderRadius: 50,
                }}
              >
                <Text
                  style={{
                    justifyContent: "center",
                    color: "white",
                    textAlign: "center",
                    alignItems: "center",
                    fontSize: 7.5,
                    fontWeight: "600",
                  }}
                >
                  {sending > 9 ? "9+" : sending}
                </Text>
              </View>
            )}
            <Feather style={styles.icon} name="bell" />
          </TouchableOpacity>
        </View>
      </View>
      {!expoPushToken && (
        <View
          style={{
            backgroundColor: "#F5F5F5",
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
            paddingHorizontal: 15,
            paddingVertical: 10,
          }}
        >
          <Text style={{ width: 250, fontSize: 12, color: "gray" }}>
            Vui lòng cho phép thông báo để nhận các thông báo về đơn từ!
          </Text>
          <TouchableOpacity
            onPress={() => {
              if (Platform.OS === "ios") {
                // Mở cài đặt ứng dụng trên iOS
                Linking.openURL("app-settings:");
              } else {
                // Mở cài đặt chung trên Android
                Linking.openSettings();
              }
            }}
            style={{
              backgroundColor: "#0056d2",
              flexDirection: "column",
              justifyContent: "center",
              borderRadius: 15,
              width: 100,
            }}
          >
            <Text
              style={{
                alignItems: "center",
                fontSize: 12,
                textAlign: "center",
                color: "white",
                fontWeight: "600",
              }}
            >
              Cài đặt <Ionicons name="settings-sharp" size={12} color="white" />
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        style={{ height: "100%" }}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing} // Trạng thái làm mới
            onRefresh={onRefresh} // Hàm xử lý khi kéo để làm mới
            colors={["#ff6347"]}
          />
        }
      >
        <View style={styles.content}>
          <Animated.View style={[styles.attendBar, { opacity }]}>
            <View style={styles.checkInBar}>
              <Text allowFontScaling={false} style={styles.titleCheckIn}>
                Giờ làm
              </Text>
              <Text allowFontScaling={false} style={styles.time}>
                {userInfo?.userCheck === false
                  ? convertTimeFormat(timeCheckinSetting)
                  : timeCheckin?.length > 0
                  ? convertTimeFormat(timeCheckin)
                  : "--:--"}
              </Text>
              <Button
                title={
                  loadingLocation === true || loadingScreen === true
                    ? "Đang tải..."
                    : "Vào làm"
                }
                size={10}
                backgroundColor={
                  timeCheckin?.length > 0 ||
                  isSunday(new Date()) ||
                  isCheck === 1 ||
                  loadingLocation === true ||
                  userInfo.userCheck === false ||
                  loadingScreen === true ||
                  dis1 === true
                    ? "#B0BEC5"
                    : "#F08314"
                }
                onPress={handleCheckIn}
                borderRadius={50}
                boxShadow={false}
                disa={
                  timeCheckin?.length > 0 ||
                  isSunday(new Date()) ||
                  isCheck === 1 ||
                  loadingLocation === true ||
                  userInfo.userCheck === false ||
                  loadingScreen === true ||
                  dis1 === true
                    ? true
                    : false
                }
                margin={10}
                padding={15}
              />
              <Text allowFontScaling={false} style={styles.alert}>
                {userInfo?.userCheck === false
                  ? isBeforeEight(timeCheckinSetting, checkin_setting)
                    ? "Đến đúng giờ"
                    : "Đến trễ"
                  : timeCheckin
                  ? isBeforeEight(timeCheckin, checkin_setting)
                    ? "Đến đúng giờ"
                    : "Đến trễ"
                  : ""}
              </Text>
            </View>
            <View style={styles.checkOutBar}>
              <Text allowFontScaling={false} style={styles.titleCheckIn}>
                Giờ ra
              </Text>
              <Text allowFontScaling={false} style={styles.time}>
                {userInfo?.userCheck === false
                  ? convertTimeFormat(timeCheckoutSetting)
                  : timeCheckout
                  ? convertTimeFormat(timeCheckout)
                  : "--:--"}
              </Text>
              <Button
                title={
                  loadingLocation === true || loadingScreen === true
                    ? "Đang tải..."
                    : "Ra về"
                }
                disa={
                  timeCheckin?.length <= 0 ||
                  loadingLocation === true ||
                  userInfo.userCheck === false ||
                  dis2 === true
                    ? true
                    : timeCheckout?.length > 0 ||
                      userInfo.userCheck === false ||
                      dis2 === true
                    ? true
                    : false
                }
                size={10}
                backgroundColor={
                  timeCheckin?.length <= 0 ||
                  loadingLocation === true ||
                  userInfo.userCheck === false ||
                  dis2 === true
                    ? "#B0BEC5"
                    : timeCheckout?.length > 0 ||
                      userInfo.userCheck === false ||
                      dis2 === true
                    ? "#B0BEC5"
                    : "#034887"
                }
                onPress={checkoutHandle}
                borderRadius={50}
                boxShadow={false}
                margin={10}
                padding={15}
              />
              <Text allowFontScaling={false} style={styles.alert}>
                {userInfo?.userCheck === false
                  ? isBeforeFive(timeCheckoutSetting, checkout_setting)
                    ? "Ra về đúng giờ"
                    : "Ra về sớm"
                  : timeCheckout
                  ? isBeforeFive(timeCheckout, checkout_setting)
                    ? "Ra về đúng giờ"
                    : "Ra về sớm"
                  : ""}
              </Text>
            </View>
          </Animated.View>

          <View style={styles.totalAttend}>
            <View style={styles.view}>
              <View style={styles.attendTotal}>
                <Text allowFontScaling={false} style={styles.textTotalAttend}>
                  Tổng giờ làm
                </Text>
                <Text allowFontScaling={false} style={styles.countAttend}>
                  {userInfo?.userCheck === false
                    ? "8:0"
                    : totalHourAttend
                    ? totalHourAttend
                    : "--"}
                </Text>
              </View>
              <View style={styles.attendTotal}>
                <Text allowFontScaling={false} style={styles.textTotalAttend}>
                  Điểm công
                </Text>
                <Text allowFontScaling={false} style={styles.countAttend}>
                  {scoreAttend !== null || scoreAttend !== undefined
                    ? scoreAttend
                    : "--"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.list}>
          <View allowFontScaling={false} style={styles.titleHistory}>
            <Text allowFontScaling={false} style={{ fontSize: 20 }}>
              Lịch sử chấm công tuần
            </Text>
          </View>

          <ScrollView
            style={styles.listScroll}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          >
            {attendanceDates?.length > 0 ? (
              attendanceDates?.map((item, index) => {
                const checkinTime = item.checkin_time
                  ? new Date(item.checkin_time)
                  : null;
                const checkoutTime = item.checkout_time
                  ? new Date(item.checkout_time)
                  : null;
                let caculate = calculateDurationHistory(
                  item?.checkin_time,
                  item?.checkout_time
                );
                return (
                  <View key={index} style={styles.item}>
                    <View style={styles.childItem}>
                      <Text allowFontScaling={false} style={styles.dateAttend}>
                        {item.created_at
                          ? item?.date + "/" + item?.month + "/" + item?.year
                          : "Thứ năm, 25.10.2024"}
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
                                ? getHourMinuteFromSetting(checkin_setting)
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
                            item?.created_at,
                            checkout_setting
                          ) === true || userInfo?.userCheck === true ? (
                            <Text
                              allowFontScaling={false}
                              style={styles.timeIn}
                            >
                              {checkout_setting}
                            </Text>
                          ) : (
                            <Text
                              allowFontScaling={false}
                              style={
                                isSaturdayOrOutsideWorkingHours(
                                  timeCheckoutSetting,
                                  item?.created_at,
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
                                ? getHourMinuteFromSetting(checkin_setting)
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
                            item?.created_at,
                            checkout_setting
                          ) === true || userInfo?.userCheck === true ? (
                            <Text
                              allowFontScaling={false}
                              style={
                                isSaturdayOrOutsideWorkingHours(
                                  item?.checkout_time,
                                  item?.created_at,
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
                                  item?.created_at,
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
              })
            ) : (
              <Text allowFontScaling={false} style={styles.textNoHistory}>
                Chưa có lịch sử chấm công
              </Text>
            )}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    paddingTop: Platform.OS === "ios" ? 0 : 30,
  },
  header: {
    alignItems: "center",
    // flex: 1.5,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 10 : 20,
    paddingHorizontal: 10,
  },
  formImage: {
    padding: 2,
    // flex: 1.3,
    width: 70,
    height: 70,
  },
  image: {
    height: "100%",
    width: "100%",
    borderRadius: 50,
  },
  middle: {
    padding: 2,
    // flex: 4,
  },
  title: {
    width: 120,
    fontSize: 17,
    fontWeight: "500",
    flexWrap: "wrap",
  },
  dateTime: {
    color: "#9cafad",
  },
  action: {
    flexDirection: "row",
    display: "flex",
  },
  iconContainer: {
    width: 50, // Chiều rộng của vùng chứa biểu tượng
    height: 50, // Chiều cao của vùng chứa biểu tượng
    borderRadius: 30, // Đặt borderRadius bằng nửa chiều rộng/chiều cao
    backgroundColor: "#eaeaea", // Màu nền cho vùng chứa
    justifyContent: "center", // Căn giữa nội dung theo chiều dọc
    alignItems: "center", // Căn giữa nội dung theo chiều ngang
    marginLeft: Platform.OS === "ios" ? 16 : 10,
  },
  icon: {
    fontSize: 25,
    padding: 5,
  },
  content: {
    // flex: 7,
    padding: 2,
    marginTop: 10,
  },
  list: {
    paddingTop: 20,
    paddingHorizontal: 10,
    height: 600,
  },
  titleHistory: {
    marginBottom: 10,
    padding: Platform.OS === "ios" ? 2 : 5,
    fontSize: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  listScroll: {
    padding: 2,
    height: 350,
  },
  item: {
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
  time: {
    textAlign: "center",
    marginBottom: 10,
    marginTop: 10,
    fontSize: 25,
    color: "#27a745",
  },
  alert: {
    textAlign: "center",
    marginBottom: 10,
    marginTop: 10,
    color: "#b1b2b4",
  },
  totalAttend: {
    paddingHorizontal: 10,
  },
  view: {
    borderRadius: 10,
    backgroundColor: "#eaeef6",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  countAttend: {
    fontSize: 17,
    color: "#0056d2",
  },
  totalAttendTime: {
    fontSize: 25,
    color: "#0056d2",
  },
  dateAttend: {},
  totalDateAttend: {
    color: "#9cafad",
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
  },
  timeOutLate: {
    marginRight: 5,
    color: "red",
  },
  textNoHistory: {
    textAlign: "center",
    color: "gray",
  },
  attendTotal: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  textTotalAttend: {
    fontSize: 17,
    color: "#2e2a36",
    fontWeight: "300",
  },
  wrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  spinnerContainer: {
    zIndex: 0,
  },
});

export default HomeScreen;
