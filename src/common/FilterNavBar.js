import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {
  ScaledSheet,
} from 'react-native-size-matters';
import { 
  widthPercentageToDP as wp, 
  heightPercentageToDP as hp 
} from 'react-native-responsive-screen'
import * as RootNavigation from '../RootNavigation'
import FastImage from 'react-native-fast-image'
import Icons from '@assets/icons'

function FilterNavBar({ onPress, title, toMessages, unread, searchWith }) {


  const { titleStyle, container,  top, subIcon,  } = styles;
  

  return (
    <View>
      <View style={container}>
        <TouchableOpacity onPress={toMessages} style={styles.messages}>
          <FastImage 
            source={Icons.greyMessages}
            style={{    
              width: wp('9'),
              height: wp('9'),
          }}
          />
          {unread?<View style={styles.notification}>
            <Text style={styles.notificationText}>{unread}</Text>
          </View>:null}
        </TouchableOpacity>
  
        <View style={top}>
          <Text style={titleStyle}>{title}</Text>
        </View>

        <TouchableOpacity style={subIcon} onPress={onPress}>
          <FastImage
            source={Icons.blueFilter}
            style={styles.sub}
          />
        </TouchableOpacity>

      </View>
    </View>
  )
}

const styles = ScaledSheet.create({
  container: {
    paddingTop: hp('.5'),
    height: hp('9%'),
    backgroundColor: '#fff',
    marginBottom: '4@vs',
    justifyContent: 'center',
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  titleStyle: {
    fontSize: wp('6'),
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
    color: 'dimgrey',
  },
  sub: {
    width: wp('8'),
    height: wp('8'),
  },
  subIcon: {
    position: 'absolute',
    right: wp('4'),
    top: hp('3'),
    zIndex: 5,
    backgroundColor: '#fff',
    borderRadius: 4,
    shadowOffset: {width: .5, height: 0},
    shadowOpacity: .3,
    shadowColor: '#4F6D7A',
    shadowRadius: 4,
  },  
  messages: {
    position: 'absolute',
    left: wp('4'),
    top: hp('3'),
    zIndex: 5,
  },
  notification: {
    position: 'absolute',
    right: -wp(2),
    bottom: -wp(1),
    width: wp('4'),
    height: wp('4'),
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#4F6D7A',
    borderRadius: wp('2'),
    justifyContent: 'center',
  }, 
  notificationText: {
    textAlign: 'center',
    fontFamily: 'Montserrat-Regular',
    color: '#4F6D7A',
  },
})

export { FilterNavBar }
