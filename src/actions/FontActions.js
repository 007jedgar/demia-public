import { 
  FONT_LOADING,
  FONTS_LOADED,
} from './types'

export const fontsLoaded = () => {
  return (dispatch) => {
    dispatch({
      type: FONTS_LOADED,
    })
  }
}

export const fontLoading = () => {
  return (dispatch) => {
    dispatch({
      type: FONT_LOADING,
    })
  }
}
