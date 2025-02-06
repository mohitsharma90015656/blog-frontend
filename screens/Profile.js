import {
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import SearchComponent from "../components/SearchComponent";
import Button from "../components/Button";
import InputField from "../components/InputField";
import OutlineBtn from "../components/OutlineBtn";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { BASE_URL } from "../constants/Config";
import { useDispatch, useSelector } from "react-redux";
import { login as loginAction, logout as logoutAction } from "../redux/AuthSlice";

const Profile = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.userAuth || {});

  const isAuthenticated = auth.isAuthenticated || false;
  const userData = auth.user || null;
  const accessToken = auth.token || null
  console.log("isAuthenticated :", isAuthenticated);
  console.log("userData: ", userData);
  console.log("access Token : ", accessToken);

  const [email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  const handleSignUp = () => {
    navigation.navigate("signUp");
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

  const handleLogOut = async() => {
    try {
      const response = await axios.post(`${BASE_URL}api/v1/users/logout`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      const data = response?.data
      console.log("userData: ", data )

      if(data?.success){
        dispatch(logoutAction())
      }
    } catch (error) {
      console.error("Logout Failed :", error.response?.data || error.message)
      Alert.alert("Logout Error", "Something went wrong. Please try again.");
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {isAuthenticated ? (
        <>
          <View style={styles.userNameContainer}>
            <View style={{ flex: 1 }}>
              <SearchComponent />
            </View>
            <View
              style={{
                borderWidth: 0.5,
                borderColor: "lightgray",
                padding: 6,
                borderRadius: 50,
              }}
            >
              <FontAwesome name="bell-o" size={24} color="black" />
            </View>
          </View>
          <View>
            <OutlineBtn title={"Logout"} onPress={handleLogOut} />
          </View>
        </>
      ) : (
        <>
          <View style={styles.imgContainer}>
            <Image style={styles.img} source={require("../assets/logo.png")} />
          </View>
          <View style={styles.card}>
            <InputField
              placeholder={"Enter Your Email"}
              value={email}
              onChangeText={setEmail}
            />
            <InputField
              placeholder={"Enter Password"}
              value={Password}
              onChangeText={setPassword}
            />
            <Button title={"Login"} onPress={login} />
            <TouchableOpacity style={styles.forgotTxt}>
              <Text style={{ color: "white" }}>Forgotten Password?</Text>
            </TouchableOpacity>
          </View>
          <View>
            <OutlineBtn title={"Sign Up"} onPress={handleSignUp} />
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#070426",
    flex: 1,
  },
  userNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 25,
    justifyContent: "space-between",
  },
  card: {
    flex: 1,
    justifyContent: "center",
  },
  forgotTxt: {
    alignItems: "center",
    marginTop: 20,
  },
  imgContainer: {
    alignItems: "center",
    marginTop: 50,
  },
  img: {
    height: 150,
    width: 150,
  },
});
