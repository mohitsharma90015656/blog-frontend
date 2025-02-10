import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Button, Menu, Provider, Divider } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { BASE_URL } from "../constants/Config";
import { useSelector } from "react-redux";
import axios from "axios";
import { ActivityIndicator } from "react-native";

const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Select Category");
  const [categoryId, setCategoryId] = useState(null);

  const [menuVisible, setMenuVisible] = useState(false);
  const [blogImage, setBlogImage] = useState(null);
  const navigation = useNavigation();
  const auth = useSelector((state) => state.userAuth || {});
  const accessToken = auth.token || null;
  const [categoryList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMyCategoryList();
  }, []);

  const fetchMyCategoryList = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}api/v1/blog/getCategoryList`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setCategoryList(response?.data?.data);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching report list:", error);
      throw error;
    }
  };

  const categoryPress = (item) => {
    setCategoryId(item?._id);
    setCategory(item?.name);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setBlogImage(result.assets[0].uri);
      closeModal();
    }

    if (result.canceled) return;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", categoryId);

      if (blogImage) {
        const fileName = blogImage.split("/").pop();
        const fileType = fileName.split(".").pop();
        formData.append("blogImage", {
          uri: blogImage,
          name: fileName,
          type: `image/${fileType}`,
        });
      }
      const response = await axios.post(
        `${BASE_URL}api/v1/blog/createBlog`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setLoading(false);
      const data = response?.data;
      if (data?.success) {
        navigation.replace("blogDetails", { blogId: data?.data.blogId });
      }
    } catch (error) {
      setLoading(false);
      console.error("error", error.response?.data || error.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          alignItems: "center",
          flexDirection: "row",
          paddingLeft: 10,
          paddingTop: Platform.OS == "ios" ? 0 : 20,
        }}
      >
        <Ionicons
          name="arrow-back"
          size={26}
          color="black"
          style={{ padding: 16, paddingLeft: 4 }}
          onPress={() => navigation.goBack()}
        />
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 16, fontWeight: 500 }}>Create blog</Text>
        </View>
      </View>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : null}>
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {blogImage ? (
            <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
              {blogImage ? (
                <Image
                  source={{ uri: blogImage }}
                  style={{ height: 200, width: "100%", borderRadius: 12 }}
                />
              ) : (
                <FontAwesome name="camera" size={32} color="gray" />
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={pickImage}
              style={{
                alignItems: "center",
                marginBottom: 10,
                borderWidth: 1,
                padding: 12,
                borderRadius: 8,
                borderStyle: "dashed",
              }}
            >
              <Text style={{ fontSize: 16 }}>Upload blog Image</Text>
            </TouchableOpacity>
          )}

          <Text
            style={{
              fontSize: 16,
              fontWeight: 500,
              marginBottom: 10,
              paddingTop: 12,
            }}
          >
            Title
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              padding: 10,
              borderRadius: 8,
              marginBottom: 10,
              borderColor: "lightgray",
            }}
            placeholder="Enter Blog Title"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={{ fontSize: 16, fontWeight: 500, marginBottom: 10 }}>
            Description
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              padding: 10,
              borderRadius: 8,
              marginBottom: 10,
              height: 100,
              textAlignVertical: "top",
              borderColor: "lightgray",
            }}
            placeholder="Enter Blog Description"
            multiline
            value={description}
            onChangeText={setDescription}
          />

          <Text style={{ fontSize: 16, fontWeight: 500, marginBottom: 10 }}>
            Category
          </Text>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setMenuVisible(!menuVisible)}
                style={{ borderColor: "lightgray" }}
              >
                <Text style={{ color: "black" }}>{category}</Text>
              </Button>
            }
          >
            {categoryList?.map((item) => {
              return (
                <Menu.Item
                  onPress={() => categoryPress(item)}
                  title={item?.name}
                />
              );
            })}
          </Menu>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={{ bottom: 0, padding: 12 }}>
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={{
            marginTop: 16,
            backgroundColor: "black",
            height: 50,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {loading ? (
            <View style={{}}>
              <ActivityIndicator size={"large"} />
            </View>
          ) : (
            "Create Blog"
          )}
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default CreateBlog;

const styles = StyleSheet.create({});
