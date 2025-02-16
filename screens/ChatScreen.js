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
  ImageBackground,
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
  const flatListRef = useRef(null);

  useEffect(() => {
    if (!user?._id) return;

    socket.emit("join", currentUserId);

    socket.emit("userInChat", {
      userId: currentUserId,
      chattingWith: user._id,
    });

    const handleReceiveMessage = (msg) => {
      if (msg.receiverId === currentUserId) {
        setMessages((prevMessages) => [...prevMessages, msg]);

        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 300);
        socket.emit("markMessagesAsRead", {
          senderId: msg.senderId,
          receiverId: currentUserId,
        });
      }
    };

    const handleMessagesRead = ({ senderId, receiverId }) => {
      if (receiverId === currentUserId) {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.senderId === senderId ? { ...msg, isRead: true } : msg
          )
        );
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("messagesRead", handleMessagesRead);
    axios
      .post(`${BASE_URL}api/v1/messages/mark-read`, {
        senderId: user._id,
        receiverId: currentUserId,
      })
      .then(() => console.log("Messages marked as read"))
      .catch((error) =>
        console.error("Error marking messages as read:", error)
      );

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
      socket.emit("userLeftChat", currentUserId);
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("messagesRead", handleMessagesRead);
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
        isRead: false,
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
        <ImageBackground
          source={{
            uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzG1j9wU1OMdJV0QSD6JGLWBVoGAtc4MTiYGnpZe5i9616euIesNbWHBVaO48pEgKd23k&usqp=CAU",
          }}
          style={{ flex: 1 }}
        >
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
                  {item.senderId === currentUserId && (
                    <Ionicons
                      name={item.isRead ? "checkmark-done" : "checkmark"}
                      size={16}
                      color={item.isRead ? "blue" : "gray"}
                      style={styles.readReceiptIcon}
                    />
                  )}
                </View>
              </View>
            )}
          />

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={message}
              onChangeText={setMessage}
              placeholder="Message"
            />
            <TouchableOpacity onPress={sendMessage} style={styles.button}>
              <Ionicons name="send" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
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
  },
  input: {
    flex: 1,
    padding: 13,
    borderRadius: 18,
    backgroundColor: "#fff",
  },
  button: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: "#18a668",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: { color: "white", fontWeight: "bold" },
});

export default ChatScreen;
