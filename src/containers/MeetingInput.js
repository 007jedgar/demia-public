import React from 'react'
import {
  TextInput,
  Text,
  View,
} from 'react-native'
import {ScaledSheet} from 'react-native-size-matters'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

function MeetingInput({ placeholder, title, value, onChangeText }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <TextInput 
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        style={styles.textInput}
        placeholderTextColor="#8D93A5"
      />
    </View>
  )
}
const styles = ScaledSheet.create({
  textInput: {
    textAlign: 'center',
    fontSize: wp('4.6'),
    fontFamily: 'OpenSans-SemiBold',
    paddingVertical: hp('.5'),
    color: '#000',
  },
  container: {
    shadowColor: '#81B29A',
    shadowOffset: { x: 1, y:2},
    shadowRadius: 3,
    shadowOpacity: .6,
    elevation: 1,

    borderRadius: 8,

    backgroundColor: '#fff',
    marginVertical: '5@ms',
    marginHorizontal: wp('3'),
    padding: wp('2'),
  },
  title: {
    alignSelf: 'center',
    fontFamily: 'OpenSans-Regular',
    fontSize: wp('4')
  },
})

export {MeetingInput}