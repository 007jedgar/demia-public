import React from 'react'
import { 
  TouchableOpacity,
  Text,
} from 'react-native'
import { ScaledSheet } from 'react-native-size-matters'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image'
import Icons from '@assets/icons'

function AuthBtn({ onPress, btnStyle, type, fontStyle, text }) {
  let  { btn, textStyle } = styles
  
  const setImg = () => {
    switch (type) {
      case 'Apple':
        return Icons.apple
      case 'Google':
        return Icons.google
      case 'Email':
        return Icons.email
      default:
        break;
    }
  }

  return (
    <TouchableOpacity style={btn} onPress={onPress}>
      <FastImage 
        source={setImg()}
        style={styles.img}
      />
      <Text style={[textStyle, fontStyle]}>
        {text} {type}
      </Text>
    </TouchableOpacity>
  )
}

const styles = ScaledSheet.create({
  btn: {
    marginHorizontal: wp('7'),
    marginVertical: hp('2'),
    padding: '5@ms',
    borderRadius: '2@ms',
    borderWidth: 1,
    elevation: '1@ms',
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'center',
    padding: wp('2')
  },
  textStyle: {
    textAlign: 'center',
    fontSize: wp('5'),
    fontFamily: 'Montserrat-Regular',
    color: '#000',
    marginLeft: wp('5'),
  },
  img: {
    width: wp('7'),
    height: wp('7'),
    alignSelf: 'center',
  },
})

export { AuthBtn }