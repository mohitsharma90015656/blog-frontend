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
import React, { useRef, useState, useEffect } from "react";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { BASE_URL, BLOG_DEFAULT_IMAGE } from "../constants/Config";
import axios from "axios";
import { useSelector } from "react-redux";
import Modal from "react-native-modal";
import io from "socket.io-client"; // Import socket.io
import {
  connectSocket,
  disconnectSocket,
  getSocket,
} from "../constants/Socket";

const socket = io(BASE_URL); // Connect to backend server

const BlogDetails = (props) => {
  const navigation = useNavigation();
  const [blogDetails, setBlogDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const auth = useSelector((state) => state.userAuth || {});
  const isAuthenticated = auth.isAuthenticated || false;
  const [comment, setComment] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  let textInputRef = useRef(null);
  const accessToken = auth.token || null;
  const blogId = props?.route.params.blogId;

  const socket = getSocket();

  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (blogDetails?.likeBy?.includes(auth?.user?._id)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [blogDetails, auth]);

  useEffect(() => {
    fetchBlogDetails(blogId);
    if (!blogId) return;

    connectSocket();

    socket.on("updateComments", ({ blogId: updatedBlogId, comment }) => {
      setBlogDetails((prev) =>
        prev && prev?._id === updatedBlogId
          ? {
              ...prev,
              commentedBy: [{ ...comment }, ...(prev.commentedBy || [])],
            }
          : prev
      );
    });
    socket.on("updateLikes", ({ blogId: updatedBlogId, likeCount, userId }) => {
      setBlogDetails((prev) => {
        if (!prev || prev?._id !== updatedBlogId) return prev;

        const isLiked = prev.likeBy.includes(userId);

        return {
          ...prev,
          likeCount,
          likeBy: isLiked
            ? prev.likeBy.filter((id) => id !== userId)
            : [...prev.likeBy, userId],
        };
      });
    });

    return () => {
      disconnectSocket();
      socket.off("updateComments");
      socket.off("updateLikes");
    };
  }, []);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleTextChange = (newText) => {
    if (comment === "" && newText === " ") {
      return;
    }
    setComment(newText);
  };

  const fetchBlogDetails = async (id) => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id) => {
    try {
      await axios.put(`${BASE_URL}api/v1/blog/liked/${id}`);
      socket.emit("like_blog", { blogId: id });
    } catch (error) {
      console.error("Error liking the post:", error);
    }
  };

  const handleCommentAdd = async (id) => {
    toggleModal();
    setComment("");

    const reqObj = { comment };

    try {
      const response = await axios.put(
        `${BASE_URL}api/v1/blog/commented/${id}`,
        reqObj,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      const latestComment = response.data.comments.slice(-1)[0];

      socket.emit("commentBlog", { blogId: id, comment: latestComment });
    } catch (error) {
      console.error("Error adding comment:", error.response?.data || error);
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
              name={liked ? "heart" : "hearto"}
              size={26}
              color={liked ? "red" : "black"}
              onPress={() => handleLike(blogId)}
            />
          )}
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {loading ? (
            <View style={{ padding: 16 }}>
              <ActivityIndicator size={"large"} />
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              <Image
                source={{ uri: blogDetails?.blogImage || BLOG_DEFAULT_IMAGE }}
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
                  {blogDetails?.owner?.fullName && (
                    <Text style={{ fontSize: 14, fontWeight: 500 }}>
                      By{" "}
                      <Text style={{ color: "gray", fontSize: 16 }}>
                        {blogDetails?.owner?.fullName}
                      </Text>
                    </Text>
                  )}
                </View>
              </View>

              <View style={{ gap: 12, paddingTop: 16 }}>
                <Text style={{ fontSize: 20, fontWeight: 500 }}>
                  {blogDetails?.title}
                </Text>
                <Text>{blogDetails?.description}</Text>
              </View>
            </View>
          )}

          {accessToken && (
            <TouchableOpacity onPress={toggleModal}>
              <View style={{ paddingTop: 16, flexDirection: "row" }}>
                <View style={styles.commentBox}>
                  <Text style={{ marginLeft: 12 }}>Add comment</Text>
                  <MaterialIcons name="send" size={20} color={"gray"} />
                </View>
              </View>
            </TouchableOpacity>
          )}

          <View style={{ paddingTop: 12 }}>
            {blogDetails?.commentedBy?.map((item, index) => (
              <View key={index} style={styles.commentCard}>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
                >
                  <Image
                    source={{ uri: item?.user?.avatar }}
                    style={styles.commentAvatar}
                  />
                  <Text style={{ fontSize: 16 }}>{item?.user?.fullName}</Text>
                </View>
                <Text style={{ fontSize: 14, paddingTop: 4 }}>
                  {item?.comment}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* {isModalVisible && (
        <Modal
          isVisible={isModalVisible}
          onBackdropPress={toggleModal}
          onBackButtonPress={toggleModal}
          style={styles.modal}
        >
          <View style={styles.modalInput}>
            <TextInput
              ref={(input) => (textInputRef = input)}
              style={styles.inputField}
              placeholder={"Add comment"}
              value={comment}
              onChangeText={handleTextChange}
              placeholderTextColor={"gray"}
              autoFocus
            />
            <TouchableOpacity
              onPress={() => handleCommentAdd(blogId)}
              disabled={!comment}
            >
              <MaterialIcons name="send" size={20} color={"lightgreen"} />
            </TouchableOpacity>
          </View>
        </Modal>
      )} */}
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
  commentBox: {
    width: "100%",
    flexDirection: "row",
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "white",
    justifyContent: "space-between",
    height: 50,
    borderWidth: 1,
    borderColor: "lightgray",
  },
  commentCard: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "lightgray",
    padding: 8,
    borderRadius: 8,
    marginBottom: 6,
  },
  commentAvatar: { height: 26, width: 26, borderRadius: 50 },
  modal: { justifyContent: "flex-end", margin: 0 },
  modalInput: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
  },
  inputField: { flex: 1, borderRadius: 8, height: 65, padding: 8 },
});
