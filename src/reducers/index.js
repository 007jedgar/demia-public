import { combineReducers } from "redux";
import { firestoreReducer } from 'redux-firestore'
import FontReducer from './FontReducer'
import AuthReducer from './AuthReducer'
import MessageReducer from './MessgeReducer'
import MeetingReducer from './MeetingReducer'
import PollsReducer from './PollsReducer'

export default combineReducers({
  font: FontReducer,
  auth : AuthReducer,
  firebase: firestoreReducer,
  message: MessageReducer,
  meeting: MeetingReducer,
  polls: PollsReducer,
});