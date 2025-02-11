import { StyleSheet } from "react-native";
import { Provider } from "react-redux";
import store from "./redux/store";
import StackNavigation from "./navigation/StackNavigation";
import { PaperProvider } from "react-native-paper";
import { SnackbarProvider } from "./context/SnackBarContext";

export default function App() {
  return (
    <Provider store={store}>
      <PaperProvider>
        <SnackbarProvider>
          <StackNavigation />
        </SnackbarProvider>
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
