import React from 'react'
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

function StreamOptionsModal({ visible, onToggleModal, onDelete }) {

  const optionPressed = () => {
    onToggleModal()
  }

  const onDetailsPressed = () => {

    onDelete()
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

          <TouchableOpacity onPress={onDetailsPressed} style={styles.optionCard}>
            <Text style={styles.optionText}>Delete</Text>
          </TouchableOpacity>

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

export { StreamOptionsModal }