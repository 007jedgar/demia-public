import React, { useState, useEffect } from 'react'
import {
  Text,
  FlatList,
  TouchableOpacity,
  View,
} from 'react-native'

import {
  Block,
} from '../../common'
import {
  SubscriptionCard,
  AgendaCard,
} from '../../containers'
import {
  EmptySubscriptionCard
} from '../../emptyOrError'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
import { ScaledSheet } from 'react-native-size-matters'
import Spinny from 'react-native-spinkit'
import {
  EventModal,
} from '../../modals'
import {
  Agenda,
} from 'react-native-calendars';
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import moment from 'moment'

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

function Subscriptions(props) {
  const [ subscriptions, setSubscriptions ] = useState('')
  const [ events, setEvents ] = useState([])
  const [ currentEvent, setEvent ] = useState({})
  const [ isLoading, toggleLoading ] = useState(false)
  const [ alertSelected, toggleAlertSelected ] = useState(true)
  const [ showEventModal, toggleEventModal ] = useState(false)

  useEffect(() => {
    toggleLoading(true)
    const user = auth().currentUser

    let unsubscribe = firestore()
    .collection('users').doc(user.uid)
    .collection('subscriptions')
    .orderBy("date", "desc")
    .limit(20)
    .onSnapshot((querySnap) => {
      if (querySnap.empty) {
        toggleLoading(false)
        return setSubscriptions([])
      }

      let subs = []
      querySnap.forEach((doc) => {
        subs.push({ ...doc.data(), id: doc.id })
      })

      setSubscriptions(subs)
      toggleLoading(false)
    }, (err) => {
      console.log(err)
      toggleLoading(false)
      setSubscriptions([])
    })

    let calendarSub = firestore()
    .collection('users').doc(user.uid)
    .collection('calendar')
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


    return () => {
      unsubscribe()
      calendarSub()
    }
  }, [])

  const header = () => {
    const selectedStyle = {    
      borderRadius: 6,
      backgroundColor: '#fff',
      shadowColor: '#69A2B0',
      shadowOffset: { width: 1, height: 1},
      shadowOpacity: .5,
    }

    return (
      <View style={styles.headerContainer}>
        <TouchableOpacity activeOpacity={.9} onPress={() => toggleAlertSelected(!alertSelected)} style={[styles.selectorBtn, alertSelected?selectedStyle:{}]}>
          <Text style={styles.header}>alerts</Text>
        </TouchableOpacity>
        
        <TouchableOpacity activeOpacity={.9} onPress={() => toggleAlertSelected(!alertSelected)} style={[styles.selectorBtn, !alertSelected?selectedStyle:{}]}>
          <Text style={styles.header}>calendar</Text>
        </TouchableOpacity>

      </View>
    )
  }

  const deleteEvent = () => {
    const user = auth().currentUser
    toggleEventModal(!showEventModal)
    
    firestore()
    .collection('users').doc(user.uid)
    .collection('calendar').doc(currentEvent.id)
    .delete().catch((err) => {
      console.log(err)
    })
  }

  return (
    <Block>
      {!alertSelected?header():null}

      {alertSelected?<FlatList 
        ListHeaderComponent={header()}
        ListEmptyComponent={<EmptySubscriptionCard />}
        data={subscriptions}
        renderItem={({item}) => (
          <SubscriptionCard item={item}/>
        )} 
        keyExtractor={(item) => item.id.toString()}
      />:<Agenda
        items={events}
        loadItemsForMonth={(month) => {console.log('trigger items loading')}}
        onCalendarToggled={(calendarOpened) => {console.log('opened',calendarOpened)}}
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
      />}

      {showEventModal?<EventModal 
        visible={showEventModal}
        closeModal={() => toggleEventModal(!showEventModal)}
        onDelete={deleteEvent}
        item={currentEvent}
        isUserCalendar={true}
      />:null}
    </Block>
  )
} 

const styles = ScaledSheet.create({
  header: {
    fontSize: wp('5.6'),
    fontFamily: 'Montserrat-SemiBold',
    textAlign: 'center',
    color: 'dimgrey',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: hp('1'),
    backgroundColor: '#E4EEF1',
    marginHorizontal: wp(21),
    padding: wp(1),
    borderRadius: 6
  },
  selectorBtn: {
    marginHorizontal: wp(3),
    paddingHorizontal: wp(2),
  },
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

export default Subscriptions