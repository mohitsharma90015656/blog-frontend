import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { COLORS } from "../constants/theme";

const OutlineBtn = ({ title, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <Text style={styles.btnTxt}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default OutlineBtn;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 20,
    marginHorizontal: 25,
    marginVertical: 20,
    borderColor: COLORS.white,
    borderWidth: 1
  },
  btnTxt: {
    fontSize: 16,
    fontWeight: 700,
    color: COLORS.white,
  },
});
