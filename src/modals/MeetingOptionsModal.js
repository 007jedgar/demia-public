import React from 'react'
import {
  Modal,
  Text,
  TouchableOpacity,
  SafeAreaView,
  View,
} from 'react-native'
import { 
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
import { ScaledSheet } from 'react-native-size-matters'
import auth from '@react-native-firebase/auth'


function MeetingOptionsModal({ visible, closeModal, onLeave, onSettings, onChangeName, onBlockedUsers, profile,  }) {

  return (
    <Modal
      visible={visible}
      transparent={true}
    >
      <TouchableOpacity activeOpacity={0} onPress={closeModal} style={styles.background}>
        <View style={styles.container}>
          {/* <TouchableOpacity onPress={onLeave} style={styles.btn}>
            <Text style={styles.option}>Back to boards</Text>
          </TouchableOpacity> */}
          {profile.admin?<TouchableOpacity onPress={onSettings} style={styles.btn}>
            <Text style={styles.option}>Admin</Text>
          </TouchableOpacity>:null}
          <TouchableOpacity onPress={onBlockedUsers} style={styles.btn}>
            <Text style={styles.option}>Blocked users</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onChangeName} style={styles.btn}>
            <Text style={styles.option}>Change display name</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
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
  btn: {
    paddingVertical: wp('4'),
    paddingHorizontal: wp('2')
  },
  option: {
    fontFamily: 'Montserrat-Regular',
    fontSize: wp('5'),
    color: '#000',
  },
})
export {MeetingOptionsModal}