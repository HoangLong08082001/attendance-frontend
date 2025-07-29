import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  RefreshControl,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { AuthContext } from "../../contexts/AuthContext";
import CustomHeaderCalendar from "../../components/customHeaderCalendar";
import { useToast } from "react-native-toast-notifications";

const StaffManager = (props) => {
  const toast = useToast();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const { navigation } = props;
  const { listStaffManager, getListStaffManager } = useContext(AuthContext);

  const filteredEmployees = listStaffManager.filter((employee) =>
    employee?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const onRefresh = async () => {
    setIsRefreshing(true);
    await getListStaffManager();
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
  const renderEmployeeItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("StaffDetailScreen", { item })}
    >
      <View style={styles.employeeContainer}>
        <Image source={{ uri: item?.avatar }} style={styles.avatar} />
        <View style={styles.employeeInfo}>
          <Text allowFontScaling={false} style={styles.employeeName}>
            {item?.name.toUpperCase()}
          </Text>
          <Text allowFontScaling={false} style={styles.employeeId}>
            Mã số: {item?.id_staff}
          </Text>
          <Text allowFontScaling={false} style={styles.employeeDepartment}>
            {item?.department} - {item?.position}
          </Text>
          {/* {item.status && (
          <View style={styles.statusContainer}>
            <Text allowFontScaling={false} style={styles.statusText}>
              {item.status}
            </Text>
          </View>
        )} */}
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
          navigation.goBack();
        }}
      />
      <View style={styles.wrap_body}>
        <View style={styles.searchInput}>
          <AntDesign
            name="search1"
            size={24}
            color="#B9BDC1"
            style={styles.search_icon}
          />
          <TextInput
            allowFontScaling={false}
            placeholder="Tìm kiếm theo tên nhân viên, phòng ban,..."
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
            style={{
              marginLeft: 5,
              fontSize: 13,
              color: "#B9BDC1",
              fontWeight: "400",
            }}
          />
        </View>
        <FlatList
          data={filteredEmployees}
          renderItem={renderEmployeeItem}
          keyExtractor={(item) => item?.id_staff}
          contentContainerStyle={styles.listContainer}
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
                Chưa có nhân viên
              </Text>
            </View>
          }
        />
      </View>
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
  wrap_body: {
    paddingHorizontal: 16,
    marginTop: 10,
  },
  search_icon: {
    alignSelf: "center",
  },
  searchInput: {
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    fontSize: 16,
    borderRadius: 30,
    fontSize: 13,
    color: "#B9BDC1",
    flexDirection: "row",
  },
  listContainer: {
    paddingBottom: 16,
    height: "100%",
  },
  employeeContainer: {
    position: "relative",
    flexDirection: "row",
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#FFF",
    marginBottom: 12,
    alignItems: "center",
    borderColor: "#B9BDC1",
    borderWidth: 1,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 50,
    marginRight: 16,
  },
  employeeInfo: {
    flex: 1,
    gap: 5,
  },
  employeeName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#36383A",
  },
  employeeId: {
    fontSize: 14,
    fontWeight: "400",
    color: "#36383A",
  },
  employeeDepartment: {
    fontSize: 12,
    fontWeight: "400",
    color: "#36383A",
  },
  statusContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#FEF9E1",
    height: 21,
    width: 102,
    justifyContent: "center",
    alignItems: "center",
  },
  statusText: {
    color: "#F08313",
    fontSize: 12,
  },
});

export default StaffManager;
