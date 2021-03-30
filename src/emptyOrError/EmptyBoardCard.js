import React from 'react'
import {  
  View,
  Text,
} from 'react-native'
import {
  widthPercentageToDP as wp ,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen'
import { ScaledSheet } from 'react-native-size-matters'

function EmptyBoardCard() {

  return (
    <View style={styles.container}>
      
      <View style={styles.img}/>
      <View style={styles.textLineShort}/>
      <View style={styles.textLineLong}/>
      <Text style={styles.text}>When you join or create a group, they will appear here</Text>
    </View>
  )
}

const styles = ScaledSheet.create({
  container: {
    margin: '15@ms',
    marginHorizontal: '25@ms',
    height: hp('30%'),
    paddingBottom: '1@ms',
    shadowColor: 'black',
    shadowOffset: { x: 2, y:1},
    shadowRadius: '6@ms',
    shadowOpacity: .6,
    borderBottomRightRadius: '6@ms',
    borderBottomLeftRadius: '6@ms',
    elevation: '1@ms',
    backgroundColor: '#fff',
  },
  text: {
    position: 'absolute',
    fontSize: wp('6%'),
    color: '#4F6D7A',
    fontFamily: 'OpenSans-SemiBold',
    margin: wp('3%'),
    alignSelf: 'center',
  },
  img: {
    backgroundColor: '#DBE9EE',
    width: '100%',
    height: '55%',
  },
  textLineShort: {
    backgroundColor: '#DBE9EE',
    width: '40%',
    height: '13%',
    marginVertical: '15@ms', 
    marginLeft: '15@ms', 
  },
  textLineLong: {
    backgroundColor: '#DBE9EE',
    width: '70%',
    height: '10%',
    marginLeft: '15@ms', 
  },
})

export { EmptyBoardCard }