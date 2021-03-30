import React from 'react'
import { 
  TouchableOpacity,
  Text,
} from 'react-native'
import { ScaledSheet } from 'react-native-size-matters'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

function ConfirmBtn({ onPress, btnStyle, text, fontStyle, disabled }) {
  let  { btn, textStyle } = styles
  return (
    <TouchableOpacity activeOpacity={.7} disabled={disabled} style={[btn, btnStyle]} onPress={onPress}>
      <Text style={[textStyle, fontStyle]}>
        {text}
      </Text>
    </TouchableOpacity>
  )
}

const styles = ScaledSheet.create({
  btn: {
    marginHorizontal: wp('5'),
    marginVertical: wp('2'),
    padding: wp('2'),
    borderRadius: 4,
    backgroundColor: '#69A2B0',
    justifyContent: 'center',
  },
  textStyle: {
    textAlign: 'center',
    fontSize: wp('5'),
    fontFamily: 'Montserrat-Regular',
    color: '#fff',
  },
})

export { ConfirmBtn }