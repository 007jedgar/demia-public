import {
  GET_USER,
  GET_USER_FAIL,
  SIGNIN,
  SIGNIN_FAIL,
  CLEAR_ERROR,
  AUTH_ATTEMPT,
} from '../actions/types'

const INITIAL_STATE = {
  profile: {},
  profileErr: {},
  isLoading: false,
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_USER: 
      return { ...state, profile: action.payload }
    case GET_USER_FAIL: 
      return { ...state, profileErr: action.payload }
    case AUTH_ATTEMPT:
      return { ...state, isLoading: true }
    case SIGNIN:
      return { ...state, profile: action.payload, isLoading: false }
    case SIGNIN_FAIL:
      return { ...state, profileErr: action.payload, isLoading: false }
    case CLEAR_ERROR:
      return { ...state, profileErr: {} }
    default:
      return { ...state }
  }
}