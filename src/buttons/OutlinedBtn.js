import React from 'react'
import { 
  TouchableOpacity,
  Text,
  View,
} from 'react-native'
import { ScaledSheet } from 'react-native-size-matters'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image'
import Spinny from 'react-native-spinkit'

function OutlinedBtn({ rightIcon, onPress, btnStyle, text, disabled, isLoading }) {
  let  { btn, textStyle } = styles
  if (isLoading) {
    return (
      <View style={{alignSelf: 'center',  marginTop: hp('6')}}>
        <Spinny color="#000" size={wp(10)} type="Arc"/>
      </View>
    )
  }

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
    borderColor: '#000',
    borderRadius: 4,
    borderWidth: 1,
    marginTop: hp('6'),
    marginHorizontal: wp('11'),
  },
  textStyle: {
    fontFamily: 'Montserrat-Regular',
    fontSize: wp('5'),
    textAlign: 'center',
    margin: wp('2')
  },
})

export { OutlinedBtn }