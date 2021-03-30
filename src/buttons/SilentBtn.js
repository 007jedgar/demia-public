import React from 'react'
import { 
  TouchableOpacity,
  Text,
} from 'react-native'
import { ScaledSheet } from 'react-native-size-matters'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

function SilentBtn({ onPress, text }) {
  let  { btn, textStyle } = styles
  return (
    <TouchableOpacity style={[btn]} onPress={onPress}>
      <Text style={textStyle}>
        {text}
      </Text>
    </TouchableOpacity>
  )
}

const styles = ScaledSheet.create({
  btn: {
    justifyContent: 'center',
    borderRadius: 4,
    backgroundColor: '#fff',
    backgroundColor: '#E07A5F',
    margin: wp('2'),
    marginHorizontal: wp('5'),
    shadowOffset: { width: 1, height: 1},
    shadowColor: 'dimgrey',
    shadowOpacity: .5,
  },
  textStyle: {
    textAlign: 'center',
    fontSize: wp('5'),
    fontFamily: 'Montserrat-Regular',
    color: '#fff',
    margin: wp('2'),
  },
})

export { SilentBtn }