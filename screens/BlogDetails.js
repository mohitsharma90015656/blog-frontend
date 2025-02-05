import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import {
  AntDesign,
  EvilIcons,
  FontAwesome6,
  Ionicons,
} from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { BASE_URL, BLOG_DEFAULT_IMAGE } from "../constants/Config";
import axios from "axios";

const BlogDetails = (props) => {
  const navigation = useNavigation();
  const [blogDetails, setBlogDetails] = useState([]);
  const [likes, setLikes] = useState([]);
  useFocusEffect(
    React.useCallback(() => {
      fetchBlogDetails(props?.route.params.blogId);
      return () => {};
    }, [])
  );
  const fetchBlogDetails = async (id) => {
    try {
      const response = await axios.get(
        `${BASE_URL}api/v1/blog/blogDetails/${id}`
      );
      setBlogDetails(response?.data?.data);
    } catch (error) {
      console.error(
        "Error fetching blog details:",
        error.response?.data || error
      );
    }
  };
  const handleLike = async (id) => {
    try {
      const response = await axios.put(`${BASE_URL}api/v1/blog/liked/${id}`);
      setLikes(response.data.likes);
    } catch (error) {
      console.error("Error liking the post:", error);
    }
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ padding: 12, paddingLeft: 16, gap: 16, flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Ionicons
            name="arrow-back"
            size={28}
            color="black"
            onPress={() => navigation.goBack()}
          />

          <AntDesign
            name="hearto"
            size={26}
            color="black"
            onPress={() => handleLike(props?.route.params.blogId)}
          />
        </View>
        <ScrollView>
          <View style={{ flex: 1 }}>
            <Image
              source={{
                uri:
                  blogDetails?.blogImage == ""
                    ? BLOG_DEFAULT_IMAGE
                    : blogDetails?.blogImage,
              }}
              style={styles.blogImage}
            />
            <View
              style={{
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: "row",
                paddingTop: 12,
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
              >
                {/* <EvilIcons name="user" size={28} color="black" /> */}
                {blogDetails?.owner?.fullName && (
                  <Text style={{ fontSize: 14, fontWeight: 500 }}>
                    By{" "}
                    <Text style={{ color: "gray", fontSize: 16 }}>
                      {blogDetails?.owner?.fullName}
                    </Text>
                  </Text>
                )}
              </View>
              {blogDetails?.owner?.fullName && (
                <View style={styles.followButton}>
                  <Text style={{ color: "white" }}>Follow</Text>
                </View>
              )}
            </View>
            <View style={{ gap: 12, paddingTop: 16 }}>
              <Text style={{ fontSize: 20, fontWeight: 500 }}>
                {blogDetails?.title}
              </Text>
              <Text>{blogDetails?.description}</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default BlogDetails;

const styles = StyleSheet.create({
  blogImage: { width: "100%", height: 220, borderRadius: 8, paddingTop: 12 },
  followButton: {
    height: 25,
    width: 60,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
});
