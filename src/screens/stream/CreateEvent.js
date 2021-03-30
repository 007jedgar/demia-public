import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native'
import {
  Block,
  BackNavBar,
  SubNavBar,
} from '../../common'
import {
  BasicInput,
  BasicMultilineInput,
} from '../../containers'
import {
  AddBtn,
} from '../../buttons'
import { ScaledSheet } from 'react-native-size-matters';
import { 
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import moment from 'moment'
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import { connect } from 'react-redux'
import DateTimePicker from '@react-native-community/datetimepicker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
function CreateEvent(props) {
  const [ showDatePicker, toggleDatePicker ] = useState(false)
  const [ date, setDate ] = useState(new Date)
  const [ title, setTitle ] = useState('')
  const [ description, setDescription ] = useState('')
  
  const onCreate = () => {
    let event =  {
      author: props.meetingProfile,
      meeting: props.meeting,
      timestamp: firestore.Timestamp.now(),
      date,
      title,
      description,
    }

    Promise.all([
      firestore().collection('meetings').doc(props.meeting.id)
      .collection('events').add(event)
    ]).then(() => {
      console.log('event created')      
      
      props.navigation.goBack()
    }).catch(err => {
      console.log(err)
    })
  }

  return (
    <Block>
      <BackNavBar title="Create Event"
      />
      <KeyboardAwareScrollView>

        <BasicInput 
          text={title}
          title="Title"
          placeholder="Title"
          typed={setTitle}
        />

        <BasicMultilineInput 
          text={description}
          title="Description"
          placeholder="Description"
          typed={setDescription}
        />

        {/* <TouchableOpacity 
          onPress={() => toggleDatePicker(!showDatePicker)} 
          style={styles.date}
        >
          <Text style={styles.dateText}>{moment().format('dddd, MMM Do YYYY, h:mm a')}</Text>
        </TouchableOpacity> */}

        <DateTimePicker  
          value={date}
          style={styles.datPicker}
          mode={'datetime'}
          minimumDate={new Date}
          onChange={(event, selectedDate) => {
            setDate(selectedDate)
            toggleDatePicker(!showDatePicker)
          }}
        />

        <TouchableOpacity onPress={onCreate} style={styles.createBtn}>
          <Text style={styles.btnText}>Create</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>


    </Block>
  )
}

const styles = ScaledSheet.create({
  date: {
    marginVertical: wp('5'),
    marginHorizontal: wp('9'),
  },
  dateText: {
    color: 'dimgrey',
    fontFamily: 'Montserrat-Regular',
    fontSize: wp('4.5')
  },
  createBtn: {
    borderColor: '#000',
    borderRadius: 4,
    borderWidth: 1,
    marginTop: hp('6'),
    marginHorizontal: wp('11'),
  }, 
  btnText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: wp('5'),
    textAlign: 'center',
    margin: wp('2')
  },
  datPicker: {
    height: hp('6'),
    marginHorizontal: wp('10'),
    marginVertical: wp('5'),
    color: '#000',
  },
})

const mapStateToProps = state => {
  const { meeting, meetingProfile} = state.meeting
  const { profile } = state.auth

  return {
    meeting, 
    meetingProfile,
    profile,
  }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(CreateEvent)