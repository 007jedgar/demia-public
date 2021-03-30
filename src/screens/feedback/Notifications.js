import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native'
import FastImage from 'react-native-fast-image'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
import {
  ScaledSheet
} from 'react-native-size-matters'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'

import {
  Block,
  BackNavBar
} from '../../common'

import Icons from '@assets/icons'

function Notifications() {
  const [ currentUser, setCurrentUser ] = useState({})
  const [ showThanks, toggleThanks ] = useState(false)
  const [ activeNotifications, toggleNotifications ] = useState(true)
  
  useEffect(() => {
    const user = auth().currentUser

    const unsub = firestore()
    .collection('users').doc(user.uid)
    .onSnapshot((doc) => {

      setCurrentUser({ ...doc.data(), id: doc.id })

    }, (err) => {
      console.log(err)
    })

    return () => unsub()
  }, [])


  const notify = () => {
    let request = {
      author: currentUser,
      date: firestore.Timestamp.now()
    }

    firestore()
    .collection('notifications_ask')
    .doc(currentUser.id).set(request)
    .then(() => {
      toggleThanks(true)

      setTimeout(() => {
        toggleThanks(false)
      }, 1500)
    })
  }

  return (
    <Block>
      <BackNavBar 
        title="Notifications"
      />

      <Text style={styles.header}>Hi!</Text>
      
      <Text style={styles.info}>
        Thanks for using our app in beta version. 
        We're currently working to give you full control of 
        notifications. You can disable notifications in your phone's 
        settings app under notifications. Or wherever you see this image
      </Text>

      <TouchableOpacity style={{padding: wp(4)}} activeOpacity={.7} onPress={() => toggleNotifications(!activeNotifications)}>
        <FastImage  
          source={activeNotifications?Icons.blueSub:Icons.greySub}
          style={{
            width: wp('10'),
            height: wp('10'),
            alignSelf: 'center',
          }}
        />

        <Text style={styles.statusText}>{!activeNotifications?'Disabled':'Enabled'}</Text>
      </TouchableOpacity>

      <Text style={styles.info}>
        You can tap that. When it's grey, 
        the notiifcations will be disabled.
      </Text>
    </Block>
  )
}

const styles = ScaledSheet.create({
  header: {
    color: '#000',
    fontFamily: 'Montserrat-Medium',
    fontSize: wp('4'),
    margin: wp('5'),
  },
  info: {
    color: '#000',
    fontFamily: 'Montserrat-Medium',
    fontSize: wp('4'),
    margin: wp('5'),
  },
  btn: {
    width: wp('15'),
    height: wp('15'),
    borderRadius: wp('7.5'),
    shadowOffset: {width: 3, height: 3},
    shadowColor: '#393939',
    shadowOpacity: .3,
    backgroundColor: '#81B29A',
    alignSelf: 'center',
  },
  thanks: {
    color: '#81B29A',
    fontFamily: 'Montserrat-Medium',
    textAlign: 'center',
    fontSize: wp('5'),
    margin: wp('5'),
  },
  statusText: {
    alignSelf: 'center',
    fontFamily: 'Montserrat-Regular',
  },
})

export default Notifications