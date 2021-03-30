import React from 'react'
import {
  View,
  Text,
} from 'react-native'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp, 
} from 'react-native-responsive-screen'
import { ScaledSheet } from 'react-native-size-matters'

function EmptyMessage() {
  return (
    <View>
    <View style={styles.empty1}/>
    <View style={styles.empty2}>
      <Text style={styles.emptyText}>Looks like the discussion hasn't started yet...</Text>
    </View>
    <View style={styles.empty3}/>
    <View style={styles.empty1}/>
    <View style={styles.empty3}/>
    <View style={styles.empty2}/>
    <View style={styles.empty1}/>
    <View style={styles.empty2}/>
    <View style={styles.empty3}/>
    <View style={styles.empty1}/>
  </View>
  )
}

const styles = ScaledSheet.create({
  empty1: {
    width: wp('70%'),
    height: hp('4%'),
    backgroundColor: '#DBE9EE',
    marginLeft: wp('7%'),
    marginVertical: hp('1%'),
  },
  empty2: {
    width: wp('80%'),
    height: hp('7%'),
    backgroundColor: '#DBE9EE',
    marginLeft: wp('7%'),
    marginVertical: hp('1%'),
  },
  empty3: {
    width: wp('80%'),
    height: hp('3%'),
    backgroundColor: '#DBE9EE',
    marginLeft: wp('7%'),
    marginVertical: hp('1%'),
  },
  emptyText: {
    fontSize: wp('4%'),
    color: '#4F6D7A',
    fontFamily: 'OpenSans-SemiBold',
    marginLeft: wp('1%'),
    margin: wp('2%'),
  },
})

export { EmptyMessage }