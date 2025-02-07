import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import SearchComponent from "../components/SearchComponent";

const Module = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ flex: 1, paddingHorizontal: 12 }}>
        <SearchComponent />
      </View>
    </SafeAreaView>
  );
};

export default Module;

const styles = StyleSheet.create({});
