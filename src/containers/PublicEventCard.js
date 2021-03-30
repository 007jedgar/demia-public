import React, {useState, useEffect } from 'react'
import {
  TouchableOpacity,
  View,
  Text,
} from 'react-native'
import { 
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
import { ScaledSheet } from 'react-native-size-matters'
import moment from 'moment'
import Icons from '@assets/icons'
import FastImage from 'react-native-fast-image'
import * as RootNavigation from '../RootNavigation'

function PublicEventCard(props) {
  const [ type, setType ] = useState('')
  const { author, nameOfSender, timeSent, text } = props
  const { nameStyle, messageStyle, timestampStyle, messageCardContainer, messageContainer, messageInfoContainer} = styles 

  useEffect(() => {
    setType('')
  }, []) 

  const parseEventTitle = () => {
    let title = ''

    switch (props.type) {
      case 'document_added':
        title = "document added"
        break;
      case 'asignment_added':
        title = "assignment added"
        break;
      case 'poll_added':
        title = "poll added"
        break;
      default:
        title = "event"
        break;
    }

    return title
  }
  const parseEventIcon = () => {
    let icon = Icons.documentIcon

    switch (props.type) {
      case 'document_added':
        icon = Icons.documentIcon
        break;
      case 'asignment_added':
        icon = Icons.asignmentIcon
        break;
      case 'poll_added':
        icon = Icons.pollIcons
        break;
      case 'event_added':
        icon = Icons.calendar
        break;
      default:
        icon = Icons.documentIcon
        break;
    }

    return icon
  }
  
  const parseScreen = () => {
    let screen;

    switch (props.type) {
      case 'document_added':
        screen = 'documents'
        break;
      case 'asignment_added':
        screen = 'assignments'
        break;
      case 'poll_added':
        screen = 'polls'
        break;
      case 'event_added':
        screen = 'events'
        break;
      default:
        screen = 'comment'
        break;
    }

    return screen
  }

  const handleNav = () => {
    switch (props.type) {
      case 'document_added':
        RootNavigation.navigate('stream')
        return RootNavigation.navigate('sharedDocs')
      case 'asignment_added':
        RootNavigation.navigate('stream')
        return RootNavigation.navigate('assignments')
      case 'poll_added':
        RootNavigation.navigate('stream')
        return RootNavigation.navigate('polls')
      case 'event_added':
        RootNavigation.navigate('stream')
        return RootNavigation.navigate('events')
      default:
        return ;
    }
  }
  
  const renderTimestamp = (item) => {
    const { date, isFirst, isNew, isToday, } = item
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
  return (
    <View style={{ marginVertical: wp(1)}}>
      <TouchableOpacity onLongPress={() => {}} activeOpacity={1}>
        <View>
          {renderTimestamp(props)}
          <View style={[messageCardContainer]}>

            <FastImage 
              source={parseEventIcon()}
              style={styles.msgImg}
            />
            
            <View style={messageContainer}>

                <View style={messageInfoContainer}>
                  <Text style={nameStyle}>New {parseEventTitle()}</Text>
                  <Text style={timestampStyle}>{moment.unix(props.date._seconds).format('h:mm a')}</Text>
                </View>

                <Text style={messageStyle}>{text}: {props.item.title}</Text>

            </View>
          </View>

          <TouchableOpacity onPress={handleNav} style={styles.goToBtn}>
            <Text style={styles.goToText}>Go to {parseScreen()}</Text>
          </TouchableOpacity>
        </View>

      </TouchableOpacity>      
    </View>
  )
}


const styles = ScaledSheet.create({
  msgImg: {
    width: wp('10'),
    height: wp('10'),
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
  goToBtn: {
    borderWidth: 1,
    borderColor: 'dimgrey',
    borderRadius: 3,
    marginHorizontal: wp('5'),
    padding: wp('2'),
    flex: 1,
  },
  goToText: {
    flex: 1,
    fontSize: wp('4.4'),
    fontFamily: 'OpenSans-Regular',
    marginRight: '20@ms',
    textAlign: 'center',
  },
  messageContainer: {
    flex: 1,
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
    marginVertical: wp('2'),
  },
  dateText: {
    fontSize: '18@ms',
    color: 'dimgrey',
    textAlign: 'center',
    marginHorizontal: wp('3')
  },
})


export { PublicEventCard }