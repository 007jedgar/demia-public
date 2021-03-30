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

function EmptyThread() {

  return (
    <View style={styles.container}>
      
      <View style={styles.img}/>
      <View >
        <View style={styles.textLineShort}/>
        <View style={styles.p}>
          <Text style={styles.text}>You have no messages yet</Text>
        </View>
      </View>
    </View>
  )
}

const styles = ScaledSheet.create({
  container: {
    margin: wp('1'),
    borderRadius: 4,
    marginHorizontal: wp(4),
    paddingBottom: 1,
    shadowColor: 'black',
    shadowOffset: { x: 2, y:1},
    shadowRadius: 4,
    shadowOpacity: .2,
    borderBottomRightRadius: 4,
    borderBottomLeftRadius: 4,
    elevation: 4,
    backgroundColor: '#fff',
    flexDirection: 'row',
  },
  img: {
    backgroundColor: '#DBE9EE',
    width: wp('15'),
    height: wp('15'),
    borderRadius: wp('7.5'),
    margin: wp('2'),
  },
  textLineShort: {
    width: wp('40'),
    height: wp('3'),
    backgroundColor: '#DBE9EE',
    marginTop: wp('2')
  },
  textLineLong: {
    width: wp('30'),
    height: wp('3'),
    backgroundColor: '#c2c2c2',
    marginTop: wp('2')
  },
  text: {
    fontFamily: 'OpenSans-Regular',
    color: '#454545',
    // flex: 1,
  },  
  p: {
    flex: 1,
    backgroundColor: '#DBE9EE',
    width: wp('60'),
    // height: wp('5'),
    marginVertical: wp('3'),
    padding: wp('2'),
  },
})

export { EmptyThread }