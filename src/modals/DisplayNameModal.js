import React, {useState, useEffect, useRef } from 'react'
import {
  Modal,
  Text,
  TouchableOpacity,
  SafeAreaView,
  View,
  TextInput,
} from 'react-native'
import { 
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
import { ScaledSheet } from 'react-native-size-matters'
import auth from '@react-native-firebase/auth'


function DisplayNameModal({ visible, closeModal, onCancel, onAccept }) {
  const [ newName, setNewName ] = useState('')
  const [ oldName, setOldNameStatic ] = useState('New Display Name')
  const inputRef = useRef(null)

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onShow={() => {
        setNewName('')
        inputRef.current.focus()
      }}
    >
      <View activeOpacity={0}  style={styles.background}>
       
        <View style={styles.container}>
          <TextInput 
            ref={inputRef}
            placeholderTextColor="#C0D6DF"
            placeholder={oldName}
            value={newName}
            onChangeText={setNewName}
            style={styles.input}
            maxLength={25}
          />

          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <TouchableOpacity onPress={onCancel} style={styles.btn}>
              <Text style={styles.option}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onAccept(newName)} disabled={!newName} style={styles.btn}>
              <Text style={styles.option}>Ok</Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>
    </Modal>
  )
}


const styles = ScaledSheet.create({
  background: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.3)',
    // justifyContent: 'center',
  },
  container: {
    marginTop: hp('20'),
    marginHorizontal: wp('10'),
    backgroundColor: '#fff',
    borderBottomRightRadius: 4,
    borderBottomLeftRadius: 4,
  },
  input: {
    color: '#000',
    margin: wp('3'),
    fontSize: wp('5'),
    textAlign: 'center'
  },
  btn: {
    marginVertical: wp('5'),
    padding: wp('2'),
    flex: 1
  },
  option: {
    fontFamily: 'Montserrat-Regular',
    fontSize: wp('5'),
    color: '#000',
    textAlign: 'center',
  },
})

export { DisplayNameModal }