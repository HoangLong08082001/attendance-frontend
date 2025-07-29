// src/components/UserList.js
import React from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { useUser } from "../hooks/useUser";

const UserList = () => {
  const { users, loading } = useUser();

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={{ padding: 10, borderBottomWidth: 1 }}>
          <Text
            allowFontScaling={false}
            style={{ fontSize: 16, fontWeight: "bold" }}
          >
            {item.name}
          </Text>
          <Text allowFontScaling={false}>{item.email}</Text>
        </View>
      )}
    />
  );
};

export default UserList;
