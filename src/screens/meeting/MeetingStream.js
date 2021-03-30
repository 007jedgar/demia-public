import React, { useState, useEffect } from 'react'
import {
  ScrollView,
  Text,
  View,
} from 'react-native'
import {
  Block
} from '../../common'
import { StreamCard } from '../../containers'
import {
  ExitBar,
} from '../../buttons'
import {
  MeetingOptionsModal,
  DisplayNameModal,
} from '../../modals'
import { ScaledSheet, moderateScale } from 'react-native-size-matters'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {
  getUser,
  joinMeeting,
  getMeetingProfile,
  saveDisplayName,
  leaveMeeting,
} from '../../actions'
import { connect } from 'react-redux'
import { InputModal } from '../../modals'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'

function MeetingStream(props) {

  const [ showOptionsModal, toggleOptionsModal ] = useState(false)
  const [ showNameModal, toggleNameModal ] = useState(false)
  const [ showSuccess, toggleSuccess ] = useState(false)

  useEffect(() => {
    // console.log(props.route)
    let doc = props.route.params.doc
    let profile = props.profile
    console.log(profile)
    props.joinMeeting(doc, profile)
    props.getMeetingProfile(doc, profile)
  }, [])

  const changeDisplayName = (displayName) => {
    if (!displayName) return;
    firestore().collection('meetings').doc(props.meeting.id)
    .collection('current_attendance').doc(props.meetingProfile.id)
    .update({
      displayName
    }).then(() => {
      toggleSuccess(true)

      setTimeout(() => {
        toggleSuccess(false)
      }, 1500)
    }).catch((err) => {
      console.log(err)
    })
  }
  
    return (
      <Block>
        <ExitBar 
          onOptions={() => {
            toggleOptionsModal(!showOptionsModal)
          }}
          onLeave={() => {
            props.leaveMeeting(props.meeting.docRef, props.profile)
          }}           
          groupId={props.meeting.groupId} 
          title="Stream"
        />

        <ScrollView style={{ flex: 1, paddingTop: hp('2%')}}>
          <StreamCard 
            onPress={() => props.navigation.push('sharedDocs')} 
            text="Shared Documents"
          />

          <StreamCard 
            onPress={() => props.navigation.push('assignments')} 
            text="Assignments"
          />

          <StreamCard 
            onPress={() => props.navigation.push('polls')} 
            text="Polls"
          />

          <StreamCard 
            onPress={() => props.navigation.push('events')} 
            text="Events"
          />
        </ScrollView>
  
        <MeetingOptionsModal 
          closeModal={() => toggleOptionsModal(!showOptionsModal)}
          visible={showOptionsModal}
          onLeave={() => {
            toggleOptionsModal(!showOptionsModal)
            props.leaveMeeting(props.meeting.docRef, props.profile)
          }}
          onSettings={() => {
            toggleOptionsModal(!showOptionsModal)
            props.navigation.navigate('meetingSettings')
          }} 
          onBlockedUsers={() => {
            toggleOptionsModal(!showOptionsModal)
            props.navigation.navigate('blockedUsers')
          }}          
          onChangeName={() => {
            toggleOptionsModal(!showOptionsModal)
            toggleNameModal(!showNameModal)
          }}
          profile={props.meetingProfile}
        />

        <DisplayNameModal 
          closeModal={() => toggleNameModal(!showNameModal)}
          visible={showNameModal}
          onCancel={() => {
            toggleNameModal(!showNameModal)
          }}
          onAccept={(displayName) => {
            changeDisplayName(displayName)
            toggleNameModal(!showNameModal)
          }}
        />

        {showSuccess?<View style={{ 
          backgroundColor: '#fff',
          borderRadius: 10,
          alignSelf: 'center',
          shadowColor: 'black',
          shadowOffset: { x: 1, y:1},
          shadowRadius: 1,
          shadowOpacity: .6,
          marginVertical: hp('3')
          }}>
          <Text style={{ 
            textAlign: 'center',
            margin: wp('3'),
            fontFamily: 'Montserrat-SemiBold',
            fontSize: wp('4.7'),
            color: 'dimgrey',

          }}>Display Name Changed!</Text>
        </View>:null}
      </Block>
    )
  
}

const mapStateToProps = state  => {
  const { profile } = state.auth
  const { meetingProfile, meeting } = state.meeting
  
  return {
    profile,
    meetingProfile,
    meeting,
  }
}

const mapDispatchToProps = { 
  getUser, joinMeeting, getMeetingProfile ,
  saveDisplayName, leaveMeeting
}

export default connect(mapStateToProps, mapDispatchToProps)(MeetingStream)