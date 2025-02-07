import {
  Alert,
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
import React, { useEffect, useState } from "react";
import Button from "../components/Button";
import InputField from "../components/InputField";
import OutlineBtn from "../components/OutlineBtn";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { BASE_URL } from "../constants/Config";
import { useDispatch, useSelector } from "react-redux";
import {
  login as loginAction,
  logout as logoutAction,
} from "../redux/AuthSlice";
import Header from "../components/Header";
import { FontAwesome } from "@expo/vector-icons";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import * as ImagePicker from "expo-image-picker";
import { Modal, Portal } from "react-native-paper";

const Profile = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const translateX = useSharedValue(0);
  const auth = useSelector((state) => state.userAuth || {});

  const isAuthenticated = auth.isAuthenticated || false;
  const userData = auth.user || null;
  const accessToken = auth.token || null;

  // console.log("isAuthenticated :", isAuthenticated);
  // console.log("userData: ", userData);
  // console.log("access Token : ", accessToken);

  const [selectedTab, setSelectedTab] = useState("Login");

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
  const closeModal = () => setModalVisible(!modalVisible);

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
  };
  console.log("image result : ", profileImage);

  const handleTabPress = (tab, index) => {
    setSelectedTab(tab);
    translateX.value = withTiming(index * 150, { duration: 300 });
  };

  const handleSignUp = async () => {
    if (!fullName || !userName || !signUpEmail || !signUpPassword) {
      Alert.alert("Validation Error", "All fields are required.");
      return;
    }
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
      console.log("User Data :", data);
    } catch (error) {
      console.error("SignUp failed:", error.response?.data || error.message);
      Alert.alert("SignUp Error", "Something went wrong. Please try again.");
    }
  };

  const login = async () => {
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
        navigation.navigate("Home");
      } else {
        Alert("Please give correct credentials");
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      Alert.alert("Login Error", "Something went wrong. Please try again.");
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
      console.log("userData: ", data);

      if (data?.success) {
        dispatch(logoutAction());
      }
    } catch (error) {
      console.error("Logout Failed :", error.response?.data || error.message);
      Alert.alert("Logout Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          {isAuthenticated ? (
            <>
              <Header
                goBack={true}
                showSearchComponent={true}
                showRightIcon={true}
                rtIcon={<FontAwesome name="bell-o" size={24} color="white" />}
              />
              <View>
                <OutlineBtn title={"Logout"} onPress={handleLogOut} />
              </View>
            </>
          ) : (
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
                  <Button title={"Login"} onPress={login} />
                  <TouchableOpacity style={styles.forgotTxt}>
                    <Text style={{ color: "black" }}>Forgotten Password?</Text>
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
                  <Button title={"SignUp"} onPress={handleSignUp} />
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
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
    </SafeAreaView>
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
    elevation: 5, // Adds shadow effect for Android
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
});
