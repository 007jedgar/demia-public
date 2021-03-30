import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  KeyboardAvoidingView,
  FlatList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import {
  Block,
} from '../../common'
import {
  ChatInput,
  MessageCard
} from '../../containers'
import {
  ExitBar,
} from '../../buttons'
import {
  EmptyMessage
} from '../../emptyOrError'
import {
  messageGroup, 
  deleteGroupMessage,
  leaveMeeting,
} from '../../actions'
import {
  CommentOptionsModal,
  MeetingOptionsModal,
  DisplayNameModal,
  ImageViewerModal,
} from '../../modals'
import { ScaledSheet, moderateScale, verticalScale } from 'react-native-size-matters'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { connect } from 'react-redux'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import { uniqueId, forEach, includes, map } from 'lodash' 
import moment from 'moment'
import Spinny from 'react-native-spinkit'
import Clipboard from "@react-native-community/clipboard";
import { GiftedChat } from 'react-native-gifted-chat'



function MeetingComments(props) {
  const [ text, setText] = useState('')
  const [ comments, setComments] = useState([])
  const [ blockedUserIds, setBlockedUserIds] = useState([])
  const [ showPostOptionsModal, togglePostModal] = useState(false)
  const [ comment, setComment] = useState({})
  const [ currentIndex, setCurrentIndex] = useState(0)
  const [ isEditing, toggleEditing] = useState(false)
  const [ isLoading, toggleLoading] = useState(false)
  const [ showOptionsModal, toggleOptionsModal ] = useState(false)
  const [ showNameModal, toggleNameModal ] = useState(false)
  const [ showSuccess, toggleSuccess ] = useState(false)
  const [ showImageModal, toggleImageModal ] = useState(false)
  const [ imgUrl, setImageUrl ] = useState('')
  const [ loadedPosts, setLoadedPost ] = useState(30)
  const [ showFooter, toggleShowFooter ] = useState(true)
  const messagesList = useRef(null)

  useEffect(() => {
    toggleLoading(true)
    const user = auth().currentUser
    
    let query = firestore()
    .collection('meetings').doc(props.meeting.id)
    .collection('public_comments')
    .orderBy('date', 'desc')
    .limit(20)
    // .endAt(firestore.Timestamp.now())

    let unsubscribe = query.onSnapshot((querySnap) => {
      if (querySnap.empty) {
        toggleLoading(false)
        return setComments([])
      }

      sortMessages(querySnap)
      setLoadedPost(30)
      // toggleShowFooter(true)

    }, () => {
      toggleLoading(false)
      setComments([])
    })



    let unsub = firestore()
    .collection('meetings').doc(props.meeting.id)
    .collection('current_attendance').doc(user.uid)
    .onSnapshot((doc) => {
      let { blockedUserIds } = doc.data()
      if (!blockedUserIds) return setBlockedUserIds([])
      setBlockedUserIds(blockedUserIds)
    })
    // setTimeout(() => {
    //   loadMoreMessages()
    // }, 100)
    return () => {
      unsubscribe()
      unsub()
    }
  }, []) 

  const sortMessages = (querySnap) => {
    // label messages with isToday and 
    // is first/last in day
    //.isToday, .isFirst
    let messages = []
    querySnap.forEach((doc) => {
      messages.push({ ...doc.data(), id: doc.id, ref: doc.ref })
    })

    let reversed = messages.reverse()

    let days = []
    let newMessages = []
    reversed.forEach((msg) => {
      let currentDay = moment().format('MMMM Do YYYY')
      let msgDay = moment.unix(msg.date._seconds).format('MMMM Do YYYY')
      
      msg.timeSent = msg.date.toDate()
      
      if (!days.includes(msgDay)) {
        msg.isFirst = true
      }
      if (msgDay === currentDay) {
        msg.isToday = true
      }

      newMessages.push(msg)
      days.push(msgDay)
    })

    if (newMessages.length < 20) toggleShowFooter(false)
    else toggleShowFooter(true)
    setComments(newMessages.reverse())
    toggleLoading(false)
  }

  const loadMoreMessages = () => {
    let l = comments.length
    
    let latestComment = comments[l-1]
    firestore().collection('meetings').doc(props.meeting.id)
    .collection('public_comments')
    .orderBy('date', 'desc')
    .limit(loadedPosts)
    .startAfter(latestComment.ref)
    .get().then((querySnap) => {
      sortMessages(querySnap)
      console.log(querySnap)
      if (querySnap.size < loadedPosts) {
        toggleShowFooter(!showFooter)
      }

      setLoadedPost(loadedPosts+10)
    })
  }

  const changeDisplayName = (displayName) => {
    if (!displayName) return;
    firestore().collection('meetings').doc(props.meeting.id)
    .collection('current_attendance').doc(props.meetingProfile.id)
    .update({
      displayName
    }).then(() => {
      toggleSuccess(true)

      setTimeout(() => {
        toggleSuccess(false)
      }, 1500)
    }).catch((err) => {
      console.log(err)
    })
  }

  const createMsg = (picUrl) => {
    let id = uniqueId()
  
    return {
      author: props.meetingProfile,
      id: id,
      text: text,
      timeSent: moment().format(),
      nameOfSender: props.meetingProfile.displayName,
      senderId: props.meetingProfile.id,
      date: firestore.Timestamp.now(),
      attachment: picUrl,
    }
  }

  const renderFooter = () => {
    if (showFooter && comments.length) {
      return (
        <TouchableOpacity onPress={loadMoreMessages} style={styles.footerBtn}>
          <Text style={styles.footerBtnText}>Load more</Text>
        </TouchableOpacity>
      )
    }
  }

  return (
    <Block> 
      <ExitBar 
        onOptions={() => {
          toggleOptionsModal(!showOptionsModal)
        }}
        onLeave={() => {
          props.leaveMeeting(props.meeting.docRef, props.profile)
        }}   
        groupId={props.meeting.groupId} 
        title="Discussion"
      />
      
      <View style={{flex: 1, justifyContent: 'space-between'}}>
        <View style={{flex: 1}}>
          <FlatList
            inverted={comments.length?true:false}
            // ItemSeparatorComponent={({leadingItem, highlighted}) => {
            //   console.log(leadingItem)
            //   return <Text>Hello</Text>
            // }}
            ListFooterComponent={renderFooter()}
            ref={messagesList}
            showsVerticalScrollIndicator={false}
            extraData={comments}
            data={comments}
            renderItem={({item, index}) => (
              <MessageCard 
                item={item}
                index={index} 
                message={item}
                blockedUserIds={blockedUserIds}
                onLongPress={() => {
                  setComment(item)

                  setTimeout(() => {
                    togglePostModal(!showPostOptionsModal)
                  }, 30)                
                }}
                viewImage={(url) => {
                  setImageUrl(url)
                  setTimeout(() => {
                    toggleImageModal(!showImageModal)
                  }, 100)
                }}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={<EmptyMessage />}
          />
        </View>

        <KeyboardAvoidingView keyboardVerticalOffset={verticalScale(100)} behavior="padding">
          <ChatInput 
            meeting={props.meeting}
            text={text} 
            onSendMsg={(picUrl) => {
              if (!text) return
              let meetingId = props.meeting.id
    
              props.messageGroup(meetingId, createMsg(picUrl))
              setText('')
            }} 
            onType={setText}
          />
        </KeyboardAvoidingView>
      </View>

      {comment.id?<CommentOptionsModal 
        visible={showPostOptionsModal}
        onToggleModal={() => togglePostModal(!showPostOptionsModal)}
        comment={comment}
        currentIndex={currentIndex}
        onDeletePost={() => props.deleteGroupMessage(props.meeting.docRef, comment)}
        onReportPost={() => props.navigation.navigate('report', {item:comment})}
        onEditPost={() => toggleEditing(!isEditing)}
        onEditsPost={() => {}}
        onCopyText={() => {
          Clipboard.setString(comment.text)
          togglePostModal(!showPostOptionsModal)
        }}
        isEditting={isEditing}
        meeting={props.meeting}
      />:null}

        <MeetingOptionsModal 
          closeModal={() => toggleOptionsModal(!showOptionsModal)}
          visible={showOptionsModal}
          onLeave={() => {
            toggleOptionsModal(!showOptionsModal)
            props.leaveMeeting(props.meeting.docRef, props.profile)
          }}
          onSettings={() => {
            toggleOptionsModal(!showOptionsModal)
            props.navigation.navigate('meetingSettings')
          }} 
          onBlockedUsers={() => {
            toggleOptionsModal(!showOptionsModal)
            props.navigation.navigate('blockedUsers')
          }}          
          onChangeName={() => {
            toggleOptionsModal(!showOptionsModal)
            toggleNameModal(!showNameModal)
          }}
          profile={props.meetingProfile}
        />

        <DisplayNameModal 
          closeModal={() => toggleNameModal(!showNameModal)}
          visible={showNameModal}
          onCancel={() => {
            toggleNameModal(!showNameModal)
          }}
          onAccept={(displayName) => {
            changeDisplayName(displayName)
            toggleNameModal(!showNameModal)
          }}
        />

        <ImageViewerModal 
          visible={showImageModal}
          images={[{url: imgUrl, props: {}}]}
          onCancel={() => toggleImageModal(!showImageModal)}
        />
    </Block>
  )
}

const styles = StyleSheet.create({
  footerBtn: {
    borderRadius: 8,
    borderColor: 'dimgrey',
    borderWidth: 1,
    backgroundColor: '#fff',
    alignSelf: 'center',
    margin: wp(1)
  },
  footerBtnText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: wp('4'),
    margin: wp(1),
    textAlign: 'center',
  },
})

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

export default connect(mapStateToProps, dispatchToState)
(MeetingComments)


// const sortMessages = (querySnap) => {
//   let messages = []
//   let days = []

//   querySnap.forEach((doc) => {
//     let msg = { ...doc.data(), id: doc.id }
//     let tstmp = msg.date._seconds
//     let today = moment().format('MMM Do')
//     let time = moment.unix(tstmp).format('MMM Do')
    
//     if (today === time) {
//       // console.log(msg)
//       msg.isToday = true
//       msg.isNew = includes(days, time)? false:true
//     } else if (includes(days, time)) {
//       msg.isNew = false
//     } else {
//       msg.isNew = true
//     }

//     days.push(time)
//     messages.push(msg)
//   })
  
//   let sortedMsgs = messages.sort((a, b) => b.date._seconds - a.date._seconds)
//   setComments(sortedMsgs)
//   toggleLoading(false)

// }

    // firestore()
    // .collection('meetings').doc(props.meeting.id)
    // .collection('public_comments').orderBy('date')
    // .onSnapshot((querySnap) => {
    //   querySnap.docChanges().forEach((change) => {
    //     console.log('change made')
    //     if (change.type === "added") {

    //     }
    //   })
    // })