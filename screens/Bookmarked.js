import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import SearchComponent from "../components/SearchComponent";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const Bookmarked = () => {
  const navigation = useNavigation();
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
    </SafeAreaView>
  );
};

export default Bookmarked;

const styles = StyleSheet.create({});
