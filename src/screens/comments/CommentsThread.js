import React, {useState, useEffect, useRef } from 'react'
import {
  Block
} from '../../common'
import {
  ChatInterface, PublicEventCard
} from '../../containers'
import {
  ExitBar,
} from '../../buttons'
import {
  messageGroup, 
  deleteGroupMessage,
  leaveMeeting,
} from '../../actions'
import { ScaledSheet, moderateScale } from 'react-native-size-matters'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { connect } from 'react-redux'
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import { uniqueId, forEach, includes, map } from 'lodash' 
import moment from 'moment'


function CommentsThread(props) {
  const [ comments, setComments ] = useState([])
  const [ text, setText ] = useState('')
  const [ showPostOptionsModal, togglePostOptionsModal ] = useState(false)
  const [ comment, setComment ] = useState({})
  const [ currentIndex, setCurrentIndex ] = useState(0)
  const [ isLoading, toggleLoading ] = useState(false)
  const messagesList = useRef(null)

  useEffect(() => {
    toggleLoading(true)

    firestore().collection('meetings').doc(props.meeting.id)
    .collection('public_comments')
    .limit(30)
    .onSnapshot((querySnap) => {
      if (querySnap.empty) {
        console.log('empty')
        toggleLoading(false)
        return setComments([])
      }

      let comments = []
      let sortedMsgs = []
      let days = []
      querySnap.forEach((doc) => {
        let msg = { ...doc.data(), id: doc.id }
        let tstmp = msg.date._seconds
        let today = moment().format('MMM Do')
        let time = moment(tstmp).format('MMM Do')
    
        if (today === time) {
          msg.isToday = true
          msg.isNew = includes(days, time)? false:true
        } else if (includes(days, time)) {
          msg.isNew = false
        } else {
          msg.isNew = true
        }

        days.push(time)
        sortedMsgs.push(msg)

        comments.push(sortedMsgs.sort((a, b) => b.date._seconds - a.date._seconds))
      })

      setComments(sortedMsgs)
      toggleLoading(false)
    }, (err) => {
      console.log(err)
      toggleLoading(false)
      setComments([])
    })
  }, [])

  const createMsg = () => {
    let id = uniqueId()
  
    return {
      id: id,
      text: text,
      timeSent: moment().format(),
      nameOfSender: this.props.meetingProfile.displayName,
      senderId: this.props.meetingProfile.id,
      date: firestore.Timestamp.now()
    }
  }

  
  return (
    <Block> 
      <ExitBar 
        onLeave={() => props.leaveMeeting(props.meeting.docRef, props.profile)} 
        groupId={props.meeting.groupId} 
        title="Discussion"
      />

    <View style={{flex: 1, justifyContent: 'space-between'}}>
      <View style={{flex: 1}}>
        <FlatList
          ref={messagesList}
          data={comments}
          renderItem={({item, index}) => {
            if (item.type) return <PublicEventCard {...item}/>
            else return <MessageCard 
              message={item}
              index={index}
              onLongPress={props.onLongPress}
            /> 
          }}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={<EmptyMessage />}
        />
      </View>

      <KeyboardAvoidingView keyboardVerticalOffset={verticalScale(100)} behavior="padding">
        <ChatInput 
          text={props.text} 
          onSendMsg={() => props.sendSMS()} 
          onType={(t) => props.typing(t)}
        />
      </KeyboardAvoidingView>
    </View>

    </Block>
  )
}

const mapStateToProps = state => {
  const { meeting, meetingProfile } = state.meeting
  const { profile } = state.auth

  return {
    meeting,
    meetingProfile,
    profile
  }
}

const dispatchToState = {
  messageGroup, deleteGroupMessage, leaveMeeting,
}

export default
  connect(mapStateToProps, dispatchToState)
(CommentsThread)