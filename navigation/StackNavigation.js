import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import BottomTabNavigation from "./BottomTabNavigation";
import BlogDetails from "../screens/BlogDetails";
import Bookmarked from "../screens/Bookmarked";
import CreateBlog from "../screens/CreateBlog";
import ChatScreen from "../screens/ChatScreen";
const StackNavigation = () => {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="Bottom Navigation"
          component={BottomTabNavigation}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="blogDetails"
          component={BlogDetails}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="bookmarked"
          component={Bookmarked}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="createBlog"
          component={CreateBlog}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ChatScreen"
          component={ChatScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigation;
