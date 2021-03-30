import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native'
import { ScaledSheet, moderateScale } from 'react-native-size-matters'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import profile from '../../assets/icons/profile.png'
import FastImage from 'react-native-fast-image'
import Icons from '@assets/icons'
import * as RootNavigation from '../RootNavigation';
import auth from '@react-native-firebase/auth'
import moment from 'moment'

function AgendaCard({ onPress, day, item }) {
  console.log(item)
  return (
    <TouchableOpacity 
      activeOpacity={.7} 
      style={styles.agendaContainer}
      onPress={onPress}
    >
      <View>
        <Text style={styles.nameText}>{item.title}</Text>
        <Text style={styles.day}>{moment.unix(item.date._seconds).format('MMMM Do YYYY, h:mm a')}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = ScaledSheet.create({
  agendaContainer: {
    flexDirection: 'row',
    marginVertical: wp('2'),
  },
  nameText: {
    fontSize: wp('5'),
    fontFamily: 'Montserrat-Regular',
    marginLeft: wp('5')
  },
  day: {
    fontSize: wp('4.5'),
    fontFamily: 'Montserrat-Regular',
    color: 'dimgrey',
    marginLeft: wp('5')
  },
  dayNum: {

  },
})

export { AgendaCard }