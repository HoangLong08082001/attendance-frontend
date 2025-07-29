import React, { useContext } from "react";
import {
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../contexts/AuthContext";

const CustomHeaderCalendar = (
  { title, statusAction, handleRead, handleBack },
  props
) => {
  const { sending, seen, all } = useContext(AuthContext);
  const navigation = useNavigation();
  return (
    <SafeAreaView style={{ backgroundColor: "white" }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons
            name="chevron-back-circle-outline"
            size={30}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text allowFontScaling={false} style={styles.headerText}>
          {title}
        </Text>
        {statusAction === 1 ? (
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.icons}>
              <Ionicons
                name="chatbubble-outline"
                style={styles.icon}
                size={24}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.icons}
              onPress={() => navigation.navigate("ListNotification")}
            >
              {sending === 0 ? (
                ""
              ) : (
                <View
                  style={{
                    zIndex: 1000,
                    position: "absolute",
                    top: 0,
                    left: 0,
                    backgroundColor: "red",
                    width: 20,
                    height: 20,
                    paddingVertical: 5,
                    borderRadius: 50,
                  }}
                >
                  <Text
                    style={{
                      justifyContent: "center",
                      color: "white",
                      textAlign: "center",
                      alignItems: "center",
                      fontSize: 7.5,
                      fontWeight: "600",
                    }}
                  >
                    {sending > 9 ? "9+" : sending}
                  </Text>
                </View>
              )}
              <Ionicons
                name="notifications-outline"
                size={24}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.checkRead} onPress={handleRead}>
              <Ionicons name="checkmark-done-sharp" size={24} color="#27a745" />
              <Text allowFontScaling={false} style={styles.textCheck}>
                Đánh dấu đã đọc
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    width: "100%",
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 0 : 50,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  backIcon: {
    marginRight: 10,
  },
  headerText: {
    flex: 1,
    fontSize: 18,
    fontWeight: "400",
  },
  headerIcons: {
    flexDirection: "row",
  },
  icon: {
    marginHorizontal: 10,
  },
  icons: {
    zIndex: 0,
    position: "relative",
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: "#eaeaea",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: Platform.OS === "ios" ? 16 : 10,
  },
  checkRead: {
    padding: 13,
    flexDirection: "row",
    width: 200,
    justifyContent: "space-around",
  },
  textCheck: {
    color: "#27a745",
  },
});

export default CustomHeaderCalendar;
