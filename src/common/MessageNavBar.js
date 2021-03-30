import React, {  } from 'react';
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

function MessageNavBar({ onPress, onOptions, title, isSubbed, hideMenu, profilePic }) {
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
          {profilePic?<FastImage 
            source={{uri: profilePic}}
            style={styles.profile}
          />:null}
          <Text style={titleStyle}>{title}</Text>
        </View>

        {hideMenu?null:<TouchableOpacity style={subIcon} onPress={onOptions}>
          <FastImage
            source={Icons.menuDots}
            style={styles.sub}
          />
        </TouchableOpacity>}
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
    fontSize: wp('4.5'),
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
    left: wp('2'),
    zIndex: 5
  },
  subIcon: {
    position: 'absolute',
    right: wp('4'),
    top: hp('3.5'),
    zIndex: 5
  },  
  profile: {
    width: wp('8'),
    height: wp('8'),
    borderRadius: wp('4'),
    marginRight: wp('2'),
    alignSelf: 'center',
  },
})

export { MessageNavBar };
