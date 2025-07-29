import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { convertDateFormat } from "../../services/utils";
import CustomHeaderCalendar from "../../components/customHeaderCalendar";

const StaffDetailScreen = (props) => {
  const { navigation, route } = props;
  const { item } = route.params;

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={()=> navigation.goBack()}>
        <Ionicons
          name="chevron-back-circle-outline"
          size={24}
          color="#504A4A"
        />
        </TouchableOpacity>
        <Text allowFontScaling={false} style={styles.text_header}>
          {" "}
          Quản lí nhân viên
        </Text>       
      </View> */}
      <CustomHeaderCalendar
        title={"Quản lí nhân viên"}
        statusAction={1}
        handleBack={() => {
          navigation.navigate("StaffManager");
        }}
      />
      <View style={styles.profile}>
        <Image source={{ uri: item?.avatar }} style={styles.avatar} />
        <View style={styles.infoContainer}>
          <Text allowFontScaling={false} style={styles.name}>
            {item?.name}
          </Text>
          <Text allowFontScaling={false} style={styles.userId}>
            {item?.id_staff}
          </Text>
          <Text allowFontScaling={false} style={styles.department}>
            {item?.department} | {item?.position}
          </Text>
          {/* <Text allowFontScaling={false} style={styles.separator}> | </Text> */}
          {/* <Text allowFontScaling={false} style={styles.position}>{employeeData.position}</Text> */}
        </View>
      </View>
      <View style={styles.section}>
        <Text allowFontScaling={false} style={styles.sectionTitle}>
          Thông tin Nhân viên
        </Text>
        <View style={styles.infoRow}>
          <Text allowFontScaling={false} style={styles.label}>
            Họ và tên
          </Text>
          <Text allowFontScaling={false} style={styles.value}>
            {item?.name}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text allowFontScaling={false} style={styles.label}>
            Mã nhân viên
          </Text>
          <Text allowFontScaling={false} style={styles.value}>
            {item?.id_staff}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text allowFontScaling={false} style={styles.label}>
            Phòng ban
          </Text>
          <Text allowFontScaling={false} style={styles.value}>
            {item?.department}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text allowFontScaling={false} style={styles.label}>
            Vị trí
          </Text>
          <Text allowFontScaling={false} style={styles.value}>
            {item?.position}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text allowFontScaling={false} style={styles.label}>
            Chức vụ
          </Text>
          <Text allowFontScaling={false} style={styles.value}>
            {item?.position}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text allowFontScaling={false} style={styles.label}>
            Ngày tham gia
          </Text>
          <Text allowFontScaling={false} style={styles.value}>
            {convertDateFormat(item?.created_at)}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text allowFontScaling={false} style={styles.label}>
            Số điện thoại
          </Text>
          <Text allowFontScaling={false} style={styles.value}>
            {item?.phone}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text allowFontScaling={false} style={styles.label}>
            Email
          </Text>
          <Text allowFontScaling={false} style={styles.value}>
            {item?.email}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text allowFontScaling={false} style={styles.label}>
            Ngày sinh
          </Text>
          <Text allowFontScaling={false} style={styles.value}>
            {item?.birth}
          </Text>
        </View>
      </View>
      <View>
        <Text
          allowFontScaling={false}
          style={[styles.sectionTitle, { marginTop: 30 }]}
        >
          Thông tin nhân viên
        </Text>
        <View style={styles.listConvenience}>
          <TouchableOpacity
            onPress={() => navigation.navigate("ListApplication")}
            style={[styles.Convenience, { backgroundColor: "#e8f2ff" }]}
          >
            <MaterialCommunityIcons
              name="card-text-outline"
              size={24}
              color="black"
              style={styles.iconConvenience}
            />
            <Text allowFontScaling={false} style={styles.textConvenience}>
              Đơn từ
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            // onPress={() => setAlert(true)}
            style={[styles.Convenience, { backgroundColor: "#f1f8ec" }]}
          >
            <MaterialCommunityIcons
              name="file-document-edit-outline"
              size={24}
              color="black"
              style={styles.iconConvenience}
            />
            <Text allowFontScaling={false} style={styles.textConvenience}>
              Phép năm
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            //onPress={() => setAlert(true)}
            style={[styles.Convenience, { backgroundColor: "#fef2e8" }]}
          >
            <MaterialCommunityIcons
              name="file-document-outline"
              size={24}
              color="black"
              style={styles.iconConvenience}
            />
            <Text allowFontScaling={false} style={styles.textConvenience}>
              Chấm công
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            //onPress={() => setAlert(true)}
            style={[styles.Convenience, { backgroundColor: "#fae9fb" }]}
          >
            <AntDesign
              style={styles.iconConvenience}
              name="calendar"
              size={24}
              color="black"
            />
            <Text allowFontScaling={false} style={styles.textConvenience}>
              Công việc
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    backgroundColor: "#FFF",
    height: "100%",
  },
  header: {
    flexDirection: "row",
    padding: 20,
    alignItems: "center",
  },
  text_header: {
    fontSize: 18,
    fontWeight: "500",
  },
  profile: {
    marginTop: 10,
    flexDirection: "row",
    gap: 20,
    //padding: 20,
    paddingHorizontal: 20,
  },
  avatar: {
    width: 86,
    height: 86,
    borderRadius: 40,
    marginBottom: 8,
  },
  infoContainer: {
    alignItems: "center",
    gap: 6,
  },
  name: {
    color: "#034887",
    fontSize: 24,
    fontWeight: "700",
  },
  userId: {
    color: "#B9BDC1",
    fontSize: 12,
    fontWeight: "400",
  },
  department: {
    color: "#36383A",
    fontWeight: "400",
    fontSize: 12,
  },
  section: {
    marginTop: 15,
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
    marginTop: 8,
  },
  label: {
    color: "#97A0A9",
    fontSize: 14,
  },
  value: {
    color: "#36383A",
    fontSize: 14,
  },

  title: {
    fontSize: 20,
    marginTop: 10,
  },
  listConvenience: {
    // height: 150,
    paddingTop: 10,
    //width: 400,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  Convenience: {
    padding: 19,
    borderRadius: 20,
  },
  textConvenience: {
    textAlign: "center",
  },
  iconConvenience: {
    textAlign: "center",
  },
  textBack: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 20,
  },
});

export default StaffDetailScreen;
