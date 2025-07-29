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
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ReactNativeModal } from "react-native-modal"; // Import Modal component
import { AuthContext } from "../../contexts/AuthContext";
import CustomHeaderCalendar from "../../components/customHeaderCalendar";
import { useToast } from "react-native-toast-notifications";

const Stack = createNativeStackNavigator();

// const getLateOrEarlyMessage = (time, defaultTime, messagePrefix) => {
//   // Nếu time là null hoặc undefined, gán giá trị mặc định
//   if (!time) {
//     time = defaultTime;
//   }

//   // Chuyển đổi time và defaultTime thành đối tượng Date để tính toán
//   const timeDate = new Date(`1970-01-01T${time}Z`);
//   const defaultDate = new Date(`1970-01-01T${defaultTime}Z`);

//   // Tính sự chênh lệch thời gian (millisecond)
//   const diffInMilliseconds = timeDate - defaultDate;

//   // Nếu không có sự chênh lệch (bằng 0), không cần hiển thị thông báo
//   if (diffInMilliseconds === 0) {
//     return "";
//   }

//   // Chuyển đổi sự chênh lệch từ milliseconds sang giờ và phút
//   const diffInMinutes = Math.floor(Math.abs(diffInMilliseconds) / 60000);
//   const diffInHours = Math.floor(diffInMinutes / 60);
//   const remainingMinutes = diffInMinutes % 60;

//   // Tạo thông báo đi trễ hoặc về sớm
//   let message = messagePrefix;
//   if (diffInMilliseconds > 0) {
//     // Trễ
//     message += " Được đi trễ";
//   } else {
//     // Về sớm
//     message += " Được về sớm";
//   }

//   // Thêm phần giờ và phút
//   if (diffInHours > 0) {
//     message += ` ${diffInHours} tiếng`;
//   }
//   if (remainingMinutes > 0) {
//     message += ` ${remainingMinutes} phút`;
//   }

//   return message;
// };

const CreateScreen = (props) => {
  const toast = useToast();

  const { navigation } = props;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [hasClickedMode, setHasClickedMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { listModeResume, typeResumeCategory, getCategoryResume, loading } =
    useContext(AuthContext);
  const closeModal = () => {
    setIsModalVisible(false);
    setHasClickedMode(false);
  };
  // useEffect(() => {
  //   const fetchData = async () => {
  //     setIsRefreshing(true);
  //     await getCategoryResume();
  //     setIsRefreshing(false);
  //   };

  //   fetchData();
  // }, []);
  const onRefresh = async () => {
    setIsRefreshing(true);
    await getCategoryResume();
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
  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        if (item.id_setting_resume === 1) {
          navigation.navigate("LeaveScreen"); // Navigate to LeaveApplication screen
        }
        if (item.id_setting_resume === 2) {
          navigation.navigate("AbsenceScreen"); // Navigate to AbsenteeApplication screen
        }
        if (item.id_setting_resume === 3) {
          navigation.navigate("CheckScreen"); // Navigate to AbsenteeApplication screen
        }
        if (item.id_setting_resume === 7) {
          navigation.navigate("ModeScreen"); // Navigate to AbsenteeApplication screen
        }
        if (item.id_setting_resume === 12) {
          navigation.navigate("LongLeaveScreen"); // Navigate to AbsenteeApplication screen
        }
        if (item.id_setting_resume === 13) {
          navigation.navigate("ResignationScreen"); // Navigate to AbsenteeApplication screen
        }
        // if (item.id_setting_resume === "7") {
        //   navigation.navigate("HourlyLeaveScreen"); // Navigate to AbsenteeApplication screen
        // }
        if (item.id_setting_resume === 16) {
          navigation.navigate("LeaveNoMoneyScreen"); // Navigate to AbsenteeApplication screen
        }
        if (item.id_setting_resume === 14) {
          navigation.navigate("LeaveProScreen"); // Navigate to AbsenteeApplication screen
        }
        if (item.id_setting_resume === 18) {
          navigation.navigate("HourlyLeaveNoSalaryScreen"); // Navigate to AbsenteeApplication screen
        }
        if (item.id_setting_resume === 17) {
          navigation.navigate("EarlyLeaveScreen"); // Navigate to AbsenteeApplication screen
        }
        if (item.id_setting_resume === 19) {
          navigation.navigate("LateScreen"); // Navigate to AbsenteeApplication screen
        }
      }}
    >
      {item.id_setting_resume !== 19 &&
        item.id_setting_resume !== 17 &&
        item.id_setting_resume !== 16 &&
        item.id_setting_resume !== 20 && (
          <View style={styles.card}>
            <View style={styles.row}>
              <View
                padding={20}
                backgroundColor={item.BackgroundColor}
                borderRadius={50}
              >
                {item.id_setting_resume === 16 ? (
                  <MaterialIcons
                    name={item.icon}
                    size={35}
                    color={item?.color === "" ? "#4F8EF7" : item.color}
                  />
                ) : item.id_setting_resume === 18 ? (
                  <FontAwesome
                    name={item.icon}
                    size={35}
                    color={item?.color === "" ? "#4F8EF7" : item.color}
                  />
                ) : (
                  <Ionicons
                    name={item.icon}
                    size={35}
                    color={item?.color === "" ? "#4F8EF7" : item.color}
                  />
                )}
              </View>
              <View style={styles.info}>
                <Text allowFontScaling={false} style={styles.title}>
                  {item.id_setting_resume === 3 || item.id_setting_resume === 4
                    ? "Đơn checkin/checkout"
                    : item.name_setting_resume}
                </Text>
                <Text
                  allowFontScaling={false}
                  style={styles.time}
                  numberOfLines={3}
                >
                  {item.description}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    if (!hasClickedMode) {
                      // Set the state to show the modal
                      setIsModalVisible(true);
                      setSelectedItem(item);
                      setHasClickedMode(true);
                    }
                  }}
                >
                  <Text style={styles.readMore}>
                    Xem chi tiết{"  "}
                    <AntDesign
                      name="exclamationcircleo"
                      size={12}
                      color="#FFCC00"
                    />
                  </Text>
                </TouchableOpacity>
              </View>
              <Text
                allowFontScaling={false}
                style={[styles.status, { backgroundColor: item.statusColor }]}
              >
                {item.status}
              </Text>
            </View>
            {/* {
          item.id === "4" && (
            <TouchableOpacity style={styles.warningIcon} onPress={() => { 
                 if (!hasClickedMode) {
                   // Set the state to show the modal
                   setIsModalVisible(true);
                   setHasClickedMode(true);
            }}}>
          <AntDesign name="exclamationcircleo" size={24} color="orange" />
        </TouchableOpacity>
          )
        } */}
          </View>
        )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <CustomHeaderCalendar
        title={"Tạo mới đơn từ"}
        statusAction={1}
        handleBack={() => navigation.navigate("ListApplication")}
      />
      <View
        style={{
          flex: 1,
          padding: 16,
          backgroundColor: "#FFFFFF",
        }}
      >
        <FlatList
          data={typeResumeCategory}
          keyExtractor={(item) => item.id_setting_resume}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false} // Ẩn thanh cuộn dọc
          showsHorizontalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing} // Trạng thái làm mới
              onRefresh={onRefresh} // Hàm xử lý khi kéo để làm mới
              colors={["#ff6347"]}
            />
          }
        />

        <ReactNativeModal
          isVisible={isModalVisible}
          onBackdropPress={closeModal}
          onBackButtonPress={closeModal}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {selectedItem?.name_setting_resume}
            </Text>
            <View style={styles.scrollContainer}>
              {selectedItem ? (
                <Text style={styles.modalText}>
                  <Text style={styles.description}>
                    {selectedItem.description}
                  </Text>
                </Text>
              ) : (
                <Text>No description available</Text>
              )}
            </View>
            <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
              <Text style={styles.modalButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </ReactNativeModal>
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
    marginLeft: 130,
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
    position: "relative",
    backgroundColor: "#fff",
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#B9BDC1",
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

  time: {
    fontSize: 14,
    color: "#B1B2B4",
    marginTop: 5,
    lineHeight: 18,
  },
  reason: {
    fontSize: 14,
    color: "#888",
    marginTop: 5,
  },
  status: {
    fontSize: 12,
    color: "#fff",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    overflow: "hidden",
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
  scrollContainer: {
    height: 210,
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    lineHeight: 21,
  },
  modalTextTime: {
    fontSize: 14,
    color: "gray",
  },
  modalButton: {
    marginTop: 15,
    backgroundColor: "#F08313",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
  },
  description: {
    color: "gray",
  },
  wrapText: {
    // flexDirection: "row",
    // justifyContent: "space-between",
  },
  wrapTime: {
    marginLeft: -3,
    marginTop: 4,
    marginBottom: 7,
  },
  modalItem: {
    marginTop: 10,
    // borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    // borderBottomWidth: 1
  },
  modalItemWithBorder: {
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
    borderBottomWidth: 1,
  },
  warningIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  readMore: {
    color: "#FFCC00",
    fontWeight: "500",
    marginTop: 10,
    fontSize: 12,
  },
});

export default CreateScreen;
