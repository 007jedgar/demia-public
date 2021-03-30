import React, {useState} from 'react'
import { 
  View,
  TouchableOpacity, 
  Text, 
  Modal, 
  StyleSheet,
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen'

function DatePickerModal ({ onDateChange, visible, onCloseIOS, iosHeading, displayDate }) {
  const [ date, setDate ] = useState(displayDate)

  const onChangeDate = (event, selectedDate) => {
    let newDate = selectedDate || date
    setDate(newDate)
  }

  const returnDate = () => {
    onDateChange(date)
    onCloseIOS()
  }

  return (
    <Modal
      animationType='fade'
      visible={visible}
      transparent={true}
    >
      <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,.3)'}} >

        <View style={styles.background}>
          
          <View style={styles.container}>
            <View>
              <Text style={styles.header}>
                {iosHeading}
              </Text>
            </View>
          </View>

          <View style={styles.pickerContainer}>
            <DateTimePicker
              style={{color: '#000'}}
              value={date}
              mode={'date'}
              textColor="#000"
              display="spinner"
              onChange={(event, selectedDate) => onChangeDate(event, selectedDate)}
            />
          </View>

          <View style={styles.bottomContainer}>
            <TouchableOpacity style={styles.btns} onPress={onCloseIOS}>
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={returnDate} style={styles.btns}>
              <Text style={styles.btnText}>Ok</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  background: {
    justifyContent: 'center', 
    backgroundColor: '#fff',
    borderColor: '#c2c2c2',
    borderRadius: 4,
    marginHorizontal: wp('15'),
    marginTop: hp('30'),
    zIndex: 1,
  },
  header: {
    fontFamily: "OpenSans-Regular", 
    color: "#000", 
    fontSize: wp('5'),  
    textAlign: 'center',
    margin: hp('2')
  },
  container: {
    zIndex: 0,
  },
  pickerContainer: {
    backgroundColor: "#fff", 
    justifyContent: "center",
  },
  btns: {
    flex: 1,
    zIndex: 3,
  },
  btnText: {
    fontFamily: "OpenSans-Regular", 
    fontSize: wp('5'),
    margin: hp('2'),
    color: "#000",
    textAlign: 'center',
  },
  bottomContainer: {
    // alignItems: 'center', 
    flexDirection: "row", 
    zIndex: 2,
  },
})

export  {DatePickerModal}
