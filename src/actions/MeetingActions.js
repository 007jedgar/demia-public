import { Alert } from 'react-native'
import {
  CREATE_MEETING,
  CREATE_MEETING_FAIL,
  GET_MEETING,
  GET_MEETING_SUCCESS,
  GET_MEETING_FAIL,
  LEAVE_MEETING,
  LEAVE_MEETING_FAIL,
  GET_GROUP_PROFILE,
  GET_GROUP_PROFILE_FAIL,
  SAVE_DISPLAY_NAME,
  SAVE_DISPLAY_NAME_FAIL,
  JOIN_NEW_MEETING,
  JOIN_NEW_MEETING_FAIL,
  GET_USER,
} from './types'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import * as RootNavigation from '../RootNavigation';
import moment from 'moment'

export const createMeeting = (group, profile, displayName) => {
  return (dispatch) => {
    const user = auth().currentUser
    
    group.creator = profile
    group.admins = [user.uid]

    let groupProfile = {
      id: user.uid,
      present: true,
      displayName: displayName,
      tempUser: false,
      profile: profile,
      admin: true,
      joined: moment().format(),
    }

    // return console.log(group, groupProfile)
    firestore().collection('meetings').add(group)
    .then((doc) => {

      let profileRef = firestore().collection('meetings')
      .doc(doc.id).collection('current_attendance')
      .doc(user.uid).set(groupProfile)

      let groupIdRef = firestore().collection('groupIds')
      .doc(group.groupId)
      .set({group: group, doc: doc })

      let userGroupRef = firestore().collection('users')
      .doc(user.uid)
      .collection('meetings').doc(doc.id)
      .set({group: group, doc: doc })

      
      return Promise.all([groupIdRef, userGroupRef, profileRef])
      .then(() => doc)
    }).then((doc) => {

      dispatch({
        type: CREATE_MEETING, 
      })
      RootNavigation.navigate('meeting', {
        screen: 'stream',
        params: {
          doc: doc,
        },
      })
    }).catch((err) => {
      dispatch({
        type: CREATE_MEETING_FAIL, payload: err
      })
    })
  }
}


export const joinNewGroup = (groupId, profile, displayName, hexPassword) => {
  return (dispatch) => {
    // console.log('hexPassword: ',hexPassword)

    firestore().collection('groupIds').doc(groupId)
    .get().then((doc) => {
      if (!doc.exists) return alert('The group id supplied does not match any active group')

      const docRef = doc.data().doc
      const hashedPassword = doc.data().group.password
      // console.log(hashedPassword)

      if (hashedPassword) {
        // console.log(hashedPassword)
        if (hexPassword !== hashedPassword) {
          return alert('The group id or password was not correct')
        }
      }

      return docRef.get().then((doc) => {
        if (!doc.exists) return alert('An error has occured, please try again')
        let info = { doc: docRef, ...doc.data(), id: doc.id }
        dispatch({ type: GET_MEETING, payload: info })

        RootNavigation.navigate('meeting', {
          screen: 'stream',
          params: {
            doc: docRef,
          },
        })
        profile.present = true
        profile.admin = false
        profile.displayName = displayName

        firestore().collection('users')
        .doc(profile.id)
        .collection('meetings').add({ group: doc.data(), doc: docRef })

        let profileRef = docRef.collection('current_attendance')
        .doc(profile.id)
        
        return profileRef.get().then((doc) => {
          if (!doc.exists) return profileRef.set(profile)
          else return profileRef.update(profile)
        }).then(() => {
          dispatch({
             type: GET_MEETING_SUCCESS,
             payload: profile,
          })
        })
      })
    }).catch((err) => dispatch({ type: GET_MEETING_FAIL, payload: err }))
  }
}

export const joinMeeting = (docRef, profile) => {
  return (dispatch) => {
    const user = auth().currentUser
    docRef.get().then((doc) => {
      if (!doc.exists) {
        return Alert(
          'Oops',
          'An error has occured while retriving this document, please try again',
          [
          {text: 'Ok', onPress: () => RootNavigation.navigate('board')},  
          ],
          { cancelable: false }
        ) 
      }

      let meeting = {...doc.data(), id: doc.id, docRef: doc.ref }

      dispatch({
        type: GET_MEETING,
        payload: meeting
      })
      //also return group profile
      profile.present = true

      let profileRef = docRef.collection('current_attendance')
      .doc(user.uid)
      
      return profileRef.get().then((doc) => {
        if (!doc.exists) return profileRef.set(profile)
        else return profileRef.update(profile)
      })
    }).catch((err) => dispatch({ type: GET_MEETING_FAIL, paylaod: err }))
  }
}

export const leaveMeeting = (docRef, profile) => {
  return (dispatch) => {

    const user = auth().currentUser
    
    docRef.collection('current_attendance')
    .doc(user.uid).update({
      present: false
    }).then(() => {
      if (user.isAnonymous) {
        dispatch({ type: LEAVE_MEETING })
        return RootNavigation.navigate('welcome')
      }
      dispatch({ type: LEAVE_MEETING })
      RootNavigation.navigate('board')
    }).catch((err) => dispatch({ type: LEAVE_MEETING_FAIL, payload: err }))
  }
}

export const getMeetingProfile = (docRef, profile) => {
  return (dispatch) => {
    docRef.collection('current_attendance').doc(profile.id)
    .get().then((doc) => {
      let groupProfile = { ...doc.data(), id: doc.id }

      dispatch({ type: GET_GROUP_PROFILE, payload: groupProfile })
    }).catch((err) => {
      dispatch({ type: GET_GROUP_PROFILE_FAIL, payload: err })
    }) 
  }
}

export const getAttendance = (docRef) => {
  return (dispatch) => {
    docRef.collection('current_attendance')
    .get().then((querySnap) => {
      if (querySnap.empty) {
        return dispatch({
          type: GET_ATTENDANCE, payload: []
        })
      }

      let attendees = []

      querySnap.forEach((doc) => {
        if (doc.exists) {
          attendees.push({ ...doc.data() })
        }
      })

      dispatch({
        type: GET_ATTENDANCE, payload: attendees
      })
    }).catch((err) => dispatch({ type: GET_ATTENDANCE_FAIL, payload: err }))
  }
}

export const saveDisplayName = (docRef, profile, displayName) => {
  return (dispatch) => {
    docRef.collection('current_attendance')
    .doc(profile.id).update({
      displayName: displayName
    }).then(() => {
      dispatch({ type: SAVE_DISPLAY_NAME, payload: displayName})
    }).catch((err) => {
      dispatch({ type: SAVE_DISPLAY_NAME_FAIL, payload: err})
    })
  }
}


export const setMeeting = (meeting, profile) => {
  return dispatch => {
    dispatch({
      type: GET_MEETING,
      payload: meeting
    })
    dispatch({
      type: GET_USER,
      payload: profile
    })
  }
}