import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Feather";

const NewsCard = () => {
  return (
    <View style={styles.card}>
      <Image
        source={{
          uri: "https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png",
        }}
        style={styles.profileImage}
      />
      <View style={styles.textContainer}>
        <Text style={styles.author}>Marlina Kampret</Text>
        <Text style={styles.title} numberOfLines={2}>
          China is set to shatter its wind and solar target five years early...
        </Text>
        <Text style={styles.meta}>Wed, 05 July 2023 • Environment</Text>
      </View>
      <TouchableOpacity>
        <Icon name="bookmark" size={20} color="#666" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    margin: 12,
    borderWidth: 0.3,
    borderColor: "lightgray"
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  textContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  author: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    marginVertical: 4,
  },
  meta: {
    fontSize: 12,
    color: "#777",
  },
});

export default NewsCard;
