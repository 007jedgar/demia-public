import React from 'react'
import {
  TouchableOpacity,
  View,
  Text,
} from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { ScaledSheet } from 'react-native-size-matters'

function StreamCard({ onPress, text }) {

  return (
    <TouchableOpacity activeOpacity={.5} onPress={onPress}>
      <View style={styles.container}>
        <Text style={styles.textStyle}>
          {text}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = ScaledSheet.create({
  textStyle: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: '20@ms',
    marginLeft: '10@ms',
    color: '#151515'
  },
  container: {
    justifyContent: 'center',
    marginHorizontal: '15@ms',
    marginBottom: '10@ms',
    borderWidth: 1,
    borderColor: 'dimgrey',
    borderRadius: '5@ms',
    // backgroundColor: '#DBE9EE',
    height: hp('8%'),
  },
})

export { StreamCard }