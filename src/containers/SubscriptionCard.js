import React from 'react'
import {
  Text,
  View,
  StyleSheet
} from 'react-native'

import FastImage from 'react-native-fast-image'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
import Icons from '@assets/icons'
import moment from 'moment'

function SubscriptionCard({ item, }) {
  const parseIcon = () => {
    switch (item.type) {
      case 'polls': 
        return Icons.pollIcons
      case 'poll_expired': 
        return Icons.pollIcons
      case 'poll_added': 
        return Icons.pollIcons
      case 'assignment_added': 
        return Icons.asignmentIcon
      case 'assignment': 
        return Icons.asignmentIcon
      case 'assignments': 
        return Icons.asignmentIcon
      case 'newMessage': 
        return Icons.poll
      case 'event_added': 
        return Icons.calendar
      case 'events': 
        return Icons.calendar
      case 'request':
        return Icons.teacher
      case 'request_response':
        return Icons.teacher
      default:
        return Icons.documentIcon
    }
  }

  const parseEvent = (type) => {
    switch (item.type) {
      case 'document_added':
        return `${item.item.author.displayName} added a new document`
      case 'assignment_added':
        return `${item.item.author.displayName} added a new assignmnet: ${item.item.title}`
      case 'assignments':
        return `You subscribed to assignments in ${item.meeting.title}`
      case 'assignment_imminent':
        return `The assignment ${item.item.title} is due soon`
      case 'poll_added':
        return `${item.item.author.displayName} added a new poll: "${item.item.title}"`
      case 'poll_expired':
        return `A poll has expired`
      case 'polls':
        return `You subscribed to polls in ${item.meeting.title}`
      case 'documents':
        return `You subscribed to documents in ${item.meeting.title}`
      case 'newMessage':
        return `You recieved a message from ${item.item.author.displayName}`
      case 'events':
        return `You subscribed to events in ${item.meeting.title}`
      case 'event_added':
        return `An event: "${item.item.title}" was added by ${item.item.author.displayName}`
      case 'event_imminent':
        return `The event ${item.item.title} is starting soon`
      case 'request':
        return item.text
      case 'request_response':
        return item.text
      default:
        return 'comment'
    }
  }

  const parseSubTitle = () => {

  }

  return (
    <View style={styles.card}>
      
      <View style={styles.imgContainer}>
        <FastImage 
          source={parseIcon()}
          style={styles.subIcon}
        />
      </View>

      <View style={styles.details}>
        <Text style={styles.groupName}>{item.meeting.title}</Text>

        <Text style={styles.info}>{parseEvent()}</Text>

        <View style={styles.comment}>
          <Text style={styles.eventDetail}>{moment.unix(item.date._seconds).format('LLL')}</Text>
        </View>

      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    shadowColor: '#81B29A',
    shadowOffset: { x: 1, y:2},
    shadowRadius: 3,
    shadowOpacity: .6,
    elevation: 1,

    flexDirection: 'row',
    marginHorizontal: wp('3'),
    marginVertical: hp('1'),
    backgroundColor: '#fff',
    borderRadius: 4,
    padding: wp('2'),
  },
  subIcon: {
    width: wp('10'),
    height: wp('10'),
  },
  imgContainer: {
    alignSelf: 'center',
    marginHorizontal: wp('2'),
  },
  groupName: {
    fontFamily: 'Montserrat-BoldItalic',
    fontSize: wp('4'),
    color: 'dimgrey',
  },
  details: {
    marginHorizontal: wp('2'),
    flex: 1,
  },
  comment: {
    borderLeftColor: 'dimgrey',
    borderLeftWidth: 2,
    paddingLeft: wp('2.4'),
    justifyContent: 'center',
  },
  info: {
    fontFamily: 'OpenSans-Regular',
    fontSize: wp('3.7'),
    marginVertical: hp('.6'),
  },  
  eventDetail: {
    fontFamily: 'OpenSans-Regular',
    fontSize: wp('3.6')
  },
})

export {SubscriptionCard}