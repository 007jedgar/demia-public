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
import { ProfileCard } from './ProfileCard';
import moment from 'moment'

function RequestCard({ item, onAccept, onDeny, isTa }) {
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
        <Text style={styles.msg}>"{item.message}"</Text>
        <Text style={[styles.info, {marginBottom: wp(2)}]}>{item.customer.name} has requested the following:</Text>
        {item.services.map((order, i) => {
          if (order.optionSelected) {
            return <Text key={i+1} style={styles.info}>{order.name} ${order.price?parseFloat(order.price).toFixed(2):'custom'}</Text>
          }
        })}
        <Text style={[styles.info, {marginVertical: wp(2)}]}>Total: ${(item.total)}</Text>

        <Text style={styles.time}>{displayDate()}</Text>

        {item.status === 'pending' && isTa?<View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={onAccept} activeOpacity={.6} style={[styles.btn, {backgroundColor: '#C0D6DF'}]}>
            <Text style={styles.accept}>Accept</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onDeny} activeOpacity={.6} style={[styles.btn, {backgroundColor: '#c2c2c2'}]}>
            <Text style={styles.deny}>Deny</Text>
          </TouchableOpacity>
        </View>:<Text style={styles.status}>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</Text>}
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
  msg: {
    fontFamily: 'Montserrat-MediumItalic',
    fontSize: wp('4.4'),
    marginBottom: wp('2')
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
  status: {
    textAlign: 'center',
    margin: wp('2'),
    fontSize: wp('4.5'),
    fontFamily: 'OpenSans-Regular',
  },
})

export {RequestCard}