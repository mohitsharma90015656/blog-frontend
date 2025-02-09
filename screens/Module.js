import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import SearchComponent from "../components/SearchComponent";
import { BASE_URL } from "../constants/Config";
import { useSelector } from "react-redux";
import NewsCard from "../components/NewsCard";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import axios from "axios";
import Button from "../components/Button";
import { Ionicons } from "@expo/vector-icons";
import Header from "../components/Header";
import { FAB } from "react-native-paper";

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
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
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

  return (
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
          <View style={{ }}>
            <FlatList
              data={blogListData}
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index}
              renderItem={({ item }) => (
                <NewsCard
                  onPress={() =>
                    navigation.navigate("blogDetails", { blogId: item?._id })
                  }
                  isUserLoggedIn={false}
                  item={item}
                />
              )}
              ListHeaderComponent={
                <>
                  {loading ? (
                    <View style={{ padding: 16 }}>
                      <ActivityIndicator size={"large"} />
                    </View>
                  ) : null}
                </>
              }
            />
          </View>
        </View>
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <View>
            <Text style={{ fontSize: 20, fontWeight: 500 }}>Please Login</Text>
          </View>
          <Button
            title={"Login"}
            onPress={() => navigation.navigate("Profile")}
          />
        </View>
      )}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate("createBlog")}
        color="white"
      />
    </SafeAreaView>
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
});
