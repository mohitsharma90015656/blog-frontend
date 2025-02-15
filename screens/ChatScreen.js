import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import io from "socket.io-client";
import { BASE_URL, getTimeAgo } from "../constants/Config";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import moment from "moment";

const socket = io(BASE_URL);

const ChatScreen = ({ route }) => {
  const { user } = route?.params;
  const navigation = useNavigation();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const isUserLoggedIn = useSelector((state) => state.userAuth || {});
  const userData = isUserLoggedIn.user || null;
  const currentUserId = userData?._id;
  const flatListRef = useRef(null); // ✅ Reference for FlatList auto-scroll

  useEffect(() => {
    if (!user?._id) return;

    socket.emit("join", currentUserId);

    const handleReceiveMessage = (msg) => {
      if (msg.receiverId === currentUserId) {
        setMessages((prevMessages) => [...prevMessages, msg]);

        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 300);
      }
    };

    socket.off("receiveMessage").on("receiveMessage", handleReceiveMessage);

    axios
      .get(`${BASE_URL}api/v1/messages/${currentUserId}/${user?._id}`)
      .then((response) => {
        setMessages(response.data.data);

        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: false });
        }, 500);
      })
      .catch((error) => console.error("Error loading chat history:", error));

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [user?._id, currentUserId]);

  const sendMessage = () => {
    if (message.trim()) {
      const timestamp = new Date().toISOString();
      const msgData = {
        senderId: currentUserId,
        receiverId: user?._id,
        message,
        timestamp,
      };

      setMessages((prevMessages) => [...prevMessages, msgData]);

      socket.emit("sendMessage", msgData);

      setMessage("");

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 300);
    }
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <SafeAreaView style={styles.safeContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.headerContainer}>
          <Ionicons
            name="arrow-back"
            size={24}
            color="green"
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.header}>{user?.fullName}</Text>
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item, index) => index.toString()}
          style={styles.messagesList}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View
              style={
                item.senderId === currentUserId
                  ? styles.myMessage
                  : styles.theirMessage
              }
            >
              <Text style={styles.messageText}>{item.message}</Text>
              <View style={styles.timestampContainer}>
                <Text style={styles.timestampText}>
                  {getTimeAgo(item?.timestamp)}
                </Text>
              </View>
            </View>
          )}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message..."
          />
          <TouchableOpacity onPress={sendMessage} style={styles.button}>
            <Text style={styles.buttonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: 500,
    marginLeft: 10,
    color: "green",
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 8,
  },
  myMessage: {
    alignSelf: "flex-end",
    padding: 4,
    backgroundColor: "#4caf50",
    borderRadius: 5,
    marginVertical: 5,
    maxWidth: "80%",
    position: "relative",
  },
  theirMessage: {
    alignSelf: "flex-start",
    padding: 4,
    backgroundColor: "#2196f3",
    borderRadius: 5,
    marginVertical: 4,
    maxWidth: "80%",
    position: "relative",
  },
  messageText: {
    color: "#fff",
    fontSize: 16,
  },
  timestampContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  timestampText: {
    color: "#e0e0e0",
    fontSize: 12,
    marginRight: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  button: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: "#6200ea",
    borderRadius: 5,
  },
  buttonText: { color: "white", fontWeight: "bold" },
});

export default ChatScreen;
