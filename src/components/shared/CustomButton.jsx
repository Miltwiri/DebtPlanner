import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const CustomButton = ({ type, title, onPress, disabled }) => {
  let height, width, backgroundColor, borderColor, borderWidth, textColor, alignItems, justifyContent, fontStyle;

  switch (type) {
    case 'primary':
      height = 50;
      width = 150;
      backgroundColor = '#000080';
      textColor = 'white';
      alignItems = 'center';
      justifyContent = 'center';
      break;
    case 'secondary':
      height = 50;
      width = 150;
      backgroundColor = 'orange';
      textColor = 'white';
      borderColor = '#0072ff';
      borderWidth = 0;
      alignItems = 'center';
      justifyContent = 'center';
      break;
    case 'tertiary':
      textColor = '#3C5291';
      alignItems = 'flex-start';
      justifyContent = 'center';
      fontStyle = 'italic';
      break;
    default:
      height = 50;
      width = 200;
      backgroundColor = '#0072ff';
      borderColor = '#0072ff';
      borderWidth = 1;
  }

  // Conditional styles for disabled button
  const buttonStyles = {
    height: height,
    width: width,
    backgroundColor: disabled ? 'gray' : backgroundColor, // Set to gray if disabled
    borderColor: borderColor,
    borderWidth: borderWidth,
    alignItems: alignItems,
    justifyContent: justifyContent,
    fontStyle: fontStyle,
    borderRadius: 5,
  };

  // Conditional styles for text color
  const textStyles = {
    color: disabled ? 'lightgray' : textColor, // Set to lightgray if disabled
  };

  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <View style={buttonStyles}>
        <Text style={textStyles}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default CustomButton;
