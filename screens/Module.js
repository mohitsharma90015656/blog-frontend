import Swipeable from "react-native-gesture-handler/Swipeable";
import { GestureHandlerRootView } from "react-native-gesture-handler"; // Import this
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../constants/Config";
import { useSelector } from "react-redux";
import NewsCard from "../components/NewsCard";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import Header from "../components/Header";
import { FAB } from "react-native-paper";
import Button from "../components/Button";

const Module = () => {
  const navigation = useNavigation();
  const auth = useSelector((state) => state.userAuth || {});
  const isAuthenticated = auth.isAuthenticated || false;
  const accessToken = auth.token || null;

  const [blogListData, setBlogListData] = useState([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      if (accessToken) {
        setBlogListData([]);
        setLoading(true);
        fetchMyBlogList();
      }
      return () => {};
    }, [])
  );

  const fetchMyBlogList = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}api/v1/blog/blogUserWiseList`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setLoading(false);
      setBlogListData(response?.data?.data);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching report list:", error);
      throw error;
    }
  };

  const renderRightActions = (progress, dragX, itemId) => {
    return (
      <View style={styles.swipeActions}>
        <Text style={styles.deleteText} onPress={() => handleDelete(itemId)}>
          Delete
        </Text>
      </View>
    );
  };

  const handleDelete = async (itemId) => {
    setLoading(true)
    try {
      const response = await axios.delete(
        `${BASE_URL}api/v1/blog/deleteBlog/${itemId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      fetchMyBlogList()
    } catch (error) {
      setLoading(false);
      console.error("Error fetching report list:", error);
      throw error;
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}> 
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        {isAuthenticated ? (
          <View style={{ flex: 1 }}>
            <Header
              showSearchComponent={true}
              showRightIcon={true}
              rtIcon={
                <Ionicons
                  name={"bookmark"}
                  size={24}
                  color="tomato"
                  onPress={() => navigation.navigate("bookmarked")}
                />
              }
              onRtIconPress={() => navigation.navigate("bookmarked")}
            />
            <FlatList
              data={blogListData}
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <Swipeable
                  renderRightActions={(progress, dragX) =>
                    renderRightActions(progress, dragX, item._id)
                  }
                >
                  <NewsCard
                    onPress={() =>
                      navigation.navigate("blogDetails", { blogId: item?._id })
                    }
                    isUserLoggedIn={false}
                    item={item}
                  />
                </Swipeable>
              )}
              ListHeaderComponent={
                loading ? (
                  <View style={{ padding: 16 }}>
                    <ActivityIndicator size={"large"} />
                  </View>
                ) : null
              }
            />
          </View>
        ) : (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 20, fontWeight: "500" }}>Please Login</Text>
            <Button title={"Login"} onPress={() => navigation.navigate("Profile")} />
          </View>
        )}
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => navigation.navigate("createBlog")}
          color="white"
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Module;

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 10,
    bottom: 10,
    backgroundColor: "black",
    color: "white",
    height: 50,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  swipeActions: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    // height: "100%",
    height: 100
  },
  deleteText: {
    color: "white",
    fontWeight: "bold",
  },
});
