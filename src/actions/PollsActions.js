import {
  CREATE_POLL,
  CREATE_POLL_FAIL,
  DELETE_POLL,
  DELETE_POLL_FAIL,
  GET_POLLS,
  GET_POLLS_FAIL,
  VOTE_POLL,
  VOTE_POLL_FAIL,
} from './types'
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import { remove } from 'lodash'
import * as RootNavigation from '../RootNavigation'

export const getPolls = (meeting) => {
  return (dispatch) => {
    firestore().collection('meetings').doc(meeting.id)
    .collection('polls').get()
    .then((querySnap) => {
      if (querySnap.empty) return dispatch({ type: GET_POLLS, payload: []})

      let polls = []
      querySnap.forEach((doc) => {
        polls.push({ ...doc.data(), id: doc.id })
      })

      dispatch({
        type: GET_POLLS,
        payload: polls
      })
    }).catch((err) => {
      dispatch({ type: GET_POLLS_FAIL, payload: err })
    })
  }
}

export const createPoll = (meeting, poll ) => {
  return (dispatch) => {
    firestore().collection('meetings').doc(meeting.id)
    .collection('polls').add(poll).then(() => {
      dispatch({ type: CREATE_POLL })
      RootNavigation.goBack()
    }).catch((err) => {
      dispatch({ type: CREATE_POLL_FAIL, payload: err})
    })
  }
}

export const deletePoll = (meeting, poll, prevPolls) => {
  return (dispatch) => {
    firestore().collection('meetings').doc(meeting.id)
    .collection('polls').doc(poll.id).delete().then(() => {
      let newPolls = remove(prevPolls, (poll) => {
        return poll.id !== poll.id
      })

      dispatch({ type: DELETE_POLL, payload: newPolls })
    }).catch((err) => {
      dispatch({ type: DELETE_POLL_FAIL, payload: err })
    })
  }
}

export const votePoll = ( meeting, poll, vote ) => {
  return (dispatch) => {
    if (!vote) return;
    
    firestore().collection('meetings').doc(meeting.id)
    .collection('polls').doc(poll.id)
    .update(vote).then(() => {
      fetchPolls(dispatch, meeting)
      dispatch ({ type: VOTE_POLL })
    }).catch((err) => {
      dispatch({ type: VOTE_POLL_FAIL, payload: err })
    })
  }
}

const fetchPolls = (dispatch, meeting) => {
  firestore().collection('meetings').doc(meeting.id)
  .collection('polls').get()
  .then((querySnap) => {
    if (querySnap.empty) return dispatch({ type: GET_POLLS, payload: []})

    let polls = []
    querySnap.forEach((doc) => {
      polls.push({ ...doc.data(), id: doc.id })
    })

    dispatch({
      type: GET_POLLS,
      payload: polls
    })
  }).catch((err) => {
    dispatch({ type: GET_POLLS_FAIL, payload: err })
  })
} 