import { NavigationContainer } from "@react-navigation/native";
import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";
import { AuthContext } from "../contexts/AuthContext";
import MyDrawer from "./MyDrawer";
import AppNavigation from "./AppNavigation";

const RootNavigator = () => {
  const { isLoggedIn, loading } = useContext(AuthContext);

  if (isLoggedIn) {
    return <MyDrawer />;
  } else {
    return <AppNavigation />;
  }
};

const styles = StyleSheet.create({});

export default RootNavigator;
