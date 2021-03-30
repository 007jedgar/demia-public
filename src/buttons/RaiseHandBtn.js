import React from 'react'
import {
  TouchableOpacity,
  Image,
  Text,
} from 'react-native'
import {
  ScaledSheet 
} from 'react-native-size-matters'
import hand from "../../assets/icons/blue_filled_hand.png";
import {widthPercentageToDP as wd, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const styles = ScaledSheet.create({
  btn: {
    height: 45,
    width: 45,
    left : hp("0%"),
    zIndex: 100,
    top: hp("-5.7%"),
    resizeMode:'contain'
  },
  x: {
    fontSize: '20@ms',
    fontFamily: 'Montserrat-ExtraBold',
    textAlign: 'center',
  }
})


function RaiseHandBtn({ onPress, style }) {
  return (
    <TouchableOpacity style={style} onPress={onPress}>
      <Image
        source={hand}
        style={styles.btn}
      />
    </TouchableOpacity>
  )
}

export { RaiseHandBtn }