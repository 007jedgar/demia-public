import {
  SEND_GROUP_MSG,
  SEND_GROUP_MSG_FAIL,
  DELETE_GROUP_MSG,
  DELETE_GROUP_MSG_FAIL,
} from '../actions/types'

const INITIAL_STATE = {
  messageError: {},
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case DELETE_GROUP_MSG_FAIL: 
      return { ...state }
    case SEND_GROUP_MSG_FAIL:
      return { ...state }
    default:
      return { ...state }
  }
}