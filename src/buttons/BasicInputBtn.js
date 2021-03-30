import React from 'react'
import { 
  TextInput,
  View,
  Text,
  TouchableOpacity,
} from 'react-native'
import { ScaledSheet, moderateScale } from 'react-native-size-matters'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

function BasicInputBtn({ 
  value, title, onPress
}) {
  const { inputStyle } = styles

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={.7} style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.input}>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.manage}>Edit</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = ScaledSheet.create({
  container: {
    backgroundColor: '#fff',
    margin: wp(2),
    marginHorizontal: wp('5'),
    marginVertical: wp('1'),
  },
  input: {
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#343434',
    flexDirection: 'row', justifyContent: 'space-between', padding: wp('2')
  },
  title: {
    marginLeft: wp('2'),
    marginBottom: hp('.5'),
    fontSize: wp('3.5'),
    fontFamily: 'Montserrat-Medium',
  },
  manage: {
    color: '#69A2B0',
    marginLeft: wp('2'),
    fontSize: wp('4.4'),
    fontFamily: 'Montserrat-Medium',
    alignSelf: 'center',
  },
  value: {
    color: '#454545',
    // marginLeft: wp('2'),
    fontSize: wp('4.4'),
    fontFamily: 'Montserrat-Medium',
    alignSelf: 'center',
  },
})

export { BasicInputBtn } 