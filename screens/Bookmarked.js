import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import SearchComponent from "../components/SearchComponent";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import axios from "axios";
import { BASE_URL } from "../constants/Config";
import NewsCard from "../components/NewsCard";

const Bookmarked = () => {
  const navigation = useNavigation();
  const [blogListData, setBlogListData] = useState([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setBlogListData([]);
      setLoading(true);
      fetchMyBlogList();
      return () => {};
    }, [])
  );

  const fetchMyBlogList = async () => {
    try {
      const response = await axios.get(`${BASE_URL}api/v1/bookmark/bookmarked`);
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
      <View
        style={{
          paddingHorizontal: 16,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Ionicons
          name="arrow-back"
          size={28}
          color="black"
          style={{ padding: 12, paddingLeft: 4 }}
          onPress={() => navigation.goBack()}
        />
      </View>
      <View style={{ flex: 1 }}>
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
              <>
                {loading ? (
                  <View style={{ padding: 16 }}>
                    <ActivityIndicator size={"large"} />
                  </View>
                ) : null}
              </>
            </>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default Bookmarked;

const styles = StyleSheet.create({});
