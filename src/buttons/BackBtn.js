import React from 'react'
import {
  TouchableOpacity,
  Image,
  Text,
} from 'react-native'
import {
  ScaledSheet 
} from 'react-native-size-matters'
import BackArrow from "../../assets/icons/filled_back_arrow.png";
import {widthPercentageToDP as wd, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const styles = ScaledSheet.create({
  btn: {
    height: 45,
    width: 45,
    left : hp("0%"),
    zIndex: 100,
    top: hp("-5.7%"),
    // resizeMode:'contain'
  },
  x: {
    fontSize: '20@ms',
    fontFamily: 'Montserrat-ExtraBold',
    textAlign: 'center',
  }
})


function BackBtn({ onPress, style, navigation }) {
  return (
    <TouchableOpacity style={style} onPress={() => {
      if (!onPress) return navigation.goBack()
      
      return onPress()
    }}>
      <Image
        source={BackArrow}
        style={styles.btn}
      />
    </TouchableOpacity>
  )
}

export { BackBtn }