import React, { useEffect } from 'react'
import {
  View,
  Text,
} from 'react-native'
import { 
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
 } from 'react-native-responsive-screen'
import {ScaledSheet } from 'react-native-size-matters'

function MinorAlert({ text, hideAlert }) {
  useEffect(() => {
    setTimeout(() => {
      hideAlert()
    }, 2000)
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
    </View>
  )
}

const styles = ScaledSheet.create({
  container: {
    shadowOffset: {width: 3, height: 3},
    shadowColor: '#393939',
    shadowOpacity: .3,
    alignSelf: 'center',
    position: 'absolute',
    bottom: 20,
    backgroundColor: '#fff',
    padding: wp(2),
    borderRadius: 20
  },
  text: {
    fontFamily: 'OpenSans-Regular',
    fontSize: wp('4'),
    textAlign: 'center',
    margin: wp('2'),
  },
})

export { MinorAlert }