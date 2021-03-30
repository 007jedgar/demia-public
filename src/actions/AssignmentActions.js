import {
  CREATE_ASSIGNMENT,
  CREATE_ASSIGNMENT_FAIL,
}  from './types'
import moment from 'moment'
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import * as RootNagigation from '../RootNavigation'

export const createAssignment = (meeting, meetingProfile, assignment) => {
  return (dispatch) => {
    //
    assignment.dateCreated = firestore.Timestamp.now()
    assignment.completed = 0
    assignment.subscribers = []
    assignment.notStarted = []
    assignment.currentlyWorking = []
    assignment.hasCompleted = []

    return firestore().collection('meetings').doc(meeting.id)
    .collection('assignments').add(assignment)
    .then(() => {
      dispatch({
        type: CREATE_ASSIGNMENT,
      })

      RootNagigation.goBack()      
    }).catch((err) => {
      dispatch({
        type: CREATE_ASSIGNMENT_FAIL,
        payload: err
      })
    })
  }
}

export const deleteAssignment = (assignment, meeting) => {
  return (dispatch) => {
    firestore().collection('meetings').doc(meeting.id)
    .collection('assignments').doc(assignment.id)
    .delete()
  }
}

export const updateAssignment = (assignment, meeting) => {
  return (dispatch) => {
    firestore().collection('meetings').doc(meeting.id)
    .collection('assignments').doc(assignment.id)
    .update(assignment)
  }
}


export const fetchAssignments = (meeting) => {
  return (dispatch) => {
    firestore().collection('meetings').doc(meeting.id)
    .collection('assignments').get().then((querySnap) => {
      let assignments = []
      querySnap.forEach((doc) => {
        let assignment = { id: doc.id, ...doc.data()}
        assignments.push(assignment)
      })

      //dispatch assingnments
      // likly move to screen for subscriptions
    })
  }
}


export const subscribeToAssignment = (meeting, assignment) => {
  return (dispatch) => {
    const user = auth().currentUser
    
    firestore().collection('meetings').doc(meeting.id)
    .collection('assignment').doc(assignment.id)
    .collection('subscribers').add({
      user: user
    }).then(() => {

    }).catch((err) => {

    }) 

    firestore().collection('users').doc(user.uid)
    .collection('subscriptions').add(assignment)
    .then(() => {

    }).catch((err) => {

    }) 


  }
}

export const unsubscribeToAssignment = (assignment) => {
  return (dispatch) => {
    firestore().collection('users').doc(user.uid)
    .collection('subscriptions').doc(assignment.id)
    .then(() => {

    }).cacth((err) => {

    })
  }
}