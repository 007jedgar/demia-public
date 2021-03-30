import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native'
import { ScaledSheet, moderateScale } from 'react-native-size-matters'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image'
import Icons from '@assets/icons'

function ExitBar({onPress, groupId, title, category, onLeave, onOptions }) {

  return (
    <View>
      <View style={styles.bar}>
       
       <TouchableOpacity onPress={onLeave} style={styles.exitBtn}>
          <FastImage 
            source={Icons.exit}
            style={{
              width: hp('4'),
              height: hp('4'),
              alignSelf: 'center',
            }}
          />
          <Text style={styles.title}>Exit</Text>
        </TouchableOpacity>

        <View>
          <Text style={styles.meetingIdText}>Classroom Id: {groupId}</Text>
          <Text style={styles.titleText}>{title}</Text>
        </View>

        <TouchableOpacity onPress={onOptions} style={styles.optionsBtn}>
          <FastImage 
            source={Icons.circleMenu}
            style={{
              width: hp('4'),
              height: hp('4'),
              alignSelf: 'center',
            }}
          />
          <Text style={styles.title}>Options</Text>
        </TouchableOpacity>
      </View>

    </View>
  )
}

const styles = ScaledSheet.create({
  bar: {
    height: hp('7.5'),
    backgroundColor: '#fff',
    shadowOffset: {width: 1, height: 1},
    shadowColor: '#393939',
    shadowOpacity: .2,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  exitBtn: {
    flex: 1,
    position: 'absolute',
    left: 10,
    alignSelf: 'center',
    padding: wp('4')
  },
  optionsBtn: {
    flex: 1,
    position: 'absolute',
    right: 10,
    alignSelf: 'center',
    padding: wp('4')
  },
  exitText: {
    color: 'red',
    fontFamily: 'Montserrat-Medium',
    alignSelf: 'flex-end'
  },
  meetingIdText: {
    fontFamily: 'Montserrat-Medium',
  },
  titleText: {
    
    textAlign: 'center',
    fontFamily: 'Montserrat-Regular',
    fontSize: hp('2.5%'),
  },
  title: {
    flex: 1,
    fontFamily: 'OpenSans-Regular',
    textAlign: 'center',
  },  
})

export { ExitBar }