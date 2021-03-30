import React, { useState, useEffect } from 'react'
import {
  Modal,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Alert
} from 'react-native'
import { ScaledSheet } from 'react-native-size-matters'
import { 
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
 } from 'react-native-responsive-screen'
import FastImage from 'react-native-fast-image'
import moment, { duration } from 'moment'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { 
  BasicInput,
  PollInput,
} from '../containers'
import { 
  ConfirmBtn ,
  FilledConfirmBtn,
  UploadBtn,
} from '../buttons'
import {Picker} from '@react-native-community/picker';
import { map } from 'lodash'

import Spinny from 'react-native-spinkit'
import firestore from '@react-native-firebase/firestore'

const days = [0, 1, 2, 3, 4, 5, 6, 7]
const hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
  20, 21, 22, 23]
const minutes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
  20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
  30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
  40, 41, 42, 43, 44, 45, 46, 47, 48, 49,
  50, 51, 52, 53, 54, 55, 56, 57, 58, 59 ]

function CreatePollModal({ visible, closeModal, sendAssignment, profile }) {
  const [ title, setTitle ] = useState('')
  const [ daysDuration, setDaysDuration ] = useState(0)
  const [ hoursDuration, setHoursDuration ] = useState(0)
  const [ minutesDuration, setMinutesDuration ] = useState(0)
  const [ showDurationPicker, toggleDurationPicker ] = useState(false)
  const [ durationTitle, setDurationTitle] = useState('')
  const [ showAdd, setAdd ] = useState([true, false, false]) 
  const [ choices, setChoices ] = useState(['', '', '', '']) 
  const [ error, setError ] = useState('')

  useEffect(() => {
      setTitle('')
      setDaysDuration(0)
      setHoursDuration(0)
      setMinutesDuration(0)
      setDurationTitle('')
      setChoices(['', '', '', ''])
      setError('')
  }, [])
  
  const onPickDuration = () => {
    toggleDurationPicker(true)
  }

  const editChoice = (num, edit) => {
    let c = choices
    c[num] = edit
    setChoices(c)
  }


  const donePressed = () => {
    if (durationTitle === "Duration") {
      return setError('Please add the duration the poll will be available')
    }
    if (!title) return setError('Please add a title')

    let duration = moment().add(daysDuration, 'days').add(hoursDuration, 'hours').add(minutesDuration, 'minutes')

    let newChoices = []
    
    map(choices, (choice) => {
      if (choice) {
        let obj = {
          statement: choice,
          isSelected: false,
          numSelected: 0,
        }
        newChoices.push(obj)
      }
    })

    const poll = {
      question: title,
      title,
      duration: duration.format(),
      durationObject: duration,
      durationTitle,
      options: newChoices, //not changing,
      timeSent: moment().format(),
      date: firestore.Timestamp.now(),
      voters: 0,
      voted: [],
      choice1Votes: 0,
      choice2Votes: 0,
      choice3Votes: 0,
      choice4Votes: 0,
      author: profile,
      subscribers: [],
    }
    // return console.log(poll)
    sendAssignment(poll) 
    closeModal()
  }

  const durationPicked = () => {
    if ((minutesDuration + hoursDuration + daysDuration) === 0 ) {
      
      toggleDurationPicker()
      return setDurationTitle('Duration')
    }

    let duration = `${daysDuration} day${daysDuration!==1?'s':''}, ${hoursDuration} hour${hoursDuration!==1?'s':''}, ${minutesDuration} minute${minutesDuration!==1?'s':''}`
    setDurationTitle(duration)
    toggleDurationPicker()
  }

  const onClosePressed = () => {
    
    closeModal()
  }

  return (
    <Modal
      animationType="slide"
      visible={visible}
    >
      <SafeAreaView style={styles.container}>
          <TouchableOpacity style={{zIndex: 2}} onPress={onClosePressed}>
            <Text style={styles.close}>Close</Text>
          </TouchableOpacity>
        <KeyboardAwareScrollView style={{flex: 1}}>


          <Text style={styles.header}>
            Create a poll
          </Text>

          <BasicInput 
            placeholder="Title"
            text={title}
            typed={setTitle}
            title={'Title'}
          />

          <PollInput 
            showAdd={false}
            placeholder="choice 1"
            onChangeText={(t) => editChoice(0, t)}
          />
          <PollInput 
            showAdd={showAdd[0]}
            placeholder="choice 2"
            onAdd={() => {
              setAdd([false, true ])
            }}
            onChangeText={(t) => editChoice(1, t)}
          />
          {showAdd[1]||showAdd[2]?<PollInput 
            showAdd={showAdd[1]}
            placeholder="choice 3 (optional)"
            onChangeText={(t) => editChoice(2, t)}
            onAdd={() => {
              setAdd([false, false, true ])
            }}
          />:null}
          {showAdd[2]?<PollInput 
            showAdd={false}
            placeholder="choice 4 (optional)"
            onChangeText={(t) => editChoice(3, t)}
          />:null}

          
          <ConfirmBtn 
            fontStyle={{ fontSize: wp('4.5') }} 
            onPress={onPickDuration} 
            text={durationTitle?durationTitle:'Duration'}
          />


          <FilledConfirmBtn 
            text="Done"
            onPress={donePressed}
          />
          <Text style={styles.error}>{error}</Text>

        {showDurationPicker?<View style={styles.pickerContainer}>
          <View style={styles.pickerHolder}>
            <View style={{flexDirection: 'row', justifyContent: 'center', marginVertical: hp('2')}}>
              <View>
                <Text style={styles.pickerTitle}>Days</Text>
                <Picker   
                  selectedValue={daysDuration}
                  style={styles.picker}
                  onValueChange={(itemValue, itemIndex) =>
                    setDaysDuration(itemValue)
                  }          
                >
                  {map(days, (day) => (
                    <Picker.Item  key={day.toString} label={day.toString()} value={day} />
                  ))}
                </Picker>
              </View>
              <View>
                <Text style={styles.pickerTitle}>Hours</Text>
                <Picker 
                  selectedValue={hoursDuration}
                  style={styles.picker}
                  onValueChange={(itemValue, itemIndex) =>
                    setHoursDuration(itemValue)
                  }          
                >
                  {map(hours, (hour) => (
                    <Picker.Item  key={hour.toString} label={hour.toString()} value={hour} />
                  ))}
                </Picker>
              </View>
              <View>
                <Text style={styles.pickerTitle}>Minutes</Text>
                <Picker 
                  selectedValue={minutesDuration}
                  style={styles.picker}
                  onValueChange={(itemValue, itemIndex) =>
                    setMinutesDuration(itemValue)
                  }          
                >
                  {map(minutes, (min) => (
                    <Picker.Item  key={min.toString} label={min.toString()} value={min} />
                  ))}
                </Picker>
              </View>
            </View>
            <TouchableOpacity onPress={durationPicked}><Text style={styles.done}>Done</Text></TouchableOpacity>
          </View>
        </View>:null}

        </KeyboardAwareScrollView>
      </SafeAreaView>
    </Modal>
  )
}

const styles = ScaledSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  close: {
    fontFamily: 'OpenSans-Bold',
    fontSize: wp('4'),
    color: 'dimgrey',
    margin: wp('3')
  },
  header: {
    fontFamily: 'OpenSans-Bold',
    fontSize: wp('7'),
    color: 'dimgrey',
    margin: wp('3')
  },
  btnTitle: {
    marginLeft: wp('14'),
    marginBottom: hp('.5'),
    fontSize: wp('4'),
    fontFamily: 'Montserrat-Medium',
  },
  picker: {
    width: wp('20'),
    alignSelf: 'center',
  },
  pickerHolder: {
    backgroundColor: '#fff',
    borderColor: '#c2c2c2',
    borderRadius: 4,
    borderWidth: 1,
    marginHorizontal: wp('15'),
  },
  pickerContainer: {
    position: 'absolute',
    justifyContent: 'center',
    width: wp('100'),
    height: hp('90'),
  },
  done: {
    textAlign: 'center',
    color: '#000',
    fontSize: wp('5.5'),
    fontFamily: 'Montserrat-Regular',  
    marginBottom: hp('2')
  },
  pickerTitle: {
    fontSize: wp('4'),
    fontFamily: 'Montserrat-Medium',
    alignSelf: 'center',
  },
  error: {
    marginVertical: hp('2'),
    marginHorizontal: hp('2'),
    color: '#E35B31',
    fontSize: wp('5'),
    textAlign: 'center',
    fontFamily: 'Montserrat-Regular'
  },  
})

export {CreatePollModal}