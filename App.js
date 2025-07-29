import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AuthProvider } from "./contexts/AuthContext";
import { AttendanceProvider } from "./contexts/AttendanceContext";

import { AlertNotificationRoot } from "react-native-alert-notification";
import RootNavigator from "./routes/rootNavigator";
import { ToastProvider } from "react-native-toast-notifications";
import { NotificationProvider } from "./contexts/NotificationProvider";
import * as Notifications from "expo-notifications";

// fetchData().then(() => {
//   // Log baseURL của axiosApiInstance sau khi fetchData đã cập nhật
//   //console.log('axiosApiInstance baseURL after fetchData:', axiosApiInstance.defaults.baseURL);
// });

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});
export default function App() {
  
  return (
    <NotificationProvider>
      <AuthProvider>
        <AttendanceProvider>
          <SafeAreaProvider>
            <ToastProvider>
              <AlertNotificationRoot>
                <NavigationContainer>
                  <RootNavigator />
                </NavigationContainer>
              </AlertNotificationRoot>
            </ToastProvider>
          </SafeAreaProvider>
        </AttendanceProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}
