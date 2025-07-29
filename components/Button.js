import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const Button = ({
  title,
  onPress,
  size = "medium",
  backgroundColor = "#007BFF",
  borderRadius = 5,
  boxShadow = false,
  margin,
  padding,
  disa,
  width,
  marginVertical,
}) => {
  const styles = getStyles(
    size,
    backgroundColor,
    borderRadius,
    boxShadow,
    margin,
    padding,
    width,
    marginVertical
  );

  return (
    <TouchableOpacity style={styles.button} disabled={disa} onPress={onPress}>
      <Text allowFontScaling={false} style={styles.buttonText}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const getStyles = (
  size,
  backgroundColor,
  borderRadius,
  boxShadow,
  margin,
  padding,
  width,
  marginVertical
) => {
  return StyleSheet.create({
    button: {
      marginVertical: marginVertical,
      width: width,
      backgroundColor: backgroundColor,
      padding: padding,
      borderRadius: borderRadius,
      alignItems: "center",
      margin: margin,
      ...(boxShadow && {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5, // Chỉ dành cho Android
      }),
    },
    buttonText: {
      color: "#FFFFFF",
      fontSize: size === "large" ? 18 : size === "small" ? 14 : 16,
    },
  });
};

export default Button;
