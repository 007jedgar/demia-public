import {
  CREATE_ASSIGNMENT,
  CREATE_ASSIGNMENT_FAIL,
} from '../actions/types'


const INITIAL_STATE = {
  assingmentLoading: false ,
  assignmentErr: {}
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CREATE_ASSIGNMENT:
      return { ...state, assingmentLoading: false }
    case CREATE_ASSIGNMENT_FAIL:
      return { ...state, assignmentErr: action.payload }
    default:
      return { ...state }
  }
}