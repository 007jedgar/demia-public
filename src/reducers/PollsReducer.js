import {
  CREATE_POLL,
  CREATE_POLL_FAIL,
  DELETE_POLL,
  DELETE_POLL_FAIL,
  GET_POLLS,
  GET_POLLS_FAIL,
} from '../actions/types'


const INITIAL_STATE = {
  polls: [],
  pollError: {}
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CREATE_POLL:
      return { ...state, polls: action.payload }
    case CREATE_POLL_FAIL:
      return { ...state, pollError: action.payload }
    case GET_POLLS:
      return { ...state, polls: action.payload }
    case GET_POLLS_FAIL:
      return { ...state, pollError: action.payload }
    case DELETE_POLL:
      return { ...state, polls: action.payload }
    case DELETE_POLL_FAIL:
      return { ...state, pollError: action.payload }
    default:
      return { ...state }
  }
}