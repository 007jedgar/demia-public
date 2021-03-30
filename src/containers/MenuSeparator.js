import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native'
import { ScaledSheet } from 'react-native-size-matters'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen'

function MenuSeparator({ onPress, title, }) {

  return (
    <TouchableOpacity activeOpacity={.8} style={styles.card}>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = ScaledSheet.create({
  title: {
    fontSize: wp('5'),
    fontFamily: 'Montserrat-Regular',
    color: 'dimgrey',
    
  },
  card: {
    marginHorizontal: wp('10'),
    marginVertical: wp('2'),
    borderBottomColor: 'dimgrey',
    borderBottomWidth: 1,
  },
})

export { MenuSeparator }