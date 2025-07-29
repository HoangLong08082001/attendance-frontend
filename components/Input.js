import React from "react";
import { TextInput, StyleSheet, View, Text } from "react-native";

const Input = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  height,
  borderColor = "gray",
  borderWidth = 1,
  boxShadow = false,
  margin,
  padding,
  backgroundColor,
  borderRadius,
  marginVertical,
}) => {
  const styles = getStyles(
    borderColor,
    borderWidth,
    boxShadow,
    padding,
    margin,
    height,
    backgroundColor,
    borderRadius,
    marginVertical
  );

  return (
    <View style={styles.container}>
      <TextInput
        allowFontScaling={false}
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
      />
    </View>
  );
};

const getStyles = (
  borderColor,
  borderWidth,
  boxShadow,
  margin,
  padding,
  height,
  backgroundColor,
  borderRadius,
  marginVertical
) => {
  return StyleSheet.create({
    container: {
      marginVertical: marginVertical,
      flexDirection: "row",
      height: height,
      borderColor: borderColor,
      borderWidth: borderWidth,
      backgroundColor: backgroundColor,
      borderRadius: borderRadius,
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
      margin: margin,
      alignItems: "center",
      padding: padding,
      paddingLeft: 10,
    },
    input: {
      width: "100%",
      height: "100%",
    },
  });
};

export default Input;
