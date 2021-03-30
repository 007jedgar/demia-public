import React, {useState, useEffect } from 'react'
import { 
  FlatList,
  View,
  Text,
} from 'react-native'
import {
  Block,
  BackNavBar,
  SubNavBar
} from '../../common'
import {
  PollContainer,
} from '../../containers'
import {
  AddBtn
} from '../../buttons'
import {
  CreatePollModal,
  StreamOptionsModal,
} from '../../modals'
import {
  createPoll, deltePoll, getPolls, votePoll
} from '../../actions'
import { EmptyPoll } from '../../emptyOrError'

import { connect } from 'react-redux'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { ScaledSheet } from 'react-native-size-matters'
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import Spinny from 'react-native-spinkit'
import moment from 'moment'

function Polls(props) {
  const [ showPollModal, togglePollModal ] = useState(false)
  const [ showPollOptions, togglePollOptions ] = useState(false)
  const [ polls, setPolls ] = useState(false)
  const [ pollError, setPollErr ] = useState(false)
  const [ isLoading, toggleLoading ] = useState(false)
  const [ pollSubscribers, setPollSubs ] = useState([])
  const [ currentPoll, setCurrentPoll ] = useState({})

  const footer = 'Polls will disapear after two weeks'
  const sortPolls = (polls) => {
    let sortedPolls = polls.sort((a, b) => moment(b.timeSent) - moment(a.timeSent))
    return sortedPolls
  }

  useEffect(() => {
    toggleLoading(true)

    let unsubscribe = firestore()
    .collection('meetings').doc(props.meeting.id)
    .collection('polls').orderBy("date", "asc")
    .onSnapshot((querySnap) => {
      if (querySnap.empty) {
        toggleLoading(false)
        return setPolls([])
      }

      let polls = []
      let sevenDaysFromNow = moment().subtract(14, 'days')._d

      querySnap.forEach((doc) => {

        if (moment(doc.data().duration).isAfter(sevenDaysFromNow)) {
          polls.push({ ...doc.data(), id: doc.id })
        }
      })

      setPolls(polls)
      toggleLoading(false)
    }, (err) => {
      console.log(err)
      setPolls([])
      toggleLoading(false)
      setPollErr(err)
    })

    let unsub = firestore()
    .collection('meetings').doc(props.meeting.id)
    .onSnapshot((doc) => {
      let { pollSubscribers } = doc.data()
      if (!pollSubscribers) return setPollSubs([])

      setPollSubs(pollSubscribers)
    }, (err) => {
      console.log(err)
    })

    return () => {
      unsubscribe()
      unsub()
    }
  }, [])

  const onSubscribe = async () => {
    const user = auth().currentUser
    console.log('subscribing')

    try {
      let sub = {
        meeting: props.meeting,
        meetingId: props.meeting.id,
        item: {},
        itemId: '',
        type: 'polls',
        date: firestore.Timestamp.now(),
      }

      let docSubRef = firestore()
      .collection('meetings').doc(props.meeting.id)
      .collection('polls_subs')
      
      let userSubCollectionRef = firestore()
      .collection('users').doc(user.uid)
      .collection('subscription_refs')
  
      let userSubsRef = firestore()
      .collection('users').doc(user.uid)
      .collection('subscriptions')

      let meetingRef  = firestore()
      .collection('meetings').doc(props.meeting.id)
  
      meetingRef.update({
        pollSubscribers: firestore.FieldValue.arrayUnion(user.uid)
      })
  
      let userDocMeetingSubRef = await docSubRef.add(props.profile)
      
      let userSubDoc = await userSubsRef.add(sub)
  
      sub.ref = userSubDoc
      await userSubCollectionRef.add(sub)
  
      sub.ref = userDocMeetingSubRef
      await userSubCollectionRef.add(sub)
    } catch(err) {
      console.log(err)
    }
  }

  const onUnsubscribe = () => {
    console.log('unsubscribing')
    const user = auth().currentUser

    let meetingRef  = firestore()
    .collection('meetings').doc(props.meeting.id)

    let userSubCollectionRef = firestore()
    .collection('users').doc(user.uid)
    .collection('subscription_refs')
    
    userSubCollectionRef.where("type", "==", "polls")
    .where("meetingId" , "==", props.meeting.id)
    .get().then((querySnap) => {
      let batch = firestore().batch()
      querySnap.forEach((doc) => {
        batch.delete(doc.ref)
        batch.delete(doc.data().ref)
      })

      batch.commit()
    })

    meetingRef.update({
      pollSubscribers: firestore.FieldValue.arrayRemove(user.uid)
    })
  }


  const renderLoading = () => {
    if (isLoading) {
      return (
        <View style={{alignSelf: 'center'}}>
          <Spinny size={wp('9')} type="Arc" color="#000"/>
        </View>
      )
    }
  }



  return (
    <Block>

      {/* <BackNavBar title="Polls" navigation={props.navigation}/> */}
      <SubNavBar 
        title="Polls" 
        onToggleSub={() => {
          let user = auth().currentUser
          if (pollSubscribers.includes(user.uid)) {
            onUnsubscribe()
          } else {
            onSubscribe()
          }
        }}
        isSubbed={pollSubscribers.includes(auth().currentUser.uid)}
      />

      <FlatList 
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyPoll />}
        ListHeaderComponent={renderLoading()}
        ListFooterComponent={<Text style={styles.footer}>{footer}</Text>}
        data={polls}
        extraData={polls}
        renderItem={({item}) => (
          <PollContainer 
            poll={item} 
            voteOnPoll={(vote) => props.votePoll(props.meeting, item, vote)}
            showOptions={() => {
              setCurrentPoll(item)

              setTimeout(() => {
                togglePollOptions(!showPollOptions)
              }, 50)
            }}
            onUnsubscribe={() => unsubscribeToPoll(item)}
            onSubscribe={() => subscribeToPoll(item)}
          />
        )}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
      />

      <AddBtn onPress={() => props.navigation.navigate('createPoll')} />

      <CreatePollModal 
        profile={props.meetingProfile}
        closeModal={() => togglePollModal(!showPollModal)}
        visible={showPollModal}
        sendAssignment={(poll) => {
          props.createPoll(props.meeting, poll)
        }} 
      />

      <StreamOptionsModal
        visible={showPollOptions}
        onToggleModal={() => togglePollOptions(!showPollOptions)}
        onDelete={() => {
          if (props.meetingProfile.admin || currentPoll.author.id === auth().currentUser.uid) {
            return firestore()
            .collection('meetings').doc(props.meeting.id)
            .collection('polls').doc(currentPoll.id)
            .delete().then(() => {
              togglePollOptions(!showPollOptions)
            })
          } else return alert(`You must be the poll's creator or an admin to delete`)
        }}
      />
    </Block>
  )
}

const styles = ScaledSheet.create({
  footer: {
    marginVertical: hp('2'),
    fontFamily: 'Montserrat-Medium',
    color: 'dimgrey',
    fontSize: wp('5'),
    textAlign: 'center',
  },
})

const mapStateToProps = state => {
  const { pollError } = state.polls
  const { meetingProfile, meeting } = state.meeting
  const { profile } = state.auth

  return {
    pollError,
    meeting, 
    meetingProfile,
    profile,
  }
}

const mapDispatchToProps = {
  createPoll, deltePoll, getPolls, votePoll
}

export default connect(mapStateToProps, mapDispatchToProps)(Polls)