import { StyleSheet } from "react-native";
import { Provider } from "react-redux";
import store, { persistor } from "./redux/store";
import StackNavigation from "./navigation/StackNavigation";
import { PaperProvider } from "react-native-paper";
import { SnackbarProvider } from "./context/SnackBarContext";
import { PersistGate } from "redux-persist/integration/react";

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider>
          <SnackbarProvider>
            <StackNavigation />
          </SnackbarProvider>
        </PaperProvider>
      </PersistGate>
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
