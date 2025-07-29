import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Toast, ALERT_TYPE } from "react-native-alert-notification";
export const ARRAY_TYPE = {
  success: ALERT_TYPE.SUCCESS,
  warning: ALERT_TYPE.WARNING,
  danger: ALERT_TYPE.DANGER,
};
const Notification = ({ title, message, duration, type, show, setShow }) => {
  useEffect(() => {
    if (show) {
      Toast.show({
        title: title,
        textBody: message,
        duration: duration,
        type: type,
      });
      setTimeout(() => {
        setShow(false);
      }, duration);
    } else {
      return null;
    }
  }, [title, message, duration, type, show, setShow]); // Chạy lại khi props thay đổi

  return null; // Không cần render gì, chỉ hiển thị notification
};

export default Notification;
