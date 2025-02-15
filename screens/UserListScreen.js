import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { BASE_URL } from "../constants/Config";
import { SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const UserListScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    fetchUserListList();
  }, []);

  const fetchUserListList = async () => {
    try {
      const response = await axios.get(`${BASE_URL}api/v1/users/userList`);
      setLoading(false);
      setUsers(response?.data?.users);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching user list:", error);
      throw error;
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
    <View style={styles.container}>
    <Ionicons
          name="arrow-back"
          size={28}
          color="black"
          onPress={() => navigation.goBack()}
        />
      {loading ? (
        <ActivityIndicator size="large" color="#6200ea" />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item?.id?.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.userItem}
                onPress={() => navigation.navigate("Chat", { user: item })}
            >
              <Text style={styles.userName}>{item?.fullName}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f8f8f8" },
  userItem: {
    padding: 15,
    backgroundColor: "#ddd",
    marginBottom: 10,
    borderRadius: 5,
  },
  userName: { fontSize: 18, fontWeight: "bold" },
});

export default UserListScreen;
