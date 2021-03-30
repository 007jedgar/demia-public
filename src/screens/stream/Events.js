import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
} from 'react-native'
import {
  Block,
  BackNavBar,
  SubNavBar,
} from '../../common'
import {
  AgendaCard,
} from '../../containers'
import {
  AddBtn,
} from '../../buttons'
import {
  EventModal,
} from '../../modals'
import {
  Calendar, 
  CalendarList, 
  Agenda,
} from 'react-native-calendars';
import { ScaledSheet } from 'react-native-size-matters';
import { 
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import moment from 'moment'
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import { connect } from 'react-redux'
import * as RootNavigation from '../../RootNavigation'

const DayCard = ({ day }) => {
  return (
    <View style={{
      width: wp('15'),
      backgroundColor: '#D7E6EA',
      marginTop: day?wp('2'):0,
      marginLeft: wp('2'),
    }}>
      <Text style={styles.dateText}>{day?day.day:''}</Text>
      <Text style={styles.dateText}>{day?moment.unix(day.timestamp).format('ddd'):''}</Text>
    </View>
  )
}

function Events(props) {
  const [ events, setEvents ] = useState({})
  const [ currentEvent, setEvent ] = useState({})
  const [ isLoading, toggleLoading ] = useState(false)
  const [ subscribers, setSubscribers ]  = useState([])
  const [ showEventModal, toggleEventModal ]  = useState(false)

  useEffect(() => {
    // console.log(auth().currentUser.uid)
    let unsub = firestore()
    .collection('meetings').doc(props.meeting.id)
    .collection('events')
    .onSnapshot((querySnap) => {
      if (querySnap.empty) {
        setEvents({})
        return toggleLoading(false)
      }

      let events = Object.assign({},{})
      querySnap.forEach((doc) => {
        let { date } = doc.data()
        date = moment.unix(date._seconds).format('YYYY-MM-DD')

        events[date] && events[date].length?events[date].push({...doc.data(), id: doc.id }):events[date] = [{...doc.data(), id: doc.id }]
      })
      console.log(events)
      setEvents(events)
    }, (err) => console.log(err)  )


    let unsubFromSub = firestore()
    .collection('meetings').doc(props.meeting.id)
    .onSnapshot((doc) => {
      if (!doc.exists) return setSubscribers([])

      const { eventSubscribers } = doc.data()

      
      if (!eventSubscribers) return setSubscribers([])
      setSubscribers(eventSubscribers)

    }, (err) => console.log(err))
    
    
    return () => {
      unsub()
      unsubFromSub()
    }
  }, [])


  const subEvents = async () => {
    const user = auth().currentUser
    try {
      console.log('subscribing...')

      let sub = {
        meeting: props.meeting,
        meetingId: props.meeting.id,
        item: {},
        itemId: '',
        type: 'events',
        date: firestore.Timestamp.now(),
      }
  
      let eventSubsRef = firestore()
      .collection('meetings').doc(props.meeting.id)
      .collection('events_subs')

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
        eventSubscribers: firestore.FieldValue.arrayUnion(user.uid)
      })
      
      let subDocRef = await eventSubsRef.add(props.profile)
      
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
      type: 'events'
    }
  }


  const unsubEvents = () => {
    console.log('unsubscribing...')
    const user = auth().currentUser

    let unsubfromList = firestore()
    .collection('meetings').doc(props.meeting.id)
    .update({
      eventSubscribers: firestore.FieldValue.arrayRemove(user.uid)
    })

    // for removing subs for user
    let userUnsubRef = firestore()
    .collection('users').doc(user.uid)
    .collection('subscription_refs')
    .where("type", "==", "events")
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


  const onAdd = () => {
    RootNavigation.navigate('createEvent')
  }

  const deleteEvent = () => {
    toggleEventModal(!showEventModal)
    console.log('deleting', currentEvent)
    firestore()
    .collection('meetings').doc(props.meeting.id)
    .collection('events').doc(currentEvent.id)
    .delete()
  }

  return (
    <Block>
      <SubNavBar 
        isSubbed={subscribers.includes(auth().currentUser.uid)} 
        onToggleSub={() => subscribers.includes(auth().currentUser.uid)?unsubEvents():subEvents()}
        title="Events" 
      />
      
      <Agenda
        items={events}
        loadItemsForMonth={(month) => {console.log('trigger items loading')}}
        onCalendarToggled={(calendarOpened) => {console.log('opened',calendarOpened)}}
        // Callback that gets called on day press
        // onDayPress={}
        // Callback that gets called when day changes while scrolling agenda list
        // onDayChange={(day)=>{console.log('day changed')}}
        selected={moment().format('YYYY-MM-DD')}
        minDate={'2020-10-22'}
        maxDate={'2021-11-30'}
        pastScrollRange={50}
        futureScrollRange={50}
        renderItem={(item, firstItemInDay) => {
          return (
            <AgendaCard 
              onPress={() => {
                setEvent(item)

                setTimeout(() => {
                  toggleEventModal(!showEventModal)
                }, 50)
              }}  
              item={item}
            />
          )}
        }
        renderDay={(day, item) => {return (<DayCard  day={day}/>)}}
        renderEmptyDate={() => {return (<View />)}}
        renderKnob={() => {return (<View style={styles.knob}/>)}}
        renderEmptyData = {() => {return (<View />)}}
        rowHasChanged={(r1, r2) => {return r1.date._seconds !== r2.date._seconds}}
        hideKnob={false}
        refreshing={false}
        theme={{
          agendaDayTextColor: 'yellow',
          agendaDayNumColor: 'green',
          agendaTodayColor: 'red',
          agendaKnobColor: 'blue',
          selectedDayBackgroundColor: '#69A2B0',
          todayTextColor: '#69A2B0',
          dotColor: '#69A2B0',
        }}
        style={{flex: 1}}
      />

      <AddBtn onPress={onAdd} />
      {showEventModal?<EventModal 
        visible={showEventModal}
        closeModal={() => toggleEventModal(!showEventModal)}
        onDelete={deleteEvent}
        item={currentEvent}
      />:null}
    </Block>
  )
}

const styles = ScaledSheet.create({
  knob: {
    backgroundColor: '#898989',
    height: wp('1'),
    width: wp('10'),
    borderRadius: wp('5'),
  },
  dateCard: {
    width: wp('10'),
    justifyContent: 'center',
  },
  dateText: {
    textAlign: 'center',
    alignSelf: 'center',
    color: '#000',
    fontSize: wp('4.5'),
    fontFamily: 'Montserrat-Regular',
  },
})

const mapStateToProps = state => {
  const { meeting } = state.meeting
  const { profile } = state.auth

  return {
    meeting,
    profile,
  }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Events)