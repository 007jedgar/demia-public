import React, { Component } from 'react';
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  Linking
} from 'react-native';
import {
  ScaledSheet,  verticalScale
} from 'react-native-size-matters';
import { PublicEventCard } from './PublicEventCard'

import {
  EmptyMessage
} from '../emptyOrError'

import moment from 'moment'
import {
  KeyboardAwareScrollView,
} from 'react-native-keyboard-aware-scroll-view';
import auth from '@react-native-firebase/auth';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image'
import Autolink from 'react-native-autolink';
import Communications from 'react-native-communications';


function MessageCard({ message, onLongPress, viewImage, blockedUserIds }) {

  const renderTimestamp = () => {
    const { timeSent, date, isFirst, isNew, isToday, } = message

    let formatteDate = moment.unix(date._seconds).format('MMMM Do')
    
    if (isFirst && isToday) {
      return (
        <View style={styles.date}>
          <Text style={styles.dateText}>Today</Text>
        </View>
      )
    } else if (isFirst) {
      return (
        <View style={styles.date}>
          <Text style={styles.dateText}>{formatteDate}</Text>
        </View>
      )
    } else {
      return (
        <View />
      )
    }
  }

  const { text, isEdited, from, timeSent, nameOfSender, type } = message
  const { messageCardContainer, messageInfoContainer, nameStyle, timestampStyle, messageStyle } = styles
  
  if (!text) {
    return null
  }

  if (type) {
    return (
      <PublicEventCard {...message}/>
    )
  }

  if (blockedUserIds.includes(message.author.id)) {
    return null
  }

  return (
    <TouchableOpacity onLongPress={() => onLongPress(message)} activeOpacity={.7}>
      <View>
        {renderTimestamp(message)}
        
        <View style={[messageCardContainer]}>
          
          <View style={styles.messageContainer}>

              <View style={messageInfoContainer}>
                <Text style={nameStyle}>{nameOfSender}</Text>
                <Text style={timestampStyle}>{moment.unix(message.date._seconds).format('h:mm a')}</Text>
              </View>

              {message.attachment?<TouchableOpacity style={{marginTop: wp(1)}} activeOpacity={.8} onPress={() => viewImage(message.attachment)}>
                <FastImage 
                  source={{uri: message.attachment}}
                  style={{
                    width: wp('90'),
                    height: wp('50'),
                    borderRadius: 4,
                  }}
                />
              </TouchableOpacity>:null}

              <Autolink 
                style={styles.messageStyle} 
                text={text} 
                onPress={(url, match) => {
                  switch (match.getType()) {
                    case 'url':
                      return Linking.openURL(url)
                    case 'phone':
                      return Communications.text(url.split('tel:')[1])
                    case 'email':
                      return Communications.email([url, ''],null,null,'','')
                    default:
                      console.log(match.getType())
                  }
                }}
              />


          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = ScaledSheet.create({
  msgImg: {
    width: '50@ms',
    height: '50@ms',
  },
  profileImg: {
    width: '35@ms',
    height: '35@ms',
    alignSelf: 'center',
  },
  messageCardContainer: {
    padding: '4@ms',
    paddingLeft: '6@ms',
    marginLeft: '5@ms',
    marginRight: '5@ms',
    marginTop: '2@ms',
    flexDirection: 'row',
  },
  messageContainer: {
    paddingLeft: '10@ms',
    paddingRight: '3@ms',
  },
  messageInfoContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  timestampStyle: {
    color: 'dimgrey',
    fontSize: '17@ms',
  },
  nameStyle: {
    fontSize: wp('4'),
    marginRight: wp('4'),
    fontFamily: 'Montserrat-BoldItalic',
  },
  messageStyle: {
    flex: 1,
    fontSize: wp('4.4'),
    fontFamily: 'OpenSans-Regular',
    marginRight: '20@ms',
  },
  date: {
    flex: 1,
    marginVertical: hp('1')
  },
  dateText: {
    fontSize: '18@ms',
    color: 'dimgrey',
    textAlign: 'center',
    marginHorizontal: wp('3')
  },
  input: {
    color: '#000',
    fontSize: wp('5'),
    margin: wp(1),
  },  
  inputContainer: {
    borderRadius: 3,
    borderWidth: 1,
    borderColor: 'dimgrey',
    maxHeight: hp('9'),
    width: wp('75')
  },
})

export { MessageCard }