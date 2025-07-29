import { useContext, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Image,
  Platform,
  ScrollView,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useToast } from "react-native-toast-notifications";

import AntDesign from "@expo/vector-icons/AntDesign";
//import { TouchableOpacity } from "react-native-gesture-handler";

// import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext } from "../../contexts/AuthContext";
import { convertDateFormat, formatDateStringBirth } from "../../services/utils";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import DialogComponent from "../../components/DialogComponent";
import ImageViewer from "react-native-image-zoom-viewer";
import SpinnerLoadingHome from "../../components/SpinnerLoadingHome";

// const Stack = createNativeStackNavigator();

const ProfileManage = (props) => {
  const { navigation } = props;

  const [isRefreshing, setIsRefreshing] = useState(false);
  const toast = useToast();
  const {
    userInfo,
    pickImage,
    avatar,
    // setUserInfo,
    // slogan,
    // setSlogan,
    // resumeSuccess,
    changeUserProfile,
    // loading,
    // setResumeSuccess,
    changeSlogan,
    setChangeSlogan,
    loadUserInfo,
    // loadingHome,
    loadingScreen,
    isAnnual,
    setIsAnnual,
  } = useContext(AuthContext);
  const [alert, setAlert] = useState(false);
  const [sologan, setSologan] = useState(userInfo.slogan);
  const [isEditingSlogan, setIsEditingSlogan] = useState(false);
  const [name, setName] = useState(userInfo.name);
  const [isModalVisible, setModalVisible] = useState(false);

  const images = [
    {
      // url: avatar
      //   ? `data:image/gif;base64,${avatar}`
      //   : require("../../assets/avatar/user_default.png"),
      url: userInfo?.avatar
        ? avatar
          ? `data:image/gif;base64,${avatar}`
          : userInfo?.avatar
        : require("../../assets/avatar/user_default.png"),
    },
  ];
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleSaveProfile = () => {
    // Gọi hàm changeUserProfile từ context khi người dùng thay đổi tên và slogan
    changeUserProfile(name, sologan);
    // //// // //console.log(sologan);
    setIsEditingSlogan(false);
  };
  // useEffect(() => {
  //   const fetchData = async () => {
  //     setIsRefreshing(true);
  //     await loadUserInfo();
  //     setIsRefreshing(false);
  //   };

  //   fetchData();
  // }, []);
  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadUserInfo();
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
    <SafeAreaView style={styles.container}>
      {loadingScreen === true && <SpinnerLoadingHome />}
      {alert === true && (
        <DialogComponent
          isVisible={alert}
          icon="ios-information-circle"
          message="Tính năng đang được phát triển"
          onConfirm={() => setAlert(false)}
          onCancel={() => setAlert(false)}
          title="Thông báo"
          isWarning={true}
          lotties={3}
          isCancel={true}
          cancelText={"Thoát"}
          duration={500} // Thời gian hiệu ứng (500ms)
        />
      )}
      {changeSlogan === true && (
        <DialogComponent
          isVisible={changeSlogan}
          message="Thay đổi slogan thành công"
          onConfirm={() => setChangeSlogan(false)}
          onCancel={() => setChangeSlogan(false)}
          title="Thông báo"
          isOk={true}
          lotties={1}
          confirmText={"Xác nhận"}
          duration={500} // Thời gian hiệu ứng (500ms)
        />
      )}
      <View
        style={{
          backgroundColor: "#e8f2ff",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 100,
        }}
      >
        <Text
          allowFontScaling={false}
          style={{
            textAlign: "center",
            marginTop: 50,
            fontWeight: "500",
            fontSize: 17,
          }}
        >
          Thông tin
        </Text>
      </View>
      <View style={styles.top}>
        <View style={styles.header}>
          <View style={styles.btnBack}>
            {/* <AntDesign name="leftcircleo" style={styles.iconBack} /> */}
          </View>
        </View>
        <View style={styles.avatar}>
          <TouchableOpacity style={styles.formImage}>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Image
                style={styles.image} // Chỉnh sửa kích thước hình ảnh tùy ý
                source={
                  avatar
                    ? {
                        uri: `data:image/gif;base64,${avatar}`,
                      }
                    : userInfo?.avatar
                    ? {
                        uri: `${userInfo?.avatar}`,
                      }
                    : require("../../assets/avatar/user_default.png")
                }
              />
            </TouchableOpacity>
            <Modal
              visible={isModalVisible}
              transparent={true}
              onRequestClose={() => setModalVisible(false)}
            >
              <TouchableWithoutFeedback onPress={handleCloseModal}>
                <View
                  style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.7)" }}
                  onPress={handleCloseModal}
                >
                  <ImageViewer
                    imageUrls={images}
                    onSwipeDown={() => setModalVisible(false)} // Tắt modal khi vuốt xuống
                    enableSwipeDown={true} // Cho phép vuốt xuống để đóng modal
                    renderIndicator={() => null}
                  />
                  <TouchableWithoutFeedback onPress={handleCloseModal}>
                    <View
                      style={{
                        position: "absolute",
                        top: 40,
                        right: 15,
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        borderRadius: 50,
                        padding: 10,
                      }}
                    >
                      <AntDesign name="close" size={30} color="white" />
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
            <TouchableOpacity onPress={pickImage}>
              <View style={styles.iconCamera}>
                <MaterialCommunityIcons
                  name="camera-plus-outline"
                  size={24}
                  color="black"
                />
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
        <View style={styles.infoPostion}>
          <Text allowFontScaling={false} style={styles.name}>
            {userInfo.name}
          </Text>
          <Text allowFontScaling={false} style={styles.idUser}>
            {userInfo.id_staff}
          </Text>
          <Text allowFontScaling={false} style={styles.positionName}>
            Phòng chức năng | Chuyên viên kỹ thuật
          </Text>
          <View style={styles.wrap_slogan}>
            <View
              style={{
                width: isEditingSlogan ? "80%" : 200,
                flexDirection: isEditingSlogan ? "column" : "row",
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: 10,
              }}
            >
              <View
                style={{
                  width: "100%",
                  textAlign: "center",

                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {isEditingSlogan ? (
                  <TextInput
                    allowFontScaling={false}
                    placeholder="Slogan cá nhân"
                    value={sologan}
                    onChangeText={setSologan} // Cập nhật slogan khi người dùng nhập
                  />
                ) : (
                  <Text
                    allowFontScaling={false}
                    style={{
                      color: sologan ? "black" : "gray",
                      fontStyle: sologan ? "" : "italic",
                      textAlign: "center",
                      fontWeight: sologan ? "300" : "",
                    }}
                  >
                    {sologan ? sologan : "Slogan cá nhân"}
                  </Text>
                )}
              </View>
              {isEditingSlogan ? (
                <View
                  style={{ flexDirection: "row", gap: 5, marginLeft: "auto" }}
                >
                  <TouchableOpacity
                    style={styles.iconWrapper}
                    onPress={handleSaveProfile}
                  >
                    <Text allowFontScaling={false}>Lưu</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setIsEditingSlogan(!isEditingSlogan)} // Chuyển sang chế độ chỉnh sửa
                    style={styles.iconWrapper}
                  >
                    <Text allowFontScaling={false}>Huỷ</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    setIsEditingSlogan(!isEditingSlogan);
                  }} // Chuyển sang chế độ chỉnh sửa
                  style={styles.iconWrapper}
                >
                  <MaterialCommunityIcons
                    name="pencil-circle-outline"
                    size={30}
                    color="black"
                    style={styles.icon_pencil}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
      <ScrollView
        style={styles.bottom}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing} // Trạng thái làm mới
            onRefresh={onRefresh} // Hàm xử lý khi kéo để làm mới
            colors={["#ff6347"]}
          />
        }
      >
        <View style={styles.wrap_titleInfo}>
          <Text allowFontScaling={false} style={styles.title}>
            Thông tin cá nhân
          </Text>
        </View>
        <View style={styles.infoCareer}>
          <View style={styles.iconText}>
            <AntDesign name="phone" size={15} color="gray" />
            <Text
              allowFontScaling={false}
              style={{ color: "gray", fontSize: 15, marginLeft: 10 }}
            >
              Số điện thoại
            </Text>
          </View>

          <Text allowFontScaling={false} style={styles.textInfo}>
            {userInfo.phone}
          </Text>
        </View>
        <View style={styles.infoCareer}>
          <View style={styles.iconText}>
            <SimpleLineIcons name="envelope" size={15} color="gray" />
            <Text
              allowFontScaling={false}
              style={{ color: "gray", fontSize: 15, marginLeft: 10 }}
            >
              Email
            </Text>
          </View>
          <Text allowFontScaling={false} style={styles.textInfo}>
            {userInfo.email}
          </Text>
        </View>
        <View style={styles.infoCareer}>
          <View style={styles.iconText}>
            <MaterialCommunityIcons
              name="cake-variant-outline"
              size={20}
              color="gray"
            />
            <Text
              allowFontScaling={false}
              style={{ color: "gray", fontSize: 15, marginLeft: 10 }}
            >
              Ngày sinh
            </Text>
          </View>
          <Text allowFontScaling={false} style={styles.textInfo}>
            {formatDateStringBirth(userInfo.birth)}
          </Text>
        </View>
        <View style={styles.infoCareer}>
          <View style={styles.iconText}>
            <Ionicons name="calendar-outline" size={20} color="gray" />
            <Text
              allowFontScaling={false}
              style={{ color: "gray", marginLeft: 10 }}
            >
              Ngày tham gia
            </Text>
          </View>
          <Text allowFontScaling={false} style={styles.textInfo}>
            {convertDateFormat(userInfo.created_at)}
          </Text>
        </View>
        <View style={styles.infoCareer}>
          <View style={styles.iconText}>
            <Feather name="lock" size={20} color="gray" />
            <Text
              allowFontScaling={false}
              style={{ color: "gray", marginLeft: 10 }}
            >
              Mật khẩu
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate("ChangePasssword")}
          >
            <Text
              allowFontScaling={false}
              style={{ color: "#0E7CBA", textDecorationLine: "underline" }}
            >
              Đổi mật khẩu
            </Text>
          </TouchableOpacity>
        </View>
        <Text
          allowFontScaling={false}
          style={[styles.title, { marginTop: 30 }]}
        >
          Quản lí nhân sự
        </Text>
        <View style={styles.listConvenience}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              onPress={() => navigation.navigate("ApplicationManager")}
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
              onPress={() => navigation.navigate("StaffManager")}
              style={[styles.Convenience, { backgroundColor: "#f1f8ec" }]}
            >
              <MaterialCommunityIcons
                name="file-document-edit-outline"
                size={24}
                color="black"
                style={styles.iconConvenience}
              />
              <Text allowFontScaling={false} style={styles.textConvenience}>
                Nhân viên
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
        <Text
          allowFontScaling={false}
          style={[styles.title, { marginTop: 30 }]}
        >
          Tiện ích của tôi
        </Text>
        <View style={styles.listConvenience}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {isAnnual === true && (
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
            )}
            <TouchableOpacity
              onPress={() => setAlert(true)}
              style={[styles.Convenience, { backgroundColor: "#f1f8ec" }]}
            >
              <MaterialCommunityIcons
                name="file-document-edit-outline"
                size={24}
                color="black"
                style={styles.iconConvenience}
              />
              <Text allowFontScaling={false} style={styles.textConvenience}>
                Công việc
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setAlert(true)}
              style={[styles.Convenience, { backgroundColor: "#fef2e8" }]}
            >
              <MaterialCommunityIcons
                name="file-document-outline"
                size={24}
                color="black"
                style={styles.iconConvenience}
              />
              <Text allowFontScaling={false} style={styles.textConvenience}>
                Tài liệu
              </Text>
            </TouchableOpacity>

            {isAnnual === true && (
              <TouchableOpacity
                onPress={() => navigation.navigate("YearScreen")}
                style={[styles.Convenience, { backgroundColor: "#fae9fb" }]}
              >
                <AntDesign
                  style={styles.iconConvenience}
                  name="calendar"
                  size={24}
                  color="black"
                />
                <Text allowFontScaling={false} style={styles.textConvenience}>
                  Phép năm
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: 40,
  },
  top: {
    backgroundColor: "#e8f2ff",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingBottom: 15,
    marginTop: 35,
    position: "relative",
  },
  bottom: {
    backgroundColor: "white",
    padding: 20,
    paddingTop: 5,
  },
  wrap_titleInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  wrap_slogan: {
    width: "100%",
  },
  icon_pencil: {
    top: 0,
    //right: 0,
    left: 10,
    //marginLeft:200
    zIndex: 0,
  },
  header: {},
  avatar: {
    // flex: Platform.OS === "ios" ? 0.5 : 0,
  },
  formImage: {
    marginTop: 5,
    marginBottom: 10,
    position: "relative",
    margin: "auto",

    width: 100,
    height: 100,
  },
  image: {
    width: "100%",
    height: "100%",
    // flex: 1,
    borderWidth: 0.1,

    borderRadius: 50,
  },
  iconCamera: {
    position: "absolute",
    bottom: 0,
    right: -30,
    backgroundColor: "white",
    padding: 5,
    borderRadius: 50,
  },
  infoPostion: {
    // flex: Platform.OS === "os" ? 1 : 0.8,
  },
  name: {
    textAlign: "center",
    fontWeight: "500",
    fontSize: 21,
  },
  idUser: {
    textAlign: "center",
    fontWeight: "300",
    color: "gray",
  },
  positionName: {
    fontSize: 15,
    textAlign: "center",
    marginTop: 10,
  },
  status: {
    textAlign: "center",
    marginTop: 10,
    color: "gray",
  },
  infoCareer: {
    marginTop: 15,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconText: {
    display: "flex",
    flexDirection: "row",
  },
  textInfo: {
    color: "gray",
  },
  title: {
    fontSize: 20,
    marginTop: 10,
  },
  listConvenience: {
    marginVertical: 5,
    flexDirection: "row",
    gap: Platform.OS === "ios" ? 10 : 6,
    //height: 150,
  },
  listConvenienceStaff: {
    paddingTop: 10,
    flexDirection: "row",
    marginVertical: 5,
  },
  Convenience: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    width: 90,
    borderRadius: 20,
    marginRight: 10,
  },
  ConvenienceStaff: {
    marginRight: 10,
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
  iconWrapper: {
    paddingVertical: 2,
    paddingHorizontal: 10,
  },
});

export default ProfileManage;
