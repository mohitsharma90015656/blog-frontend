import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet } from "react-native";
import BottomTabNavigation from "./navigation/BottomTabNavigation";
import BlogDetails from "./screens/BlogDetails";
import SignUp from "./screens/SignUp";
import { Provider } from "react-redux";
import store from "./redux/store";
import Bookmarked from "./screens/Bookmarked";

export default function App() {
  const Stack = createNativeStackNavigator();
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
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
            name="signUp"
            component={SignUp}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="bookmarked"
            component={Bookmarked}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
