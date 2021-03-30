import React from 'react'
import {
  TouchableOpacity,
  Text,
} from 'react-native'
import {
  ScaledSheet 
} from 'react-native-size-matters'
import FastImage from 'react-native-fast-image'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Icons from '@assets/icons'
import * as RootNavigation from '../RootNavigation'

const styles = ScaledSheet.create({
  btn: {
    position: 'absolute',
    left : wp(4),
    top: wp(4),
    zIndex: 4,
    borderRadius: wp(5),
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: .3,
    shadowOffset: { width: 1, height: 1},
  },
  img: {
    height: wp('10'),
    width: wp('10'),
    zIndex: 5,
  },
})


function BubbleBackBtn({ onPress, navigation }) {
  return (
    <TouchableOpacity activeOpacity={.7} style={styles.btn} onPress={() => {
      return RootNavigation.goBack()
    }}>
      <FastImage
        source={Icons.backArrow}
        style={styles.img}
      />
    </TouchableOpacity>
  )
}

export { BubbleBackBtn }