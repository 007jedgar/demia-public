import React, { useState, useEffect } from 'react'
import {
  Modal,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
import {
  ScaledSheet 
} from 'react-native-size-matters'
import FastImage from 'react-native-fast-image'
import Icons from '@assets/icons'

import moment from 'moment'
import { AssignmentCard } from '../containers'

function ReminderModal({ visible, onSave, onClose, assignment }) {
  const [ date, setDate ] = useState(new Date())
  const showDatePicker = () => {
    return (
      <View style={styles.dateContainer}>
        <DateTimePicker 
          value={date}
          mode={'datetime'}
          onChange={(event, selectedDate) => setDate(selectedDate)}
        />
      </View>
    )
  }

  return (
    <Modal
      visible={visible}
      animationType="fade"
    >
      <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <FastImage 
              style={styles.xIcon}
              source={Icons.x}
            />
          </TouchableOpacity>


        </View>

        <Text style={styles.assignment}>{assignment.title}</Text>
        <Text style={styles.assignment}>Due: {moment(assignment.dueDate).format('LLL')}</Text>
        <Text style={styles.headerText}>Would you like to set an extra reminder?</Text>
        {showDatePicker()}

        <Text style={styles.formattedDate}>{moment(date).format('LLL')}</Text>

        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <TouchableOpacity 
            style={[styles.saveBtn, {backgroundColor: '#E76F51'}]}
            onPress={() => onSave(null)}
          >
            <Text style={styles.saveText}>No thanks</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.saveBtn}
            activeOpacity={.8}
            onPress={() => onSave(date)}
          >
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal> 
  )
}

const styles = ScaledSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp('5'),
    paddingTop: hp('1')
  },
  xIcon: {
    width: wp('8'),
    height: wp('8'),
  },
  saveBtn: {
    borderRadius: 4,
    backgroundColor: '#2A93F3',
    width: wp('40'),
    margin: wp('5')
  },
  saveText: {
    color: '#fff',
    fontFamily: 'Montserrat-Medium',
    fontSize: wp('4.6'),
    margin: wp('2'),
    textAlign: 'center',
  },
  dateContainer: {
    marginHorizontal: wp('10')
  },
  formattedDate: {
    textAlign: 'center',
    color: 'dimgrey',
    fontSize: wp('5'),
    fontFamily: 'Montserrat-Medium'
  },
  headerText: {
    fontFamily: 'Montserrat-Regular',
    textAlign: 'center',
    marginVertical: hp('2'),
  },
  assignment: {
    color: '#000',
    fontFamily: 'Montserrat-Medium',
    fontSize: wp('4.6'),
    textAlign: 'center',
    marginHorizontal: wp('2'),
  },
})

export { ReminderModal }