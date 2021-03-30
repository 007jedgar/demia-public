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


function CommentOptionsModal({ visible, onReportPost, onToggleModal, onCopyText, comment, onDeletePost, onEditPost, meeting  }) {

  const onEdit = () => {
    onEditPost()
    onToggleModal()
  }
  const onDelete = () => {
    onDeletePost()
    onToggleModal()
  }
  const onReport = () => {
    onReportPost()
    onToggleModal()
  }

  // console.log(comment)

  const blockUser = async () => {
    try {
      const user = auth().currentUser
      let item = comment.author
      console.log('blocking...', item.id)
  
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

    } catch(err) {
      console.log(err)
      alert('An error has ocurred')
      onToggleModal()
    }
  }

  
  return (
    <Modal
        animationType="slide"
        visible={visible}
        transparent={true}
      >
      <TouchableOpacity 
        activeOpacity={.9} 
        onPress={onToggleModal}  
        style={styles.background}
      >
        <SafeAreaView style={styles.container}>

          {auth().currentUser.uid ==comment.author.id?<TouchableOpacity onPress={onDelete} style={styles.optionCard}>
            <Text style={styles.optionText}>Delete</Text>
          </TouchableOpacity>:null}

          <TouchableOpacity onPress={onCopyText} style={styles.optionCard}>
            <Text style={styles.optionText}>Copy Text</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity onPress={onReport} style={styles.optionCard}>
            <Text style={styles.optionText}>Report</Text>
          </TouchableOpacity> */}
          
          {auth().currentUser.uid !==comment.author.id?<TouchableOpacity onPress={() => blockUser()} style={styles.optionCard}>
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

export { CommentOptionsModal }