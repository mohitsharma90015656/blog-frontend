import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import SearchComponent from "../components/SearchComponent";
import Button from "../components/Button";
import InputField from "../components/InputField";
import OutlineBtn from "../components/OutlineBtn";

const Profile = () => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

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
      {!isUserLoggedIn &&
        <>
          <View style={styles.imgContainer}>
            <Image style={styles.img} source={require("../assets/logo.png")} />
          </View>
          <View style={styles.card}>
            <InputField placeholder={"Enter Your Email"} />
            <InputField placeholder={"Enter Password"} />
            <Button title={"Login"} />
            <TouchableOpacity style={styles.forgotTxt}>
              <Text style={{ color: "white" }}>Forgotten Password?</Text>
            </TouchableOpacity>
          </View>
          <View>
            <OutlineBtn title={"Sign Up"} />
          </View>
        </>
      }
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
