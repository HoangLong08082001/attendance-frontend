import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import Modal from "react-native-modal";
import LottieView from "lottie-react-native";

const DialogComponent = ({
  isVisible,
  icon,
  message,
  onConfirm,
  title,
  onCancel,
  confirmText = "OK",
  cancelText = "Cancel",
  isCancel,
  isOk,
  lotties,
  isWarning,
  duration = 10, // Giảm duration để fadeIn nhanh hơn
}) => {
  const [fadeAnim] = useState(new Animated.Value(0)); // Khởi tạo giá trị opacity (0 -> 1)

  // Khi modal thay đổi trạng thái, thêm hiệu ứng fade in, fade out
  if (isVisible) {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: duration, // Duration khi fade in (giảm tốc độ để nhanh hơn)
      useNativeDriver: true,
    }).start();
  } else {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: duration, // Duration khi fade out
      useNativeDriver: true,
    }).start();
  }

  return (
    <Modal
      isVisible={isVisible}
      animationIn="fadeIn" // Hiệu ứng vào
      animationOut="fadeOut" // Hiệu ứng ra
      backdropOpacity={0.3}
      onBackdropPress={onCancel} // Nhấn vào nền ngoài để đóng modal
    >
      <Animated.View style={[styles.modalContent, { opacity: fadeAnim }]}>
        {/* Lottie Animation */}
        <LottieView
          style={styles.icon}
          source={
            lotties === 1
              ? require("../assets/lotties/Animation-Check.json")
              : lotties === 2
              ? require("../assets/lotties/Animation-errol.json")
              : require("../assets/lotties/Animation-warning.json")
          }
          autoPlay
          loop={false} // Đảm bảo animation chỉ chạy 1 lần
          speed={0.9} // Điều chỉnh tốc độ, giá trị > 1 sẽ nhanh hơn, < 1 sẽ chậm hơn
        />
        <Text allowFontScaling={false} style={styles.titleText}>
          {title}
        </Text>
        <Text allowFontScaling={false} style={styles.modalText}>
          {message}
        </Text>
        <View style={styles.buttonContainer}>
          {isOk && (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#23B26D" }]}
              onPress={onConfirm}
            >
              <Text allowFontScaling={false} style={styles.buttonText}>
                {confirmText}
              </Text>
            </TouchableOpacity>
          )}
          {isCancel && (
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: isWarning ? "#ff6b00" : "#D60000" },
              ]}
              onPress={onCancel}
            >
              <Text allowFontScaling={false} style={styles.buttonText}>
                {cancelText}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  icon: {
    height: 100,
    width: 100,
  },
  modalText: {
    fontSize: 15,
    marginTop: 20,
    fontWeight: "400",
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  button: {
    width: 100,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    flex: 1,
    margin: 5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
  },
  titleText: {
    fontSize: 18,
  },
});

export default DialogComponent;
