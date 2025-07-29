import React from "react";
import { View, Text } from "react-native";
import Button from "./Button";
import { useAttendance } from "../contexts/AttendanceContext";

const AttendanceButton = ({ handleCheckIn, handleCheckOut }) => {
  const { isCheckedIn, checkIn, checkOut, canCheckIn, canCheckOut } =
    useAttendance();

  const handleButtonPress = () => {
    checkIn(); // Gọi hàm checkIn
    handleCheckIn(); // Gọi hàm handleCheckIn
  };

  const handleCheckOutPress = () => {
    checkOut(); // Gọi hàm checkOut từ useAttendance
    handleCheckOut(); // Gọi hàm handleCheckOut từ prop
  };

  return (
    <View style={{ padding: 20 }}>
      {isCheckedIn ? (
        canCheckOut() ? (
          <Button
            title="Check-Out"
            onPress={handleCheckOutPress}
            padding={10}
            backgroundColor="red"
          />
        ) : (
          <Text allowFontScaling={false}>
            Bạn cần đợi 5 phút trước khi Check Out.
          </Text>
        )
      ) : canCheckIn() ? (
        // Use handleCheckIn prop here
        <Button title="Check-In" onPress={handleButtonPress} padding={10} />
      ) : (
        <Text allowFontScaling={false}>
          Bạn đã hết giờ làm việc vui lòng quay lại vào ngày mai nhé
        </Text>
      )}
    </View>
  );
};

export default AttendanceButton;
