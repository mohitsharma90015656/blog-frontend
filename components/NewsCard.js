import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import moment from "moment";
import { BLOG_DEFAULT_IMAGE } from "../constants/Config";
import { Fontisto } from "@expo/vector-icons";
const NewsCard = ({ onPress, item, isUserLoggedIn, onPressBookmarked }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.card}>
        <Image
          source={{
            uri: item?.blogImage == "" ? BLOG_DEFAULT_IMAGE : item?.blogImage,
          }}
          style={styles.profileImage}
        />
        <View style={styles.textContainer}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Text style={styles.author}>{item?.owner?.fullName}</Text>
          </View>
          <Text style={styles.title} numberOfLines={2}>
            {item?.title}
          </Text>
          <Text style={styles.meta}>
            {moment(item?.createdAt).format("ddd, DD MMM YYYY")} • Environment
          </Text>
          <Text style={[styles.meta, { paddingTop: 2 }]}>
            {item?.likeBy?.length} Likes • {item?.commentedBy?.length} Comment
          </Text>
        </View>
        {isUserLoggedIn && (
          <TouchableOpacity onPress={onPressBookmarked} style={{padding: 8}}>
            <Fontisto
              name={item?.isBookmarked ? "bookmark-alt" : "bookmark"}
              size={20}
              color="black"
            />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
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
    borderColor: "lightgray",
    marginTop: 0,
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
