import firestore from '@react-native-firebase/firestore'
import { shuffle } from 'lodash'
import auth from '@react-native-firebase/auth'

export const setRandomGroup = (attendees, groupMax, meeting) => {
  return (dispatch) => {
    let user = auth().currentUser

    firestore().collection('meetings').doc(meeting.id)
    .collection('groups').add(attendees)
    .catch((err) => console.log(err))
  }
}

export const setOpenGroup = (groupMax, meeting) => {
  return (dispatch) => {
    firestore().collection('meetings').doc(meeting.id)
    .collection('groups').add({
      groupMax: groupMax,
    })
  }
}