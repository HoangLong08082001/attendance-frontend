import { useEffect, useState, useContext } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import DetailScreen from "../Screen/Application/DetailApplication";
import CheckScreen from "../Screen/Application/CheckApplication";
import ListScreen from "../Screen/Application/ListApplication";
import CreateScreen from "../Screen/Application/CreateApplication";
import AbsenceScreen from "../Screen/Application/absenteeApplication";
import AbsenteeDetailScreen from "../Screen/Application/AbsenteeDetailScreen";
import LeaveScreen from "../Screen/Application/LeaveApplication";
import CheckDetailScreen from "../Screen/Application/CheckDetailApplication";
import ModeScreen from "../Screen/Application/ModeApplication";
import BottomTabNavigator from "./BottomTabNavigator";
import DetailManageScreen from "../Screen/Manager/DetailApplicationManage";
import YearScreen from "../Screen/Application/YearApplication";
import LongLeaveScreen from "../Screen/Application/LongLeaveApplication";
import ResignationScreen from "../Screen/Application/ResignationApplication";
import ApplicatonManagerScreen from "../Screen/Manager/ApplicationManager";
import StaffManager from "../Screen/Manager/StaffManager";
import StaffDetailScreen from "../Screen/Manager/StaffDetailScreen";
import HourlyLeaveScreen from "../Screen/Application/HourlyLeaveApplication";
import LeaveNoMoneyScreen from "../Screen/Application/LeaveNoMoneyApplication";
import HourlyLeaveNoSalaryScreen from "../Screen/Application/HourlyLeaveNoSalaryApplication";
import LeaveProScreen from "../Screen/Application/LeaveProApplication";
import EarlyLeaveScreen from "../Screen/Application/EarlyLeaveApplication";
import LateScreen from "../Screen/Application/LateApplication";
import { AuthContext } from "../contexts/AuthContext";
import CustomDrawerContent from "../components/CustomDrawer";
import ListNotification from "../Screen/Notification/listNotification";
import ChangePassword from "../Screen/ChangePassword";
import LoadingScreen from "../components/LoadingScreen";
import { AttendanceContext } from "../contexts/AttendanceContext";
import { useNotification } from "../contexts/NotificationProvider";
import { handleAddNotificaion } from "../services/api";
import Contact from "../Screen/Contact";
import ChatBotScreen from "../Screen/ChatbotScreen";

const Drawer = createDrawerNavigator();

const MyDrawer = ({ navigation }) => {
  const [intervalId, setIntervalId] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [isConnected, setIsConnected] = useState(false); // Trạng thái kết nối mạng
  const { expoPushToken } = useNotification();
  const { isLoggedIn } = useContext(AuthContext);
  const { load } = useContext(AttendanceContext);
  // const fetchApiCheckNetwork = async () => {
  //   try {
  //     const token = await AsyncStorage.getItem("userToken");
  //     let response = await axiosApiInstance.get("/attendance/testnetwork");
  //     if (response) {
  //       setIsConnected(true); // Đánh dấu là đã kết nối thành công
  //     }
  //   } catch (error) {
  //     setIsConnected(false);
  //     navigation.navigate("Network");
  //   }
  // };
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     fetchApiCheckNetwork();
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, []);
  const sendToken = async () => {
    if (expoPushToken) {
      try {
        const response = await handleAddNotificaion(expoPushToken);

        if (response.status === 400) {
          // const data = await response.json();
          // // // //console.log("Error:", data.error);
          clearInterval(intervalId); // Dừng interval khi nhận lỗi 400
          setIsSending(false); // Dừng trạng thái gửi token
        } else if (response.status === 200) {
        }
      } catch (error) {
        clearInterval(intervalId); // Dừng interval nếu gặp lỗi mạng
        setIsSending(false);
      }
    }
  };
  useEffect(() => {
    // Bắt đầu gửi token ngay khi component được mount
    if (!isSending) {
      setIsSending(true);
    }

    // Gửi token tự động mỗi 10 giây
    const id = setInterval(sendToken, 1000);
    setIntervalId(id);

    // Cleanup khi component unmount hoặc dừng gửi
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isSending]); // Khi `isSending` thay đổi, effect sẽ được chạy

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerLockMode: "locked-closed",
        headerShown: false,
        drawerStyle: {
          backgroundColor: "#f4f4f4",
          width: 240,
        },
      }}
    >
      <Drawer.Screen name="Main" component={BottomTabNavigator} />
      <Drawer.Screen
        name="ListApplication"
        options={{ gestureEnabled: false }}
        component={ListScreen}
      />
      <Drawer.Screen
        name="CreateScreen"
        options={{ gestureEnabled: false }}
        component={CreateScreen}
      />
      <Drawer.Screen
        name="AbsenceScreen"
        options={{ gestureEnabled: false }}
        component={AbsenceScreen}
      />
      <Drawer.Screen
        name="CheckScreen"
        options={{ gestureEnabled: false }}
        component={CheckScreen}
      />
      <Drawer.Screen
        name="LeaveScreen"
        options={{ gestureEnabled: false }}
        component={LeaveScreen}
      />

      <Drawer.Screen
        name="DetailScreen"
        options={{ gestureEnabled: false }}
        component={DetailScreen}
      />
      <Drawer.Screen
        name="AbsenteeDetailScreen"
        options={{ gestureEnabled: false }}
        component={AbsenteeDetailScreen}
      />
      <Drawer.Screen
        name="CheckDetailScreen"
        options={{ gestureEnabled: false }}
        component={CheckDetailScreen}
      />
      <Drawer.Screen
        name="ModeScreen"
        options={{ gestureEnabled: false }}
        component={ModeScreen}
      />
      <Drawer.Screen
        name="ListNotification"
        options={{ gestureEnabled: false }}
        component={ListNotification}
      />
      <Drawer.Screen
        name="YearScreen"
        options={{ gestureEnabled: false }}
        component={YearScreen}
      />
      <Drawer.Screen
        name="LongLeaveScreen"
        options={{ gestureEnabled: false }}
        component={LongLeaveScreen}
      />
      <Drawer.Screen
        name="ResignationScreen"
        options={{ gestureEnabled: false }}
        component={ResignationScreen}
      />
      <Drawer.Screen
        name="ApplicationManager"
        options={{ gestureEnabled: false }}
        component={ApplicatonManagerScreen}
      />
      <Drawer.Screen
        name="DetailManageScreen"
        options={{ gestureEnabled: false }}
        component={DetailManageScreen}
      />
      <Drawer.Screen
        name="ChangePasssword"
        options={{ gestureEnabled: false }}
        component={ChangePassword}
      />
      <Drawer.Screen
        name="StaffManager"
        options={{ gestureEnabled: false }}
        component={StaffManager}
      />
      <Drawer.Screen
        name="StaffDetailScreen"
        options={{ gestureEnabled: false }}
        component={StaffDetailScreen}
      />
      <Drawer.Screen
        name="HourlyLeaveScreen"
        options={{ gestureEnabled: false }}
        component={HourlyLeaveScreen}
      />
      <Drawer.Screen
        name="LeaveNoMoneyScreen"
        options={{ gestureEnabled: false }}
        component={LeaveNoMoneyScreen}
      />
      <Drawer.Screen
        name="LeaveProScreen"
        options={{ gestureEnabled: false }}
        component={LeaveProScreen}
      />
      <Drawer.Screen
        name="HourlyLeaveNoSalaryScreen"
        options={{ gestureEnabled: false }}
        component={HourlyLeaveNoSalaryScreen}
      />
      <Drawer.Screen
        name="EarlyLeaveScreen"
        options={{ gestureEnabled: false }}
        component={EarlyLeaveScreen}
      />
      <Drawer.Screen
        name="LateScreen"
        options={{ gestureEnabled: false }}
        component={LateScreen}
      />
      <Drawer.Screen
        name="LoadingScreen"
        options={{ gestureEnabled: false, swipeEnabled: false }}
        component={LoadingScreen}
      />
      <Drawer.Screen
        name="Contact"
        options={{ gestureEnabled: false }}
        component={Contact}
      />
      <Drawer.Screen
        name="ChatBotScreen"
        options={{ gestureEnabled: false }}
        component={ChatBotScreen}
      />
      {/* <Drawer.Screen
        name="Network"
        options={{ gestureEnabled: false, swipeEnabled: false }}
        component={Network}
      /> */}
    </Drawer.Navigator>
  );
};

export default MyDrawer;
