import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";

export const TYPES = {
  success: ALERT_TYPE.SUCCESS,
  warning: ALERT_TYPE.WARNING,
  danger: ALERT_TYPE.DANGER,
};
const Dialogs = ({ title, message, duration, type, show, setShow }) => {
  useEffect(() => {
    if (show) {
      Dialog.show({
        title: title,
        textBody: message,
        duration: duration,
        type: type,
        button: "Đóng",
      });
      setTimeout(() => {
        setShow(false);
      }, duration);
    } else {
      return null;
    }
  }, [title, message, duration, type, show, setShow]);
};

export default Dialogs;
