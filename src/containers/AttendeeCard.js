import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native'
import { ScaledSheet, moderateScale } from 'react-native-size-matters'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import profile from '../../assets/icons/profile.png'
import FastImage from 'react-native-fast-image'
import Icons from '@assets/icons'
import * as RootNavigation from '../RootNavigation';
import auth from '@react-native-firebase/auth'

function AttendeeCard({ onPress, profileImg, item, showUserOptions }) {
  return (
    <TouchableOpacity 
      activeOpacity={.7} 
      style={styles.attenderCard}
      onPress={onPress}
    >
      <View style={{flexDirection: 'row'}}>
        <FastImage 
          style={styles.imgStyle}
          source={profile}
        />
        <Text style={styles.nameText}>{item.displayName}</Text>
        {/* {item.present?<View style={styles.green}/>:null} */}
      </View>
      
      <View style={{flexDirection: 'row'}}>
        {item.id !== auth().currentUser.uid?<TouchableOpacity onPress={() => {
          RootNavigation.navigate('feedThread', {
            subject: 'current_attendance', 
            subjectDoc: item,
          })
        }} style={styles.messageBtn}>
          <FastImage 
            style={styles.messagesIcon}
            source={Icons.messages}
          />
        </TouchableOpacity>:null}

        {item.id!==auth().currentUser.uid?<TouchableOpacity onPress={showUserOptions} style={styles.messageBtn}>
          <FastImage 
            style={styles.messagesIcon}
            source={Icons.menuDots}
          />        
        </TouchableOpacity>:null}
      </View>

    </TouchableOpacity>
  )
}

const styles = ScaledSheet.create({
  attenderCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: '#4F6D7A',
    borderBottomWidth: '1@ms',
    marginHorizontal: wp('2'),
    paddingHorizontal: wp('2'),
    paddingVertical: hp('1'),
  },
  nameText: {
    fontSize: wp('5'),
    fontFamily: 'Montserrat-Regular',
    alignSelf: 'center',
    marginLeft: wp('5%')
  },
  imgStyle: {
    width: wp('9'),
    height: wp('9'),
    alignSelf: 'center',
  },  
  messagesIcon: {
    width: wp('9'),
    height: wp('9'),
    alignSelf: 'flex-end',
  },
  messageBtn: {
    alignSelf: 'flex-end',
  },
  green: {
    backgroundColor: '#81B29A',
    borderRadius: wp('2'),
    height: wp('4'),
    width: wp('4'),
    alignSelf: 'center',
    marginLeft: wp('4'),
  },
})

export { AttendeeCard }