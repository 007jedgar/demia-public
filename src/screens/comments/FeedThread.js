import React, { useEffect, useState, useRef } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  FlatList
} from 'react-native'
import { ScaledSheet } from 'react-native-size-matters'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import {  ReplyCard } from '../../containers'
import twitter from 'twitter-text'
import { MessageNavBar } from '../../common'
import {
  MessageOptionsModal,
  CommentOptionsModal
} from '../../modals'
import Icons from '@assets/icons'
import Clipboard from "@react-native-community/clipboard";

import {  connect } from 'react-redux'
import { 
  createPoll, deltePoll, getPolls, votePoll, directMessage
} from '../../actions'
import moment from 'moment'
import * as RootNavigation from '../../RootNavigation'

const parseTitle = (subject, subjectDoc) => {  
  switch(subject) {
    case 'polls_thread':
      return 'Poll Discussion';
    case 'assignments_thread':
      return 'Assignment Discussion';
    case 'current_attendance':
      return subjectDoc.displayName?subjectDoc.displayName:'Direct Messages';
    case 'documents_thread':
      return 'Document Discussion';
    default:
      return ''
  }
}

function FeedThread(props) {
  const [ isfocused, toggleIsFocused ] = useState(false)
  const [ showMentions, toggleShowMentions ] = useState(false)
  const [ inputFocused, toggleInputFocused ] = useState(false)
  const [ cursor, toggleCursor ] = useState(false)
  
  const [ text, setText ] = useState('')
  const [ commentTyped, setCommentTyped ] = useState('')
  const [ placeholder, setPlaceholder ] = useState('Type a message')
  
  const [ comment, setComment ] = useState({})
  const [ addedComments, setAddedComments ] = useState([])
  const [ mentions, setMentions ] = useState([])
  const [ messages, setMessages ] = useState([])
  const [ ats, setAts ] = useState([])

  const [ showOptionsModal, toggleOptionsModal ] = useState(false)
  const [ showCommentsModal, toggleCommentsModal ] = useState(false)
  
  const [ replyToReply, setReplyToReply ] = useState({})
  const [ replyToComment, setReplyToComment ] = useState({})
  const [ currentUser, setUser ] = useState({})

  const replyInput = useRef(null)
  const commentsList = useRef(null)

  useEffect(() => { 
    const { subject, subjectDoc } = props.route.params
    const { meeting } = props
    console.log(subjectDoc)
    let unsubscribe;
    const user = auth().currentUser

    if (subject == 'current_attendance') {
      

      unsubscribe = firestore().collection('meetings').doc(meeting.id)
      .collection(subject).doc(subjectDoc.id)
      .collection('direct_messages').doc(user.uid)
      .collection('messages')
      .orderBy('date')
      .onSnapshot((querySnap) => {
        if (querySnap.empty) {
          return setMessages([])
        }
        
        let messages = []
        querySnap.forEach((doc) => {
          messages.push({ ...doc.data(), id: doc.id })
        })
        setMessages(messages)
      }, (err) => console.log(err)) 
    } else {
      unsubscribe = firestore().collection('meetings').doc(meeting.id)
      .collection(subject).orderBy('date').onSnapshot((querySnap) => {
        if (querySnap.empy) {
          return setMessages([])
        }
  
        let messages = []
        querySnap.forEach((doc) => {
          messages.push({ ...doc.data(), id: doc.id })
        })

        setMessages(messages)
      }, (err) => console.log(err))
    }

    let unsub = firestore()
    .collection('users').doc(user.uid)
    .onSnapshot((doc) => {
      setUser({ ...doc.data(), id: doc.id })
    }, (err) => console.log(err))

    return () => {
      unsubscribe()
      unsub()
    }
  }, [])


  const addComment = () => {
    const { meeting, meetingProfile } = props
    const { subject, subjectDoc } = props.route.params

    let newComment = {
      text: commentTyped.trim(),
      author: meetingProfile,
      meeting: meeting,
      timeSent: moment().format(),
      replyToReply: replyToReply,
      replyToComment: replyToComment,
      subjectDoc: subjectDoc,
      subject: subject,
      replies: 0,
      likes: 0,
      unixTimeStamp: moment().unix(),
      mentions: [],
      date: firestore.Timestamp.now(),
    }

    //handle direct messages
    if (subject === 'current_attendance') {
      props.directMessage(meeting, subjectDoc, newComment)
      return setCommentTyped('')
    }

    let users = []

    firestore().collection('meetings').doc(meeting.id)
    .collection(subject).add(newComment)
    .then((doc) => {
      setCommentTyped('')

    }).catch((err) => {
      alert('An error has ocurred, please try again')
      console.log(err)
    })
  }



const sendMentionAlerts = (post, comment, mentions) => {  
  const { author, } = post

  mentions.forEach((mention) => {
    let userId = mention.objectID

    let alert = {
      type: 'mention',
      title: `${author.name} has mentioned you`,
      timeSent: moment().format(),
      postId: post.id,
      post: post,
      comment: comment,
      reciever: userId,
    }

    firestore().collection('users').doc(userId)
    .collection('alerts').add(alert).catch((err) => {
      console.log(err)
    })
  })
}

  const onType = (val) => {
    const words = commentTyped.split(' ')
    const lastWordIndex = words.length - 1
    let cursorIndex = cursor.start

    if (!inputFocused) {
      toggleShowMentions(false)
    } else if (cursorIndex !== val.length || words[lastWordIndex].includes('@')) {
      let wordWithoutAt = words[lastWordIndex].substr(1, words[lastWordIndex].length)
      // props.fetchUsernames(wordWithoutAt)
      toggleShowMentions(true)
    } else {
      toggleShowMentions(false)
    }
    
    // props.fetchUsernames(text)
    setCommentTyped(val)
  }

  const onClosePressed = () => {
    props.closeModal()
  }

  const handleCursorChange = ({ nativeEvent: { selection } }) => {
    toggleCursor(selection)
  }

  const listInputfooter = () => {
    return (
      <View>

        <TextInput
          ref={replyInput}
          placeholder={placeholder}
          selectionColor="dimgrey"
          style={styles.input}
          multiline={true}
          value={commentTyped}
          onChangeText={onType}
          onBlur={() => {
            setReplyToReply({})
            setReplyToComment({})
            setPlaceholder('Type a message')
            toggleShowMentions(false)
          }}
          onFocus={() => {
            toggleInputFocused(true)
          }}
          onEndEditing={() => {
            toggleInputFocused(false)
            toggleShowMentions(false)
          }}
          onSelectionChange={handleCursorChange}
        />

        {/* {messages.length?<ReplyCard item={messages[0]} />:null} */}

          {commentTyped?<TouchableOpacity onPress={addComment} disabled={!commentTyped} style={styles.postBtn}>
            <Text style={styles.postBtnText}>Send</Text>
          </TouchableOpacity>:null}
      </View>
    )
  }

  const renderEmpty = () => {
    return (
      <Text style={styles.emptyText}>Start a discussion</Text>
    )
  }

  const toggleMuteMessagePN = () => {
    const user = auth().currentUser
    let newState = !currentUser.messagePNMuted?true:false

    firestore().collection('users').doc(user.uid)
    .update({
      messagePNMuted: newState
    }).catch((err) => {
      console.log(err)
    })
  }

  const onDeleteConvo = () => {
    //check if subject is direct message
    //check if user is sure
    if (props.route.params.subject !== 'current_attendance') return;

    firestore().collection('meetings').doc(meeting.id)
      .collection(subject).doc(subjectDoc.id)
      .collection('direct_messages').doc(user.uid)
      .collection('messages')
      .get().then((querySnap) => {
        if (querySnap.empty) return alert('No messages to remove')

        let batch = firestore().batch()
        querySnap.forEach((doc) => {
          batch.delete(doc.ref)
        })

        batch.commit()
      })
  }

  
  const { currentPost } = props
  const { subject, subjectDoc } = props.route.params

  return (
    <SafeAreaView style={{flex: 1}}>
      <MessageNavBar 
        title={parseTitle(subject, subjectDoc)}
        hideMenu={props.route.params.subject !== 'current_attendance'}
        onOptions={() => {
          setTimeout(() => {
            toggleOptionsModal(!showOptionsModal)
          }, 50)
        }}
      />
      
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      
      {/* <Text style={styles.header}>{parseTitle(subject)}</Text> */}


        <FlatList 
          ref={commentsList}
          ListEmptyComponent={renderEmpty()}
          data={messages}
          extraData={messages}
          renderItem={({item, index}) => (
            <ReplyCard 
              onLongPress={() => {
                setComment(item)

                setTimeout(() => {
                  toggleCommentsModal(!showCommentsModal)
                }, 30)

              }}
              onDeepReplyPress={(reply) => {

              }}
              onPress={() => {

              }} 
              item={item} 
            />
            // <Text>ello world</Text>
          )}
          keyExtractor={item => item.id.toString()}
          style={styles.list}
        />
        
        <KeyboardAvoidingView keyboardVerticalOffset={hp('8')} keyboardShouldPersistTaps='handled' behavior="padding">
          {listInputfooter()}
        </KeyboardAvoidingView>  

        <MessageOptionsModal 
          visible={showOptionsModal}
          onToggleModal={() => toggleOptionsModal(!showOptionsModal)}
          onMute={toggleMuteMessagePN}
          // onReport={onReport}
          onDeleteConversation={onDeleteConvo}
          userBlocked={() => {}}
          item={props.route.params.subjectDoc}
          subject={props.route.params.subject}
          meeting={props.meeting}
        />

        {comment.id?<CommentOptionsModal 
          visible={showCommentsModal}
          onToggleModal={() => toggleCommentsModal(!showCommentsModal)}
          comment={comment}
          onDeletePost={() => {
            let subject = props.route.params.subject
            let subjectDoc = props.route.params.subjectDoc
            let user = auth().currentUser
            toggleCommentsModal(!showCommentsModal)

            if (subject === 'current_attendance') {
              return firestore().collection('meetings').doc(props.meeting.id)
              .collection(subject).doc(subjectDoc.id)
              .collection('direct_messages').doc(user.uid)
              .collection('messages').doc(comment.id)
              .delete().catch((err) => {
                console.log(err)
              })
            }
            
            firestore().collection('meetings').doc(props.meeting.id)
            .collection(subject).doc(comment.id)
            .delete().catch((err) => {
              console.log(err)
            })
          }}
          onCopyText={() => {
            Clipboard.setString(comment.text)
            toggleCommentsModal(!showCommentsModal)
          }}
          meeting={props.meeting}
        />:null}
    </SafeAreaView>
  )
  
}

const styles = ScaledSheet.create({
  input: {
    fontFamily: 'Montserrat-Bold',
    fontSize: wp('5'),
    marginTop: hp('1'),
    marginBottom: hp('2'),
    marginHorizontal: wp('5'),
    padding: wp('.5'),
    maxHeight: hp('50'),
  },
  container: {
    justifyContent: 'space-between',
    height: '95%',
  },
  header: {
    fontFamily: 'Montserrat-Bold',
    fontSize: wp('5'),
    color: '#c2c2c2',
    alignSelf: 'center',
    textAlign: 'center',
    position: 'absolute',
    top: hp('2'),
  },
  postBtn: {
    justifyContent: 'center',
    borderColor: 'dimgrey',
    borderWidth: 1,
    borderRadius: wp('1'),
    width: wp('70'),
    alignSelf: 'center',
    marginBottom: hp('1'),
  },
  postBtnText: {
    textAlign: 'center',
    fontFamily: 'Montserrat-Bold',
    color: 'dimgrey',
    fontSize: wp('6'),
    margin: wp('1'),
  },
  hashtag: {

  },
  at: {

  },
  list: {
    flex: 1,
  },
  emptyText: {
    textAlign: 'center',
    fontFamily: 'Montserrat-Bold',
    color: 'dimgrey',
    fontSize: wp('6'),
    margin: wp('1'),
  },
})
const mapStateToProps = state => {
  const { polls, pollError } = state.polls
  const { meetingProfile, meeting } = state.meeting
  const { profile } = state.auth

  return {
    polls, pollError,
    meeting, meetingProfile,
    profile,
  }
}

const mapDispatchToProps = {
  createPoll, deltePoll, getPolls, votePoll, directMessage,
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedThread)