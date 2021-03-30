import React, { useState, useEffect} from 'react'
import {
  FlatList,
  View,
  Text,
} from 'react-native'
import {
  Block,
} from '../../common'
import {
  AttendeeCard
} from '../../containers'
import { 
  leaveMeeting,
} from '../../actions'
import {
  ExitBar
} from '../../buttons'
import {
  MeetingOptionsModal,
  DisplayNameModal,
  UserOptionsModal,
} from '../../modals'

import ImagePicker from 'react-native-image-picker';

import { connect } from 'react-redux'

import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import Spinny from 'react-native-spinkit'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen'

function MeetingAttendance(props) {
  const [ showOptionsModal, toggleOptionsModal ] = useState(false)
  const [ showUserModal, toggleUserModal ] = useState(false)
  const [ showNameModal, toggleNameModal ] = useState(false)
  const [ showSuccess, toggleSuccess ] = useState(false)
  const [ isLoading, toggleLoading ] = useState(false)
  const [ members, setMembers ] = useState([])
  const [ otherUser, setUser ] = useState({})
  const [ currentUser, setCurrentUser ] = useState({})

  useEffect(() => {
    toggleLoading(true)
    const user = auth().currentUser

    firestore()
    .collection('meetings').doc(props.meeting.id)
    .collection('current_attendance')
    .onSnapshot((querySnap) => {
      
      if (querySnap.empty) {
        toggleLoading(false)
        return setMembers([])
      }

      let members = []
      querySnap.forEach((doc) => {
        if (doc.id === user.uid) {
          setCurrentUser({ ...doc.data(), id: doc.id })
        }

        members.push({ ...doc.data(), id: doc.id })
      })

      setMembers(members)
      toggleLoading(false)
    }, (err) => {
      setMembers([])
      toggleLoading(false)
    })
    
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

  const renderLoading = () => {
    return (
      <View style={{alignSelf: 'center', marginVertical: hp('4')}}>
        <Spinny type="Arc" color="#000" size={wp('8')} />
      </View>
    )
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
        title={'Members'}
      />

      <FlatList 
        ListHeaderComponent={isLoading?renderLoading():null}
        data={members}
        renderItem={({item}) => {
          if (currentUser.blockedUserIds && currentUser.blockedUserIds.includes(item.id)) return null

          return  (
            <AttendeeCard 
              item={item}
              showUserOptions={() => {
                setUser(item)
                
                setTimeout(() => {
                  toggleUserModal(!showUserModal)
                }, 50)
              }}
            /> 
          )
      }}
        keyExtractor={(item) => item.id.toString()}
      />
 
      <MeetingOptionsModal 
        closeModal={() => toggleOptionsModal(!showOptionsModal)}
        visible={showOptionsModal}
        onLeave={() => {
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

      {showUserModal?<UserOptionsModal 
        visible={showUserModal}
        onToggleModal={() => toggleUserModal(!showUserModal)}
        onBlock={() => {
          toggleUserModal(!showUserModal)
        }}
        meeting={props.meeting}
        item={otherUser}
        profile={props.meetingProfile}
      />:null}

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


const mapStateToProps = state => {
  const { meeting, meetingProfile } = state.meeting
  const { profile } = state.auth

  return {
    meeting,
    meetingProfile,
    profile,
  }
}

const mapDispatchToProps = {
  leaveMeeting,
}

export default
  connect(mapStateToProps, mapDispatchToProps)
(MeetingAttendance)