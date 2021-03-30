import React, {useState, useEffect, useRef } from 'react'
import {
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  Text,
} from 'react-native'
import FastImage from 'react-native-fast-image'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Icons from '@assets/icons'
import moment from 'moment'

function RequestResponseCard({ item,  }) {
  const displayDate = () => {
    let now = item.date._seconds
    if (now > 86400) {
      return moment.unix(item.date._seconds).format('MMM Do YYYY, h:mm a')
    }
    else return moment.unix(item.date._seconds).fromNow()
  }
  return (
    <TouchableOpacity activeOpacity={.7} style={styles.container}>
      <View>
        <Text style={[styles.info, {marginBottom: wp(2), textAlign: 'center'}]}>Request for ${item.total} has been {item.status}</Text>
        <Text style={styles.time}>{displayDate()}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    margin: wp('4'),
    padding: wp(2),
    backgroundColor: '#fff',

    borderRadius: 10,
    borderWidth: 1.52,
    borderColor: '#c2c2c2',
  },
  info: {
    fontFamily: 'OpenSans-Regular',
    fontSize: wp('4'),
  },
  time: {
    textAlign: 'center',
    color: 'dimgrey',
    margin: wp('2')
  },  
  btn: {
    flex: 1,
    marginHorizontal: wp(1),
    marginTop: wp('2')
  },
  accept: {
    textAlign: 'center',
    margin: wp('2'),
    fontSize: wp('4.5'),
    fontFamily: 'OpenSans-Regular',
  },
  deny: {
    textAlign: 'center',
    margin: wp('2'),
    fontSize: wp('4.5'),
    fontFamily: 'OpenSans-Regular',
  },
})

export {RequestResponseCard}