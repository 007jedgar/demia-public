import React, {Component} from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';
import {
  ScaledSheet
} from 'react-native-size-matters'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen'

const LineInput = ({ label, keyboardType, value, placeholderTextColor, placeholder, onChangeText, secureTextEntry, text }) => {
const { inputStyle } = styles

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        style={inputStyle}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
      />
    </View>
  )
}

const styles = ScaledSheet.create({
  container: {
    marginVertical: wp('2')
  },
  inputStyle: {
    fontSize: '19@ms',
    fontFamily: 'Arial',
    borderColor: 'dimgrey',
    borderBottomWidth: 1,
    color: '#000',  
    marginHorizontal: wp('10'),
    padding: wp('1')
  },
  label: {
    marginHorizontal: wp('10'),
    fontSize: 'Montserrat-Regular',
    fontSize: wp('4'),
  },
})


export { LineInput };
