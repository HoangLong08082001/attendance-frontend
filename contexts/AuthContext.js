// src/context/AuthContext.js
import { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  approveResumeAdmin,
  cancelResume,
  changePasswordHandle,
  changeProfile,
  changeProfileAvatarAPI,
  checkInAPI,
  checkOutAPI,
  createCheckinApplication,
  createCheckoutApplication,
  createModeApplication,
  getAttendanceByUserAPI,
  getAttendanceToday,
  getLimitResumeCheckoutIn,
  getListNotification,
  getSettingTime,
  getTypeCategoryResume,
  getTypeModeApplication,
  getUserInfoAPI,
  HandleUpdateResumeOther,
  insertResume1,
  insertResume12,
  insertResume13,
  insertResume14,
  insertResume15,
  insertResume16,
  insertResume17,
  insertResume18,
  insertResume19,
  insertResume2,
  insertResume20,
  removeResume,
  resumeListForAdmin,
  resumeListForuser,
  seenNotification,
  StaffManage,
  updateResume1,
  updateResume12,
  updateResume13,
  updateResume14,
  updateResume15,
  updateResume16,
  updateResume17,
  updateResume18,
  updateResume19,
  updateResume2,
  updateResume20,
  updateResume3,
  updateResume4,
} from "../services/api";
import { Alert } from "react-native";
import { jwtDecode } from "jwt-decode";
import {
  calculateWorkingTime,
  convertTimeString,
  getCurrentTimeCheckInCheckOut,
  getDayName,
  formatDate,
  subtractTimeNew,
  subtractTimeResume,
  calculateWorkingTimeSaturday,
  subtractTimeNewSaturday,
  isSaturday,
  groupNotificationsByDate,
} from "../services/utils";
import * as ImagePicker from "expo-image-picker";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userToken, setUserToken] = useState("");
  const [timeCheckin, setTimeCheckIn] = useState("");
  const [fails, setFails] = useState(false);
  const [timeCheckout, setTimeCheckOut] = useState("");
  const [checkout, setCheckout] = useState("");
  const [text, setText] = useState("");
  const [alert, setAlert] = useState(false);
  const [Switch, setSwitch] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isLogout, setIsLogout] = useState(false);
  const [attendanceDates, setAttendanceDates] = useState([]);
  const [dateSuccess, setDateSuccesss] = useState([]);
  const [scoreAttend, setScoreAttend] = useState("");
  const [totalHourAttend, setTotalHourAttend] = useState("");
  const [timeCheckinApi, setTimeCheckinApi] = useState("");
  const [timeCheckoutApi, setTimeCheckoutApi] = useState("");
  const [isCheckin, setIsCheckin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resumeSuccess, setResumeSuccess] = useState(false);
  const [resumeRemoveSuccess, setResumeRemoveSuccess] = useState(false);
  const [resumeFails, setResumeFails] = useState(false);
  const [resumeLimitCheckIn, setResumeLimitCheckIn] = useState(null);
  const [resumeLimitCheckOut, setResumeLimitCheckOut] = useState(null);
  const [listTypeModeApplication, setListTypeModeApplication] = useState([]);
  const [listResumeApplication, setListResumeApplication] = useState([]);
  const [listResumeApplicationAdmin, setListResumeApplicationAdmin] = useState(
    []
  );
  const [errorLog, setErrorLog] = useState("");
  const [alertNetword, setAlertNetword] = useState(false);
  const [listModeResume, setListModeResume] = useState([]);
  const [changeSlogan, setChangeSlogan] = useState(false);
  const [changeSloganFail, setChangeSloganFail] = useState(false);
  const [userArray, setUserArray] = useState();
  const [isChangeSuccess, setIsChangeSuccess] = useState(false);
  const [isChangeFails, setIsChangeFails] = useState(false);
  const [listStaffManager, setListStaffManager] = useState([]);
  const [role, setRole] = useState(0);
  const [loadingScreen, setLoadingScreen] = useState(false);
  const [checkStatus, setCheckStatus] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
    id: "",
    avatar: "",
    email: "",
    birth: "",
    phone: "",
    sologan: "",
    created_at: "",
    current_resume: "",
    limit_resume_year: "",
    department: "",
    postion: "",
    manager: "",
    status: false,
    created_at: "",
    resumeSelect: false,
  });
  const [avatar, setAvatar] = useState(userInfo.avatar);
  const [statusImage, setStatusImage] = useState(false);
  const [notifySuccess, setNotifySuccess] = useState(false);
  const [notifyFails, setNotifyFails] = useState(false);
  const [slogan, setSlogan] = useState("");
  const [checkin_setting, setCheckinSetting] = useState("");
  const [checkout_setting, setCheckoutSetting] = useState("");
  const [leaveApplications, setLeaveApplications] = useState([]);
  const [isCheck, setIsCheck] = useState(0);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [typeResumeCategory, setTypeResumeCategory] = useState([]);
  const [loadingHome, setLoadingHome] = useState(true);
  //state resume
  const [exitsResume, setExitsResume] = useState(false);
  const [statusCheck, setStatusCheck] = useState(false);
  const [resumeSelect, setResumeSelect] = useState(null);
  const [listNotification, setListNotification] = useState([]);
  const [all, setAll] = useState(0);
  const [seen, setSeen] = useState(0);
  const [sending, setSending] = useState(0);
  const [statusNotify, setStatusNotify] = useState(false);
  const [isAnnual, setIsAnnual] = useState(false);
  // // // //console.log("time setting", checkin_setting, " ", checkout_setting);
  const login = async (token) => {
    setUserToken("");
    setIsLoggedIn(false);

    if (token) {
      await AsyncStorage.setItem("userToken", JSON.stringify(token));
      setIsLoggedIn(true);
      setUserToken(token.replace(/"/g, ""));
      setNotifySuccess(true);
      const decodedToken = jwtDecode(token);
      // console.log(decodedToken);
      setIsAnnual(decodedToken.is_annual);
      setCheckinSetting(decodedToken.checkin_setting);
      setCheckoutSetting(decodedToken.checkout_setting);
    } else {
      setNotifyFails(false);
    }
  };

  const checkIn = async (la, long) => {
    setStatusCheck(true);
    try {
      let token = userToken;

      if (!token) {
        //console.error("No token found");
        return; // Ngừng nếu không có token
      }
      const checkInResponse = await checkInAPI(token, la, long); // Gọi API check-in
      if (checkInResponse) {
        if (
          checkInResponse?.status === 200 ||
          checkInResponse?.status === 201
        ) {
          setSuccess(true);
          setSwitch(true);
          setTimeCheckIn(
            checkInResponse?.data?.time
              ? checkInResponse?.data?.time.toString()
              : ""
          );
          setTimeCheckinApi(getCurrentTimeCheckInCheckOut());
          setDateSuccesss((prev) => [
            ...(prev || []),
            {
              day: new Date().getDate(),
              month: new Date().getMonth() + 1,
              year: new Date().getFullYear(),
              time: `${getDayName()}, ${new Date().getDate()}.${
                new Date().getMonth() + 1
              }
              .${new Date().getFullYear()}`,
              checkin_time: checkInResponse?.data?.time
                ? checkInResponse?.data?.time.toString()
                : "",
            },
          ]);
          let today = new Date().getTime();
          setAttendanceDates((prev) => {
            const updatedRecords = [
              ...prev,
              {
                date: new Date().getDate(),
                month: new Date().getMonth() + 1,
                year: new Date().getFullYear(),
                created_at: today,
                checkin_time: checkInResponse?.data?.time,
              },
            ];
            return updatedRecords.sort(
              (a, b) => new Date(b.created_at) - new Date(a.created_at)
            );
          });
          setStatusCheck(false);
        } else {
          setSwitch(true);
          setText(checkInResponse.message);
          setFails(true);
          setStatusCheck(false);
        }
      }
    } catch (error) {
      setStatusCheck(false);
    }
  };

  const checkOut = async (la, long) => {
    setStatusCheck(true);
    try {
      let token = userToken;
      //  //// // //console.log(token);

      if (!token) {
        //console.error("No token found");
        return; // Ngừng nếu không có token
      }
      const checkOutResponse = await checkOutAPI(token, la, long); // Gọi API check-in

      if (
        checkOutResponse?.status === 200 ||
        checkOutResponse?.status === 201
      ) {
        if (new Date().getDay() === 6) {
          setSuccess(true);
          setSwitch(false);
          setTimeCheckOut(checkOutResponse?.data?.time);
          setScoreAttend(
            checkOutResponse?.data?.score === 1
              ? 1
              : Number(checkOutResponse?.data?.score)?.toFixed(3)
          );
          setTotalHourAttend(
            convertTimeString(checkOutResponse?.data?.scocetime) === "9:0"
              ? "8:00"
              : calculateWorkingTimeSaturday(
                  timeCheckin !== null ? timeCheckin : checkin_setting,
                  checkOutResponse?.data?.time !== null
                    ? checkOutResponse?.data?.time
                    : checkout_setting
                ) !== "4:00" && "4:00"
          );
          // //// // //console.log("checkin time log", timeCheckin);
          let today = new Date().getTime();
          setDateSuccesss((prev) =>
            prev.map((attend) => {
              return attend?.day === new Date().getDate() &&
                attend?.month === new Date().getMonth() + 1 &&
                attend?.year === new Date().getFullYear()
                ? {
                    ...attend,
                    checkout_time: checkOutResponse?.data?.time,
                    point_attandance: checkOutResponse?.data?.score
                      ? checkOutResponse?.data?.score === 1
                        ? 1
                        : Number(checkOutResponse?.data?.score)?.toFixed(3)
                      : "0",

                    total_time_working: subtractTimeNewSaturday(
                      checkOutResponse?.data?.time
                        ? checkOutResponse?.data?.time
                        : checkout_setting,
                      timeCheckin ? timeCheckin : checkin_setting
                    ),
                  }
                : attend;
            })
          );
          setAttendanceDates((prev) =>
            prev.map((attend, i) =>
              i === 0
                ? {
                    ...attend,
                    checkout_time: checkOutResponse?.data?.time,
                  }
                : attend
            )
          );
          setStatusCheck(false);
        } else {
          setSuccess(true);
          setSwitch(false);
          setTimeCheckOut(checkOutResponse?.data?.time);
          setScoreAttend(
            checkOutResponse?.data?.score === 1
              ? 1
              : Number(checkOutResponse?.data?.score)?.toFixed(3)
          );
          setTotalHourAttend(
            convertTimeString(checkOutResponse?.data?.scocetime) === "9:0"
              ? "8:00"
              : calculateWorkingTime(
                  timeCheckin !== null ? timeCheckin : checkin_setting,
                  checkOutResponse?.data?.time !== null
                    ? checkOutResponse?.data?.time
                    : checkout_setting
                )
          );
          // //// // //console.log("checkin time log", timeCheckin);
          let today = new Date().getTime();
          setDateSuccesss((prev) =>
            prev.map((attend) => {
              return attend?.day === new Date().getDate() &&
                attend?.month === new Date().getMonth() + 1 &&
                attend?.year === new Date().getFullYear()
                ? {
                    ...attend,
                    checkout_time: checkOutResponse?.data?.time,
                    point_attandance: checkOutResponse?.data?.score
                      ? checkOutResponse?.data?.score === 1
                        ? 1
                        : Number(checkOutResponse?.data?.score)?.toFixed(3)
                      : "0",

                    total_time_working: subtractTimeNew(
                      checkOutResponse?.data?.time
                        ? checkOutResponse?.data?.time
                        : checkout_setting,
                      timeCheckin ? timeCheckin : checkin_setting
                    ),
                  }
                : attend;
            })
          );
          setAttendanceDates((prev) =>
            prev.map((attend, i) =>
              i === 0
                ? {
                    ...attend,
                    checkout_time: checkOutResponse?.data?.time,
                  }
                : attend
            )
          );
          setStatusCheck(false);
        }
      } else {
        setSuccess(false);
        setSwitch(true);
        setText(checkOutResponse?.data?.message);
        setFails(true);
        setStatusCheck(false);
      }
    } catch (error) {
      setSuccess(false);
      setStatusCheck(false);
    }
  };
  const loadToken = async () => {
    let token = await AsyncStorage.getItem("userToken");
    if (token) {
      // console.log(token);
      // // // //console.log("token load:", token.replace(/"/g, "").toString());
      const decodedToken = jwtDecode(token);
      const expirationTime = decodedToken.exp * 1000; // Chuyển sang milliseconds
      const currentTime = Date.now();
      setResumeSelect(decodedToken.resume_select);
      setRole(decodedToken.userRole);
      if (currentTime < expirationTime) {
        setIsLoggedIn(true);
        setUserToken(token.replace(/"/g, "").toString());
        setIsAnnual(decodedToken.is_annual);
        setCheckinSetting(decodedToken.checkin_setting);
        setCheckoutSetting(decodedToken.checkout_setting);
      } else {
        await AsyncStorage.removeItem("userToken");
        setUserToken("");
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  };

  const AttendanceByUser = async () => {
    try {
      let userInfo = await getUserInfoAPI();
      // const attendanceByUserResponse = await getAttendanceByUserAPI(); // Gọi API check-in
      let attendanceByUserResponse = await getAttendanceByUserAPI(); // Gọi API check-in

      let attendToday = attendanceByUserResponse.attendance_today;

      if (attendanceByUserResponse.attendance) {
        const sortedData = attendanceByUserResponse?.attendance.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setAttendanceDates(sortedData); // Lưu vào stat
        if (userInfo?.attendance[0]?.auto_check === true) {
          let createdAtArray = attendanceByUserResponse.attendance.map(
            (item) => {
              if (
                item?.checkin_time === null &&
                item?.checkout_time === null &&
                item?.point_attandance === 1
              ) {
                return {
                  day: item?.date ? item?.date : "0",
                  month: item?.month ? item?.month : "0",
                  year: item?.year ? item?.year : "0",
                  time: formatDate(
                    `${item?.date}-${item?.month}-${item?.year}`
                  ),
                  checkin_time: checkin_setting,
                  checkout_time: checkout_setting,
                  point_attandance: item?.point_attandance
                    ? item?.point_attandance
                    : "0",
                  total_time_working:
                    isSaturday(item?.created_at) === true
                      ? subtractTimeNewSaturday("12:00:00", checkin_setting)
                      : subtractTimeNew(checkout_setting, checkin_setting),
                };
              } else {
                return {
                  day: item?.date ? item?.date : "0",
                  month: item?.month ? item?.month : "0",
                  year: item?.year ? item?.year : "0",
                  time: formatDate(
                    `${item?.date}-${item?.month}-${item?.year}`
                  ),
                  checkin_time:
                    item?.checkin_time !== null ? item?.checkin_time : "",
                  checkout_time:
                    item?.checkout_time !== null ? item?.checkout_time : "",
                  point_attandance: item?.point_attandance
                    ? item?.point_attandance
                    : "0",
                  total_time_working:
                    item?.checkout_time !== null && item?.checkin_time !== null
                      ? isSaturday(item?.created_at) === true
                        ? subtractTimeNewSaturday(
                            item?.checkout_time !== null
                              ? item?.checkout_time
                              : "00:00:00",
                            item?.checkin_time !== null
                              ? item?.checkin_time
                              : "00:00:00"
                          )
                        : subtractTimeNew(
                            item?.checkout_time !== null
                              ? item?.checkout_time
                              : "00:00:00",
                            item?.checkin_time !== null
                              ? item?.checkin_time
                              : "00:00:00"
                          )
                      : 0,
                };
              }
            }
          );
          setDateSuccesss(createdAtArray);
        } else {
          let responseSetting = await getSettingTime();
          let checkinSetting =
            responseSetting?.data?.setting_time[0].checkin_time;
          let checkoutSetting =
            responseSetting?.data?.setting_time[0].checkout_time;
          let createdAtArray = attendanceByUserResponse?.attendance?.map(
            (item) => {
              return {
                day: item?.date ? item?.date : "0",
                month: item?.month ? item?.month : "0",
                year: item?.year ? item?.year : "0",
                time: formatDate(`${item?.date}-${item?.month}-${item?.year}`),
                checkin_time:
                  // item?.checkin_time !== null
                  //   ? item?.checkin_time
                  //   : checkin_setting,
                  checkinSetting,
                checkout_time:
                  // item?.checkout_time !== null
                  //   ? item?.checkout_time
                  //   : checkout_setting,
                  checkoutSetting,
                point_attandance: item?.point_attandance
                  ? item?.point_attandance
                  : "0",
                total_time_working:
                  item?.checkin_time === null && item?.checkout_time === null
                    ? isSaturday(item?.created_at)
                      ? subtractTimeNewSaturday(checkoutSetting, checkinSetting)
                      : subtractTimeNew(checkoutSetting, checkinSetting)
                    : 0,
              };
            }
          );
          // // // //console.log("data map 123:", createdAtArray);
          setDateSuccesss(createdAtArray);
        }
      }
    } catch (error) {
      setAlertNetword(true);
    }
  };
  // // // //console.log("check authContext:", dateSuccess);
  const AttendenceToday = async () => {
    try {
      setLoadingHome(true);
      setLoadingScreen(true);
      const api = await getAttendanceToday();
      let response2 = api.setting_time;
      let attendanceToday = api.attendance_today;
      if (attendanceToday) {
        setLoadingHome(false);
        if (attendanceToday?.user[0]?.auto_check === true) {
          if (
            attendanceToday?.attendanceRecords[0]?.checkin_time === null &&
            attendanceToday?.attendanceRecords[0]?.checkout_time === null &&
            attendanceToday?.attendanceRecords[0]?.point_attandance === 1
          ) {
            setLoadingScreen(false);
            setTimeCheckIn(response2?.setting_time[0]?.checkin_time);
            setTimeCheckOut(response2?.setting_time[0]?.checkout_time);
            setScoreAttend(
              attendanceToday.attendanceRecords[0]?.point_attandance
            );
            setTotalHourAttend("08:00");
          } else {
            setLoadingScreen(false);
            setTimeCheckIn(
              attendanceToday?.attendanceWithDuration[0]?.checkin_time
            );
            setTimeCheckOut(
              attendanceToday.attendanceWithDuration[0].checkout_time
            );
            let caculate2 = convertTimeString(attendanceToday.scocetime);

            setScoreAttend(
              attendanceToday.attendanceWithDuration[0].point_attandance
            );
            setTotalHourAttend(caculate2);
          }
        } else {
          setLoadingScreen(false);
          setTimeCheckIn(response2?.setting_time[0]?.checkin_time);
          setTimeCheckOut(response2?.setting_time[0]?.checkout_time);
          let caculate2 = convertTimeString(attendanceToday.scocetime);
          setScoreAttend(
            attendanceToday.attendanceWithDuration[0].point_attandance
          );
          setTotalHourAttend(caculate2);
        }
      } else {
        setLoadingHome(true);
        setLoadingScreen(false);
      }
    } catch (error) {
      setLoadingHome(true);
      setLoadingScreen(false);
      setLoading(false);
    }
  };

  const logout = async () => {
    setIsLogout(true);
    setUserToken("");
    setTimeCheckIn("");
    setTimeCheckOut("");
    setScoreAttend(0);
    setUserInfo({
      name: "",
      id: "",
      avatar: "",
      email: "",
      birth: "",
      phone: "",
      sologan: "",
      created_at: "",
      current_resume: "",
      limit_resume_year: "",
      department: "",
      postion: "",
      manager: "",
      status: false,
      created_at: "",
      resumeSelect: false,
    });
    setTotalHourAttend("");
    setAttendanceDates([]);
    setDateSuccesss([]);
    setListResumeApplication([]);
    setCheckinSetting("");
    setCheckoutSetting("");
    setIsAnnual(false);
    setListNotification([]);
    setAll(0);
    setSeen(0);
    setSending(0);
    setRole(0);
    await AsyncStorage.removeItem("userToken");
    //await AsyncStorage.removeItem("avatar");
    let token = AsyncStorage.getItem("userToken");
    //// // //console.log(token);
    setIsLoggedIn(false);
    setResumeSelect(null);
  };

  const loadUserInfo = async () => {
    try {
      const info = await getUserInfoAPI();
      // console.log(info);
      if (info) {
        setUserInfo({
          name: info?.attendance[0]?.name,
          id_staff: info?.attendance[0]?.id_staff,
          avatar: info?.attendance[0]?.avatar,
          email: info?.attendance[0]?.email,
          birth: info?.attendance[0]?.birth,
          phone: info?.attendance[0]?.phone,
          slogan: info?.attendance[0]?.sologan,
          created_at: info?.attendance[0]?.created_at,
          current_resume: info?.attendance[0]?.current_resume,
          limit_resume_year: info?.attendance[0]?.limit_resume_year,
          department: info?.attendance[0]?.department,
          postion: info?.attendance[0]?.position,
          manager: info?.attendance[0]?.manager,
          status: info?.attendance[0]?.status,
          userCheck: info?.attendance[0]?.auto_check,
          resumeSelect: info?.role[0]?.resume_select,
        });
        setIsAnnual(info?.attendance[0]?.isAnnual);
        setCheckinSetting(info?.time_settings?.checkin_time);
        setCheckoutSetting(info?.time_settings?.checkout_time);
        setUserArray(info?.attendance[0]);
      }
    } catch (error) {}
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Cần quyền truy cập thư viện ảnh!");
      //return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      base64: true,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (pickerResult.canceled) {
      // //// // //console.log("Người dùng đã hủy chọn ảnh");
      return;
    }

    const selectedImageBase64 = pickerResult.assets[0].base64;
    // //// // //console.log("base64: ", selectedImageBase64);

    const imageSizeInMB =
      (selectedImageBase64.length * (3 / 4)) / (1024 * 1024); // Chuyển đổi từ base64 sang MB
    // //// // //console.log("imageSizeInMB: ", imageSizeInMB);

    if (imageSizeInMB > 20) {
      setStatusImage(true);
      //  //// // //console.log("Kích thước ảnh lớn hơn 20 MB:", imageSizeInMB, "MB");
    } else {
      setAvatar(selectedImageBase64);
      await changeProfileAvatarAPI(selectedImageBase64);
      await AsyncStorage.setItem("avatar", selectedImageBase64);
      //await AsyncStorage.removeItem('avatar', selectedImageBase64);
      setStatusImage(false);
    }

    //setUserInfo((prev) => ({ ...prev, avatar: selectedImageBase64 }));
  };

  const loadAvatar = async () => {
    const savedAvatar = await AsyncStorage.getItem("avatar");
    if (savedAvatar) {
      setAvatar(savedAvatar);
    }
  };

  const changeUserProfile = async (name, sologan) => {
    try {
      // Gọi API thay đổi thông tin người dùng
      const response = await changeProfile(name, sologan);
      if (response?.message === "Profile updated successfully") {
        setChangeSlogan(true);
        if (slogan) {
          setSlogan(sologan);
        }
        setUserInfo((prev) => ({ ...prev, name, sologan }));
        // //// // //console.log(sologan);
      } else {
        setChangeSlogan(false);
        setChangeSloganFail(true);
      }
    } catch (error) {
      setChangeSlogan(false);
      setChangeSloganFail(true);
    }
  };

  //đơn nghỉ phép
  const handleInsertResume1 = async (dateStart, dateEnd, description) => {
    try {
      setLoading(true);
      let response = await insertResume1(dateStart, dateEnd, description); // Gọi API
      // // // //console.log(response.data);
      if (response?.status === 200 || response?.status === 201) {
        if (userInfo) {
          setListResumeApplication((prev) => [
            ...(prev || []), // Nếu prev là undefined, khởi tạo với mảng trống
            {
              id_resume: Number(response?.data[0]?.resume_id),
              id_staff: userInfo?.id_staff,
              setting_resume: {
                id_setting_resume: 1,
                name_setting_resume: "Đơn nghỉ phép",
              },
              date_start: dateStart,
              date_end: dateEnd,
              time_start: null,
              time_end: null,
              description: description,
              created_at: new Date(),
              id_setting_resume: 1,
              created_at: new Date(),
              status_resume: {
                name_status: "Đang chờ duyệt",
                id_status_resume: 1,
              },
              staff: {
                manager: userInfo?.manager,
                name: userInfo?.name,
                department: userInfo?.department,
                position: userInfo?.postion,
              },
            },
          ]);
          setResumeSuccess(true);
          setLoading(false);
        }
      } else if (response?.status === 500 && response.data.message) {
        setResumeFails(true);
        setLoading(false);
      } else if (response?.status === 400 && response.data.message) {
        setResumeFails(false);
        setExitsResume(true);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };
  //đơn công tác nhiều ngày
  const handleInsertResume20 = async (dateStart, dateEnd, description) => {
    try {
      setLoading(true);
      let response = await insertResume20(dateStart, dateEnd, description); // Gọi API

      if (response?.status === 200 || response?.status === 201) {
        if (userInfo) {
          setListResumeApplication((prev) => [
            ...(prev || []), // Nếu prev là undefined, khởi tạo với mảng trống
            {
              id_resume: response?.data?.resumeId,
              id_staff: userInfo?.id_staff,
              setting_resume: {
                id_setting_resume: 20,
                name_setting_resume: "Đơn công tác nhiều ngày",
              },
              date_start: dateStart,
              date_end: dateEnd,
              time_start: null,
              time_end: null,
              description: description,
              created_at: new Date(),
              id_setting_resume: 20,
              created_at: new Date(),
              status_resume: {
                name_status: "Đang chờ duyệt",
                id_status_resume: 1,
              },
              staff: {
                manager: userInfo?.manager,
                name: userInfo?.name,
                department: userInfo?.department,
                position: userInfo?.postion,
              },
            },
          ]);
          setResumeSuccess(true);
          setLoading(false);
        }
      } else if (response?.status === 500 && response.data.message) {
        setResumeFails(true);
        setLoading(false);
      } else if (response?.status === 400 && response.data.message) {
        setResumeFails(false);
        setExitsResume(true);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };
  //đơn công tác
  const handleInsertResume2 = async (
    dateStart,
    dateEnd,
    description,
    starttime,
    endtime
  ) => {
    // Kiểm tra nếu thiếu thông tin

    try {
      setLoading(true);
      const response = await insertResume2(
        dateStart,
        dateEnd,
        description,
        starttime,
        endtime
      );
      if (response?.status === 200 || response?.status === 201) {
        setResumeSuccess(true);
        setListResumeApplication((prev) => [
          ...(prev || []), // Nếu prev là undefined, khởi tạo với mảng trống
          {
            id_resume: response?.data?.resumeId,
            id_staff: userInfo?.id_staff,
            setting_resume: {
              id_setting_resume: 2,
              name_setting_resume: "Đơn công tác",
            },
            date_start: dateStart,
            date_end: dateEnd,
            time_start: starttime,
            time_end: endtime,
            description: description,
            created_at: new Date(),
            id_setting_resume: 2,
            status_resume: {
              name_status: "Đang chờ duyệt",
              id_status_resume: 1,
            },
            staff: {
              manager: userInfo?.manager,
              name: userInfo?.name,
              department: userInfo?.department,
              position: userInfo?.postion,
            },
          },
        ]);
        setLoading(false);
      } else if (response?.status === 500 && response.data.message) {
        setResumeFails(true);
        setLoading(false);
      } else if (response?.status === 400 && response.data.message) {
        setResumeFails(false);
        setExitsResume(true);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  //đơn nghỉ dài hạn
  const handleInsertResume12 = async (dateStart, dateEnd, description) => {
    // Kiểm tra nếu thiếu thông tin
    try {
      setLoading(true);
      const response = await insertResume12(dateStart, dateEnd, description); // Gọi API

      if (response?.status === 200 || response?.status === 201) {
        setResumeSuccess(true);

        setListResumeApplication((prev) => [
          ...(prev || []), // Nếu prev là undefined, khởi tạo với mảng trống
          {
            id_resume: response?.data?.resumeId,
            id_staff: userInfo?.id_staff,
            setting_resume: {
              id_setting_resume: 12,
              name_setting_resume: "Đơn nghỉ dài hạn",
            },
            date_start: dateStart,
            date_end: dateEnd,
            description: description,
            created_at: new Date(),
            id_setting_resume: 1,
            status_resume: {
              name_status: "Đang chờ duyệt",
              id_status_resume: 1,
            },
            staff: {
              manager: userInfo?.manager,
              name: userInfo?.name,
              department: userInfo?.department,
              position: userInfo?.postion,
            },
          },
        ]);
        setLoading(false);
      } else if (response?.status === 400 && response.data.message) {
        setResumeFails(false);
        setExitsResume(true);
        setLoading(false);
      } else if (response?.status === 500 && response.data.message) {
        setResumeFails(true);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  //đơn thôi việc
  const handleInsertResume13 = async (dateStart, description) => {
    try {
      setLoading(true);
      const response = await insertResume13(dateStart, description);

      if (response.status === 200 || response.status === 201) {
        setResumeSuccess(true);
        setListResumeApplication((prev) => [
          ...(prev || []), // Nếu prev là undefined, khởi tạo với mảng trống
          {
            id_resume: response?.data?.resumeId,
            id_staff: userInfo?.id_staff,
            setting_resume: {
              id_setting_resume: 13,
              name_setting_resume: "Đơn thôi việc",
            },
            date_start: dateStart,
            date_end: dateStart,
            description: description,
            created_at: new Date(),
            id_setting_resume: 1,
            status_resume: {
              name_status: "Đang chờ duyệt",
              id_status_resume: 1,
            },
            staff: {
              manager: userInfo?.manager,
              name: userInfo?.name,
              department: userInfo?.department,
              position: userInfo?.postion,
            },
          },
        ]);
        setLoading(false);
      } else if (response.status === 400 && response.data.message) {
        setResumeFails(false);
        setExitsResume(true);
        setLoading(false);
      } else if (response.status === 500 && response.data.message) {
        setResumeFails(true);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const getLimitResume = async () => {
    try {
      setLoading(true);
      const responseLimitResume = await getLimitResumeCheckoutIn();
      if (responseLimitResume) {
        setResumeLimitCheckIn(responseLimitResume?.response1[0]?.limit_resume);
        setResumeLimitCheckOut(responseLimitResume?.response2[0]?.limit_resume);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  //Đơn checkin
  const handleCreateCheckinApplication = async (
    dateStart,
    dateEnd,
    description
  ) => {
    try {
      setLoading(true);
      // //// // //console.log(dateStart, dateEnd, description);
      const checkInResponse = await createCheckinApplication(
        dateStart,
        dateEnd,
        description
      ); // Gọi API check-in
      if (checkInResponse?.status === 200 || checkInResponse?.status === 201) {
        setResumeSuccess(true);
        setListResumeApplication((prev) => [
          ...(prev || []), // Nếu prev là undefined, khởi tạo với mảng trống
          {
            id_resume: checkInResponse?.data?.resumeId,
            id_staff: userInfo?.id_staff,
            setting_resume: {
              id_setting_resume: 3,
              name_setting_resume: "Đơn chấm công check in",
            },
            date_start: dateStart,
            date_end: dateEnd,
            description: description,
            created_at: new Date(),
            id_setting_resume: 1,
            status_resume: {
              name_status: "Đang chờ duyệt",
              id_status_resume: 1,
            },
            staff: {
              manager: userInfo?.manager,
              name: userInfo?.name,
              department: userInfo?.department,
              position: userInfo?.postion,
            },
          },
        ]);

        setLoading(false);
      } else if (
        checkInResponse?.status === 500 &&
        checkInResponse.data.message
      ) {
        setResumeFails(true);
        setLoading(false);
      } else if (
        checkInResponse?.status === 400 &&
        checkInResponse.data.message
      ) {
        setResumeFails(false);
        setExitsResume(true);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  //Đơn checkout
  const handleCreateCheckoutApplication = async (
    dateStart,
    dateEnd,
    description
  ) => {
    try {
      setLoading(true);

      const checkInResponse = await createCheckoutApplication(
        dateStart,
        dateEnd,
        description
      ); // Gọi API check-in
      setLoading(false);
      if (checkInResponse?.status === 200 || checkInResponse?.status === 201) {
        setResumeSuccess(true);

        setListResumeApplication((prev) => [
          ...(prev || []), // Nếu prev là undefined, khởi tạo với mảng trống
          {
            id_resume: checkInResponse?.data?.resumeId,
            id_staff: userInfo?.id_staff,
            setting_resume: {
              id_setting_resume: 4,
              name_setting_resume: "Đơn chấm công check out",
            },
            date_start: dateStart,
            date_end: dateEnd,
            description: description,
            created_at: new Date(),
            id_setting_resume: 1,
            status_resume: {
              name_status: "Đang chờ duyệt",
              id_status_resume: 1,
            },
            staff: {
              manager: userInfo?.manager,
              name: userInfo?.name,
              department: userInfo?.department,
              position: userInfo?.postion,
            },
          },
        ]);
      } else if (
        checkInResponse?.status === 400 &&
        checkInResponse.data.message
      ) {
        setResumeFails(false);
        setExitsResume(true);
        setLoading(false);
      } else if (
        checkInResponse?.status === 500 &&
        checkInResponse.data.message
      ) {
        setResumeFails(true);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };
  const getTypeOfModeResume = async () => {
    try {
      setLoading(true);

      const typesModeApplication = await getTypeModeApplication();
      if (typesModeApplication) {
        if (typesModeApplication) {
          let newData = typesModeApplication?.data?.resume
            ?.filter((item) => [6, 8, 11].includes(item.id_setting_resume)) // Lọc các phần tử có id_setting_resume là 6, 8 hoặc 11
            .map((item) => {
              // Logic xử lý cho các phần tử đã lọc
              switch (item.id_setting_resume) {
                case 6:
                case 8:
                case 11:
                  item.time_start =
                    item?.starttime !== null
                      ? subtractTimeResume(item?.starttime, checkin_setting)
                      : "";
                  item.time_end =
                    item?.endtime !== null
                      ? subtractTimeResume(checkout_setting, item?.endtime)
                      : "";
                  break;

                default:
                  item.description = "Chưa có mô tả";
              }

              return { ...item }; // Trả về một bản sao mới của đối tượng, tránh thay đổi trực tiếp mảng gốc
            });
          setListTypeModeApplication(newData);
          setLoading(false);
        } else {
          setText(checkInResponse.message);
          setLoading(false);
        }
      }
    } catch (error) {
      setLoading(false);
    }
  };

  //Đơn chế độ
  const handleCreateModeResumeApplication = async (
    resumeId,
    nameResume,
    dateStart,
    dateEnd,
    description
  ) => {
    try {
      setLoading(true);
      const responseApplication = await createModeApplication(
        resumeId,
        dateStart,
        dateEnd,
        description
      );
      if (
        responseApplication?.status === 200 ||
        responseApplication?.status === 201
      ) {
        setLoading(false);
        setResumeSuccess(true);
        setListResumeApplication((prev) => [
          ...(prev || []), // Nếu prev là undefined, khởi tạo với mảng trống
          {
            id_resume: responseApplication?.data?.resumeId,
            id_staff: userInfo?.id_staff,
            setting_resume: {
              id_setting_resume: resumeId,
              name_setting_resume: nameResume,
            },
            date_start: dateStart,
            date_end: dateEnd,
            description: description,
            created_at: new Date(),
            status_resume: {
              name_status: "Đang chờ duyệt",
              id_status_resume: 1,
            },
            staff: {
              manager: userInfo?.manager,
              name: userInfo?.name,
              department: userInfo?.department,
              position: userInfo?.postion,
            },
          },
        ]);
      } else if (responseApplication?.status === 400) {
        setExitsResume(true);
        setLoading(false);
      } else if (
        responseApplication?.status === 500 &&
        responseApplication.data.message
      ) {
        setResumeFails(true);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  //đơn vắng mặt theo giờ
  const handleInsertResume15 = async (
    dateStart,
    dateEnd,
    description,
    starttime,
    endtime
  ) => {
    // Kiểm tra nếu thiếu thông tin

    try {
      setLoading(true);
      const response = await insertResume15(
        dateStart,
        dateEnd,
        description,
        starttime,
        endtime
      );
      if (response?.status === 200 || response?.status === 201) {
        setResumeSuccess(true);
        setListResumeApplication((prev) => [
          ...(prev || []), // Nếu prev là undefined, khởi tạo với mảng trống
          {
            id_resume: response?.data?.resumeId,
            id_staff: userInfo?.id_staff,
            setting_resume: {
              id_setting_resume: 15,
              name_setting_resume: "Đơn vắng mặt theo giờ",
            },
            date_start: dateStart,
            date_end: dateEnd,
            time_start: starttime,
            time_end: endtime,
            description: description,
            created_at: new Date(),
            id_setting_resume: 15,
            status_resume: {
              name_status: "Đang chờ duyệt",
              id_status_resume: 1,
            },
            staff: {
              manager: userInfo?.manager,
              name: userInfo?.name,
              department: userInfo?.department,
              position: userInfo?.postion,
            },
          },
        ]);
        setLoading(false);
      } else if (response?.status === 400 && response.data.message) {
        setResumeFails(false);
        setExitsResume(true);
        setLoading(false);
      } else if (response?.status === 500 && response.data.message) {
        setResumeFails(true);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  //đơn nghỉ không dùng phép
  const handleInsertResume16 = async (
    dateStart,
    dateEnd,
    description,
    starttime,
    endtime
  ) => {
    // Kiểm tra nếu thiếu thông tin
    try {
      setLoading(true);
      const response = await insertResume16(
        dateStart,
        dateEnd,
        description,
        starttime,
        endtime
      ); // Gọi API

      if (response?.status === 200 || response?.status === 201) {
        setResumeSuccess(true);

        setListResumeApplication((prev) => [
          ...(prev || []), // Nếu prev là undefined, khởi tạo với mảng trống
          {
            id_resume: response?.data?.resumeId,
            id_staff: userInfo?.id_staff,
            setting_resume: {
              id_setting_resume: 16,
              name_setting_resume: "Đơn nghỉ phép không lương",
            },
            date_start: dateStart,
            date_end: dateEnd,
            time_start: starttime,
            time_end: endtime,
            description: description,
            created_at: new Date(),
            id_setting_resume: 16,
            status_resume: {
              name_status: "Đang chờ duyệt",
              id_status_resume: 1,
            },
            staff: {
              manager: userInfo?.manager,
              name: userInfo?.name,
              department: userInfo?.department,
              position: userInfo?.postion,
            },
          },
        ]);
        setLoading(false);
      } else if (response?.status === 400 && response.data.message) {
        setResumeFails(false);
        setExitsResume(true);
        setLoading(false);
      } else if (response?.status === 500 && response.data.message) {
        setResumeFails(true);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  //đơn 17
  const handleInsertResume17 = async (
    dateStart,
    dateEnd,
    description,
    starttime,
    endtime
  ) => {
    // Kiểm tra nếu thiếu thông tin
    try {
      setLoading(true);
      const response = await insertResume17(
        dateStart,
        dateEnd,
        description,
        starttime
      ); // Gọi API

      if (response?.status === 200 || response?.status === 201) {
        setResumeSuccess(true);

        setListResumeApplication((prev) => [
          ...(prev || []), // Nếu prev là undefined, khởi tạo với mảng trống
          {
            id_resume: response?.data?.resumeId,
            id_staff: userInfo?.id_staff,
            setting_resume: {
              id_setting_resume: 17,
              name_setting_resume: "Đơn xin về sớm ( không tính lương )",
            },
            date_start: dateStart,
            date_end: dateEnd,
            time_start: starttime,
            time_end: endtime,
            description: description,
            created_at: new Date(),
            id_setting_resume: 17,
            status_resume: {
              name_status: "Đang chờ duyệt",
              id_status_resume: 1,
            },
            staff: {
              manager: userInfo?.manager,
              name: userInfo?.name,
              department: userInfo?.department,
              position: userInfo?.postion,
            },
          },
        ]);
        setLoading(false);
      } else if (response?.status === 400 && response.data.message) {
        setResumeFails(false);
        setExitsResume(true);
        setLoading(false);
      } else if (response?.status === 500 && response.data.message) {
        setResumeFails(true);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  //đơn 18
  const handleInsertResume18 = async (
    dateStart,
    dateEnd,
    description,
    starttime,
    endtime
  ) => {
    // Kiểm tra nếu thiếu thông tin
    try {
      setLoading(true);
      const response = await insertResume18(
        dateStart,
        dateEnd,
        description,
        starttime,
        endtime
      ); // Gọi API

      if (response?.status === 200 || response?.status === 201) {
        setResumeSuccess(true);

        setListResumeApplication((prev) => [
          ...(prev || []), // Nếu prev là undefined, khởi tạo với mảng trống
          {
            id_resume: response?.data?.resumeId,
            id_staff: userInfo?.id_staff,
            setting_resume: {
              id_setting_resume: 18,
              name_setting_resume: "Đơn nghỉ theo giờ không lương",
            },
            date_start: dateStart,
            date_end: dateEnd,
            time_start: starttime,
            time_end: endtime,
            description: description,
            created_at: new Date(),
            id_setting_resume: 18,
            status_resume: {
              name_status: "Đang chờ duyệt",
              id_status_resume: 1,
            },
            staff: {
              manager: userInfo?.manager,
              name: userInfo?.name,
              department: userInfo?.department,
              position: userInfo?.postion,
            },
          },
        ]);
        setLoading(false);
      } else if (response?.status === 400 && response.data.message) {
        setResumeFails(false);
        setExitsResume(true);
        setLoading(false);
      } else if (response?.status === 500 && response.data.message) {
        setResumeFails(true);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  //đơn 19
  const handleInsertResume19 = async (
    dateStart,
    dateEnd,
    description,
    starttime,
    endtime
  ) => {
    // Kiểm tra nếu thiếu thông tin
    try {
      setLoading(true);
      const response = await insertResume19(
        dateStart,
        dateEnd,
        description,
        endtime
      ); // Gọi API

      if (response?.status === 200 || response?.status === 201) {
        setResumeSuccess(true);

        setListResumeApplication((prev) => [
          ...(prev || []), // Nếu prev là undefined, khởi tạo với mảng trống
          {
            id_resume: response?.data?.resumeId,
            id_staff: userInfo?.id_staff,
            setting_resume: {
              id_setting_resume: 19,
              name_setting_resume: "Đơn xin đi trễ",
            },
            date_start: dateStart,
            date_end: dateEnd,
            time_start: starttime,
            time_end: endtime,
            description: description,
            created_at: new Date(),
            id_setting_resume: 19,
            status_resume: {
              name_status: "Đang chờ duyệt",
              id_status_resume: 1,
            },
            staff: {
              manager: userInfo?.manager,
              name: userInfo?.name,
              department: userInfo?.department,
              position: userInfo?.postion,
            },
          },
        ]);
        setLoading(false);
      } else if (response?.status === 400 && response.data.message) {
        setResumeFails(false);
        setExitsResume(true);
        setLoading(false);
      } else if (response?.status === 500 && response.data.message) {
        setResumeFails(true);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  //đơn nghỉ hiếu hỉ
  const handleInsertResume14 = async (dateStart, dateEnd, description) => {
    // Kiểm tra nếu thiếu thông tin
    try {
      setLoading(true);
      const response = await insertResume14(dateStart, dateEnd, description); // Gọi API

      if (response?.status === 200 || response?.status === 201) {
        setResumeSuccess(true);

        setListResumeApplication((prev) => [
          ...(prev || []), // Nếu prev là undefined, khởi tạo với mảng trống
          {
            id_resume: response?.data?.resumeId,
            id_staff: userInfo?.id_staff,
            setting_resume: {
              id_setting_resume: 14,
              name_setting_resume: "Đơn hiếu hỉ",
            },
            date_start: dateStart,
            date_end: dateEnd,
            description: description,
            created_at: new Date(),
            id_setting_resume: 14,
            status_resume: {
              name_status: "Đang chờ duyệt",
              id_status_resume: 1,
            },
            staff: {
              manager: userInfo?.manager,
              name: userInfo?.name,
              department: userInfo?.department,
              position: userInfo?.postion,
            },
          },
        ]);
        setLoading(false);
      } else if (response?.status === 400 && response.data.message) {
        setResumeFails(false);
        setExitsResume(true);
        setLoading(false);
      } else if (response?.status === 500 && response.data.message) {
        setResumeFails(true);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const checkLogin = async () => {
    let token = await AsyncStorage.getItem("userToken");
    if (token) {
      setUserToken(token.replace(/"/g, "").toString());
      setIsLoggedIn(true);
    } else {
      setUserToken("");
      setIsLoggedIn(false);
    }
  };
  const getListResumeApplication = async () => {
    try {
      let responseResumeList = await resumeListForuser();
      if (responseResumeList) {
        setListResumeApplication(responseResumeList?.resume);
      } else {
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const getListResumeApplicationAdmin = async () => {
    try {
      setLoading(true);
      let responseResumeList = await resumeListForAdmin();

      if (responseResumeList) {
        let newArray = responseResumeList?.resume.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setLoading(false);
        setListResumeApplicationAdmin(newArray);
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };
  const getListModeResume = async () => {
    try {
      setLoading(true);
      let responseResumeList = await getTypeModeApplication();

      if (responseResumeList) {
        setListModeResume(responseResumeList?.data?.resume);
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const getListStaffManager = async () => {
    try {
      setLoading(true);
      let responseResumeList = await StaffManage();
      // //// // //console.log("responseResumeList: ", responseResumeList);

      if (responseResumeList) {
        setLoading(false);
        setListStaffManager(responseResumeList?.data);
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };
  // const handleGetSettingTime = async () => {
  //   try {
  //     let response = await getSettingTime();
  //     if (response) {
  //       let checkinSetting = response?.data?.setting_time[0].checkin_time;

  //       let checkoutSetting = response?.data?.setting_time[0].checkout_time;
  //       setCheckinSetting(checkinSetting);
  //       setCheckoutSetting(checkoutSetting);
  //     }
  //   } catch (error) {
  //     setLoading(false);
  //   }
  // };

  //duyệt đơn
  const approveAdmin = async (resumeId, id_setting_resume) => {
    try {
      setLoading(true);
      let response = approveResumeAdmin(resumeId, id_setting_resume); // Gọi API
      if (response) {
        setLoading(false);
        if (response) {
          setResumeSuccess(true);
          setListResumeApplicationAdmin((prev) => {
            return prev.map((resume, i) =>
              resume?.id_resume === resumeId
                ? {
                    ...resume,
                    status_resume: {
                      name_status: "Duyệt",
                      id_status_resume: 2,
                    },
                  }
                : resume
            );
          });
          setResumeSuccess(true);
        } else {
          setLoading(false);
          setResumeFails(true);
        }
      }
    } catch (error) {
      setLoading(false);
      setResumeFails(true);
    }
  };

  //Xóa đơn
  const removeApplication = async (resumeId) => {
    try {
      setLoading(true);
      let response = await removeResume(resumeId); // Gọi API
      if (response) {
        setLoading(false);
        if (response) {
          setResumeRemoveSuccess(true);
          setListResumeApplication((prev) => {
            return prev.filter((resume) => resume?.id_resume !== resumeId);
          });
          // //// // //console.log(listResumeApplicationAdmin);
        } else {
          setLoading(false);
          setResumeFails(true);
        }
      }
    } catch (error) {
      setLoading(false);
      setResumeFails(true);
    }
  };

  //Sửa đơn thôi việc
  const updateApplication13 = async (resumeId, dateStart, description) => {
    try {
      setLoading(true);
      let response = await updateResume13(resumeId, dateStart, description);
      if (response) {
        setUpdateSuccess(true);
        setListResumeApplication((prev) => {
          return prev.map((item) =>
            item?.id_resume === resumeId
              ? {
                  ...item,
                  date_start: dateStart,
                  description: description,
                }
              : item
          );
        });
        setLoading(false);
      }
    } catch (error) {
      //console.error("Update fail 13", error);
    }
  };

  //Cập nhật đơn công tác nhiều ngày
  const updateApplication20 = async (
    resumeId,
    dateStart,
    dateEnd,
    description
  ) => {
    try {
      setLoading(true);
      let response = await updateResume20(
        resumeId,
        dateStart,
        dateEnd,
        description
      );
      if (response) {
        setUpdateSuccess(true);
        setListResumeApplication((prev) => {
          return prev.map((item) =>
            item?.id_resume === resumeId
              ? {
                  ...item,
                  date_start: dateStart,
                  date_end: dateEnd,
                  description: description,
                }
              : item
          );
        });
        setLoading(false);
      }
    } catch (error) {
      //console.error("Update fail 13", error);
    }
  };

  //Sửa đơn nghỉ dài hạn
  const updateApplication12 = async (
    resumeId,
    dateStart,
    dateEnd,
    description
  ) => {
    try {
      setLoading(true);
      let response = await updateResume12(
        resumeId,
        dateStart,
        dateEnd,
        description
      );
      if (response) {
        setUpdateSuccess(true);
        setListResumeApplication((prev) => {
          return prev.map((item) =>
            item?.id_resume === resumeId
              ? {
                  ...item,
                  date_start: dateStart,
                  date_end: dateEnd,
                  description: description,
                }
              : item
          );
        });
        setLoading(false);
      }
    } catch (error) {
      //console.error("Update fail 12", error);
    }
  };

  //Sửa đơn checkout
  const updateApplication4 = async (
    resumeId,
    dateStart,
    dateEnd,
    description
  ) => {
    try {
      setLoading(true);
      let response = await updateResume4(
        resumeId,
        dateStart,
        dateEnd,
        description
      );
      if (response) {
        setUpdateSuccess(true);
        setListResumeApplication((prev) => {
          return prev.map((item) =>
            item?.id_resume === resumeId
              ? {
                  ...item,
                  date_start: dateStart,
                  date_end: dateEnd,
                  description: description,
                }
              : item
          );
        });
        setLoading(false);
      }
    } catch (error) {
      //console.error("Update fail 4", error);
    }
  };

  //Sửa đơn checkin
  const updateApplication3 = async (
    resumeId,
    dateStart,
    dateEnd,
    description
  ) => {
    try {
      setLoading(true);
      let response = await updateResume3(
        resumeId,
        dateStart,
        dateEnd,
        description
      );
      if (response) {
        setUpdateSuccess(true);
        setListResumeApplication((prev) => {
          return prev.map((item) =>
            item?.id_resume === resumeId
              ? {
                  ...item,
                  date_start: dateStart,
                  date_end: dateEnd,
                  description: description,
                }
              : item
          );
        });
        setLoading(false);
      }
    } catch (error) {
      //console.error("Update fail 3", error);
    }
  };

  //Sửa đơn công tác
  const updateApplication2 = async (
    resumeId,
    dateStart,
    dateEnd,
    description,
    starttime,
    endtime
  ) => {
    try {
      setLoading(true);
      let repsonse = await updateResume2(
        resumeId,
        dateStart,
        dateEnd,
        description,
        starttime,
        endtime
      );
      if (repsonse) {
        setUpdateSuccess(true);
        setListResumeApplication((prev) => {
          return prev.map((item) =>
            item?.id_resume === resumeId
              ? {
                  ...item,
                  date_start: dateStart,
                  date_end: dateEnd,
                  description: description,
                  time_start: starttime,
                  time_end: endtime,
                }
              : item
          );
        });
        setLoading(false);
      }
    } catch (error) {
      //console.error("Update fail 2", error);
    }
  };

  //Sửa đơn nghỉ phép
  const updateApplication1 = async (
    resumeId,
    dateStart,
    dateEnd,
    description
  ) => {
    try {
      setLoading(true);
      let response = await updateResume1(
        resumeId,
        dateStart,
        dateEnd,
        description
      );
      // // // //console.log("dateStart auth", dateStart);

      if (response) {
        setUpdateSuccess(true);
        setListResumeApplication((prev) => {
          return prev.map((item) =>
            item?.id_resume === resumeId
              ? {
                  ...item,
                  date_start: dateStart,
                  date_end: dateEnd,
                  description: description,
                }
              : item
          );
        });
        setLoading(false);
      }
    } catch (error) {
      //console.error("Update fail 1", error);
    }
  };
  //Sửa đơn chế độ
  const updateResumeOther = async (
    resumeId,
    nameValue,
    resumesettingId,
    dateStart,
    dateEnd,
    description
  ) => {
    try {
      setLoading(true);
      let response = await HandleUpdateResumeOther(
        resumeId,
        resumesettingId,
        dateStart,
        dateEnd,
        description
      );
      if (response) {
        setUpdateSuccess(true);
        setListResumeApplication((prev) => {
          if (response) {
            return prev.map((item) =>
              item?.id_resume === resumeId
                ? {
                    ...item,
                    id_resume: resumeId,
                    setting_resume: {
                      id_setting_resume: resumesettingId,
                      name_setting_resume: nameValue,
                    },
                    date_start: dateStart,
                    date_end: dateEnd,
                    description: description,
                  }
                : item
            );
          }
        });
        setLoading(false);
      }
    } catch (error) {
      //console.error("Update fail other", error);
    }
  };

  //Sửa đơn vắng mặt theo giờ
  const updateApplication15 = async (
    resumeId,
    dateStart,
    dateEnd,
    description,
    starttime,
    endtime
  ) => {
    try {
      setLoading(true);
      let repsonse = await updateResume15(
        resumeId,
        dateStart,
        dateEnd,
        description,
        starttime,
        endtime
      );
      if (repsonse) {
        setUpdateSuccess(true);
        setListResumeApplication((prev) => {
          return prev.map((item) =>
            item?.id_resume === resumeId
              ? {
                  ...item,
                  date_start: dateStart,
                  date_end: dateEnd,
                  description: description,
                  time_start: starttime,
                  time_end: endtime,
                }
              : item
          );
        });
        setLoading(false);
      }
    } catch (error) {
      //console.error("Update fail 15", error);
    }
  };

  //Sửa đơn nghỉ phép không lương
  const updateApplication16 = async (
    resumeId,
    dateStart,
    dateEnd,
    description,
    starttime,
    endtime
  ) => {
    try {
      setLoading(true);
      let response = await updateResume16(
        resumeId,
        dateStart,
        dateEnd,
        description,
        starttime,
        endtime
      );
      if (response) {
        setUpdateSuccess(true);
        setListResumeApplication((prev) => {
          return prev.map((item) =>
            item?.id_resume === resumeId
              ? {
                  ...item,
                  date_start: dateStart,
                  date_end: dateEnd,
                  description: description,
                  starttime: starttime,
                  endtime: endtime,
                }
              : item
          );
        });
        setLoading(false);
      }
    } catch (error) {
      //console.error("Update fail 16", error);
    }
  };

  //Sửa đơn 17
  const updateApplication17 = async (
    resumeId,
    dateStart,
    dateEnd,
    description,
    starttime,
    endtime
  ) => {
    try {
      setLoading(true);
      let response = await updateResume17(
        resumeId,
        dateStart,
        dateEnd,
        description,
        starttime
      );
      if (response) {
        setUpdateSuccess(true);
        setListResumeApplication((prev) => {
          return prev.map((item) =>
            item?.id_resume === resumeId
              ? {
                  ...item,
                  date_start: dateStart,
                  date_end: dateEnd,
                  description: description,
                  time_start: starttime,
                  time_end: endtime,
                }
              : item
          );
        });
        setLoading(false);
      }
    } catch (error) {
      //console.error("Update fail 17", error);
    }
  };

  //Sửa đơn 18
  const updateApplication18 = async (
    resumeId,
    dateStart,
    dateEnd,
    description,
    starttime,
    endtime
  ) => {
    try {
      setLoading(true);
      let response = await updateResume18(
        resumeId,
        dateStart,
        dateEnd,
        description,
        starttime,
        endtime
      );
      if (response) {
        setUpdateSuccess(true);
        setListResumeApplication((prev) => {
          return prev.map((item) =>
            item?.id_resume === resumeId
              ? {
                  ...item,
                  date_start: dateStart,
                  date_end: dateEnd,
                  description: description,
                  time_start: starttime,
                  time_end: endtime,
                }
              : item
          );
        });
        setLoading(false);
      }
    } catch (error) {
      //console.error("Update fail 18", error);
    }
  };

  //Sửa đơn 19
  const updateApplication19 = async (
    resumeId,
    dateStart,
    dateEnd,
    description,
    starttime,
    endtime
  ) => {
    try {
      setLoading(true);
      let response = await updateResume19(
        resumeId,
        dateStart,
        dateEnd,
        description,
        endtime
      );
      if (response) {
        setUpdateSuccess(true);
        setListResumeApplication((prev) => {
          return prev.map((item) =>
            item?.id_resume === resumeId
              ? {
                  ...item,
                  date_start: dateStart,
                  date_end: dateEnd,
                  description: description,
                  time_start: starttime,
                  time_end: endtime,
                }
              : item
          );
        });
        setLoading(false);
      }
    } catch (error) {
      //console.error("Update fail 19", error);
    }
  };

  //Sửa đơn nghỉ hiếu hỉ
  const updateApplication14 = async (
    resumeId,
    dateStart,
    dateEnd,
    description
  ) => {
    try {
      setLoading(true);
      let response = await updateResume14(
        resumeId,
        dateStart,
        dateEnd,
        description
      );
      if (response) {
        setUpdateSuccess(true);
        setListResumeApplication((prev) => {
          return prev.map((item) =>
            item?.id_resume === resumeId
              ? {
                  ...item,
                  date_start: dateStart,
                  date_end: dateEnd,
                  description: description,
                }
              : item
          );
        });
        setLoading(false);
      }
    } catch (error) {
      //console.error("Update fail 16", error);
    }
  };
  const changePassword = async (currentPass, newPass) => {
    try {
      setLoading(true);
      let response = await changePasswordHandle(currentPass, newPass);

      if (response) {
        if (response?.status === 200 || response?.status === 201) {
          setLoading(false);
          setIsChangeSuccess(true);
        } else {
          setIsChangeFails(false);
        }
      }
    } catch (error) {
      setIsChangeFails(false);
    }
  };

  const cancelAdmin = async (resumeId) => {
    try {
      setLoading(true);
      let response = cancelResume(resumeId);
      if (response) {
        setLoading(false);
        if (response) {
          setResumeSuccess(true);
          setListResumeApplicationAdmin((prev) => {
            return prev.map((resume, i) =>
              resume?.id_resume === resumeId
                ? {
                    ...resume,
                    status_resume: {
                      name_status: "Không duyệt",
                      id_status_resume: 3,
                    },
                  }
                : resume
            );
          });
        } else {
          setLoading(false);
          setResumeFails(true);
        }
      }
    } catch (error) {
      setLoading(false);
      setResumeFails(true);
    }
  };
  const getCategoryResume = async () => {
    try {
      setLoading(true);
      let response = await getTypeCategoryResume();
      if (response) {
        let itemToMove = response?.resume?.find(
          (item) => item.id_setting_resume === 13
        );

        // Loại bỏ đối tượng có id_setting_resume là 13 khỏi mảng ban đầu
        resumes = response?.resume?.filter(
          (item) => item.id_setting_resume !== 13
        );

        // Thêm đối tượng đã tìm được vào cuối mảng
        resumes.push(itemToMove);
        let newData = resumes?.map((item) => {
          switch (item.id_setting_resume) {
            case 1:
              item.icon = "umbrella-outline";
              item.BackgroundColor = "#E8F2FF";
              item.color = "";
              break;
            case 3:
              item.icon = "checkmark-circle-outline";
              item.BackgroundColor = "#E8F2FF";
              item.color = "";

              break;
            case 2:
              item.icon = "bag-outline";
              item.BackgroundColor = "#E8F2FF";
              item.color = "";

              break;
            case 7:
              item.icon = "person-outline";
              item.BackgroundColor = "#E8F2FF";
              item.color = "";

              break;
            case 12:
              item.icon = "calendar-outline";
              item.BackgroundColor = "#E8F2FF";
              item.color = "";

              break;
            case 13:
              item.icon = "log-out-outline";
              item.BackgroundColor = "#FFE8E8";
              item.color = "#D60000";

              break;
            case 14:
              item.icon = "people-outline";
              item.BackgroundColor = "#E8F2FF";
              item.color = "";

              break;
            case 16:
              item.icon = "free-cancellation";
              item.BackgroundColor = "#E8F2FF";
              item.color = "";

              break;
            case 18:
              item.icon = "calendar-times-o";
              item.BackgroundColor = "#E8F2FF";
              item.color = "";
              break;
            default:
              item.description = "Chưa có mô tả";
          }
          return { ...item }; // Trả về một bản sao mới của đối tượng, tránh thay đổi trực tiếp mảng gốc
        });
        const sortedArray = newData?.sort((a, b) => {
          if (
            a.id_setting_resume === 3 ||
            a.id_setting_resume === 1 ||
            a.id_setting_resume === 18
          )
            return -1;
          if (
            b.id_setting_resume === 3 ||
            b.id_setting_resume === 1 ||
            b.id_setting_resume === 18
          )
            return 1;
          return 0;
        });
        setTypeResumeCategory(sortedArray);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };
  const handleGetListNotification = async () => {
    setStatusNotify(true);
    // // // //console.log(listResumeApplicationAdmin);
    try {
      let response = await getListNotification();
      let responseResumeList = await resumeListForAdmin();
      let responseResumeListUser = await resumeListForuser();
      let responseUserInfo = await getUserInfoAPI();
      if (responseUserInfo?.role[0]?.resume_select === true) {
        if (response.status === 200 && responseResumeList) {
          // const joinedData = response.data.existingData.map((notification) => {
          //   // Tìm phần tử trong mảng resumes có id trùng với id của notification
          //   const resume = responseResumeList?.resume.find(
          //     (resume) => Number(notification.resume_id) === resume.id_resume
          //   );

          //   // Trả về đối tượng ghép
          //   return {
          //     ...notification,
          //     resume: resume || {}, // Nếu không tìm thấy resume, gán đối tượng rỗng
          //   };
          // });

          const mergeArrays = (notifications, resumes) => {
            return notifications.map((notification) => {
              // Tìm phần tử trong mảng resumes có id_resume trùng với resume_id của notification
              const resume = resumes.find(
                (resume) =>
                  Number(resume.id_resume) === Number(notification.resume_id)
              );

              // Nếu tìm thấy resume, gộp thông tin của nó vào notification
              return {
                ...notification,
                resume: resume || {}, // Nếu không tìm thấy resume, gán đối tượng rỗng
              };
            });
          };
          let newArray = mergeArrays(
            response.data.existingData,
            responseResumeList.resume
          );
          // // // //console.log("12 ", response.data.existingData);

          setAll(newArray.length <= 0 ? 0 : newArray.length);
          setSeen(
            newArray.filter((num) => num.status === true).length <= 0
              ? 0
              : newArray.filter((num) => num.status === true).length
          );
          setSending(
            newArray.filter((num) => num.status === false).length <= 0
              ? 0
              : newArray.filter((num) => num.status === false).length
          );
          let group = groupNotificationsByDate(newArray);
          setListNotification(group);
          setStatusNotify(false);
        }
      } else {
        if (response.status === 200 && responseResumeListUser) {
          // //console.log("2");
          // // // //console.log("12 ", response.data.existingData);
          const mergeArrays = (notifications, resumes) => {
            return notifications.map((notification) => {
              // Tìm phần tử trong mảng resumes có id_resume trùng với resume_id của notification
              const resume = resumes.find(
                (resume) =>
                  Number(resume.id_resume) === Number(notification.resume_id)
              );

              // Nếu tìm thấy resume, gộp thông tin của nó vào notification
              return {
                ...notification,
                resume: resume || {}, // Nếu không tìm thấy resume, gán đối tượng rỗng
              };
            });
          };
          let newArray = mergeArrays(
            response.data.existingData,
            responseResumeListUser.resume
          );
          setAll(newArray.length <= 0 ? 0 : newArray.length);
          setSeen(
            newArray.filter((num) => num.status === true).length <= 0
              ? 0
              : newArray.filter((num) => num.status === true).length
          );
          setSending(
            newArray.filter((num) => num.status === false).length <= 0
              ? 0
              : newArray.filter((num) => num.status === false).length
          );
          let group = groupNotificationsByDate(newArray);
          setListNotification(group);
          setStatusNotify(false);
        }
      }
    } catch (error) {
      setStatusNotify(false);
    }
  };
  // const getHandleLoadingSpinner = async ()=>{
  //   setLoadingScreen(true);
  //   try {
  //     let api1 = await getAttendanceByUserAPI();
  //     let api2 = await getAttendanceToday();
  //     let api3 = await getUserInfoAPI();
  //     if(api1 && api2 && api3)
  //     {
  //       setLoadingScreen(false);
  //     }
  //   }catch(error){
  //     setLoadingHome(true);
  //   }
  // }
  const handleCheckSeenNotification = async (id) => {
    try {
      let response = await seenNotification(id);
      let responseResumeList = await resumeListForAdmin();

      let responseUserInfo = await getUserInfoAPI();
      let responseNotification = await getListNotification();
      if (responseUserInfo?.role[0]?.resume_select === true) {
        if (response && responseResumeList && responseNotification) {
          const updatedData = responseNotification.data.existingData.map(
            (item) => {
              if (item.id === id) {
                // Thay đổi giá trị của status
                return { ...item, status: true };
              }
              return item;
            }
          );
          const mergeArrays = (notifications, resumes) => {
            return notifications.map((notification) => {
              // Tìm phần tử trong mảng resumes có id_resume trùng với resume_id của notification
              const resume = resumes.find(
                (resume) =>
                  Number(resume.id_resume) === Number(notification.resume_id)
              );

              // Nếu tìm thấy resume, gộp thông tin của nó vào notification
              return {
                ...notification,
                resume: resume || {}, // Nếu không tìm thấy resume, gán đối tượng rỗng
              };
            });
          };
          let newArray = mergeArrays(updatedData, responseResumeList.resume);
          // // // //console.log("12 ", response.data.existingData);

          setAll(newArray.length <= 0 ? 0 : newArray.length);
          setSeen(
            newArray.filter((num) => num.status === true).length <= 0
              ? 0
              : newArray.filter((num) => num.status === true).length
          );
          setSending(
            newArray.filter((num) => num.status === false).length <= 0
              ? 0
              : newArray.filter((num) => num.status === false).length
          );
          let group = groupNotificationsByDate(newArray);
          setListNotification(group);
          setCheckStatus(true);
        } else {
          setCheckStatus(false);
        }
      } else {
        if (response && responseNotification) {
          const updatedData = responseNotification.data.existingData.map(
            (item) => {
              if (item.id === id) {
                // Thay đổi giá trị của status
                return { ...item, status: true };
              }
              return item;
            }
          );

          // // // //console.log("12 ", response.data.existingData);

          setAll(updatedData.length <= 0 ? 0 : updatedData.length);
          setSeen(
            updatedData.filter((num) => num.status === true).length <= 0
              ? 0
              : updatedData.filter((num) => num.status === true).length
          );
          setSending(
            updatedData.filter((num) => num.status === false).length <= 0
              ? 0
              : updatedData.filter((num) => num.status === false).length
          );
          let group = groupNotificationsByDate(updatedData);
          setListNotification(group);
          setCheckStatus(true);
        } else {
          setCheckStatus(false);
        }
      }
    } catch (error) {
      setCheckStatus(false);
    }
  };
  const handleCheckSeenNotificationDelete = async (id) => {
    try {
      let response = await seenNotification(id);
      let responseResumeList = await resumeListForAdmin();
      let responseNotification = await getListNotification();
      if (response && responseResumeList && responseNotification) {
        let updatedData = responseNotification.data.existingData.map((item) => {
          if (item.id === id) {
            // Thay đổi giá trị của status
            return { ...item, status: true };
          }
          return item;
        });
        const mergeArrays = (notifications, resumes) => {
          return notifications.map((notification) => {
            // Tìm phần tử trong mảng resumes có id_resume trùng với resume_id của notification
            const resume = resumes.find(
              (resume) =>
                Number(resume.id_resume) === Number(notification.resume_id)
            );

            // Nếu tìm thấy resume, gộp thông tin của nó vào notification
            return {
              ...notification,
              resume: resume || {}, // Nếu không tìm thấy resume, gán đối tượng rỗng
            };
          });
        };

        let newArray = mergeArrays(updatedData, responseResumeList.resume);
        // // // //console.log("12 ", response.data.existingData);

        setAll(newArray.length <= 0 ? 0 : newArray.length);
        setSeen(
          newArray.filter((num) => num.status === true).length <= 0
            ? 0
            : newArray.filter((num) => num.status === true).length
        );
        setSending(
          newArray.filter((num) => num.status === false).length <= 0
            ? 0
            : newArray.filter((num) => num.status === false).length
        );
        let group = groupNotificationsByDate(newArray);
        setListNotification(group);
        setCheckStatus(true);
      } else {
        setCheckStatus(false);
      }
    } catch (error) {
      setCheckStatus(false);
    }
  };
  const resumeDelete = async (id) => {
    try {
      let response = await seenNotification(id);
      let responseNotification = await getListNotification();
      if (response && responseNotification) {
        // let updatedData = responseNotification.data.existingData.map((item) => {
        //   if (item.id === id) {
        //     // Thay đổi giá trị của status
        //     return { ...item, status: true };
        //   }
        //   return item;
        // });
        // const mergeArrays = (notifications, resumes) => {
        //   return notifications.map((notification) => {
        //     // Tìm phần tử trong mảng resumes có id_resume trùng với resume_id của notification
        //     const resume = resumes.find(
        //       (resume) =>
        //         Number(resume.id_resume) === Number(notification.resume_id)
        //     );

        //     // Nếu tìm thấy resume, gộp thông tin của nó vào notification
        //     return {
        //       ...notification,
        //       resume: resume || {}, // Nếu không tìm thấy resume, gán đối tượng rỗng
        //     };
        //   });
        // };

        // let newArray = mergeArrays(updatedData, responseResumeList.resume);
        // // // //console.log("12 ", response.data.existingData);

        setAll(
          responseNotification.data.existingData.length <= 0
            ? 0
            : responseNotification.data.existingData.length
        );
        setSeen(
          responseNotification.data.existingData.filter(
            (num) => num.status === true
          ).length <= 0
            ? 0
            : responseNotification.data.existingData.filter(
                (num) => num.status === true
              ).length
        );
        setSending(
          responseNotification.data.existingData.filter(
            (num) => num.status === false
          ).length <= 0
            ? 0
            : responseNotification.data.existingData.filter(
                (num) => num.status === false
              ).length
        );
        let group = groupNotificationsByDate(
          responseNotification.data.existingData
        );
        setListNotification(group);
        setCheckStatus(true);
      } else {
        setCheckStatus(false);
      }
    } catch (error) {
      setCheckStatus(false);
    }
  };

  useEffect(() => {
    checkLogin();
    loadToken();
  }, []);
  useEffect(() => {
    if (userToken) {
      // handleGetSettingTime();
      handleGetListNotification();
      loadUserInfo();
      loadAvatar();
      AttendenceToday();
      AttendanceByUser();
      getTypeOfModeResume();
      getLimitResume();
      getListResumeApplication();
      getListResumeApplicationAdmin();
      getListModeResume();
      getListStaffManager();
      getCategoryResume();
    }
  }, [userToken]);
  // console.log(checkin_setting, checkout_setting);
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        login,
        setListNotification,
        listNotification,
        checkIn,
        checkOut,
        logout,
        userToken,
        timeCheckin,
        timeCheckout,
        attendanceDates,
        success,
        setSuccess,
        setAlert,
        alert,
        fails,
        setFails,
        Switch,
        setSwitch,
        text,
        setText,
        isLogout,
        setIsLogout,
        checkout,
        setCheckout,
        resumeDelete,
        scoreAttend,
        setScoreAttend,
        dateSuccess,
        setDateSuccesss,
        totalHourAttend,
        timeCheckinApi,
        timeCheckoutApi,
        isCheckin,
        loading,
        userInfo,
        setUserInfo,
        pickImage,
        avatar,
        setAvatar,
        statusImage,
        setStatusImage,
        changeUserProfile,
        handleInsertResume1,
        handleInsertResume2,
        handleInsertResume12,
        handleInsertResume13,
        handleInsertResume15,
        handleInsertResume16,
        handleInsertResume14,
        handleInsertResume17,
        handleInsertResume18,
        handleInsertResume19,
        leaveApplications,
        handleCreateCheckinApplication,
        handleCreateCheckoutApplication,
        resumeSuccess,
        resumeFails,
        resumeRemoveSuccess,
        setResumeFails,
        setResumeSuccess,
        setResumeRemoveSuccess,
        resumeLimitCheckIn,
        resumeLimitCheckOut,
        listTypeModeApplication,
        setListTypeModeApplication,
        handleCreateModeResumeApplication,
        listResumeApplication,
        listResumeApplicationAdmin,
        getListResumeApplicationAdmin,
        listModeResume,
        listStaffManager,
        approveAdmin,
        getListStaffManager,
        slogan,
        setSlogan,
        checkin_setting,
        checkout_setting,
        role,
        cancelAdmin,
        setIsCheck,
        isCheck,
        isChangeFails,
        isChangeSuccess,
        setIsChangeFails,
        setIsChangeSuccess,
        changePassword,
        notifySuccess,
        notifyFails,
        setNotifyFails,
        setNotifySuccess,
        removeApplication,
        updateApplication13,
        updateApplication12,
        updateApplication4,
        updateApplication3,
        updateApplication2,
        updateApplication1,
        updateApplication15,
        updateApplication16,
        updateApplication14,
        updateApplication17,
        updateApplication18,
        updateApplication19,
        updateResumeOther,
        setUpdateSuccess,
        updateSuccess,
        userArray,
        setLoadingScreen,
        loadingScreen,
        setChangeSlogan,
        setChangeSloganFail,
        changeSlogan,
        changeSloganFail,
        exitsResume,
        setExitsResume,
        setTypeResumeCategory,
        typeResumeCategory,
        statusCheck,
        setStatusCheck,
        alertNetword,
        setAlertNetword,
        resumeSelect,
        setResumeSelect,
        getListResumeApplication,
        AttendanceByUser,
        AttendenceToday,
        loadingHome,
        setLoadingHome,
        handleInsertResume20,
        updateApplication20,
        getCategoryResume,
        loadUserInfo,
        setErrorLog,
        errorLog,
        all,
        seen,
        sending,
        checkStatus,
        setCheckStatus,
        handleCheckSeenNotification,
        handleGetListNotification,
        handleCheckSeenNotificationDelete,
        isAnnual,
        setIsAnnual,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
