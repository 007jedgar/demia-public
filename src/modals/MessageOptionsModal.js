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
import firestore from '@react-native-firebase/firestore'
import * as RootNavigation from '../RootNavigation'

function MessageOptionsModal({ visible, onToggleModal, item, userBlocked, subject, meeting }) {

  const onDelete = () => {
    
    onToggleModal()
  }
  
  const onReport = () => {

    onToggleModal()
  }

  const onMute = () => { 

    onToggleModal()
  }

  const onBlock = async () => {
    try {
      const user = auth().currentUser
      console.log('blocking...')
  
      await firestore().collection('meetings').doc(meeting.id)
      .collection('current_attendance').doc(user.uid)
      .collection('blocked_users').doc(item.id)
      .set(item)
  
      await firestore().collection('meetings').doc(meeting.id)
      .collection('current_attendance').doc(user.uid)
      .update({
        blockedUserIds: firestore.FieldValue.arrayUnion(item.id)
      })
  
      onToggleModal()

      setTimeout(() => {
        RootNavigation.goBack()
      }, 50)

    } catch(err) {
      console.log(err)
      alert('An error has ocurred')
      onToggleModal()
    }
  }

  return (
    <Modal
        animationType="fade"
        visible={visible}
        transparent={true}
      >
      <TouchableOpacity 
        activeOpacity={0} 
        onPress={onToggleModal}  
        style={styles.background}
      >
        <SafeAreaView style={styles.container}>

          {subject ==='current_attendance'?<TouchableOpacity activeOpacity={0} onPress={onReport} style={styles.optionCard}>
            <Text style={styles.optionText}>Mute Conversation</Text>
          </TouchableOpacity>:null}
          
         {subject ==='current_attendance'?<TouchableOpacity activeOpacity={0} onPress={onDelete} style={styles.optionCard}>
            <Text style={styles.optionText}>Delete Conversation</Text>
          </TouchableOpacity>:null}
          
          {/* <TouchableOpacity activeOpacity={0} onPress={onReport} style={styles.optionCard}>
            <Text style={styles.optionText}>Report</Text>
          </TouchableOpacity> */}

          {!item.type?<TouchableOpacity activeOpacity={0} onPress={onBlock} style={styles.optionCard}>
            <Text style={styles.optionText}>Block User</Text>
          </TouchableOpacity>:null}

        </SafeAreaView>
      </TouchableOpacity>
    </Modal>
  )
}

const styles = ScaledSheet.create({
  background: {
    height: hp('100'),
    backgroundColor: 'rgba(0,0,0,.4)',
    justifyContent: 'center',
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: wp('1'),
    shadowOffset: {width: 3, height: 3},
    shadowColor: '#393939',
    shadowOpacity: .3,
    margin: wp('10')
  },  
  optionCard: {
    height: hp('5'),
    marginVertical: hp('2'),
    marginHorizontal: wp('5'),
    justifyContent: 'center',
  },
  optionText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: wp('4'),
  },
})

export { MessageOptionsModal }