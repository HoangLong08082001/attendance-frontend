import { useContext, useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignInScreen from "../Screen/SignIn";
import { AuthContext } from "../contexts/AuthContext";
import Forgot from "../Screen/Forgot";
import Iphone3Screen from "../Screen/iphone3";
import Iphone4Screen from "../Screen/iphone4";
import BottomTabNavigator from "./BottomTabNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ListNotification from "../Screen/Notification/listNotification";
import { AttendanceContext } from "../contexts/AttendanceContext";
import Contact from "../Screen/Contact";
import ContactOutside from "../Screen/ContactOutside";
const Stack = createNativeStackNavigator();

const AppNavigation = ({ navigation }) => {
  const { userToken, isLoggedIn, loadingScreen } = useContext(AuthContext);
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  const { load } = useContext(AttendanceContext);
  useEffect(() => {
    const checkFirstLaunch = async () => {
      const hasLaunched = await AsyncStorage.getItem("hasLaunched");
      if (hasLaunched === null) {
        // Nếu chưa mở lần nào, đánh dấu đã mở
        await AsyncStorage.setItem("hasLaunched", "true");
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    };

    checkFirstLaunch();
  }, []);

  if (isFirstLaunch === null) {
    return null; // Hoặc một màn hình loading
  }
  // //// // //console.log("navigator: ", userToken);
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, gestureEnabled: false }}
    >
      {isLoggedIn ? (
        <>
          {/* <Drawer.Screen name="Main" component={BottomTabNavigator} /> */}
          <Stack.Screen name="Main" component={BottomTabNavigator} />

          <Stack.Screen name="ListNotification" component={ListNotification} />
        </>
      ) : isFirstLaunch ? (
        <>
          <Stack.Screen
            name="Iphone3"
            options={{ gestureEnabled: false }}
            component={Iphone3Screen}
          />

          <Stack.Screen
            name="Iphone4"
            options={{ gestureEnabled: false }}
            component={Iphone4Screen}
          />

          <Stack.Screen
            name="SignIn"
            options={{ gestureEnabled: false }}
            component={SignInScreen}
          />
          <Stack.Screen
            name="ContactOutside"
            options={{ gestureEnabled: false }}
            component={ContactOutside}
          />
          <Stack.Screen
            name="Contact"
            options={{ gestureEnabled: false }}
            component={Contact}
          />
          <Stack.Screen
            name="Forgot"
            options={{ gestureEnabled: false }}
            component={Forgot}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="SignIn"
            options={{ gestureEnabled: false }}
            component={SignInScreen}
          />
          <Stack.Screen
            name="ContactOutside"
            options={{ gestureEnabled: false }}
            component={ContactOutside}
          />
          <Stack.Screen
            name="Forgot"
            options={{ gestureEnabled: false }}
            component={Forgot}
          />
        </>
      )}
      {/* <Stack.Screen name="MyDrawer" component={MyDrawer} /> */}
    </Stack.Navigator>
  );
};

export default AppNavigation;
