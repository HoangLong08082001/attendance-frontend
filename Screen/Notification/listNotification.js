import { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  RefreshControl,
  Linking,
} from "react-native";
import CustomHeaderCalendar from "../../components/customHeaderCalendar";
import { AuthContext } from "../../contexts/AuthContext";
import { betweenTime } from "../../services/utils";
import { useToast } from "react-native-toast-notifications";
import Entypo from "@expo/vector-icons/Entypo";
import { useNotification } from "../../contexts/NotificationProvider";
import Ionicons from "@expo/vector-icons/Ionicons";

const ListNotification = (props) => {
  const toast = useToast();
  const { navigation } = props;
  const {
    listNotification,
    all,
    seen,
    sending,
    checkStatus,
    // setCheckStatus,
    handleCheckSeenNotification,
    handleGetListNotification,
    handleCheckSeenNotificationDelete,
    // resumeSelect,
    resumeDelete,
    userInfo,
  } = useContext(AuthContext);
  // Dữ liệu thông báo ban đầu
  const [tab, setTab] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedDates, setExpandedDates] = useState({}); // Trạng thái cho mỗi ngày

  const [visibleItems, setVisibleItems] = useState(3);

  const { expoPushToken } = useNotification();
  // Hàm xử lý khi nhấn vào thông báo
  const handleRead = async (id, request, status) => {
    if (userInfo.resumeSelect === true) {
      if (Object.keys(request).length !== 0) {
        if (status === false) {
          navigation.navigate("DetailManageScreen", {
            request,
            notifiScreen: 1,
          });
          await handleCheckSeenNotification(id);
        } else
          navigation.navigate("DetailManageScreen", {
            request,
            notifiScreen: 1,
          });
      } else {
        if (status === false) {
          resumeDelete(id);
          toast.show(`Đơn đã bị xoá`, {
            type: "warning",
            placement: "top",
            duration: 800,
            offset: 20,
            animationType: "slide-in",
            style: {
              marginTop: Platform.OS === "ios" ? 0 : 50, // Thêm marginTop tùy chỉnh
            },
          });
        } else {
          toast.show(`Đơn đã bị xoá`, {
            type: "warning",
            placement: "top",
            duration: 800,
            offset: 20,
            animationType: "slide-in",
            style: {
              marginTop: Platform.OS === "ios" ? 0 : 50, // Thêm marginTop tùy chỉnh
            },
          });
        }
      }
    } else {
      if (Object.keys(request).length !== 0) {
        if (status === false) {
          navigation.navigate("DetailScreen", {
            item: request,
            notifiScreen: 1,
          });
          await handleCheckSeenNotification(id);
        } else
          navigation.navigate("DetailScreen", {
            item: request,
            notifiScreen: 1,
          });
      } else {
        if (status === false) {
          resumeDelete(id);
          toast.show(`Đơn đã bị xoá`, {
            type: "warning",
            placement: "top",
            duration: 800,
            offset: 20,
            animationType: "slide-in",
            style: {
              marginTop: Platform.OS === "ios" ? 0 : 50, // Thêm marginTop tùy chỉnh
            },
          });
        } else {
          toast.show(`Đơn đã bị xoá`, {
            type: "warning",
            placement: "top",
            duration: 800,
            offset: 20,
            animationType: "slide-in",
            style: {
              marginTop: Platform.OS === "ios" ? 0 : 50, // Thêm marginTop tùy chỉnh
            },
          });
        }
      }
    }
  };
  const handleReadDelete = (id, status) => {
    if (status === false) {
      handleCheckSeenNotificationDelete(id);
    }
  };
  useEffect(() => {
    if (checkStatus === true) {
      toast.show(`Đã đánh dấu đọc`, {
        type: "success",
        placement: "top",
        duration: 800,
        offset: 20,
        animationType: "slide-in",
        style: {
          marginTop: Platform.OS === "ios" ? 0 : 50, // Thêm marginTop tùy chỉnh
        },
      });
    }
  }, [checkStatus]);
  const onRefresh = async () => {
    setIsRefreshing(true);
    await handleGetListNotification();
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
  const toggleDateVisibility = (date) => {
    setExpandedDates((prevState) => ({
      ...prevState,
      [date]: !prevState[date], // Chuyển đổi trạng thái của ngày đó
    }));
  };

  // const handleReadAll = () => {
  //   // Cập nhật tất cả các thông báo trong mảng data
  //   const updatedData = data.map((item) => ({
  //     ...item,
  //     notificationList: item.notificationList.map((notification) => ({
  //       ...notification,
  //       status: 1, // Đặt status thành 1 (đã đọc)
  //     })),
  //   }));

  //   // Cập nhật lại dữ liệu vào state
  //   setData(updatedData);
  // };

  // Hàm load thêm phần tử
  // const loadMore = () => {
  //   setVisibleItems(visibleItems + 3); // Mỗi lần nhấn "Load More", hiển thị thêm 3 phần tử
  // };
  useEffect(() => {
    // Mở tất cả các ngày khi bắt đầu
    const initialExpandedDates = {};
    listNotification.forEach((data) => {
      initialExpandedDates[data.date] = true; // Mở tất cả các ngày ban đầu
    });
    setExpandedDates(initialExpandedDates);
  }, [listNotification]);
  const filterNotifications = (notifications) => {
    switch (tab) {
      case 1:
        // Tab 1: Chỉ hiển thị ngày có ít nhất một thông báo có status === true
        return notifications.filter((item) => item.status === true);
      case 2:
        // Tab 2: Chỉ hiển thị ngày có ít nhất một thông báo có status === false
        return notifications.filter((item) => item.status === false);
      default:
        // Tab 0: Hiển thị tất cả các thông báo
        return notifications;
    }
  };

  return (
    <View>
      <CustomHeaderCalendar
        title="Thông báo"
        statusAction={0}
        handleBack={() => {
          const initialExpandedDates = {};
          listNotification.forEach((data) => {
            initialExpandedDates[data.date] = true; // Mở tất cả các ngày
          });
          setExpandedDates(initialExpandedDates);
          setTab(0);
          navigation.goBack();
        }}
      />
      {!expoPushToken ? (
        <View
          style={{
            backgroundColor: "#F5F5F5",
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
            padding: 10,
          }}
        >
          <Text style={{ width: 250, fontSize: 12, color: "gray" }}>
            Vui lòng cho phép thông báo để nhận các thông báo về đơn từ!
          </Text>
          <TouchableOpacity
            onPress={() => {
              if (Platform.OS === "ios") {
                // Mở cài đặt ứng dụng trên iOS
                Linking.openURL("app-settings:");
              } else {
                // Mở cài đặt chung trên Android
                Linking.openSettings();
              }
            }}
            style={{
              backgroundColor: "#0056d2",
              flexDirection: "column",
              justifyContent: "center",
              borderRadius: 15,
              width: 100,
            }}
          >
            <Text
              style={{
                alignItems: "center",
                fontSize: 12,
                textAlign: "center",
                color: "white",
                fontWeight: "600",
              }}
            >
              Cài đặt <Ionicons name="settings-sharp" size={12} color="white" />
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        ""
      )}
      <View style={styles.wrapper}>
        <View style={styles.tabNavigate}>
          <TouchableOpacity
            style={
              tab === 0 ? styles.tabContainer1Active : styles.tabContainer1
            }
            onPress={() => setTab(0)}
          >
            <Text
              allowFontScaling={false}
              style={
                tab === 0 ? styles.textTabHeaderActive : styles.textTabHeader
              }
            >
              Tất cả {all}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tab === 1 ? styles.tabContainerActive : styles.tabContainer}
            onPress={() => setTab(1)}
          >
            <Text
              allowFontScaling={false}
              style={
                tab === 1 ? styles.textTabHeaderActive : styles.textTabHeader
              }
            >
              Đã xem {seen}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={
              tab === 2 ? styles.tabContainer1Active : styles.tabContainer1
            }
            onPress={() => setTab(2)}
          >
            <Text
              allowFontScaling={false}
              style={
                tab === 2 ? styles.textTabHeaderActive : styles.textTabHeader
              }
            >
              Chưa xem {sending}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              colors={["#ff6347"]}
            />
          }
        >
          {listNotification.length > 0 ? (
            listNotification.map((data, dateIndex) => {
              const filteredNotificationList = filterNotifications(
                data.notificationList
              );

              if (filteredNotificationList.length === 0) {
                return null; // Nếu không có thông báo phù hợp với tab hiện tại thì không hiển thị ngày này
              }

              const sortedNotificationList = filteredNotificationList.sort(
                (a, b) => new Date(b.created_at) - new Date(a.created_at)
              );

              const handleDateToggle = () => toggleDateVisibility(data.date); // Toggle ngày

              return (
                <View key={dateIndex}>
                  <View style={styles.DateMonth}>
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={handleDateToggle}
                      style={styles.dateButton}
                    >
                      {data.date && (
                        <Text
                          allowFontScaling={false}
                          style={styles.textDateMonth}
                        >
                          {data.date}
                        </Text>
                      )}
                      <Text style={styles.arrowIcon}>
                        {expandedDates[data.date] ? (
                          <Entypo name="chevron-down" size={20} color="black" />
                        ) : (
                          <Entypo name="chevron-up" size={20} color="black" />
                        )}{" "}
                        {/* Mũi tên */}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Hiển thị danh sách thông báo nếu ngày được mở rộng */}
                  {expandedDates[data.date] &&
                    sortedNotificationList.map((item, notificationIndex) => {
                      let indexOfStartDate = item.body.indexOf("Ngày bắt đầu");
                      let resultString = item.body.substring(
                        0,
                        indexOfStartDate
                      );

                      return (
                        <TouchableOpacity
                          key={notificationIndex}
                          onPress={() =>
                            item?.body.includes("xóa")
                              ? handleReadDelete(item?.id, item?.status)
                              : handleRead(item?.id, item?.resume, item?.status)
                          }
                          style={
                            item.status === true
                              ? styles.itemNotification
                              : styles.itemNotificationNotRead
                          }
                        >
                          <View style={styles.left}>
                            <View style={styles.formImage}>
                              <Image
                                style={{ width: "100%", height: "100%" }}
                                source={require("../../assets/LOGO-APECGLOBAL-V.png")}
                              />
                            </View>
                          </View>
                          <View style={styles.middle}>
                            <Text
                              allowFontScaling={false}
                              style={
                                item.status === true
                                  ? styles.name
                                  : styles.nameNotRead
                              }
                            >
                              {item.title}
                            </Text>
                            <Text
                              allowFontScaling={false}
                              style={
                                item.status === true
                                  ? styles.descbNotRead
                                  : styles.descb
                              }
                            >
                              {item?.body?.includes("Ngày bắt đầu")
                                ? resultString
                                : item?.body}
                            </Text>
                            <Text
                              allowFontScaling={false}
                              style={
                                item.status === true
                                  ? styles.read
                                  : styles.readNotRead
                              }
                            >
                              {betweenTime(item.created_at)}
                            </Text>
                          </View>
                          <View style={styles.right}>
                            {item.status === true ? (
                              <></>
                            ) : (
                              <View style={styles.circleRed}></View>
                            )}
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                </View>
              );
            })
          ) : (
            <View style={{ flex: 1 }}>
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
                Chưa có thông báo
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "white",
    height: 820,
  },
  tabNavigate: {
    borderTopWidth: 0.2,
    backgroundColor: "white",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  tabContainer: {
    paddingVertical: 15,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "white",
  },
  textTabHeader: {
    textAlign: "center",
    alignItems: "center",
    fontSize: 15,
    color: "gray",
    fontWeight: "450",
    paddingHorizontal: 10,
  },
  tabContainer1: {
    paddingVertical: 10,
    flex: 0.7,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "white",
  },
  tabContainerActive: {
    paddingVertical: 15,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#034887",
  },
  textTabHeaderActive: {
    textAlign: "center",
    alignItems: "center",
    fontSize: 15,
    color: "#034887",
    fontWeight: "450",
    paddingHorizontal: 10,
  },
  tabContainer1Active: {
    paddingVertical: 10,
    flex: 0.7,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#034887",
  },
  DateMonth: {
    padding: 15,
    backgroundColor: "#fef2e8",
  },
  textDateMonth: {
    fontWeight: "350",
  },
  itemNotification: {
    flexDirection: "row",
    borderBottomWidth: 0.2,
  },
  itemNotificationNotRead: {
    flexDirection: "row",
    backgroundColor: "#f9fbff",
    borderBottomWidth: 0.2,
  },
  left: {
    flex: 1,
  },
  middle: {
    flex: 3,
  },
  name: {
    color: "#bdbdbd",
    marginVertical: 10,
    fontSize: 12,
  },

  nameNotRead: {
    color: "black",
    marginVertical: 10,
    fontSize: 12,
  },
  descb: {
    marginVertical: 10,
    fontSize: 12,
  },
  descbNotRead: {
    marginVertical: 10,
    fontSize: 12,
    color: "#bdbdbd",
  },
  read: {
    marginVertical: 10,
    fontSize: 12,
    color: "#bdbdbd",
  },
  readNotRead: {
    marginVertical: 10,
    fontSize: 12,
    color: "black",
  },
  right: {
    flex: 1,
  },
  formImage: {
    width: 50,
    height: 50,
    margin: "auto",
    borderRadius: 50,
  },
  circleNotRed: {
    width: 10,
    height: 10,
    borderRadius: 50,
    margin: "auto",
    backgroundColor: "green",
  },
  circleRed: {
    width: 10,
    height: 10,
    borderRadius: 50,
    margin: "auto",
    backgroundColor: "red",
  },
  list: { height: "100%", flex: 1 },
  dateButton: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default ListNotification;
