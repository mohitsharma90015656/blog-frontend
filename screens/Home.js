import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import SearchComponent from "../components/SearchComponent";
import { EvilIcons, FontAwesome } from "@expo/vector-icons";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import NewsCard from "../components/NewsCard";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { BASE_URL } from "../constants/Config";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
const Home = () => {
  const categories = [
    "All",
    "My blogs",
    "Fashion",
    "Politics",
    "Sports",
    "Tech",
  ];
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigation = useNavigation();
  const [blogListData, setBlogListData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState("");
  useFocusEffect(
    React.useCallback(() => {
      setIsUserLoggedIn("")
      getUserData();
      if (selectedCategory === "My blogs") {
        setBlogListData([]);
        setLoading(true);
        fetchMyBlogList();
      } else {
        setBlogListData([]);
        setLoading(true);
        fetchReportList();
      }
      return () => {};
    }, [selectedCategory])
  );
  
  const getUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem("userData");
      await AsyncStorage.removeItem()
      if (userData != null) {
        const parsedUserData = JSON.parse(userData);
        setIsUserLoggedIn(parsedUserData?.data);
      } else {
        console.log("No user data found in AsyncStorage");
        return null;
      }
    } catch (error) {
      console.error("Error retrieving user data:", error);
      throw error;
    }
  };

  const fetchMyBlogList = async () => {
    const accessToken = isUserLoggedIn.accessToken
    try {
      const response = await axios.get(
        `${BASE_URL}api/v1/blog/blogUserWiseList`,{
          headers: {
            Authorization: `Bearer ${accessToken}`, // Set token in Authorization header
          },
        }
      );
      setLoading(false);
      setBlogListData(response?.data?.data);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching report list:", error);
      throw error;
    }
  };
  
  const fetchReportList = async () => {
    try {
      const response = await axios.get(`${BASE_URL}api/v1/blog/blogList`);
      setLoading(false);
      setBlogListData(response?.data?.data);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching report list:", error);
      throw error;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.userNameContainer}>
        {isUserLoggedIn?.user?.avatar ? (
          <Image
            source={{
              uri: isUserLoggedIn?.user?.avatar,
            }}
            style={{ height: 36, width: 36, borderRadius: 50 }}
          />
        ) : (
          <EvilIcons name="user" size={46} color="black" />
        )}

        <View style={{ flex: 1, }}>
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
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <ImageBackground
            source={{
              uri: "https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png",
            }}
            style={styles.image}
            imageStyle={{ borderRadius: 12 }}
          >
            <View style={styles.details}>
              <Text style={styles.author}>Esther Howard • Fashion</Text>
              <Text style={styles.title}>
                Fashion Icon's New Collection{"\n"}Embraces Nature Elegance
              </Text>
            </View>
          </ImageBackground>
        </View>
        <View style={{}}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 500,
              paddingHorizontal: 12,
              paddingTop: 8,
            }}
          >
            For You
          </Text>
          <FlatList
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 12, paddingTop: 16 }}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.categoryItem,
                  selectedCategory === item && styles.activeCategory,
                ]}
                onPress={() => setSelectedCategory(item)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === item && styles.activeText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
        <View style={{ paddingTop: 8, marginTop: 12 }}>
          <FlatList
            data={blogListData}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index}
            renderItem={({ item }) => (
              <NewsCard
                onPress={() =>
                  navigation.navigate("blogDetails", { blogId: item?._id })
                }
                isUserLoggedIn={isUserLoggedIn}
                item={item}
              />
            )}
            ListHeaderComponent={
              <>{loading ? <ActivityIndicator size={"large"} /> : null}</>
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  userNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 25,
    justifyContent: "space-between",
  },
  container: { backgroundColor: "white", flex: 1 },
  card: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    margin: 12,
    marginTop: 0,
  },
  trendingBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  trendingText: {
    color: "#fff",
    fontSize: 12,
    marginLeft: 4,
    fontWeight: "bold",
  },
  image: {
    flex: 1,
    width: "100%",
    height: 200,
  },
  details: {
    padding: 12,
    bottom: 0,
    position: "absolute",
  },
  author: {
    fontSize: 14,
    color: "white",
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 4,
    color: "white",
  },
  categoryItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    marginHorizontal: 5,
    backgroundColor: "#fff",
  },
  activeCategory: {
    backgroundColor: "#FF6347",
    borderColor: "#FF6347",
  },
  categoryText: {
    fontSize: 14,
    color: "#333",
  },
  activeText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
