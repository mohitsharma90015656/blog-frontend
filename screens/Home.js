import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { EvilIcons, FontAwesome } from "@expo/vector-icons";
import NewsCard from "../components/NewsCard";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { BASE_URL } from "../constants/Config";
import axios from "axios";
import { useSelector } from "react-redux";
import Header from "../components/Header";
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
  const isUserLoggedIn = useSelector((state) => state.userAuth || {});
  const [bookmarkedBlog, setBookmarkedBlog] = useState(false);
  const accessToken = isUserLoggedIn.token || null;
  const userData = isUserLoggedIn.user || null;

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      fetchReportList();
      return () => {};
    }, [])
  );
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

  const bookmarkBlog = async (id) => {
    try {
      const response = await axios.post(
        `${BASE_URL}api/v1/bookmark/bookmark/${id}`
      );
      fetchReportList();
    } catch (error) {
      setLoading(false);
      console.error("Error while bookmark blog:", error);
      throw error;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        showProfile={true}
        showSearchComponent={true}
        showRightIcon={true}
        rtIcon={<FontAwesome name="bell-o" size={24} color="black" />}
        profileIconClr={"black"}
      />
      <View style={{}}>
        <FlatList
          data={[1, 2, 3, 4, 5]}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
          horizontal
          contentContainerStyle={{ paddingHorizontal: 12 }}
          keyExtractor={(item, index) => index}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={[styles.card, { flex: 1 }]}>
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
          )}
        />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
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
                isUserLoggedIn={accessToken}
                item={item}
                bookmarkedBlog={bookmarkedBlog}
                onPressBookmarked={() => bookmarkBlog(item?._id)}
              />
            )}
            ListHeaderComponent={
              <>
                <>
                  {loading ? (
                    <View style={{ padding: 16 }}>
                      <ActivityIndicator size={"large"} />
                    </View>
                  ) : null}
                </>
              </>
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: { backgroundColor: "white", flex: 1 },
  card: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    paddingRight: 12,
    marginBottom: 12,
  },
  image: {
    width: "100%",
    height: 180,
  },
  details: {
    flex: 1,
    padding: 12,
    bottom: 0,
    justifyContent: "flex-end",
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
