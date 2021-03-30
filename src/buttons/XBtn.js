import React from 'react'
import {
  TouchableOpacity,
} from 'react-native'
import {
  ScaledSheet 
} from 'react-native-size-matters'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Icons from '@assets/icons'
import FastImage from 'react-native-fast-image'

const styles = ScaledSheet.create({
  btn: {
    height: wp('10'),
    width: wp('10'),
    margin: wp('4'),
  },
})


function XBtn({ onPress, style }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <FastImage
        source={Icons.x}
        style={styles.btn}
      />
    </TouchableOpacity>
  )
}

export { XBtn }