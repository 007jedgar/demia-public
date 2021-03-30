import React from 'react'
import {
  TouchableOpacity,
  Image,
} from 'react-native'
import {
  ScaledSheet 
} from 'react-native-size-matters'
import Icons from '@assets/icons'
import FastImage from 'react-native-fast-image'
import {widthPercentageToDP as wd, heightPercentageToDP as hp} from 'react-native-responsive-screen';

function AddBtn({ onPress, style, navigation }) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <FastImage
        source={Icons.plus}
        style={styles.btn} 
      />
    </TouchableOpacity>
  )
}

const styles = ScaledSheet.create({
  btn: {
    height: '45@ms',
    width: '45@ms',
    alignSelf: 'center',
  },
  container: {
    backgroundColor: 'rgba(255,255,255,.7)',
    height: '60@ms',
    width: '60@ms',
    justifyContent: 'center',
    borderRadius: '30@ms',
    shadowOffset: {width: 3, height: 3},
    shadowColor: '#393939',
    shadowOpacity: .3,
    bottom: '30@ms', right: '20@ms',
    position: 'absolute',
  }
})


export { AddBtn }