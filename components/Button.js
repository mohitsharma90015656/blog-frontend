import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { COLORS } from "../constants/theme";

const Button = ({ title, onPress, disabled }) => {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <View style={[styles.container, disabled && styles.disabledContainer]}>
        <Text style={styles.btnTxt}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#9ED5CB",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 25,
    marginVertical: 10,
  },
  disabledContainer: {
    backgroundColor: "#9ED5CF",
  },
  btnTxt: {
    fontSize: 18,
    fontWeight: 800,
    color: COLORS.black,
  },
});
