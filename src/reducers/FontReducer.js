import {
  FONT_LOADING,
  FONTS_LOADED,
} from '../actions/types'


const INITIAL_STATE = {
  isFontLoaded: false,
  fontLoading: false,
}


export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FONTS_LOADED: 
      return { ...state, isFontLoaded: true, fontLoading: false }
    case FONT_LOADING:
      return { ...state, fontLoading: true, isFontLoaded: false }
    default:
      return { ...state }
  }
}