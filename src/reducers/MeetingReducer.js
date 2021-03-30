import {
  CREATE_MEETING,
  CREATE_MEETING_FAIL,
  GET_MEETING,
  GET_MEETING_FAIL,
  GET_MEETING_SUCCESS,
  LEAVE_MEETING,
  LEAVE_MEETING_FAIL,
  GET_GROUP_PROFILE,
  GET_GROUP_PROFILE_FAIL,
  SAVE_DISPLAY_NAME,
  SAVE_DISPLAY_NAME_FAIL,
} from '../actions/types'

const INITIAL_STATE = {
  createMeetingError: {},
  getMeetingError: {},
  meeting: {},
  getMeetingProfileErr: {},
  meetingProfile: {},
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CREATE_MEETING: 
      return { ...state, createMeetingError: {} }
    case CREATE_MEETING_FAIL:
      return { ...state, createMeetingError: action.payload }
    case GET_MEETING_FAIL:
      return { ...state, getMeetingError: action.payload }
    case GET_MEETING:
      return { ...state, meeting: action.payload }
    case GET_MEETING_SUCCESS:
      return { ...state, meetingProfile: action.payload }
    case GET_GROUP_PROFILE_FAIL:
      return { ...state, getMeetingProfileErr: action.payload }
    case GET_GROUP_PROFILE:
      return { ...state, meetingProfile: action.payload }
    case SAVE_DISPLAY_NAME: 
      return { ...state, meetingProfile: { ...state.meetingProfile, displayName: action.payload } }
    default:
      return { ...state }
  }
}