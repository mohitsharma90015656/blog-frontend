import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
} from "react-native";
import axios from "axios";
import { BASE_URL } from "../constants/Config";
import { SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Divider } from "react-native-paper";

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
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Ionicons
            name="arrow-back"
            size={24}
            color="green"
            onPress={() => navigation.goBack()}
          />
          <Text style={{ fontSize: 18, fontWeight: 500, color: "green" }}>
            Chats
          </Text>
        </View>
        {loading ? (
          <ActivityIndicator size="large" color="#6200ea" />
        ) : (
          <FlatList
            data={users}
            keyExtractor={(item) => item?.id?.toString()}
            renderItem={({ item }) => (
              <>
                <TouchableOpacity
                  style={styles.userItem}
                  onPress={() => navigation.navigate("Chat", { user: item })}
                >
                  <View style={styles.userStyle}>
                    <Image
                      source={{ uri: item?.avatar }}
                      style={styles.profileImage}
                    />
                    <View>
                      <Text style={styles.userName}>{item?.fullName}</Text>
                      {item?.latestMessage ? (
                        <Text style={styles.userName}>{item?.fullName}</Text>
                      ) : (
                        <Text>Tap to chat</Text>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
                <Divider />
              </>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  userItem: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  userName: { fontSize: 16, fontWeight: 500 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 16,
  },
  profileImage: {
    width: 34,
    height: 34,
    borderRadius: 50,
  },
  userStyle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});

export default UserListScreen;
