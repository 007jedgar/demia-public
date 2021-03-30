import React from 'react'
import { 
  TouchableOpacity,
  Text,
} from 'react-native'
import { ScaledSheet } from 'react-native-size-matters'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image'

function FilledConfirmBtn({ rightIcon, onPress, btnStyle, text, disabled }) {
  let  { btn, textStyle } = styles
  return (
    <TouchableOpacity disabled={disabled} style={[btn, btnStyle]} onPress={onPress}>
      <Text style={textStyle}>
        {text}
      </Text>
      {rightIcon?<FastImage 
        source={rightIcon}
        style={{
          width: wp('8'), 
          height: wp('8'), 
          alignSelf: 'center',
          marginLeft: wp('10')
        }}
      />:null}
    </TouchableOpacity>
  )
}

const styles = ScaledSheet.create({
  btn: {
    marginHorizontal: wp('6'),
    shadowColor: 'black',
    shadowOffset: { x: 1, y:1},
    shadowRadius: '6@ms',
    shadowOpacity: .3,
    borderRadius: 4,
    elevation: '1@ms',
    backgroundColor: '#69A2B0',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  textStyle: {
    textAlign: 'center',
    fontSize: wp('5.5'),
    fontFamily: 'Montserrat-Medium',
    color: '#fff',
    margin: wp('2.5')
  },
})

export { FilledConfirmBtn }