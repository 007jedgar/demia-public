import React, {useState, useEffect} from 'react'
import { 
  FlatList,
  View,
} from 'react-native'
import {
  Block,
  BackNavBar,
  SubNavBar
} from '../../common'
import {
  AddBtn
} from '../../buttons'
import {
  AddAssignmentModal,
  ReminderModal,
  StreamOptionsModal,
} from '../../modals'
import { 
  AssignmentCard,
} from '../../containers'
import {
  createAssignment
} from '../../actions'
import {
  EmptyAssignmentCard,
} from '../../emptyOrError'
import { connect } from 'react-redux'
import * as RootNavigation from '../../RootNavigation'
import moment from 'moment'
import Spinny from 'react-native-spinkit'
import { widthPercentageToDP } from 'react-native-responsive-screen'
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'

function Assignments(props) {
  const [ isEditing, toggleEditing ] = useState(false)
  const [ isLoading, toggleLoading ] = useState(false)
  const [ showReminderModal, toggleReminderModal ] = useState(false)
  const [ showAssignmentModal, toggleAssignmentModal ] = useState(false)
  const [ showAssignmentOptions, toggleAssignmentOptions ] = useState(false)
  const [ assignments, setAssignments ] = useState([])
  const [ currentUser, setUser ] = useState({})
  const [ currentAssignment, setCurrentAssignment ] = useState({})
  const [ subscribers, setSubscribers ] = useState([])

  useEffect(() => {
    toggleLoading(true)
    const user = auth().currentUser

    firestore().collection('users').doc(user.uid)
    .get().then((doc) => {
      setUser({ ...doc.data(), id: doc.id })
    }).catch((err) => console.log(err))

    const unsub = firestore()
    .collection('meetings').doc(props.meeting.id)
    .collection('assignments')
    .orderBy("date", "desc")
    .onSnapshot((querySnap) => {
      if (querySnap.empty) {
        toggleLoading(false)
        return setAssignments([])
      }

      let assignments = []
      querySnap.forEach((doc) => {
        assignments.push({ ...doc.data(), id: doc.id })
      })

      setAssignments(assignments)
      toggleLoading(false)
    }, (err) => {
      setAssignments(assignments)
      toggleLoading(false)
    })

    const unsubAssignments = firestore()
    .collection('meetings').doc(props.meeting.id)
    .onSnapshot((doc) => {
      const { assignmentSubscribers } = doc.data()
      if (!assignmentSubscribers) return setSubscribers([])
      setSubscribers(assignmentSubscribers)
    })

    return () => {
      unsub()
      unsubAssignments()
    }
  }, [])

  const onCreateAssignment = (assignment) => {
    assignment.dueDate = firestore.Timestamp.now()
    const { meeting , meetingProfile } = props  
    if (!meeting || !meetingProfile) return alert('An error has occured, please try again')
    props.createAssignment(meeting, meetingProfile, assignment)
    toggleAssignmentModal(false)
  }

  const renderLoading = () => {
    if (isLoading) return (
      <View style={{alignSelf: 'center'}}>
        <Spinny type="Arc" size={widthPercentageToDP('9')} color="#000" />
      </View>
    )
  }

  const setReminderPN = async (item, date) => {
    let performAt = moment(item.date).subtract(1, 'days')
      
    let worker = {
      options: {
        item,
        meeting: props.meeting,
      },
      performAt: firestore.Timestamp.fromDate(performAt._d),
      status: 'scheduled',
      worker: 'assignmentDue',
    }

    // returns a doc ref
    let addWorker = await firestore()
    .collection('tasks').add(worker)

    let reminderWorker = true

    if (date) {
      let reminder = {
        options: {
          item,
          meeting: props.meeting,
        },
        performAt: firestore.Timestamp.fromDate(date),
        status: 'scheduled',
        worker: 'assignmentDue',
      }

      reminderWorker = await firestore()
      .collection('tasks').add(reminder)
    }
  }

  const onSubscribe = async () => {
    try {
      console.log('subscribing...')
      const user = auth().currentUser

      let sub = {
        meeting: props.meeting,
        meetingId: props.meeting.id,
        item: {},
        itemId: '',
        type: 'assignments',
        date: firestore.Timestamp.now(),
      }
  
      let assignmentSubsRef = firestore()
      .collection('meetings').doc(props.meeting.id)
      .collection('assignments_subs')

      let meetingRef = firestore()
      .collection('meetings').doc(props.meeting.id)

      let userSubsRef = await firestore()
      .collection('users').doc(user.uid)
      .collection('subscriptions')

      // for removing subs for user
      let userSubRef = firestore()
      .collection('users').doc(user.uid)
      .collection('subscription_refs')
      
      // for the ui, toggling isSubscribed
      await meetingRef.update({
        assignmentSubscribers: firestore.FieldValue.arrayUnion(user.uid)
      })
      
      let subDocRef = await assignmentSubsRef.add(currentUser)
      
      let userSubsDocRef = await userSubsRef.add(sub)

      Promise.all([
        userSubRef.add(createUserSubRef(subDocRef)),
        userSubRef.add(createUserSubRef(userSubsDocRef))
      ])
    } catch(err) {
      console.log(err)
    }
  }

  const createUserSubRef = (ref) => {
    if (typeof ref === "boolean") return false

    return {
      ref,
      meeting: props.meeting,
      meetingId: props.meeting.id,
      itemId: '',
      item: {},
      date: firestore.Timestamp.now(),
      type: 'assignments'
    }
  }

  const onUnsubscribe = () => {
    console.log('unsubscribing...')
    const user = auth().currentUser

    let unsubfromList = firestore()
    .collection('meetings').doc(props.meeting.id)
    .update({
      assignmentSubscribers: firestore.FieldValue.arrayRemove(user.uid)
    })

    // for removing subs for user
    let userUnsubRef = firestore()
    .collection('users').doc(user.uid)
    .collection('subscription_refs')
    .where("type", "==", "assignments")
    .get().then((querySnap) => {

      let batch = firestore().batch()
      querySnap.forEach((doc) => {
        batch.delete(doc.data().ref)
        batch.delete(doc.ref)
      })

      batch.commit()
    }).catch((err) => {
      console.log(err)
    })

    Promise.all([unsubfromList, userUnsubRef]).catch(err => {
      console.log(err)
    })
  }

  return (
    <Block>
      <SubNavBar 
        title="Assignments"
        isSubbed={subscribers.includes(currentUser.id)}
        onToggleSub={() => {
          if (subscribers.includes(currentUser.id)) {
            onUnsubscribe()
          } else {
            onSubscribe()
          }
        }}
      />
      
      <FlatList
        ListHeaderComponent={renderLoading()}
        ListEmptyComponent={<EmptyAssignmentCard />}
        data={assignments} 
        renderItem={({item, index}) => (
          <AssignmentCard 
            onSubscribe={() => {
              setCurrentAssignment(item)
              setTimeout(() => {
                toggleReminderModal(!showReminderModal)
              },20)
            }}
            onUnsubscribe={() => onUnsubscribe(item)}
            onCommentPress={() => {
              props.navigation.navigate('feedThread', {
                subject: 'assignments_thread', 
                subjectDoc: item,
              })
            }} 
            item={item} 
            index={index} 
            meeting={props.meeting}
            onShowInfo={() => {

            }}
            onOptionsPressed={(item) => {
              setCurrentAssignment(item)

              setTimeout(() => {
                toggleAssignmentOptions(!showAssignmentOptions)
              }, 50)
            }} 
          />
        )}
        keyExtractor={item => item.id.toString()}
      />
      
      <AddBtn onPress={()=> RootNavigation.navigate('createAssignment')} />

      <AddAssignmentModal 
        meeting={props.meeting}
        profile={props.meetingProfile}
        visible={showAssignmentModal}
        closeModal={() => toggleAssignmentModal(false)}
        sendAssignment={(assignment) =>{ 
          onCreateAssignment(assignment)
          toggleAssignmentModal(false)
        }}
      />

      {showReminderModal?<ReminderModal 
        assignment={currentAssignment}
        visible={showReminderModal}
        onSave={(date) => {
          onSubscribe(currentAssignment, date)
          toggleReminderModal(!showReminderModal)
        }}
        assignment={currentAssignment}
        onClose={() => toggleReminderModal(!showReminderModal)}
      />:null}

      <StreamOptionsModal
        visible={showAssignmentOptions}
        onToggleModal={() => toggleAssignmentOptions(!showAssignmentOptions)}
        onDelete={() => {
          if (props.meetingProfile.admin || currentAssignment.author.id === auth().currentUser.uid) {
            return firestore()
            .collection('meetings').doc(props.meeting.id)
            .collection('assignments').doc(currentAssignment.id)
            .delete().then(() => {
              toggleAssignmentOptions(!showAssignmentOptions)
            })
            
          } else return alert(`You must be the assignment's creator or an admin to delete`)
        }}
      />      
    </Block>
  )
}

const mapStateToProps = state => {
  const { meeting, meetingProfile } = state.meeting
  const { profile } = state.auth
  const fbData = state.firebase.data

  return {
    meeting,
    meetingProfile,
    fbData,
    profile
  }
}
 
const mapDispatchToProps = {
  createAssignment
}

export default 
  connect(mapStateToProps, mapDispatchToProps)
(Assignments)