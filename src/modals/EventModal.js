import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  SafeAreaView,
} from 'react-native'
import { ScaledSheet, moderateScale } from 'react-native-size-matters'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import profile from '../../assets/icons/profile.png'
import FastImage from 'react-native-fast-image'
import Icons from '@assets/icons'
import * as RootNavigation from '../RootNavigation';
import auth from '@react-native-firebase/auth'
import moment from 'moment'

function EventModal({ closeModal, visible, onDelete, item, isUserCalendar }) {


  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
    >
      <TouchableOpacity activeOpacity={0} style={styles.background} onPress={closeModal}>
        <View style={styles.container}>
          
          <Text style={styles.meetingTitle}>{item.meeting.title}</Text>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.title}>{moment.unix(item.date._seconds).format('MMMM Do YYYY, h:mm a')}</Text>
          <View style={{marginBottom: hp(2)}}/>

          <TouchableOpacity onPress={onDelete}>
            <Text style={styles.optionText}>Delete Event</Text>
          </TouchableOpacity>

        </View>
      </TouchableOpacity>

    </Modal>
  )
}


const styles = ScaledSheet.create({
  container: {
    backgroundColor: '#fff',
    marginHorizontal: wp('15'),
    padding: wp('4'),
  },  
  background: {
    height: hp('100'), 
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,.2)'
  },
  optionText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: wp('4.5'),
  },
  title: {
    // textAlign: 'center',
    color: 'dimgrey',
    fontSize: wp('3.9'),
  },
  description: {
    // textAlign: 'center',
    color: 'dimgrey',
    fontSize: wp('3.9'),
    marginVertical: hp(1)
  },
  meetingTitle: {
    fontFamily: 'Montserrat-Regular',
    color: '#000',
    fontSize: wp('3.9'),
    marginVertical: hp(1)
  },
})

export {EventModal}