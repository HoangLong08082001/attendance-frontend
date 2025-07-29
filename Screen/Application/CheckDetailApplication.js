import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";

// const Stack = createNativeStackNavigator();

const CheckDetailScreen = (props) => {
  const { navigation } = props;
  const employeeInfo = {
    name: "Hà Hoàng Long",
    employeeID: "AP12345",
    department: "PHÒNG CHỨC NĂNG",
    position: "Chuyên viên kỹ thuật",
    role: "Chuyên viên",
  };

  const requestInfo = {
    type: "Đơn Checkin/out",
    leavePeriod: "Full ngày",
    requestDate: "12:15 27/9/2024",
    reason: "Việc cá nhân",
    status: "Đang chờ duyệt",
    approver: "Phan Đăng Khoa",
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text allowFontScaling={false} style={styles.headerTitle}>
          Chi tiết Đơn từ
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("ListApplication")}
        >
          <FontAwesome
            name="close"
            size={24}
            color="black"
            style={styles.iconBack}
          />
        </TouchableOpacity>
      </View>

      {/* Employee Information */}
      <View style={styles.section}>
        <Text allowFontScaling={false} style={styles.sectionTitle}>
          Thông tin Nhân viên
        </Text>
        <View style={styles.infoRow}>
          <Text allowFontScaling={false} style={styles.label}>
            Họ và tên
          </Text>
          <Text allowFontScaling={false} style={styles.value}>
            {employeeInfo.name}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text allowFontScaling={false} style={styles.label}>
            Mã nhân viên
          </Text>
          <Text allowFontScaling={false} style={styles.value}>
            {employeeInfo.employeeID}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text allowFontScaling={false} style={styles.label}>
            Phòng ban
          </Text>
          <Text allowFontScaling={false} style={styles.value}>
            {employeeInfo.department}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text allowFontScaling={false} style={styles.label}>
            Vị trí
          </Text>
          <Text allowFontScaling={false} style={styles.value}>
            {employeeInfo.position}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text allowFontScaling={false} style={styles.label}>
            Chức vụ
          </Text>
          <Text allowFontScaling={false} style={styles.value}>
            {employeeInfo.role}
          </Text>
        </View>
      </View>

      {/* Request Information */}
      <View style={styles.section}>
        <Text allowFontScaling={false} style={styles.sectionTitle}>
          Thông tin Đơn
        </Text>
        <View style={styles.infoRow}>
          <Text allowFontScaling={false} style={styles.label}>
            Loại đơn
          </Text>
          <Text allowFontScaling={false} style={styles.value}>
            {requestInfo.type}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text allowFontScaling={false} style={styles.label}>
            Thời gian xin nghỉ
          </Text>
          <Text allowFontScaling={false} style={styles.value}>
            {requestInfo.leavePeriod}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text allowFontScaling={false} style={styles.label}>
            Thời gian tạo đơn
          </Text>
          <Text allowFontScaling={false} style={styles.value}>
            {requestInfo.requestDate}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text allowFontScaling={false} style={styles.label}>
            Lí do
          </Text>
          <Text allowFontScaling={false} style={styles.value}>
            {requestInfo.reason}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text allowFontScaling={false} style={styles.label}>
            Trạng thái đơn
          </Text>
          <Text
            allowFontScaling={false}
            style={[styles.value, styles.statusPending]}
          >
            {requestInfo.status}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text allowFontScaling={false} style={styles.label}>
            Người duyệt
          </Text>
          <Text allowFontScaling={false} style={styles.value}>
            {requestInfo.approver}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 16,
    padding: 16,
    //alignSelf: 'center'
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "400",
    color: "#504A4A",
  },
  iconBack: {
    //paddingLeft: 30
  },
  section: {
    marginTop: 20,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 10,
    backgroundColor: "#F0F4FF",
    height: 48,
    paddingTop: 12,
    paddingLeft: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    padding: 16,
    marginTop: 10,
  },
  label: {
    color: "#97A0A9",
    fontSize: 14,
  },
  value: {
    color: "#36383A",
    fontSize: 14,
  },
  statusPending: {
    color: "#FF5C5C",
    fontWeight: "bold",
  },
});

export default CheckDetailScreen;
