import React, {Component} from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';

const SearchInput = ({ label, value, onChangeText, placeholder, secureTextEntry }) => {

const { inputStyle, labelStyle, containerStyle } = styles;

  return (
    <View style={containerStyle}>
      <TextInput
        placeholder={placeholder}
        autoCorrect={false}
        secureTextEntry={secureTextEntry}
        style={inputStyle}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="#8D93A5"
      />
    </View>
  )
}

const styles = ScaledSheet.create({
  inputStyle: {
    color: '#000',
    paddingRight: '5@ms',
    paddingLeft: '5@ms',
    fontSize: '25@ms',
  },
  containerStyle: {
    width: '240@ms',
    flexDirection: 'row',
    alignItems: 'center',
  },
})


export { SearchInput };
