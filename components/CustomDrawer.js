import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AuthContext } from "../contexts/AuthContext";
import { useContext } from "react";
import { useToast } from "react-native-toast-notifications";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Entypo from "@expo/vector-icons/Entypo";

const CustomDrawerContent = ({ navigation }) => {
  const toast = useToast();
  const { logout, isLoggedIn } = useContext(AuthContext);

  return (
    <View style={styles.drawerContainer}>
      <Text allowFontScaling={false} style={styles.drawerHeader}>
        APEC GLOBAL
      </Text>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => {
          navigation.navigate("Main"); // Điều hướng về Home
          navigation.closeDrawer(); // Đóng Drawer
        }}
      >
        <Entypo name="home" size={24} color="black" />
        <Text allowFontScaling={false} style={styles.drawerItemText}>
          Trang chủ
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => {
          navigation.navigate("Contact"); // Điều hướng về Home
          navigation.closeDrawer(); // Đóng Drawer
        }}
      >
        <MaterialCommunityIcons name="face-agent" size={24} color="black" />
        <Text allowFontScaling={false} style={styles.drawerItemText}>
          Liên hệ
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={async () => {
          toast.show(`Đăng xuất thành công`, {
            type: "success",
            placement: "top",
            duration: 4000,
            offset: 30,
            animationType: "slide-in",
          });
          await logout();
          //await AsyncStorage.removeItem("hasLaunched")
          navigation.closeDrawer(); // Đóng Drawer
          if (!isLoggedIn) {
            navigation.navigate("SignIn");
          }
        }}
      >
        <Entypo name="log-out" size={24} color="red" />
        <Text allowFontScaling={false} style={styles.drawerItemTextSignOut}>
          Đăng Xuất
        </Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  drawerContainer: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  drawerHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#0056d2",
  },
  drawerItem: {
    flexDirection: "row",
    gap: 20,
    paddingVertical: 15,
  },
  drawerItemText: {
    fontSize: 18,
  },
  drawerItemTextSignOut: {
    color: "red",
    fontWeight: "500",
    fontSize: 18,
  },
});
export default CustomDrawerContent;
