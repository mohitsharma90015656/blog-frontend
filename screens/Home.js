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
import { EvilIcons, FontAwesome, Ionicons } from "@expo/vector-icons";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import NewsCard from "../components/NewsCard";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { BASE_URL } from "../constants/Config";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector } from "react-redux";
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

  const accessToken = isUserLoggedIn.token || null;
  const userData = isUserLoggedIn.user || null;
  useFocusEffect(
    React.useCallback(() => {
      setBlogListData([]);
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.userNameContainer}>
        {userData?.avatar ? (
          <Image
            source={{
              uri: userData?.avatar,
            }}
            style={{ height: 30, width: 30, borderRadius: 50 }}
          />
        ) : (
          <EvilIcons name="user" size={40} color="black" />
        )}

      <View><Text style={{fontSize: 16,fontWeight: 500}}>Mohit sharma</Text></View>
        <View
          style={{
            borderWidth: 0.5,
            borderColor: "lightgray",
            padding: 4,
            borderRadius: 50,
          }}
        >
          <FontAwesome name="bell-o" size={20} color="black" />
        </View>
      </View>
      <View style={{paddingHorizontal: 12 }}>
          <SearchComponent />
      
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
              <>
                {loading ? (
                  <View style={{ padding: 16 }}>
                    <ActivityIndicator size={"large"} />
                  </View>
                ) : null}
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
