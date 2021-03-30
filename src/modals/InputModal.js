import React from 'react'
import {
  Modal,
  TouchableOpacity,
  View,
  Text,
  TextInput,
} from 'react-native'
import {
  ConfirmBtn
} from '../buttons'
import {
  BasicInput
} from '../containers'
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import { ScaledSheet } from 'react-native-size-matters'

function InputModal({ visible, placeholder, typed, value, toggleModal, onInputSaved }) {


  return (
    
        <Modal
          animationType="slide"
          visible={visible}
          transparent={true}
        >
          <TouchableOpacity activeOpacity={1} onPress={toggleModal} style={styles.centeredView}>
            <View style={styles.container}>
              <BasicInput
                placeholder={placeholder}
                typed={typed}
                value={value}
              />
              <ConfirmBtn onPress={onInputSaved} text="Save"/>
            </View>

          </TouchableOpacity>

        </Modal>
  )
}

const styles = ScaledSheet.create({
  container: {  
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: hp('15%')
  },
  centeredView: {
    height: hp('100%'),
    width: wp('100%'),
    // justifyContent: "center",
    alignItems: "center",
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0, .1)'
  }
})

export { InputModal }