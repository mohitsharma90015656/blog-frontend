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
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import axios from "axios";
import { BASE_URL } from "../constants/Config";
import AsyncStorage from "@react-native-async-storage/async-storage";
const Profile = () => {
  const navigation = useNavigation();

  const [isUserLoggedIn, setIsUserLoggedIn] = useState("");
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

      const data = response.data;
      if (data?.success) {
        navigation.navigate("Home");
        await AsyncStorage.setItem("userData", JSON.stringify(data));
      } else {
        Alert("Please give correct crediantials");
      }
    } catch (error) {
      if (error.response) {
        console.error("Login failed:", error.response.data);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error:", error.message);
      }
      throw error;
    }
  };
  useEffect(() => {
    getUserData();
  }, []);
    useFocusEffect(
      React.useCallback(() => {
        setIsUserLoggedIn("")
        getUserData();
        return () => {};
      }, [])
    );
  const getUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem("userData");

      if (userData !== null) {
        const parsedUserData = JSON.parse(userData);
        setIsUserLoggedIn(parsedUserData);
      } else {
        console.log("No user data found in AsyncStorage");
        return null;
      }
    } catch (error) {
      console.error("Error retrieving user data:", error);
      throw error;
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      {isUserLoggedIn && (
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
      )}
      {!isUserLoggedIn && (
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
