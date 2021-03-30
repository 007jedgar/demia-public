import React from 'react'
import { 
  TextInput,
  View,
  Text,
} from 'react-native'
import { ScaledSheet, moderateScale } from 'react-native-size-matters'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

function BasicInput({ 
  text, placeholder, secureTextEntry, typed, 
  autoCompleteType, autoCapitalize, textContentType, 
  keyboardType, multiline, title,

}) {
  const { inputStyle } = styles

  return (
    <View style={{
      margin: wp('2')
    }}>
      <Text style={styles.title}>{text?title:''}</Text>
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
      />
    </View>
  )
}

const styles = ScaledSheet.create({
  inputStyle: {
    backgroundColor: '#fff',
    padding: '5@ms',
    marginHorizontal: wp('7'),
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#343434',
    elevation: 1,
    backgroundColor: '#fff',
    fontSize: wp('4.4'),
    padding: wp('2'),
    color: '#000',
  },
  title: {
    marginLeft: wp('8'),
    marginBottom: hp('.5'),
    fontSize: wp('3.5'),
    fontFamily: 'Montserrat-Medium',
  },
})

export { BasicInput } 