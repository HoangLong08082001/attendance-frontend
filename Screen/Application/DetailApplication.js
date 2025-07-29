import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext } from "../../contexts/AuthContext";
import { formatDateToVN } from "../../services/utils";
import Button from "../../components/Button";

// const Stack = createNativeStackNavigator();

const DetailScreen = (props) => {
  const { navigation, route } = props;
  const { item } = route.params;
  const { notifiScreen } = route.params;
  const backStatus = route.params.backStatus || null;
  const { removeApplication, checkin_setting, checkout_setting } =
    useContext(AuthContext);
  const handleRemove = async () => {
    try {
      let resumeId = item?.id_resume;

      removeApplication(resumeId);

      navigation.navigate("ListApplication");
      //setSure(false);
    } catch (error) {}
  };
  const handleUpdate = async () => {
    const resumeId = item?.id_resume;
    const dateStart = item?.date_start;
    const description = item?.description;
    let id_setting_resume = item?.setting_resume?.id_setting_resume;
    let name_setting_resume = item?.setting_resume?.name_setting_resume;
    if (item?.setting_resume?.id_setting_resume == 13) {
      navigation.navigate("ResignationScreen", {
        resumeId,
        id_setting_resume,
        item,
      });
      //updateApplication13(resumeId, dateStart, description)
    } else if (item?.setting_resume?.id_setting_resume == 12) {
      navigation.navigate("LongLeaveScreen", {
        resumeId,
        id_setting_resume,
        item,
      });
    } else if (item?.setting_resume?.id_setting_resume == 3) {
      navigation.navigate("CheckScreen", {
        resumeId,
        id_setting_resume,
        name_setting_resume,
        item,
      });
    } else if (item?.setting_resume?.id_setting_resume == 4) {
      navigation.navigate("CheckScreen", { resumeId, id_setting_resume, item });
    } else if (item?.setting_resume?.id_setting_resume == 2) {
      navigation.navigate("AbsenceScreen", {
        resumeId: resumeId,
        id_setting_resume: id_setting_resume,
        item: item,
        leaveTypes:
          item?.time_start === checkin_setting &&
          item?.time_end === checkout_setting &&
          item?.date_start === item?.date_end
            ? "single"
            : "multiple",
      });
    } else if (item?.setting_resume?.id_setting_resume == 1) {
      navigation.navigate("LeaveScreen", {
        resumeId,
        id_setting_resume,
        item,
        leaveTypes: item?.date_start === item?.date_end ? "single" : "multiple",
      });
    } else if (item?.setting_resume?.id_setting_resume == 15) {
      navigation.navigate("HourlyLeaveScreen", {
        resumeId,
        id_setting_resume,
        item,
        leaveTypes: item?.date_start === item?.date_end ? "single" : "multiple",
      });
    } else if (item?.setting_resume?.id_setting_resume == 16) {
      navigation.navigate("LeaveNoMoneyScreen", {
        resumeId,
        id_setting_resume,
        item,
        //leaveTypes: item?.date_start === item?.date_end ? "single" : "multiple",
      });
    } else if (item?.setting_resume?.id_setting_resume == 19) {
      navigation.navigate("LateScreen", {
        resumeId,
        id_setting_resume,
        item,
        //leaveTypes: item?.date_start === item?.date_end ? "single" : "multiple",
      });
    } else if (item?.setting_resume?.id_setting_resume == 17) {
      navigation.navigate("EarlyLeaveScreen", {
        resumeId,
        id_setting_resume,
        item,
        //leaveTypes: item?.date_start === item?.date_end ? "single" : "multiple",
      });
    } else if (item?.setting_resume?.id_setting_resume == 18) {
      navigation.navigate("HourlyLeaveNoSalaryScreen", {
        resumeId,
        id_setting_resume,
        item,
        leaveTypes: item?.date_start === item?.date_end ? "single" : "multiple",
      });
    } else if (item?.setting_resume?.id_setting_resume == 14) {
      navigation.navigate("LeaveProScreen", {
        resumeId,
        id_setting_resume,
        item,
        leaveTypes: item?.date_start === item?.date_end ? "single" : "multiple",
      });
    } else if (item?.setting_resume?.id_setting_resume == 20) {
      navigation.navigate("AbsenceScreen", {
        resumeId,
        id_setting_resume,
        item,
        leaveTypes: "more",
      });
    } else {
      navigation.navigate("ModeScreen", {
        resumeId,
        id_setting_resume,
        name_setting_resume,
        item,
      });
    }
  };
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text allowFontScaling={false} style={styles.headerTitle}>
          Chi tiết Đơn từ
        </Text>
        <TouchableOpacity
          onPress={() =>
            backStatus === 1
              ? navigation.navigate("ListApplication")
              : notifiScreen === 1
              ? navigation.navigate("ListNotification")
              : navigation.goBack()
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
      <ScrollView showsVerticalScrollIndicator={false}>
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
              {item.staff.name}
            </Text>
            {/* <Text style={styles.value}>{item.id_setting_resume}</Text> */}
          </View>
          <View style={styles.infoRow}>
            <Text allowFontScaling={false} style={styles.label}>
              Mã nhân viên
            </Text>
            <Text allowFontScaling={false} style={styles.value}>
              {item.id_staff}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text allowFontScaling={false} style={styles.label}>
              Phòng ban
            </Text>
            <Text allowFontScaling={false} style={styles.value}>
              {item.staff.department}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text allowFontScaling={false} style={styles.label}>
              Vị trí
            </Text>
            <Text allowFontScaling={false} style={styles.value}>
              {item.staff.position}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text allowFontScaling={false} style={styles.label}>
              Chức vụ
            </Text>
            <Text allowFontScaling={false} style={styles.value}>
              {item.staff.position}
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
              {item.setting_resume.name_setting_resume}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text allowFontScaling={false} style={styles.label}>
              Thời gian tạo đơn
            </Text>
            <Text allowFontScaling={false} style={styles.value}>
              {formatDateToVN(item?.created_at)}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text allowFontScaling={false} style={styles.label}>
              Thời gian xin nghỉ
            </Text>
            <Text allowFontScaling={false} style={styles.value}>
              {formatDateToVN(item?.date_start)}
            </Text>
          </View>
          {item?.date_end !== null ? (
            <View style={styles.infoRow}>
              <Text allowFontScaling={false} style={styles.label}>
                Đến ngày
              </Text>
              <Text allowFontScaling={false} style={styles.value}>
                {formatDateToVN(item?.date_end)}
              </Text>
            </View>
          ) : (
            ""
          )}
          {item.id_setting_resume === 19 || item.id_setting_resume === 17 ? (
            <>
              {item?.time_start !== null ? (
                <View style={styles.infoRow}>
                  <Text allowFontScaling={false} style={styles.label}>
                    Từ
                  </Text>
                  <Text allowFontScaling={false} style={styles.value}>
                    {item?.time_start}
                  </Text>
                </View>
              ) : (
                <View style={styles.infoRow}>
                  <Text allowFontScaling={false} style={styles.label}>
                    Từ
                  </Text>
                  <Text allowFontScaling={false} style={styles.value}>
                    08:00:00
                  </Text>
                </View>
              )}
              {item?.time_end !== null ? (
                <View style={styles.infoRow}>
                  <Text allowFontScaling={false} style={styles.label}>
                    Đến
                  </Text>
                  <Text allowFontScaling={false} style={styles.value}>
                    {item?.time_end}
                  </Text>
                </View>
              ) : (
                <View style={styles.infoRow}>
                  <Text allowFontScaling={false} style={styles.label}>
                    Đến
                  </Text>
                  <Text allowFontScaling={false} style={styles.value}>
                    17:00:00
                  </Text>
                </View>
              )}
            </>
          ) : (
            <>
              {item?.time_start !== null ? (
                <View style={styles.infoRow}>
                  <Text allowFontScaling={false} style={styles.label}>
                    Từ
                  </Text>
                  <Text allowFontScaling={false} style={styles.value}>
                    {item?.time_start}
                  </Text>
                </View>
              ) : (
                ""
              )}
              {item?.time_end !== null ? (
                <View style={styles.infoRow}>
                  <Text allowFontScaling={false} style={styles.label}>
                    Đến
                  </Text>
                  <Text allowFontScaling={false} style={styles.value}>
                    {item?.time_end}
                  </Text>
                </View>
              ) : (
                ""
              )}
            </>
          )}

          <View style={styles.infoRow}>
            <Text allowFontScaling={false} style={styles.label}>
              Lí do
            </Text>
            <Text allowFontScaling={false} style={styles.value}>
              {item.description}
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
                item?.status_resume.id_status_resume === 1
                  ? styles.statusPending
                  : item?.status_resume.id_status_resume === 2
                  ? styles.statusActive
                  : styles.statusCancel,
              ]}
            >
              {item.status_resume.name_status}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text allowFontScaling={false} style={styles.label}>
              Người duyệt
            </Text>
            <Text allowFontScaling={false} style={styles.value}>
              {item.staff.manager}
            </Text>
          </View>
          {item?.status_resume?.id_status_resume === 1 && (
            <View style={styles.wrap_button}>
              <Button
                title="Sửa"
                size={10}
                backgroundColor="#23B26D"
                padding={12}
                borderRadius={30}
                width={Platform.OS == "ios" ? 170 : 184}
                onPress={() => {
                  handleUpdate();
                }}
              />
              <Button
                title="Xóa"
                size={10}
                backgroundColor="#D60000"
                padding={12}
                borderRadius={30}
                width={Platform.OS == "ios" ? 170 : 184}
                onPress={() => {
                  handleRemove();
                }}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </View>
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
    color: "#D4B740",
    backgroundColor: "#FEF9E1",
    fontWeight: "bold",
  },
  statusActive: {
    padding: 10,
    color: "#28A745",
    backgroundColor: "#EDF7E6",
    fontWeight: "bold",
  },
  statusCancel: {
    padding: 10,
    backgroundColor: "#FFE8E8",
    color: "#D60000",
    fontWeight: "bold",
  },
  wrap_button: {
    flexDirection: "row",
    gap: 15,
    justifyContent: "center",
    marginTop: 30,
    marginBottom: 90,
    //paddingHorizontal: Platform.OS == "ios" ? 20 : 20
  },
});

export default DetailScreen;
