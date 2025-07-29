import { useContext, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  RefreshControl,
  Platform,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext } from "../../contexts/AuthContext";
import { convertDateFormat } from "../../services/utils";
import DialogComponent from "../../components/DialogComponent";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import SpinnerLoading from "../../components/SpinnerLoading";
import CustomHeaderCalendar from "../../components/customHeaderCalendar";
import { useToast } from "react-native-toast-notifications";

// const Stack = createNativeStackNavigator();

// const FilterHeader = ({ totalCount }) => (
//   <View style={styles.headerContainer}>
//     <Text allowFontScaling={false} style={styles.headerFilter}>
//       Tất cả ({totalCount})
//     </Text>
//     <TouchableOpacity style={styles.filterButton}>
//       <FontAwesome name="filter" size={20} color="gray" />
//     </TouchableOpacity>
//   </View>
// );

const ListScreen = ({ navigation, route }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const toast = useToast();

  const {
    listResumeApplication,
    resumeSuccess,
    setResumeSuccess,
    resumeRemoveSuccess,
    setResumeRemoveSuccess,
    setUpdateSuccess,
    updateSuccess,
    loading,
    exitsResume,
    setExitsResume,
    getListResumeApplication,
    resumeFails,
    setResumeFails,
  } = useContext(AuthContext);
  const getIconName = (name) => {
    if (name === 1) {
      return "umbrella-outline"; // Icon cho Đơn công tác
    } else if (name === 2) {
      return "bag-outline"; // Icon cho Đơn nghỉ phép
    } else if (name === 3) {
      return "checkmark-circle-outline";
    } else if (name === 4) {
      return "checkmark-circle-outline";
    } else if (name === 7) {
      return "person-outline";
    } else if (name === 6) {
      return "person-outline";
    } else if (name === 11) {
      return "person-outline";
    } else if (name === "Về sớm 1 giờ rước con học") {
      return "person-outline";
    } else if (name === 9) {
      return "person-outline";
    } else if (name === 8) {
      return "person-outline";
    } else if (name === 7) {
      return "person-outline";
    } else if (name === 12) {
      return "calendar-outline";
    } else if (name === 13) {
      return "log-out-outline";
    } else if (name === "Đơn nghỉ phép không lương") {
      return "free-cancellation";
    } else if (name === 15) {
      return "time-outline";
    } else if (name === 14) {
      return "people-outline";
    } else if (name === 16) {
      return "free-cancellation";
    } else if (name === 20) {
      return "bag-outline";
    } else if (name === 17) {
      return "timer-outline";
    } else if (name === 18) {
      return "calendar-times-o";
    } else if (name === 19) {
      return "timer-outline";
    }
    //return "clockcircleo";
  };
  const renderItem = ({ item }) => {
    if (item) {
      return (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("DetailScreen", { item, backStatus: 1 })
          }
        >
          <View style={styles.card}>
            <View style={styles.row}>
              {item.setting_resume.id_setting_resume === 16 ? (
                <MaterialIcons
                  name={getIconName(item.setting_resume.id_setting_resume)}
                  size={24}
                  color="#4F8EF7"
                />
              ) : item.setting_resume.id_setting_resume === 18 ? (
                <FontAwesome
                  name={getIconName(item.setting_resume.id_setting_resume)}
                  size={24}
                  color="#4F8EF7"
                />
              ) : (
                <Ionicons
                  name={getIconName(item.setting_resume.id_setting_resume)}
                  size={24}
                  color={
                    item.setting_resume.id_setting_resume === 13
                      ? "#D60000"
                      : "#4F8EF7"
                  }
                />
              )}
              <View style={styles.info}>
                <Text allowFontScaling={false} style={styles.title}>
                  {item.setting_resume.name_setting_resume}
                </Text>
                <View style={styles.wrap_time}>
                  <AntDesign
                    name="clockcircleo"
                    size={15}
                    color="97A0A9"
                    style={styles.icon_time}
                  />
                  <Text allowFontScaling={false} style={styles.time}>
                    {" "}
                    {convertDateFormat(item.date_start)}
                  </Text>
                </View>
                <Text allowFontScaling={false} style={styles.reason}>
                  Lý do: {item.description}
                </Text>
              </View>
              <Text
                allowFontScaling={false}
                style={
                  item?.status_resume?.id_status_resume === 1
                    ? styles.status
                    : item?.status_resume?.id_status_resume === 2
                    ? styles.statusSuccess
                    : styles.statusCancel
                }
              >
                {item.status_resume.name_status}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <View>
          <Text allowFontScaling={false}>asd</Text>
        </View>
      );
    }
  };
  // useEffect(() => {
  //   const fetchData = async () => {
  //     setIsRefreshing(true);
  //     await getListResumeApplication();
  //     setIsRefreshing(false);
  //   };

  //   fetchData();
  // }, []);
  const onRefresh = async () => {
    setIsRefreshing(true);
    await getListResumeApplication();
    setIsRefreshing(false);
    toast.show(`Đã tải lại trang`, {
      type: "success",
      placement: "top",
      duration: 800,
      offset: 20,
      animationType: "slide-in",
      style: {
        marginTop: Platform.OS === "ios" ? 0 : 50, // Thêm marginTop tùy chỉnh
      },
    });
  };
  return (
    <View style={styles.container}>
      {loading === true && <SpinnerLoading />}
      {exitsResume === true && (
        <DialogComponent
          isVisible={exitsResume}
          message={`Bạn đã tạo đơn trước đó cho ngày này`}
          onCancel={() => setExitsResume(false)}
          title="Tạo đơn"
          isCancel={true}
          isWarning={true}
          lotties={3}
          cancelText="Xác nhận"
          duration={500}
        />
      )}
      {resumeFails && (
        <DialogComponent
          isVisible={resumeFails}
          message={"Tạo đơn thất bại"}
          onConfirm={() => setResumeFails(false)}
          title="Tạo đơn"
          isOk={true}
          lotties={3}
          confirmText="OK"
          duration={500}
        />
      )}
      {resumeSuccess === true && (
        <DialogComponent
          isVisible={resumeSuccess}
          message={"Tạo đơn thành công"}
          onConfirm={() => setResumeSuccess(false)}
          title="Tạo đơn"
          isOk={true}
          lotties={1}
          confirmText="OK"
          duration={500}
        />
      )}
      {resumeRemoveSuccess === true && (
        <DialogComponent
          isVisible={resumeRemoveSuccess}
          message={"Xóa đơn thành công"}
          onConfirm={() => setResumeRemoveSuccess(false)}
          title="Xóa đơn"
          isOk={true}
          lotties={1}
          confirmText="OK"
          duration={500}
        />
      )}
      {updateSuccess === true && (
        <DialogComponent
          isVisible={updateSuccess}
          message={"Chỉnh sửa đơn thành công"}
          onConfirm={() => setUpdateSuccess(false)}
          title="Chỉnh sửa đơn"
          isOk={true}
          lotties={1}
          confirmText="OK"
          duration={500}
        />
      )}
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="chevron-back-circle-outline"
            size={30}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text allowFontScaling={false} style={styles.headerText}>
          Danh sách đơn từ
        </Text>
        <View style={styles.headerIcons}>
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={24}
            style={styles.icon}
          />
          <Ionicons
            name="notifications-outline"
            size={24}
            style={styles.icon}
          />
        </View>
      </View> */}
      <CustomHeaderCalendar
        title={"Danh sách đơn từ"}
        statusAction={1}
        handleBack={() => navigation.goBack()}
      />
      <View
        style={{
          flex: 1,
          padding: 16,
          backgroundColor: "#FFFFFF",
        }}
      >
        <FlatList
          data={listResumeApplication?.sort(
            (a, b) => new Date(b?.created_at) - new Date(a?.created_at)
          )} // Lấy dữ liệu đơn nghỉ phép từ context
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing} // Trạng thái làm mới
              onRefresh={onRefresh} // Hàm xử lý khi kéo để làm mới
              colors={["#ff6347"]}
            />
          }
          ListEmptyComponent={
            <View
              style={{
                flex: 1,
              }}
            >
              <Text
                allowFontScaling={false}
                style={{
                  justifyContent: "center",
                  alignContent: "center",
                  textAlign: "center",
                  marginVertical: 30,
                  color: "gray",
                  fontStyle: "italic",
                }}
              >
                Chưa có thông tin tạo đơn
              </Text>
            </View>
          }
        />

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("CreateScreen")}
          >
            <FontAwesome name="plus" size={20} color="#fff" />
          </TouchableOpacity>
          <Text allowFontScaling={false} style={styles.addButtonText}>
            Tạo đơn mới
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    borderWidth: 1,
  },
  backIcon: {
    marginRight: 10,
  },
  headerText: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
  },
  headerIcons: {
    flexDirection: "row",
    marginLeft: 100,
  },
  icon: {
    marginHorizontal: 10,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#E9F3FF",
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  headerFilter: {
    fontSize: 16,
    color: "#333",
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  filterButton: {
    padding: 5,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  list: {
    paddingBottom: 60,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#B9BDC1",
    position: "relative",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  info: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
  },
  wrap_time: {
    flexDirection: "row",
  },
  icon_time: {
    marginTop: 9,
    fontSize: 14,
  },
  time: {
    fontSize: 14,
    color: "#B1B2B4",
    marginTop: 5,
  },
  reason: {
    fontSize: 14,
    color: "#888",
    marginTop: 5,
  },
  status: {
    backgroundColor: "#FEF9E1",
    position: "absolute",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
    color: "black",
    fontWeight: "bold",
    top: 0,
    color: "#D4B740",
    right: 0,
  },
  statusSuccess: {
    backgroundColor: "#EDF7E6",
    position: "absolute",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
    color: "black",
    fontWeight: "bold",
    top: 0,
    color: "#28A745",
    right: 0,
  },
  statusCancel: {
    backgroundColor: "#FFE8E8",
    position: "absolute",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
    color: "black",
    fontWeight: "bold",
    top: 0,
    color: "#D60000",
    right: 0,
  },
  footer: {
    alignItems: "center",
    bottom: 25,
    shadowColor: "#000", // Màu shadow
    shadowOpacity: 0.3, // Độ mờ của shadow
    shadowRadius: 6, // Độ lan tỏa của shadow
    elevation: 5,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F08313",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  addButtonText: {
    color: "black",
    fontSize: 16,
    marginLeft: 8,
    marginTop: 10,
  },
});

export default ListScreen;
