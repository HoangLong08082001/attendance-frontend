import { useContext, useEffect, useState } from "react";
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
import { resumeListForuser } from "../../services/api";
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

const YearScreen = ({ navigation, route }) => {
  const toast = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [applications, setApplications] = useState([]);

  const { userInfo } = useContext(AuthContext);

  const limit_resume_year = userInfo.limit_resume_year;
  // //// // //console.log("litmit_resume_year", limit_resume_year);

  const current_resume = userInfo.current_resume;

  const count_limit = limit_resume_year - current_resume;
  // //// // //console.log("current_resume", current_resume);
  const fetchApplications = async () => {
    try {
      const data = await resumeListForuser(); // Gọi hàm API để lấy dữ liệu
      if (data && data.resume) {
        const filteredApplications = data.resume.filter(
          (item) =>
            item.setting_resume.id_setting_resume === 1 ||
            item.setting_resume.id_setting_resume === 15
        );
        setApplications(filteredApplications);
      }
    } catch (error) {
      //console.error("Error fetching applications:", error);
    }
  };
  useEffect(() => {
    if (route.params?.reload) {
      fetchApplications();
    }

    fetchApplications(); // Gọi hàm fetch khi component mount
  }, [route.params?.reload]);
  const onRefresh = async () => {
    setIsRefreshing(true);
    await fetchApplications();
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
      onPress={() => navigation.navigate("DetailScreen", { item })}
    >
      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="umbrella-outline" size={24} color="#4F8EF7" />
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

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="chevron-back-circle-outline"
            size={30}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text allowFontScaling={false} style={styles.headerText}>
          Phép năm
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
        title={"Tạo mới đơn từ"}
        statusAction={1}
        handleBack={() => {
          navigation.goBack();
        }}
      />
      <View
        style={{
          flex: 1,
          padding: 16,
          backgroundColor: "#FFFFFF",
        }}
      >
        <View style={styles.wrap_count}>
          <Text allowFontScaling={false} style={styles.text_count}>
            Số phép còn lại: {count_limit}
          </Text>
          <Text allowFontScaling={false} style={styles.text_count}>
            Số phép đã sử dụng: {userInfo.current_resume ?? 0}
          </Text>
        </View>

        <FlatList
          data={applications} // Lấy dữ liệu đơn nghỉ phép từ context
          keyExtractor={(item) => item.id_resume.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
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
    marginLeft: 170,
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

  text_count: {
    fontSize: 16,
  },
});

export default YearScreen;
