import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import HomeScreen from "../Screen/Home";
import CalendarScreen from "../Screen/Calender";
import { Ionicons } from "@expo/vector-icons";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Salary from "../Screen/Salary";
import Profile from "../Screen/Profile";
import YearScreen from "../Screen/Application/YearApplication";
import DetailManageScreen from "../Screen/Manager/DetailApplicationManage";
import ApplicatonManagerScreen from "../Screen/Manager/ApplicationManager";
import EmployeeListScreen from "../Screen/Manager/StaffManager";
import StaffDetailScreen from "../Screen/Manager/StaffDetailScreen";
import CustomHeaderCalendar from "../components/customHeaderCalendar";
import ProfileManage from "../Screen/Manager/ProfileManage";
import { AuthContext } from "../contexts/AuthContext";
import Feather from "@expo/vector-icons/Feather";
import { AttendanceContext } from "../contexts/AttendanceContext";
import SpinnerLoading from "../components/SpinnerLoading";
import SpinnerLoadingHome from "../components/SpinnerLoadingHome";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = (props) => {
  const { navigation } = props;
  const { role, resumeSelect, userInfo } = useContext(AuthContext);
  const [selectResume, setSelectResume] = useState(userInfo?.resumeSelect);
  const [tabKey, setTabKey] = useState(0); // State để quản lý key
  // // // //console.log("resume_select", resume_select);

  useEffect(() => {
    setSelectResume(userInfo?.resumeSelect);
  }, [userInfo?.resumeSelect]);
  const { load } = useContext(AttendanceContext);
  const { loadingHome, loadingScreen } = useContext(AuthContext);

  return (
    <Tab.Navigator options={{ borderWidth: "none" }}>
      <Tab.Screen
        options={{
          tabBarStyle: {
            display: loadingScreen === true ? "none" : "block",
          },
          headerShown: false,
          tabBarLabel: "Trang chủ",
          headerTitleAllowFontScaling: false,
          headerTitleAlign: "center",
          headerTitleStyle: {
            textAlign: "center",
          },
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={color} />
          ),
          tabBarAllowFontScaling: false,
        }}
        name="Home"
        component={HomeScreen}
      />

      <Tab.Screen
        options={{
          headerShown: false,
          tabBarLabel: "Bảng công",
          headerTitleAllowFontScaling: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
          tabBarAllowFontScaling: false,
        }}
        name="Bảng công"
        component={CalendarScreen}
        initialParams={{
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(), // Đúng
        }}
        listeners={{
          tabPress: () => setTabKey((prev) => prev + 1), // Tăng key khi tab được chọn
        }}
      />
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarLabel: "Bảng lương",
          headerTitleAllowFontScaling: false,

          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="attach-money" size={size} color={color} />
          ),
          tabBarAllowFontScaling: false,
        }}
        name="Attend1"
        component={Salary}
      />
      <Tab.Screen
        options={{
          //headerShown: false,
          headerShown: false,
          headerStyle: { backgroundColor: "#e8f2ff" },
          //tabBarLabel: "Thông tin",
          headerTitleAllowFontScaling: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="user" size={size} color={color} />
          ),
          tabBarAllowFontScaling: false,
        }}
        name="Thông tin"
        component={selectResume === true ? ProfileManage : Profile}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({});

export default BottomTabNavigator;
