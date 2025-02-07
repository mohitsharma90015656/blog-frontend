import { StyleSheet } from "react-native";
import { Provider } from "react-redux";
import store from "./redux/store";
import StackNavigation from "./navigation/StackNavigation";
import { PaperProvider } from "react-native-paper";

export default function App() {
  return (
    <Provider store={store}>
      <PaperProvider>
        <StackNavigation />
      </PaperProvider>
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
