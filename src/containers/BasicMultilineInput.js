import React from 'react'
import { 
  TextInput,
  View,
} from 'react-native'
import { ScaledSheet, moderateScale } from 'react-native-size-matters'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

function BasicMultilineInput({ 
  text, placeholder, secureTextEntry, typed, 
  autoCompleteType, autoCapitalize, textContentType, 
  keyboardType, multiline

}) {
  const { inputStyle } = styles

  return (
    <View style={{
      margin: moderateScale(10)
    }}>
      <TextInput
        value={text}
        placeholder={placeholder}
        placeholderTextColor="#8D93A5"
        style={inputStyle}
        onChangeText={(text) => typed(text)}
        autoCompleteType={autoCompleteType}
        autoCapitalize={autoCapitalize}
        textContentType={textContentType}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        multiline={true}
      />
    </View>
  )
}

const styles = ScaledSheet.create({
  inputStyle: {
    backgroundColor: '#fff',
    height: hp('7'),
    marginHorizontal: wp('7'),
    padding: '5@ms',
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#343434',   
    elevation: '1@ms',
    backgroundColor: '#fff',
    fontSize: wp('4.4'),
    color: '#000',
  },
})

export { BasicMultilineInput } 