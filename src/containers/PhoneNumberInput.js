import React, { useState } from 'react'
import {
  TouchableOpacity, 
  TextInput,
  View,
  Text,
} from 'react-native'
import { ScaledSheet } from 'react-native-size-matters'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

function PhoneNumberInput({ 
  value, placeholder, secureTextEntry,
  autoCompleteType, autoCapitalize,
  title, onChangeText,
  toggleCountryCodes, countryCode,
}) {
  const { inputStyle } = styles

  return (
    <View style={{
      margin: wp('1'),
      marginHorizontal: wp('5'),
    }}>
      <Text style={styles.title}>{title}</Text>
     
      <View style={styles.container}>
        <TouchableOpacity onPress={() => toggleCountryCodes()} style={styles.ccBtn}>
          <Text style={styles.cc}>{countryCode}</Text>
        </TouchableOpacity>

        <TextInput
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#8D93A5"
          style={inputStyle}
          onChangeText={onChangeText}
          autoCompleteType={autoCompleteType}
          textContentType={"telephoneNumber"}
          keyboardType={"phone-pad"}
        />
      </View>
    </View>
  )
}

const styles = ScaledSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#343434',
    padding: wp('2'),
    flexDirection: 'row',
  },
  inputStyle: {
    fontSize: wp('4.4'),
    color: '#000',
    marginLeft: wp(2),
    zIndex: 2,
  },
  title: {
    marginLeft: wp('2'),
    marginBottom: hp('.5'),
    fontSize: wp('3.5'),
    fontFamily: 'Montserrat-Medium',
  },
  ccBtn: {
    borderWidth: 1,
    borderColor: '#454545',
    borderRadius: 4,
    paddingHorizontal: wp('2')
  },
  cc: {
    fontSize: wp('4'),
    fontFamily: 'Montserrat-Medium',
    color: '#454545',
  },
})

export { PhoneNumberInput } 