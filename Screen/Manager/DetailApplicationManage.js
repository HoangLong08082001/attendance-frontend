import { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Button from "../../components/Button";
import { AuthContext } from "../../contexts/AuthContext";
import { formatDateToVN } from "../../services/utils";
import DialogComponent from "../../components/DialogComponent";

// const Stack = createNativeStackNavigator();

const DetailManageScreen = (props) => {
  const { navigation, route } = props;
  const { request } = route.params;
  const { notifiScreen } = route.params;
  const [sure, setSure] = useState(false);
  const [sureCancel, setSureCancel] = useState(false);
  const [isConfirm, setIsConfirm] = useState(0);
  const { listResumeApplication, approveAdmin, cancelAdmin } =
    useContext(AuthContext);
  // // //console.log(request);
  const handleApprove = async () => {
    try {
      // Giả sử request.id là resumeId và request.setting_resume.id_setting_resume là idSettingResume
      const resumeId = request?.id_resume;
      const idSettingResume = request?.setting_resume?.id_setting_resume;

      // Gọi hàm approveAdmin từ context
      approveAdmin(resumeId, idSettingResume);

      navigation.navigate("ApplicationManager");
      setSure(false);
    } catch (error) {}
  };
  const handleCancel = async () => {
    try {
      const resumeId = request?.id_resume;
      cancelAdmin(resumeId);

      navigation.navigate("ApplicationManager");
      setSureCancel(false);
    } catch (error) {}
  };
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text allowFontScaling={false} style={styles.headerTitle}>
          Quản lí - Chi tiết Đơn từ
        </Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(
              notifiScreen === 1 ? "ListNotification" : "ApplicationManager"
            )
          }
        >
          <FontAwesome
            name="close"
            size={24}
            color="black"
            style={styles.iconBack}
          />
        </TouchableOpacity>
      </View>
      {sure === true && (
        <DialogComponent
          isVisible={sure}
          message={"Bạn có chắc muốn duyệt đơn này chứ"}
          isCancel={true}
          isOk={true}
          title={"Duyệt đơn"}
          cancelText="Đóng"
          confirmText={"Xác nhận"}
          onConfirm={handleApprove}
          onCancel={() => setSure(false)}
          duration={500}
        />
      )}
      {sureCancel === true && (
        <DialogComponent
          isVisible={sureCancel}
          message={"Bạn có chắc không duyệt đơn này chứ"}
          isCancel={true}
          isOk={true}
          title={"Duyệt đơn"}
          cancelText="Đóng"
          confirmText={"Xác nhận"}
          onConfirm={handleCancel}
          onCancel={() => setSureCancel(false)}
          duration={500}
        />
      )}
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
            {request?.staff?.name}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text allowFontScaling={false} style={styles.label}>
            Mã nhân viên
          </Text>
          <Text allowFontScaling={false} style={styles.value}>
            {request?.id_staff}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text allowFontScaling={false} style={styles.label}>
            Phòng ban
          </Text>
          <Text allowFontScaling={false} style={styles.value}>
            {request?.staff?.department}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text allowFontScaling={false} style={styles.label}>
            Vị trí
          </Text>
          <Text allowFontScaling={false} style={styles.value}>
            {request?.staff?.position}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text allowFontScaling={false} style={styles.label}>
            Chức vụ
          </Text>
          <Text allowFontScaling={false} style={styles.value}>
            {request?.staff?.position}
          </Text>
        </View>
      </View>

      {/* Request? Information */}
      <View style={styles.section}>
        <Text allowFontScaling={false} style={styles.sectionTitle}>
          Thông tin Đơn
        </Text>
        <View style={styles.infoRow}>
          <Text allowFontScaling={false} style={styles.label}>
            Loại đơn
          </Text>
          <Text allowFontScaling={false} style={styles.value}>
            {request?.setting_resume?.name_setting_resume}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text allowFontScaling={false} style={styles.label}>
            Thời gian xin nghỉ
          </Text>
          <Text allowFontScaling={false} style={styles.value}>
            {formatDateToVN(request?.date_start)}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text allowFontScaling={false} style={styles.label}>
            Thời gian tạo đơn
          </Text>
          <Text allowFontScaling={false} style={styles.value}>
            {formatDateToVN(request?.staff?.created_at)}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text allowFontScaling={false} style={styles.label}>
            Mô tả
          </Text>
          <Text allowFontScaling={false} style={styles.value}>
            {request?.description}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text allowFontScaling={false} style={styles.label}>
            Trạng thái đơn
          </Text>
          <Text
            allowFontScaling={false}
            style={[
              styles.value,
              request?.status_resume?.id_status_resume === 1
                ? styles.statusPending
                : request?.status_resume?.id_status_resume === 2
                ? styles.statusSuccess
                : styles.statusCancel,
            ]}
          >
            {request?.status_resume?.name_status}
          </Text>
        </View>
      </View>
      {request?.status_resume?.id_status_resume === 1 && (
        <View style={styles.wrap_button}>
          <Button
            title="Phê duyệt"
            size={10}
            backgroundColor="#23B26D"
            padding={12}
            borderRadius={30}
            width={184}
            onPress={() => {
              setIsConfirm(1);
              setSure(true);
            }}
          />
          <Button
            title="Từ chối"
            size={10}
            backgroundColor="#D60000"
            padding={12}
            borderRadius={30}
            width={184}
            onPress={() => {
              setIsConfirm(2);
              setSureCancel(true);
            }}
          />
        </View>
      )}
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
    padding: 10,
    borderRadius: 10,
    color: "#D4B740",
    fontWeight: "bold",
    backgroundColor: "#FEF9E1",
  },
  statusSuccess: {
    padding: 10,
    borderRadius: 10,
    color: "#28A745",
    fontWeight: "bold",
    backgroundColor: "#EDF7E6",
  },
  statusCancel: {
    padding: 10,
    borderRadius: 10,
    color: "#D60000",
    fontWeight: "bold",
    backgroundColor: "#FFE8E8",
  },
  wrap_button: {
    flexDirection: "row",
    gap: 15,
    justifyContent: "center",
    marginTop: 30,
  },
});

export default DetailManageScreen;
