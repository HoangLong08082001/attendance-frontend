import React, { createContext, useContext, useState } from "react";

export const AttendanceContext = createContext();

export const AttendanceProvider = ({ children }) => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [showCheckOut, setShowCheckOut] = useState(false);
  const [showCheckIn, setShowCheckIn] = useState(true); // Ban đầu hiện nút Check-In
  const [load, setLoad] = useState(false);
  const checkIn = () => {
    setIsCheckedIn(true);
    setCheckInTime(new Date());
    setShowCheckIn(false); // Ẩn nút Check-In sau khi Check-In
    setShowCheckOut(false);
    setTimeout(() => {
      setShowCheckOut(true); // Hiển thị Check-Out sau 5 giây
    }, 5000);
  };

  const checkOut = () => {
    setIsCheckedIn(false);
    setCheckInTime(null);
    setShowCheckOut(false); // Ẩn nút Check-Out khi Check-Out
    setShowCheckIn(false); // Ẩn nút Check-In ngay sau khi Check-Out
    setTimeout(() => {
      setShowCheckIn(true); // Hiển thị nút Check-In lại sau 5 giây
    }, 5000); // Đợi 5 giây mới hiện nút Check-In
  };

  const canCheckOut = () => {
    return showCheckOut;
  };

  const canCheckIn = () => {
    return showCheckIn;
  };
  const setLoading = () => {
    setLoad(true);
  };

  return (
    <AttendanceContext.Provider
      value={{
        isCheckedIn,
        checkIn,
        checkOut,
        canCheckIn,
        canCheckOut,
        setLoading,
        load,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

// Custom hook để dễ dàng sử dụng context
export const useAttendance = () => useContext(AttendanceContext);
