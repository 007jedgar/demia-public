import React from 'react'
import { 
  TextInput,
  View,
  Text,
} from 'react-native'
import { ScaledSheet, moderateScale } from 'react-native-size-matters'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

function BasicInput1({ 
  value, placeholder, secureTextEntry,
  autoCompleteType, autoCapitalize, textContentType, 
  keyboardType, multiline, title, onChangeText,
  maxHeight,editable
}) {
  const { inputStyle } = styles

  return (
    <View style={{
      margin: wp('1'),
      marginHorizontal: wp('5'),
    }}>
      <Text style={styles.title}>{title}</Text>
      <TextInput
        value={value}
        placeholder={placeholder}
        placeholderTextColor="#8D93A5"
        style={[inputStyle, {maxHeight: maxHeight}]}
        onChangeText={onChangeText}
        autoCompleteType={autoCompleteType}
        autoCapitalize={autoCapitalize}
        textContentType={textContentType}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        multiline={multiline}
        editable={editable}
      />
    </View>
  )
}

const styles = ScaledSheet.create({
  inputStyle: {
    padding: wp('2'),

    backgroundColor: '#fff',
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#343434',
    elevation: 1,
    backgroundColor: '#fff',
    fontSize: wp('4.4'),
    color: '#000',
  },
  title: {
    marginLeft: wp('2'),
    marginBottom: hp('.5'),
    fontSize: wp('3.5'),
    fontFamily: 'Montserrat-Medium',
  },
})

export { BasicInput1 } 