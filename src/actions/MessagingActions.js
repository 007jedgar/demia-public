import {
  SEND_GROUP_MSG,
  SEND_GROUP_MSG_FAIL,
  DELETE_GROUP_MSG,
  DELETE_GROUP_MSG_FAIL,
} from './types'
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import moment from 'moment'

export const toggleChat = (meeting) => {
  return (dispatch) => {
    const user = auth().currentUser
    if (!meeting.admins.includes(user.uid)) {
      return alert('You must be an admin to toggle chat')
    }

    let isOpen;

    if (meeting.chatToOpen) {
      isOpen = true
    } else {
      isOpen = false
    }

    firestore().collection('meetings').doc(meeting.id)
    .update({ chat : isOpen }).catch((err) => {
      console.log(err)
    })
  }
}

export const toggleQueue = (meeting) => {
  return (dispatch) => {
    const user = auth().currentUser
    if (!meeting.admins.includes(user.uid)) {
      return alert('You must be an admin to toggle chat')
    }

    let isOpen;

    if (meeting.queueToOpen) {
      isOpen = true
    } else {
      isOpen = false
    }

    firestore().collection('meetings').doc(meeting.id)
    .update({ queue : isOpen }).catch((err) => {
      console.log(err)
    })
  }
}

export const messageGroup = (meetingId, message ) => {
  return (dispatch) => {

    firestore().collection('meetings').doc(meetingId)
    .collection('public_comments').add(message)
    .then(() => {
      dispatch({
        type: SEND_GROUP_MSG,
      })
    }).catch((err) => {
      dispatch({
        type: SEND_GROUP_MSG_FAIL,
        payload: err
      })
    })
  }
}

export const deleteGroupMessage = (docRef, message) => {
  return (dispatch) => {  
    docRef.collection('public_comments').doc(message.id)
    .delete().then(() => {
      dispatch({
        type: DELETE_GROUP_MSG,
      })
    }).catch((err) => {
      dispatch({
        type: DELETE_GROUP_MSG_FAIL,
        payload: err
      })
    })
  }
}

export const editGroupMessage = (docRef, message) => {
  return (dispatch) => {
    docRef.collection('public_comments').doc(message.id)
    .update({
      text: message.text,
      isEdited: true,
    }).then(() => {
      dispatch({
        type: DELETE_GROUP_MSG,
      })
    }).catch((err) => {
      dispatch({
        type: DELETE_GROUP_MSG_FAIL,
        payload: err
      })
    })
  }
}

export const directMessage = (meeting, subjectDoc, message) => {
  return (dispatch) => {
    const user = auth().currentUser
    // return console.log(meeting, subjectDoc, message)
    firestore().collection('meetings').doc(meeting.id)
    .collection('current_attendance').doc(subjectDoc.id)
    .collection('direct_messages').doc(user.uid)
    .collection('messages').add(message).catch((err) => {
      console.log(err)
    })

    firestore().collection('meetings').doc(meeting.id)
    .collection('current_attendance').doc(user.uid)
    .collection('direct_messages').doc(subjectDoc.id)
    .collection('messages').add(message).catch((err) => {
      console.log(err)
    })
  }
}