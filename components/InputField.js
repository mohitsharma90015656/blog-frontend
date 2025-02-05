import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";

const InputField = ({ 
    label, 
    value, 
    onChangeText, 
    placeholder, 
    secureTextEntry = false, 
    errorMessage
 }) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, errorMessage ? styles.inputError : null]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#888"
        secureTextEntry={secureTextEntry}
      />
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
    </View>
  );
};

export default InputField;

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        marginHorizontal: 25
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: '#333',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 20,
        fontSize: 16,
        color: 'white',
        paddingVertical: 10
    },
    inputError: {
        borderColor: 'red',
    },
    error: {
        color: 'red',
        fontSize: 12,
        marginTop: 5,
    },
});
