import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import GestureRecognizer from "react-native-swipe-gestures";
import { useNavigation } from "@react-navigation/native";
const ChatScreen = () => {
  const navigation = useNavigation();
  const onSwipeLeft = () => {
    navigation.goBack();
  };

  return (
    <GestureRecognizer style={styles.container} onSwipeRight={onSwipeLeft}>
      <SafeAreaView>
        <Text>ChatScreen</Text>
      </SafeAreaView>
    </GestureRecognizer>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
