import React, { useEffect, useState, } from 'react'
import {
  Modal,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native'
import { 
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
import { ScaledSheet } from 'react-native-size-matters'
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'

function UserOptionsModal({ visible, onToggleModal, meeting, item, profile }) {
  const [ blockedUserIds, setBlockedUsersIds ] = useState([])

  useEffect(() => {
    const user = auth().currentUser
    console.log(profile)
    firestore().collection('meetings').doc(meeting.id)
    .collection('current_attendance').doc(user.uid)
    .get().then((doc) => {
      let { blockedUserIds } = doc.data()
      if (!blockedUserIds) return setBlockedUsersIds([])

      setBlockedUsersIds(blockedUserIds)
      console.log(blockedUserIds)
    }).catch((err) => {
      console.log(err)
    })
  }, [])

  const optionPressed = () => {
    onToggleModal()
  }
  

  const onBlock = async () => {
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
  }

  const onUnbock = async () => {
    const user = auth().currentUser
    console.log('unblocking...')

    await firestore().collection('meetings').doc(meeting.id)
    .collection('current_attendance').doc(user.uid)
    .collection('blocked_users').doc(item.id)
    .delete()

    await firestore().collection('meetings').doc(meeting.id)
    .collection('current_attendance').doc(user.uid)
    .update({
      blockedUserIds: firestore.FieldValue.arrayRemove(item.id)
    })    

    onToggleModal()
  }

  const addAdmin = async () => {
    
    await firestore()
    .collection('meetings').doc(meeting.id)
    .update({
      admins: firestore.FieldValue.arrayUnion(item.id)
    })

    await firestore().collection('meetings').doc(meeting.id)
    .collection('current_attendance').doc(item.id)
    .update({
      admin: true
    })    

    onToggleModal()
  }

  return (
    <Modal
        animationType="slide"
        visible={visible}
        transparent={true}
      >
      <TouchableOpacity 
        activeOpacity={.9} 
        onPress={optionPressed}  
        style={styles.background}
      >
        <SafeAreaView style={styles.container}>

          <TouchableOpacity onPress={() => {
            if (blockedUserIds.includes(item.id)) return onUnbock()
            onBlock()
          }} style={styles.optionCard}>
            <Text style={styles.optionText}>{blockedUserIds.includes(item.id)?'Unblock':'Block'}</Text>
          </TouchableOpacity>
          
          {profile.admin && !item.admin?<TouchableOpacity onPress={addAdmin} style={styles.optionCard}>
            <Text style={styles.optionText}>Add as admin</Text>
          </TouchableOpacity>:null}

        </SafeAreaView>
      </TouchableOpacity>
    </Modal>
  )
}

const styles = ScaledSheet.create({
  background: {
    height: hp('100'),
    flexDirection: 'row',
  },
  container: {
    alignSelf: 'flex-end',
    width: wp('100'),
    backgroundColor: '#fff',
    borderRadius: wp(5),
    shadowOffset: {width: 3, height: 3},
    shadowColor: '#393939',
    shadowOpacity: .3,
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

export { UserOptionsModal }