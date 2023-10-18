import React from 'react';
import {TextInput, View, StyleSheet} from 'react-native';


const CustomInput = ({
  height,
  width,
  backgroundColor,
  borderRadius,
  placeholder,
  onChangeText,
  value,
  secureTextEntry,
  keyboardType,
  borderBottomColor,
  borderBottomWidth
}) => (
  <View style={styles.container}>
    <TextInput
      style={styles.input}
      height={height}
      width={width}
      backgroundColor={backgroundColor}
      borderRadius={borderRadius}
      placeholder={placeholder}
      onChangeText={onChangeText}
      value={value}
      secureTextEntry={secureTextEntry}
      placeholderTextColor="#C0C0C0"
      color="black"
      keyboardType={keyboardType}
      borderBottomColor={borderBottomColor}
      borderBottomWidth={borderBottomWidth}

    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  input: {
    padding: 10,
    fontSize: 16,
    borderColor: 'gray',
    borderWidth: 0.6,
  },
});

export default CustomInput;
