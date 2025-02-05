import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { COLORS } from "../constants/theme";

const Button = ({ title, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <Text style={styles.btnTxt}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.primary,
        alignItems: "center",
        justifyContent: "center",
        padding: 15,
        borderRadius: 20,
        marginHorizontal: 25,
        marginVertical: 10
    },
    btnTxt: {
        fontSize: 16,
        fontWeight: 700,
        color: COLORS.white
    }
});
