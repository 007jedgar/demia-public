import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {
  ScaledSheet,
  moderateScale,
} from 'react-native-size-matters';
import { 
  widthPercentageToDP as wp, 
  heightPercentageToDP as hp 
} from 'react-native-responsive-screen'
import * as RootNavigation from '../RootNavigation'
import FastImage from 'react-native-fast-image'
import Icons from '@assets/icons'

function SubNavBar({ onPress, onToggleSub, title, isSubbed, }) {


  const {
    leftBtnView, titleStyle,
    container,  top, subIcon } = styles;
  

  return (
    <View>
      <View style={container}>
        <TouchableOpacity style={leftBtnView} onPress={() => {
          if (!onPress) return RootNavigation.goBack()
          return onPress()
        }}>
            <FastImage
              source={Icons.backArrow}
              style={styles.navImage}
            />
          </TouchableOpacity>

        <View style={top}>
          <Text style={titleStyle}>{title}</Text>
        </View>

        <TouchableOpacity style={subIcon} onPress={onToggleSub}>
          <FastImage
            source={isSubbed?Icons.blueSub:Icons.greySub}
            style={styles.sub}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = ScaledSheet.create({
  container: {
    paddingTop: hp('2'),
    height: hp('9%'),
    backgroundColor: '#fff',
    shadowOffset: {width: 3, height: 3},
    shadowColor: '#393939',
    shadowOpacity: .3,
    marginBottom: '4@vs',
    justifyContent: 'center',
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  titleView: {
    alignSelf: 'center',
    marginLeft: '57@s',
  },
  titleStyle: {
    textAlign: 'center',
    fontFamily: 'Montserrat-Regular',
    fontSize: hp('2.5%'),
    color: '#000',
  },
  navImage: {
    width: wp('12'),
    height: wp('12'),
  },
  sub: {
    width: wp('8'),
    height: wp('8'),
  },
  leftBtnView: {
    position: 'absolute',
    top: hp('2.5'),
    left: wp('4'),
    zIndex: 5
  },
  subIcon: {
    position: 'absolute',
    right: wp('4'),
    top: hp('4'),
    zIndex: 5
  },  
})

export { SubNavBar };
