import React, {useState, useEffect} from 'react'
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


function TotalModal({ visible, toggleModal, onCancel, onAccept, currentPrice, }) {
  const [ newPrice, setNewPrice ] = useState('')
  const [ oldName, setOldNameStatic ] = useState(currentPrice.toString())
  

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onShow={() => {
        setNewPrice('')
      }}
    >
      <View activeOpacity={0}  style={styles.background}>
       
        <View style={styles.container}>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <Text style={styles.cash}>$</Text>
            <TextInput 
              placeholderTextColor="#C0D6DF"
              placeholder={oldName}
              value={newPrice}
              onChangeText={setNewPrice}
              style={styles.input}
              maxLength={25}
            />
          </View>

          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <TouchableOpacity onPress={onCancel} style={styles.btn}>
              <Text style={styles.option}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onAccept(newPrice)} disabled={!newPrice} style={styles.btn}>
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
    justifyContent: 'center',
  },
  container: {
    marginHorizontal: wp('10'),
    backgroundColor: '#fff',
    borderBottomRightRadius: 4,
    borderBottomLeftRadius: 4,
  },
  input: {
    color: '#000',
    margin: wp('3'),
    marginLeft: wp('1'),
    fontSize: wp('5'),
    textAlign: 'center',
    fontFamily: 'OpenSans-Regular'
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
  cash: {
    color: '#454545',
    margin: wp('3'),
    marginRight: 0,
    fontSize: wp('5'),
    textAlign: 'center',
    fontFamily: 'OpenSans-Regular'
  },
})

export { TotalModal }