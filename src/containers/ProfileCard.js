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

function ProfileCard({ onPress, title, }) {

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = ScaledSheet.create({
  title: {
    fontSize: wp('5'),
    fontFamily: 'Montserrat-Medium',
    color: 'dimgrey',
    marginBottom: hp('1'),
  },
  card: {
    marginLeft: wp('10'),
    marginHorizontal: wp('4'),
    paddingBottom: hp('.7'),
  },
})

export { ProfileCard }