import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import Button from "../components/Button";
import InputField from "../components/InputField";
import OutlineBtn from "../components/OutlineBtn";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import axios from "axios";
import { BASE_URL } from "../constants/Config";
import { useDispatch, useSelector } from "react-redux";
import {
  login as loginAction,
  logout as logoutAction,
} from "../redux/AuthSlice";
import Header from "../components/Header";
import { FontAwesome } from "@expo/vector-icons";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import * as ImagePicker from "expo-image-picker";
import { FAB, Modal, Portal, SegmentedButtons } from "react-native-paper";
import NewsCard from "../components/NewsCard";
import { useSnackbar } from "../context/SnackBarContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LinearGradient from "react-native-linear-gradient";

//For Animated Scroll
const posterSize = Dimensions.get("screen").height / 3;
const headerTop = 44 - 16;

const ScreenHeader = ({ sv, avatar, fullName }) => {
  const inset = useSafeAreaInsets();

  const opacityAnim = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        sv.value,
        [
          ((posterSize - (headerTop + inset.top)) / 4) * 3,
          posterSize - (headerTop + inset.top) + 1,
        ],
        [0, 1]
      ),
      transform: [
        {
          scale: interpolate(
            sv.value,
            [
              ((posterSize - (headerTop + inset.top)) / 4) * 3,
              posterSize - (headerTop + inset.top) + 1,
            ],
            [0.98, 1],
            Extrapolation.CLAMP
          ),
        },
        {
          translateY: interpolate(
            sv.value,
            [
              ((posterSize - (headerTop + inset.top)) / 4) * 3,
              posterSize - (headerTop + inset.top) + 1,
            ],
            [-10, 0],
            Extrapolation.CLAMP
          ),
        },
      ],
      paddingTop: inset.top === 0 ? 8 : inset.top,
    };
  });

  return (
    <Animated.View
      style={[
        opacityAnim,
        {
          position: "absolute",
          width: "100%",
          paddingHorizontal: 14,
          paddingBottom: 6,
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
          zIndex: 10,
          backgroundColor: "#000",
        },
      ]}
    >
      <FontAwesome name="chevron-left" color={"white"} size={24} />
      <Animated.Text style={{ fontSize: 16, color: "#FFF", fontWeight: 500 }}>
        {fullName}
      </Animated.Text>
      <Image
        source={{ uri: avatar }}
        style={{ width: 35, height: 35, borderRadius: 50, borderWidth: 1 }}
      />
    </Animated.View>
  );
};

const PosterImage = ({ sv, avatar }) => {
  const inset = useSafeAreaInsets();
  const layoutY = useSharedValue(0);

  const opacityAnim = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        sv.value,
        [0, posterSize - (headerTop + inset.top) / 0.9],
        [1, 0],
        Extrapolation.CLAMP
      ),
    };
  });

  const scaleAnim = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(sv.value, [-50, 0], [1.3, 1], {
            extrapolateLeft: "extend",
            extrapolateRight: "clamp",
          }),
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        {
          height: Dimensions.get("screen").height / 2,
          width: Dimensions.get("screen").width,
          position: "absolute",
        },
        opacityAnim,
      ]}
    >
      <Animated.Image
        source={{
          uri: "https://images.unsplash.com/photo-1528465424850-54d22f092f9d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        }}
        style={[
          { height: "100%", width: "100%", resizeMode: "cover" },
          scaleAnim,
        ]}
      />
    </Animated.View>
  );
};

const Profile = () => {
  const categories = ["Posts", "Liked", "Latest"];
  const [selectedCategory, setSelectedCategory] = useState("Posts");

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const translateX = useSharedValue(0);
  const auth = useSelector((state) => state.userAuth || {});

  const isAuthenticated = auth.isAuthenticated || false;
  const userData = auth.user || null;
  const accessToken = auth.token || null;

  const { showSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);
  const [bookmarkedBlog, setBookmarkedBlog] = useState(false);
  const [blogListData, setBlogListData] = useState([]);
  const [selectedTab, setSelectedTab] = useState("Login");
  const [logInLoading, setLogInLoading] = useState(false);
  const [loggingError, setLoggingError] = useState(null);
  const [signUpLoading, setSignUpLoading] = useState(false);

  //For Animated Scroll
  const inset = useSafeAreaInsets();
  const sv = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      "Worklet";
      sv.value = event.contentOffset.y;
    },
  });

  const initialTranslateValue = posterSize;

  const animatedScrollStyle = useAnimatedStyle(() => {
    return {
      paddingTop: initialTranslateValue,
    };
  });

  const layoutY = useSharedValue(0);

  const stickyElement = useAnimatedStyle(() => {
    return {
      backgroundColor: "white",
      transform: [
        {
          translateY: interpolate(
            sv.value,
            [
              layoutY.value - (headerTop + inset.top) - 1,
              layoutY.value - (headerTop + inset.top),
              layoutY.value - (headerTop + inset.top) + 1,
            ],
            [0, 0, 1]
          ),
        },
      ],
    };
  });

  //Login State
  const [email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  //SignUp State
  const [userName, setUserName] = useState("");
  const [fullName, setFullName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  //State for profile Pic selector modal
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const takeSelfie = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
      closeModal();
    }

    if (result.canceled) return;
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
      closeModal();
    }

    if (result.canceled) return;
  };

  const handleTabPress = (tab, index) => {
    setSelectedTab(tab);
    translateX.value = withTiming(index * 150, { duration: 300 });
  };

  const clearInputFields = () => {
    setEmail("");
    setPassword("");
    setUserName("");
    setFullName("");
    setSignUpEmail("");
    setSignUpPassword("");
    setProfileImage(null);
    setLoggingError(null);
  };

  //Clearing the text input fields when tab changes
  useEffect(() => {
    clearInputFields();
  }, [selectedTab]);

  //Clearing the input fields when screen changes
  useFocusEffect(
    useCallback(() => {
      clearInputFields();
      return () => {};
    }, [])
  );

  const handleSignUp = async () => {
    setSignUpLoading(true);
    try {
      const formData = new FormData();

      formData.append("fullName", fullName);
      formData.append("username", userName);
      formData.append("email", signUpEmail);
      formData.append("password", signUpPassword);

      if (profileImage) {
        const fileName = profileImage.split("/").pop();
        const fileType = fileName.split(".").pop();
        formData.append("avatar", {
          uri: profileImage,
          name: fileName,
          type: `image/${fileType}`,
        });
      }

      const response = await axios.post(
        `${BASE_URL}api/v1/users/register`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      const data = response?.data;
    } catch (error) {
      console.error("SignUp failed:", error.response?.data || error.message);
      Alert.alert("SignUp Error", "Something went wrong. Please try again.");
    } finally {
      setSignUpLoading(false);
    }
  };

  const login = async () => {
    setLogInLoading(true);
    setLoggingError(null);
    try {
      const response = await axios.post(`${BASE_URL}api/v1/users/login`, {
        email: email,
        password: Password,
      });

      const data = response?.data;
      if (data?.success) {
        dispatch(
          loginAction({
            user: data?.data?.user,
            token: data?.data?.accessToken,
          })
        );
        clearInputFields();
        navigation.navigate("Home");
        showSnackbar("Login successful", { duration: 3000 });
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      setLoggingError("Wrong Credentials");
    } finally {
      setLogInLoading(false);
    }
  };

  const handleLogOut = async () => {
    try {
      const response = await axios.post(`${BASE_URL}api/v1/users/logout`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = response?.data;

      if (data?.success) {
        dispatch(logoutAction());
      }
    } catch (error) {
      console.error("Logout Failed :", error.response?.data || error.message);
      Alert.alert("Logout Error", "Something went wrong. Please try again.");
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      fetchReportList();
      return () => {};
    }, [])
  );

  const fetchReportList = async () => {
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

  const bookmarkBlog = async (id) => {
    try {
      const response = await axios.post(
        `${BASE_URL}api/v1/bookmark/bookmark/${id}`
      );
      fetchReportList();
    } catch (error) {
      setLoading(false);
      console.error("Error while bookmark blog:", error);
      throw error;
    }
  };

  return (
    <>
      {isAuthenticated ? (
        <>
          <Animated.View style={{ flex: 1, backgroundColor: "#FFF" }}>
            <ScreenHeader
              sv={sv}
              fullName={userData?.fullName}
              avatar={userData?.avatar}
            />
            <PosterImage sv={sv} avatar={userData?.avatar} />
            <Animated.View style={{ flex: 1 }}>
              <Animated.ScrollView
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
              >
                <Animated.View
                  style={[animatedScrollStyle, { paddingBottom: 10 }]}
                >
                  <Animated.View
                    onLayout={(event) => {
                      "worklet";
                      layoutY.value = event.nativeEvent.layout.y;
                    }}
                    style={[
                      {
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 10,
                        paddingBottom: 10,
                        paddingTop: 20,
                      },
                      stickyElement,
                    ]}
                  >
                    <FlatList
                      data={categories}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      keyExtractor={(item) => item}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={[
                            styles.categoryItem,
                            selectedCategory === item && styles.activeCategory,
                          ]}
                          onPress={() => setSelectedCategory(item)}
                        >
                          <Text
                            style={[
                              styles.categoryText,
                              selectedCategory === item && styles.activeText,
                            ]}
                          >
                            {item}
                          </Text>
                        </TouchableOpacity>
                      )}
                    />
                  </Animated.View>
                  <FlatList
                    data={blogListData}
                    nestedScrollEnabled={true}
                    showsVerticalScrollIndicator={false}
                    style={{ flex: 1 }}
                    contentContainerStyle={{
                      paddingTop: 10,
                      backgroundColor: "white",
                    }}
                    keyExtractor={(item, index) => index}
                    renderItem={({ item }) => (
                      <NewsCard
                        onPress={() =>
                          navigation.navigate("blogDetails", {
                            blogId: item?._id,
                          })
                        }
                        isUserLoggedIn={accessToken}
                        item={item}
                        bookmarkedBlog={bookmarkedBlog}
                        onPressBookmarked={() => bookmarkBlog(item?._id)}
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
                </Animated.View>
              </Animated.ScrollView>
            </Animated.View>
          </Animated.View>

          {/* <Header
            title={`@${userData?.username}`}
            titleColor={"black"}
            showRightIcon={true}
            rtIcon={<FontAwesome name="gear" size={24} color="black" />}
          /> */}

          {/* <View style={styles.profileHeader}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1528465424850-54d22f092f9d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              }}
              style={styles.bgImage}
            />
            <View style={styles.profileInfo}>
              {userData?.avatar ? (
                <Image
                  style={styles.profileImg}
                  source={{ uri: userData?.avatar }}
                />
              ) : (
                <Image
                  style={styles.profileImg}
                  source={{
                    uri: "https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/no-profile-picture-icon.png",
                  }}
                />
              )}

              <Text style={styles.username}>{userData?.fullName}</Text>
              <Text style={styles.designation}>{`@${userData?.username}`}</Text>
            </View>
            <View style={styles.activities}>
              <TouchableOpacity style={styles.activity}>
                <Text style={styles.number}>{userData?.blogCount}</Text>
                <Text style={styles.text}>Posts</Text>
              </TouchableOpacity>
              <View style={styles.verticalDivider} />
              <TouchableOpacity style={styles.activity}>
                <Text style={styles.number}>
                  {userData.followedBy ? userData.followedBy.length : 0}
                </Text>
                <Text style={styles.text}>Followers</Text>
              </TouchableOpacity>
              <View style={styles.verticalDivider} />
              <TouchableOpacity style={styles.activity}>
                <Text style={styles.number}>
                  {userData.following ? userData.following.length : 0}
                </Text>
                <Text style={styles.text}>Following</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              paddingHorizontal: 12,
              paddingTop: 16,
              paddingBottom: 16,
              justifyContent: "space-around",
            }}
          >
            <FlatList
              data={categories}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.categoryItem,
                    selectedCategory === item && styles.activeCategory,
                  ]}
                  onPress={() => setSelectedCategory(item)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      selectedCategory === item && styles.activeText,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>

          <FlatList
            data={blogListData}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingTop: 8 }}
            keyExtractor={(item, index) => index}
            renderItem={({ item }) => (
              <NewsCard
                onPress={() =>
                  navigation.navigate("blogDetails", {
                    blogId: item?._id,
                  })
                }
                isUserLoggedIn={accessToken}
                item={item}
                bookmarkedBlog={bookmarkedBlog}
                onPressBookmarked={() => bookmarkBlog(item?._id)}
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
          /> */}
        </>
      ) : (
        <SafeAreaView style={styles.container}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : null}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
          >
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.authContainer}>
                <Image
                  source={require("../assets/logo.png")}
                  style={styles.logo}
                />

                <View style={styles.tabSelector}>
                  <Animated.View
                    style={[styles.activeTab, { transform: [{ translateX }] }]}
                  />
                  <TouchableOpacity
                    style={styles.tab}
                    onPress={() => handleTabPress("Login", 0)}
                  >
                    <Text
                      style={[
                        styles.tabText,
                        selectedTab === "Login" && styles.activeTabText,
                      ]}
                    >
                      Login
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.tab}
                    onPress={() => handleTabPress("Signup", 1)}
                  >
                    <Text
                      style={[
                        styles.tabText,
                        selectedTab === "Signup" && styles.activeTabText,
                      ]}
                    >
                      Signup
                    </Text>
                  </TouchableOpacity>
                </View>

                {selectedTab === "Login" && (
                  <View style={styles.form}>
                    <InputField
                      placeholder={"Enter Your Email"}
                      value={email}
                      onChangeText={setEmail}
                    />
                    <InputField
                      secureTextEntry={true}
                      placeholder={"Enter Password"}
                      value={Password}
                      onChangeText={setPassword}
                    />
                    {loggingError && (
                      <Text style={styles.error}>{loggingError}</Text>
                    )}
                    <Button
                      title={
                        logInLoading ? (
                          <View>
                            <ActivityIndicator size={24} />
                          </View>
                        ) : (
                          "Login"
                        )
                      }
                      onPress={login}
                    />

                    <TouchableOpacity style={styles.forgotTxt}>
                      <Text style={{ color: "black" }}>
                        Forgotten Password?
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                {selectedTab === "Signup" && (
                  <View style={styles.form}>
                    <View style={styles.imagePickerContainer}>
                      <TouchableOpacity
                        onPress={openModal}
                        style={styles.imagePicker}
                      >
                        {profileImage ? (
                          <Image
                            source={{ uri: profileImage }}
                            style={styles.profileImage}
                          />
                        ) : (
                          <FontAwesome name="camera" size={32} color="gray" />
                        )}
                      </TouchableOpacity>
                    </View>
                    <InputField
                      placeholder={"Enter Full Name"}
                      value={fullName}
                      onChangeText={setFullName}
                    />
                    <InputField
                      placeholder={"Enter Your Email"}
                      value={signUpEmail}
                      onChangeText={setSignUpEmail}
                    />
                    <InputField
                      placeholder={"Enter Password"}
                      value={signUpPassword}
                      onChangeText={setSignUpPassword}
                      secureTextEntry={true}
                    />
                    <InputField
                      placeholder={"Enter username"}
                      value={userName}
                      onChangeText={setUserName}
                    />
                    <Button
                      title={
                        signUpLoading ? (
                          <View>
                            <ActivityIndicator size={24} />
                          </View>
                        ) : (
                          "SignUp"
                        )
                      }
                      onPress={handleSignUp}
                    />
                  </View>
                )}
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      )}

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={closeModal}
          contentContainerStyle={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalBtn} onPress={pickImage}>
              <Text style={styles.modalBtnTxt}>Choose from Gallery</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.modalBtn} onPress={takeSelfie}>
              <Text style={styles.modalBtnTxt}>Open Camera</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </Portal>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() =>
          navigation.navigate(accessToken ? "createBlog" : "Profile")
        }
        color="white"
      />
    </>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    flex: 1,
  },
  authContainer: {
    alignItems: "center",
    marginTop: 15,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  tabSelector: {
    flexDirection: "row",
    width: 300,
    height: 50,
    backgroundColor: "#F0F0F0",
    borderRadius: 25,
    position: "relative",
    overflow: "hidden",
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  tabText: {
    fontSize: 18,
    color: "gray",
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "bold",
  },
  activeTab: {
    position: "absolute",
    width: 150,
    height: "100%",
    backgroundColor: "#445045",
    borderRadius: 25,
    zIndex: 0,
  },
  form: {
    width: "90%",
    marginTop: 30,
    alignItems: "stretch",
  },
  imagePickerContainer: {
    alignItems: "center",
    marginBottom: 5,
  },
  imagePicker: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "gray",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  forgotTxt: {
    alignItems: "center",
    marginTop: 20,
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    marginHorizontal: 30,
    borderRadius: 15,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  modalContent: {
    width: "100%",
    alignItems: "center",
  },
  modalBtn: {
    width: "100%",
    paddingVertical: 12,
    marginVertical: 8,
    borderRadius: 10,
    alignItems: "center",
  },
  modalBtnTxt: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
  divider: {
    width: "90%",
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 1,
  },
  error: {
    color: "red",
    fontSize: 14,
    marginTop: 5,
    marginBottom: 10,
    textAlign: "center",
  },
  profileHeader: {
    alignItems: "center",
    backgroundColor: "#fff",
  },
  profileInfo: {
    alignItems: "center",
    marginTop: -20,
  },
  bgImage: {
    height: Dimensions.get("screen").height / 2,
    width: Dimensions.get("screen").width,
    position: "absolute",
    objectFit: "cover",
  },
  profileImg: {
    height: 130,
    width: 130,
    borderRadius: 80,
    marginTop: -60,
    borderWidth: 3,
    borderColor: "#fff",
  },
  username: {
    color: "#000",
    marginTop: 10,
    fontSize: 20,
  },
  designation: {
    alignItems: "center",
    color: "#000",
    marginTop: 5,
  },
  activities: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 12,
    marginTop: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 5,
    borderRadius: 10,
    paddingVertical: 20,
  },
  activity: {
    alignItems: "center",
    flex: 1,
  },
  number: {
    fontSize: 22,
    fontWeight: "bold",
  },
  text: {
    fontSize: 15,
    marginTop: 5,
    color: "gray",
  },
  verticalDivider: {
    width: 1,
    backgroundColor: "#ddd",
  },
  categoryItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    marginHorizontal: 5,
    backgroundColor: "#fff",
  },
  activeCategory: {
    backgroundColor: "#FF6347",
    borderColor: "#FF6347",
  },
  categoryText: {
    fontSize: 14,
    color: "#333",
  },
  activeText: {
    color: "#fff",
    fontWeight: "bold",
  },
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
