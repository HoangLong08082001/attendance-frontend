import { useContext, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  RefreshControl,
  Platform,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { AuthContext } from "../../contexts/AuthContext";
import { convertDateFormat } from "../../services/utils";
import { useToast } from "react-native-toast-notifications";
import CustomHeaderCalendar from "../../components/customHeaderCalendar";
import DialogComponent from "../../components/DialogComponent";

const ApplicatonManagerScreen = (props) => {
  const toast = useToast();
  const {
    listResumeApplicationAdmin,
    getListResumeApplicationAdmin,
    resumeSuccess,
    setResumeSuccess,
  } = useContext(AuthContext);
  //const [isRefreshing, setIsRefreshing] = useState(false);
  // // // //console.log(listResumeApprlicationAdmin);
  const { navigation } = props;
  const [selectedTab, setSelectedTab] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const countPending = () => {
    return listResumeApplicationAdmin?.filter(
      (request) => request?.status_resume.id_status_resume === 1
    ).length;
  };
  const onRefresh = async () => {
    setIsRefreshing(true);
    await getListResumeApplicationAdmin();
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
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="chevron-back-circle-outline"
            size={24}
            color="#504A4A"
          />
        </TouchableOpacity>
        <Text allowFontScaling={false} style={styles.text_header}>
          {" "}
          Quản lí danh sách đơn từ
        </Text>
      </View> */}
      <CustomHeaderCalendar
        title={"Quản lí danh sách đơn từ"}
        statusAction={1}
        handleBack={() => {
          setSelectedTab(0);
          navigation.goBack();
        }}
      />
      {resumeSuccess === true && (
        <DialogComponent
          isVisible={resumeSuccess}
          message={"Duyệt đơn thành công"}
          onConfirm={() => setResumeSuccess(false)}
          title="Duyệt đơn"
          isOk={true}
          lotties={1}
          confirmText="OK"
          duration={500}
        />
      )}

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {[0, 1, 2, 3].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, selectedTab === tab && styles.activeTab]}
              onPress={() => setSelectedTab(tab)}
            >
              <Text
                allowFontScaling={false}
                style={[
                  styles.tabText,
                  selectedTab === tab && styles.activeTabText,
                ]}
              >
                {tab === 0
                  ? "Tất cả"
                  : tab === 1
                  ? `Chờ duyệt (${countPending()})`
                  : tab === 2
                  ? "Đã duyệt"
                  : "Từ chối"}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Request List */}
      <ScrollView
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.requestList}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing} // Trạng thái làm mới
            onRefresh={onRefresh} // Hàm xử lý khi kéo để làm mới
            colors={["#ff6347"]}
          />
        }
      >
        {listResumeApplicationAdmin.length > 0 ? (
          listResumeApplicationAdmin
            ?.filter(
              (request) =>
                selectedTab === 0 ||
                request?.status_resume?.id_status_resume === selectedTab
            )
            .map((request, index) => (
              <TouchableOpacity
                key={request?.id_resume}
                onPress={() =>
                  navigation.navigate("DetailManageScreen", { request })
                }
              >
                <View
                  key={index}
                  style={[styles.requestCard, { borderColor: "gray" }]}
                >
                  <View style={styles.requestHeader}>
                    <Image
                      source={{
                        uri: request?.staff?.avatar
                          ? request?.staff?.avatar
                          : "../../assets/avatar/user_default.png",
                      }}
                      style={styles.avatar}
                    />
                    <View style={styles.wrap_info}>
                      <Text allowFontScaling={false} style={styles.requestType}>
                        {request?.setting_resume?.name_setting_resume}
                      </Text>
                      <Text allowFontScaling={false} style={styles.userName}>
                        {request?.staff?.name}
                      </Text>
                      <Text
                        allowFontScaling={false}
                        style={styles.userDepartment}
                      >
                        {request?.staff?.department}
                      </Text>
                      <View style={styles.wrap_date}>
                        <AntDesign
                          name="clockcircleo"
                          size={15}
                          color="#97A0A9"
                        />
                        <Text allowFontScaling={false} style={styles.date}>
                          {" "}
                          {convertDateFormat(request?.created_at)}
                        </Text>
                      </View>
                      <Text allowFontScaling={false} style={styles.leaveType}>
                        Loại đơn:{" "}
                        {request?.setting_resume?.name_setting_resume?.toLowerCase()}{" "}
                      </Text>
                    </View>
                  </View>
                  <Text
                    allowFontScaling={false}
                    style={
                      request?.status_resume?.id_status_resume === 1
                        ? styles.status
                        : request?.status_resume?.id_status_resume === 2
                        ? styles.statusSuccess
                        : styles.statusCancel
                    }
                  >
                    {request?.status_resume?.name_status}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
        ) : (
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
              Chưa có thông tin đơn từ
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 10,
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
  tabContainer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#E8F2FF",
    height: 40,
    ///paddingVertical: 8,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 25,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderColor: "#007AFF",
  },
  tabText: {
    fontSize: 14,
    color: "#333",
  },
  activeTabText: {
    color: "#007AFF",
  },
  requestList: {
    padding: 16,
  },
  requestCard: {
    position: "relative",
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  requestHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  wrap_info: {
    gap: 5,
  },
  requestType: {
    fontSize: 16,
    fontWeight: "490",
  },
  userName: {
    fontSize: 14,
    color: "#36383A",
    fontWeight: "350",
  },
  userDepartment: {
    fontSize: 12,
    color: "#555",
    fontWeight: "350",
  },
  wrap_date: {
    flexDirection: "row",
    alignItems: "center",
  },
  date: {
    fontSize: 12,
    color: "#B1B2B4",
  },
  leaveType: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
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
    top: 10,
    color: "#D4B740",
    right: 10,
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
    top: 10,
    color: "#28A745",
    right: 10,
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
    top: 10,
    color: "#D60000",
    right: 10,
  },
});

export default ApplicatonManagerScreen;
