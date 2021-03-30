import React, {useState, useEffect} from 'react'
import {
  Modal,
  View,
  SafeAreaView,
} from 'react-native'
import {
  FilledConfirmBtn
} from '../buttons'
import {
  BackNavBar,
} from '../common'
import {
  MeetingInput
} from '../containers'
import { ScaledSheet } from 'react-native-size-matters'
import {
  widthPercentageToDP as wp, 
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import Spinny from 'react-native-spinkit'
import * as RootNavigation from '../RootNavigation'
import { uniqueId } from 'lodash'
import FastImage from 'react-native-fast-image'
import Icons from '@assets/icons'
import RNSimpleCrypto from "react-native-simple-crypto";

function JoinPresentationModal(props) {
  const {visible, onExit } = props
  const [ meetingId, setMeetingId ] = useState('')
  const [ displayName, setDisplayName ] = useState('')
  const [ passwordTyped, setPassword ] = useState('')
  const [ isLoading, loggleLoading ] = useState(false)

  useEffect(() => {
    loggleLoading(false)
  }, [])

  const joinRoom = async () => {
    if (!meetingId) {
      return alert('please enter a classroom id')
    }
    if (!displayName) {
      return alert('please enter a display name')
    }

    try {
      loggleLoading(true)
  
      let groupDoc = await firestore().collection('groupIds').doc(meetingId).get()
      if (!groupDoc.exists) {
        loggleLoading(false)
        return alert('The group id supplied does not match any active group')
      }
  
      const docRef = groupDoc.data().doc
      const password = groupDoc.data().group.password

      const toHex = RNSimpleCrypto.utils.convertArrayBufferToHex
      const arrayBufferToHash = RNSimpleCrypto.utils.convertUtf8ToArrayBuffer(passwordTyped)
      const typedPasswordHashed = await RNSimpleCrypto.SHA.sha256(arrayBufferToHash)
      
      if (password && password !== toHex(typedPasswordHashed)) {
        loggleLoading(false)
        return alert('Your password or group id is not correct')
      }
  
      let doc = await docRef.get()
      if (!doc.exists) { 
        loggleLoading(false)
        return alert('Sorry, this group does not exist')
      }

      
      await auth().signInAnonymously()
      let user = auth().currentUser

      let profile = {
        id: user.uid,
        present: true,
        displayName: displayName,
        tempUser: true,
      }
      let info = { docRef: docRef, doc: docRef, ...doc.data(), id: doc.id }
      props.setMeeting(info, profile)
  
      let profileRef = docRef.collection('current_attendance')
      .doc(profile.id)
  
      let profileDoc = await profileRef.get()

      if (!profileDoc.exists) { 
        await profileRef.set(profile)
        loggleLoading(false)
        props.onExit()
        return RootNavigation.navigate('meeting', {
          screen: 'stream',
          params: {
            doc: docRef,
          },
        })
      } else { 
        await profileRef.update(profile)
        loggleLoading(false)
        return RootNavigation.navigate('meeting', {
          screen: 'stream',
          params: {
            doc: docRef,
          },
        })
      }
    } catch(err) {
      loggleLoading(false)
      console.log(err)
    } 
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <Modal
        animationType="slide"
        visible={visible}
      >
        <View style={styles.container}>
        <BackNavBar title="Join a Classroom" onPress={onExit}/>

          <KeyboardAwareScrollView >
              <MeetingInput 
                placeholder={"HenryCalc101"}
                value={meetingId}
                onChangeText={setMeetingId}
                style={styles.textInput}
                title="Classroom name"
              />
              <MeetingInput 
                placeholder={"password"}
                value={passwordTyped}
                onChangeText={setPassword}
                style={styles.textInput}
                title="Password (if applicable)"
              />
              <MeetingInput 
                placeholder={"Jane Smith"}
                value={displayName}
                onChangeText={setDisplayName}
                style={styles.textInput}
                title="Display name"
              />

                <FastImage 
                  source={Icons.bookshelf}
                  style={{
                    width: wp('63'), height: wp('58'), 
                    alignSelf: 'center', marginVertical: hp('5')
                  }}
                />
            
            {isLoading?<View style={{alignSelf: 'center'}}>
              <Spinny size={wp('9')} color="#4F6D7A" type="Arc"/>
            </View>:<FilledConfirmBtn rightIcon={Icons.rightArrow} onPress={joinRoom} text="Join Classroom"/>}

          </KeyboardAwareScrollView>
            
        </View>
      </Modal>
    </SafeAreaView>
  )
}


const styles = ScaledSheet.create({
  container: {
    flex: 1,
    marginTop: '20@ms',
    // marginBottom: hp('10'),
  },
  textInput: {
    height: hp('8%'),
    width: wp('90%'),
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: '20@ms',
  },
  inputContainer: {
    backgroundColor: '#fff',
  },
})

export {JoinPresentationModal}