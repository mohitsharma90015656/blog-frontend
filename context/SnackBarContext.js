import { createContext, useCallback, useContext, useState } from "react";
import { Text } from "react-native";
import { Portal, Snackbar } from "react-native-paper";

const SnackbarContext = createContext();

export const SnackbarProvider = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [duration, setDuration] = useState(3000);
  const [action, setAction] = useState(null);

  const showSnackbar = (msg, options = {}) => {
    setMessage(msg);
    setDuration(options.duration || 3000);
    setAction(options.action || null);
    setVisible(true);
  };

  const hideSnackbar = () => {
    setVisible(false);
  };

  return (
    <SnackbarContext.Provider value={{showSnackbar}}>
      {children}
      <Portal>
        <Snackbar
          visible={visible}
          onDismiss={hideSnackbar}
          duration={duration}
          action={action}
          style={{
            backgroundColor: "#FF6347",
          }}
        >
          <Text style={{color: 'black', fontWeight: 500}}>{message}</Text>
        </Snackbar>
      </Portal>
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  return useContext(SnackbarContext);
};
