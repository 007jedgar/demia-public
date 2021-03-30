import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView
} from 'react-native'
import FastImage from 'react-native-fast-image'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
import {
  ScaledSheet
} from 'react-native-size-matters'
import { 
  KeyboardAwareScrollView
} from 'react-native-keyboard-aware-scroll-view'

import Communications from 'react-native-communications';

import {
  BasicMultilineInput,
} from '../../containers'
import {
  Block,
  BackNavBar,
} from '../../common'
import {
  ConfirmBtn
} from '../../buttons'
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import RootNavigation from '../../RootNavigation'

function SendFeedback() {
  const [ reason, editReason ] = useState('')
  const [ showThanks, toggleThanks ] = useState(false)
  const disclaimers = [`We read everything sent in and reply to every question. Found a bug? Have a feature request?`]


  const onSend = async () => {
    if (!reason) return;

    let user = await firestore()
    .collection('users').doc(auth().currentUser.uid)
    .get()

    let feedback = {
      text: reason,
      author: user.data(),
      date: firestore.Timestamp.now()
    }

    await firestore()
    .collection('feedback').add(feedback)
    editReason('')
    toggleThanks(!showThanks)

    setTimeout(() => {
      toggleThanks(showThanks)
      RootNavigation.goBack()
    }, 1300)
  }

  const callSupport = () => {
    Communications.phonecall('+14153268957', false)
  }

  const textSupport = () => {
    Communications.text('+14153268957')
  }

  const emailSupport = () => {
    Communications.email(['jedgar@teachero.app'], null, null, null, null)
  }

  return (
    <Block>
      <BackNavBar 
        title={'Feedback'}
      />

      <KeyboardAwareScrollView>
        <Text style={styles.header}>Get in touch</Text>

        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: wp('10')}}>

          <TouchableOpacity style={styles.nameContainer} onPress={callSupport}>
            <Text style={styles.name}>Call</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.nameContainer} onPress={textSupport}>
            <Text style={styles.name}>Text</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.nameContainer} onPress={emailSupport}>
            <Text style={styles.name}>Email</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.disclaimer}>
          {disclaimers[0]}
        </Text>

        <BasicMultilineInput 
          placeholder="What's up?"
          typed={editReason}
          value={reason}
        />

        <View style={{ marginVertical: hp('3')}}/>

        <ConfirmBtn 
          text="Submit"
          onPress={onSend}
          disabled={!reason}
        />

        {showThanks?<Text style={styles.thanks}>Thanks for your feedback!</Text>:null}
      </KeyboardAwareScrollView>

    </Block>
  )
}

const styles = ScaledSheet.create({
  thanks: {
    color: '#81B29A',
    fontFamily: 'Montserrat-Medium',
    textAlign: 'center',
    fontSize: wp('4'),
    margin: wp('5'),
  },
  header: {
    color: '#000',
    fontFamily: 'Montserrat-Medium',
    textAlign: 'center',
    fontSize: wp('4'),
    margin: wp('5'),
  },
  disclaimer: {
    color: '#000',
    fontFamily: 'Montserrat-Regular',
    fontSize: wp('4'),
    margin: wp('5'),
  },
  name: {
    fontSize: '20@ms',
    fontFamily: 'Montserrat-Medium',
    marginRight: '10@ms',
    color: '#27a587',
    textAlign: 'center',
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: '15@ms',
  },
})

export default SendFeedback