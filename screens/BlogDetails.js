import {
  ActivityIndicator,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { BASE_URL, BLOG_DEFAULT_IMAGE } from "../constants/Config";
import axios from "axios";
import { useSelector } from "react-redux";
import Modal from "react-native-modal";
const BlogDetails = (props) => {
  const navigation = useNavigation();
  const [blogDetails, setBlogDetails] = useState([]);
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(false);
  const auth = useSelector((state) => state.userAuth || {});
  const isAuthenticated = auth.isAuthenticated || false;
  const [comment, setComment] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  let textInputRef = useRef(null);
  const accessToken = auth.token || null;
  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      fetchBlogDetails(props?.route.params.blogId);
      return () => {};
    }, [])
  );
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const handleButtonPress = () => {
    toggleModal();
  };
  const handleTextChange = (newText) => {
    if (comment === "" && newText === " ") {
      return;
    }
    setComment(newText);
  };
  const fetchBlogDetails = async (id) => {
    try {
      const response = await axios.get(
        `${BASE_URL}api/v1/blog/blogDetails/${id}`
      );
      setLoading(false);
      setBlogDetails(response?.data?.data);
    } catch (error) {
      setLoading(false);
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
  // commented
  const handleCommentAdd = async (id) => {
    toggleModal();
    setComment("");
    setLoading(true);
    const reqObj = {
      comment: comment,
    };
    try {
      const response = await axios.put(
        `${BASE_URL}api/v1/blog/commented/${id}`,
        reqObj,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      fetchBlogDetails(id);
    } catch (error) {
      console.error(
        "Error fetching blog details:",
        error.response?.data || error
      );
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
            paddingTop: Platform.OS == "ios" ? 0 : 20,
          }}
        >
          <Ionicons
            name="arrow-back"
            size={28}
            color="black"
            onPress={() => navigation.goBack()}
          />

          {isAuthenticated && (
            <AntDesign
              name="hearto"
              size={26}
              color="black"
              onPress={() => handleLike(props?.route.params.blogId)}
            />
          )}
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          {loading ? (
            <View style={{ padding: 16 }}>
              <ActivityIndicator size={"large"} />
            </View>
          ) : null}
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
              {isAuthenticated && (
                <>
                  {blogDetails?.owner?.fullName && (
                    <View style={styles.followButton}>
                      <Text style={{ color: "white" }}>Follow</Text>
                    </View>
                  )}
                </>
              )}
            </View>
            <View style={{ gap: 12, paddingTop: 16 }}>
              <Text style={{ fontSize: 20, fontWeight: 500 }}>
                {blogDetails?.title}
              </Text>
              <Text>{blogDetails?.description}</Text>
            </View>
          </View>
          {accessToken && (
            <TouchableOpacity onPress={handleButtonPress}>
              <View style={{ paddingTop: 16, flexDirection: "row" }}>
                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    borderRadius: 8,
                    alignItems: "center",
                    backgroundColor: "white",
                    justifyContent: "space-between",
                    height: 50,
                    borderWidth: 1,
                    borderColor: "lightgray",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View style={{}}></View>
                    <Text style={{ marginLeft: 12 }}>Add comment</Text>
                  </View>
                  <TouchableOpacity style={{ right: 12 }}>
                    <MaterialIcons name="send" size={20} color={"gray"} />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          )}
          <View
            style={{
              paddingTop: 12,
            }}
          >
            {blogDetails?.commentedBy?.map((item, index) => {
              console.log(item);
              return (
                <View
                  style={{
                    backgroundColor: "white",
                    borderWidth: 1,
                    borderColor: "lightgray",
                    padding: 8,
                    borderRadius: 8,
                    marginBottom: 6,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Image
                      source={{ uri: item?.user?.avatar }}
                      style={{ height: 26, width: 26, borderRadius: 50 }}
                    />

                    <Text style={{ fontSize: 16 }}>{item?.user?.fullName}</Text>
                  </View>
                  <Text style={{ fontSize: 14, paddingTop: 4 }}>
                    {item?.comment}
                  </Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
      {isModalVisible ? (
        <Modal
          isVisible={isModalVisible}
          onBackdropPress={toggleModal}
          onBackButtonPress={toggleModal}
          style={{
            justifyContent: "flex-end",
            margin: 0,
          }}
          propagateSwipe={true}
          hideModalContentWhileAnimating={true}
          swipeThreshold={250}
          swipeDirection={"down"}
          animationInTiming={400}
          animationOutTiming={100}
          useNativeDriver={true}
          avoidKeyboard={true}
          onShow={() => {
            setTimeout(() => {
              textInputRef.blur();
              textInputRef.focus();
            }, 50);
          }}
        >
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "white",
            }}
          >
            <TextInput
              ref={(input) => {
                textInputRef = input;
              }}
              style={{
                flex: 1,
                borderRadius: 8,
                height: 65,
                padding: 8,
              }}
              placeholder={"Add comment"}
              value={comment}
              onChangeText={handleTextChange}
              placeholderTextColor={"gray"}
              autoFocus
            />
            <TouchableOpacity
              style={{ right: 12 }}
              onPress={() => handleCommentAdd(props?.route.params.blogId)}
              disabled={comment?.length > 0 ? false : true}
            >
              <MaterialIcons name="send" size={20} color={"lightgreen"} />
            </TouchableOpacity>
          </View>
        </Modal>
      ) : null}
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
