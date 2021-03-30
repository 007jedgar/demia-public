import React from 'react'
import {
  Modal,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  SafeAreaView,
} from 'react-native'
import {
 widthPercentageToDP as wp,
 heightPercentageToDP as hp,
} from 'react-native-responsive-screen'

function TaMessengerModal({ toggleModal, visible, request, block, report }) {
  return (
    <Modal
      visible={visible}
      transparent={true}
    >
      <SafeAreaView style={{flex: 1}}>

        <TouchableOpacity style={styles.container} activeOpacity={0} onPress={toggleModal}>
          <View style={styles.modal}>
            {/* <TouchableOpacity style={styles.btn}>
              <Text style={styles.btnText}>Create a request</Text>
            </TouchableOpacity> */}
            <TouchableOpacity onPress={block} style={styles.btn}>
              <Text style={styles.btnText}>Block</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={report} style={styles.btn}>
              <Text style={styles.btnText}>Report</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,.2)'
  },
  modal :{
    backgroundColor: '#fff',
    padding: wp('4'),
    paddingVertical: hp(3),
  },
  btn: {
    padding: wp('3'),
  },
  btnText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: wp('4.5'),
    color: '#454545'
  },
})

export { TaMessengerModal }