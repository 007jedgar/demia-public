import storage, {StorageMetadata} from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import { uniqueId } from 'lodash'
import moment from 'moment'
import {
  UPLOAD_DOC_FAILED,
  UPLOAD_DOC
} from './types'

export const uploadDoc = ({file, meeting, profile, title }) => {
  return (dispatch ) => {
    let fileId = uniqueId()
    let now = moment().format()
    const reference = storage().ref(`meetingDocs/${meeting.id}/${fileId}`)

    reference.putFile(file.uri).then(() => {
      return reference.getDownloadURL()
    }).then((url) => {
      return firestore().collection('meetings').doc(meeting.id)
      .collection('documents').add({
        author: profile,
        url: url,
        sharedBy: profile.displayName,
        dateUploaded: now,
        title: title,
        contentType: file.type,
        subscribers: [],
        date: firestore.Timestamp.now()
      })
    }).then(() => {
      dispatch({ type: UPLOAD_DOC })
    }).catch((err) => {
      alert('an error has occurred, please try again.')
      dispatch({ type: UPLOAD_DOC, payload: err })
    })
  }
}