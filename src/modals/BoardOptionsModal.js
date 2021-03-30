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

function BoardOptionsModal({ visible, onToggleModal, comment, onDeletePost, onEditPost  }) {

  const onEdit = () => {
    onEditPost()
    onToggleModal()
  }
  const onDelete = () => {
    onDeletePost()
    onToggleModal()
  }
  const onReport = () => {

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
        onPress={onToggleModal}  
        style={styles.background}
      >
        <SafeAreaView style={styles.container}>

          {auth().currentUser.uid ===comment.senderId?(<View>
            {/* <TouchableOpacity onPress={onEdit} style={styles.optionCard}>
            <Text style={styles.optionText}>Edit</Text>
          </TouchableOpacity> */}
          <TouchableOpacity onPress={onDelete} style={styles.optionCard}>
            <Text style={styles.optionText}>Delete</Text>
          </TouchableOpacity></View>):null}

          {/* <TouchableOpacity onPress={onReport} style={styles.optionCard}>
            <Text style={styles.optionText}>Report</Text>
          </TouchableOpacity> */}

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

export { BoardOptionsModal }