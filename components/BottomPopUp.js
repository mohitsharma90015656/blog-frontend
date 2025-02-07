import React, { forwardRef, useImperativeHandle } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";

const BottomPopUp = forwardRef((props, ref) => {
  const { message, onClose } = props;

  useImperativeHandle(ref, () => ({
    open: () => {
      bottomSheetRef.current.open();
    },
    close: () => {
      bottomSheetRef.current.close();
    },
  }));

  const bottomSheetRef = React.useRef();
  return (
    <RBSheet
      ref={bottomSheetRef}
      closeOnDragDown={false}
      closeOnPressMask={false}
      animationType={"slide"}
      duration={250}
      customStyles={{
        wrapper: {
          backgroundColor: "transparent",
        },
        draggableIcon: {
          backgroundColor: "transparent",
        },
        container: styles.bottomSheetContainer,
      }}
      height={40}
    >
      <View style={styles.content}>
        <Text style={styles.message}>{message}</Text>
      </View>
    </RBSheet>
  );
});

export default BottomPopUp;

const styles = StyleSheet.create({
    bottomSheetContainer: {
        backgroundColor: "rgba(68, 80, 69, 0.9)",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
        alignItems: "center",
        justifyContent: "center"
      },
      content: {
        alignItems: "center",
        justifyContent: "center"
      },
      message: {
        fontSize: 16,
        color: "#fff",
        textAlign: "center",
      },
});
