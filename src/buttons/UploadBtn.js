import React from 'react'
import { 
  TouchableOpacity,
  Text,
} from 'react-native'
import { ScaledSheet } from 'react-native-size-matters'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

function UploadBtn({ onPress, btnStyle, text }) {
  let  { btn, textStyle } = styles
  return (
    <TouchableOpacity style={[btn, btnStyle]} onPress={onPress}>
      <Text style={textStyle}>
        {text}
      </Text>
    </TouchableOpacity>
  )
}

const styles = ScaledSheet.create({
  btn: {
    alignSelf: 'center',
    margin: wp('5'),
    height: wp('25%'),
    width: wp('25%'),
    padding: '5@ms',
    // shadowColor: 'black',
    // shadowOffset: { x: 2, y:2},
    // shadowRadius: '2@ms',
    // shadowOpacity: .6,
    borderRadius: '4@ms',
    borderColor: '#000',
    borderWidth: 1,
    elevation: '1@ms',
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  textStyle: {
    textAlign: 'center',
    fontSize: wp('5%'),
    fontFamily: 'Montserrat-Regular',
    color: '#000',
  },
})

export { UploadBtn }