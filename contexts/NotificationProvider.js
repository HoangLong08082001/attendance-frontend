import React, { createContext, useState, useEffect, useContext } from "react";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

// Tạo context để chia sẻ thông tin notification
const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [expoPushToken, setExpoPushToken] = useState(null); // Token nhận thông báo
  const [notification, setNotification] = useState(null); // Thông báo nhận được

  useEffect(() => {
    let intervalId;

    // Hàm cập nhật token
    const updateToken = async () => {
      const token = await registerForPushNotificationsAsync();
      setExpoPushToken((prevToken) =>
        prevToken !== token ? token : prevToken
      );
    };

    // Lấy token ban đầu
    updateToken();

    // Thiết lập interval để kiểm tra token mỗi 2 giây
    intervalId = setInterval(updateToken, 2000);

    // Lắng nghe thông báo khi nhận
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification); // Cập nhật thông báo khi nhận
      }
    );

    // Lắng nghe phản hồi khi người dùng tương tác với thông báo
    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        // Xử lý phản hồi nếu cần
      });

    // Cleanup interval và listener khi component bị unmount
    return () => {
      clearInterval(intervalId);
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ expoPushToken, notification }}>
      {children}
    </NotificationContext.Provider>
  );
};

// Hook để sử dụng Notification Context
export const useNotification = () => useContext(NotificationContext);

// Hàm đăng ký quyền nhận thông báo và lấy token
async function registerForPushNotificationsAsync() {
  if (Device.isDevice) {
    // Kiểm tra quyền nhận thông báo
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // Nếu quyền chưa được cấp, yêu cầu cấp quyền
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    // Nếu không được cấp quyền, không thể nhận thông báo
    if (finalStatus !== "granted") {
      return null;
    }

    // Lấy Expo Push Token
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    return token;
  } else {
    alert("Must use physical device for Push Notifications");
    return null;
  }
}
