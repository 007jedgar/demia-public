import React, { useState, useEffect } from 'react'
import {
  SafeAreaView,
  Modal,
  TouchableOpacity,
  View,
  Text,
} from 'react-native'
import { ScaledSheet } from 'react-native-size-matters'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
import auth from '@react-native-firebase/auth'

function DMOptionsModal({ visible, mutedBy, closeModal }) {

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
    >
      <SafeAreaView style={{flex: 1}}>
        <TouchableOpacity 
          onPress={closeModal}
          activeOpacity={0}
          style={styles.container}
        >
          
          <View style={styles.card}>
            
            <TouchableOpacity style={styles.block}>
              <Text style={styles.text}>{mutedBy.includes(auth().currentUser.uid)?'Unmute':'Mute'} Notification</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.block}>
              <Text style={styles.text}>Delete Conversation</Text>
            </TouchableOpacity>
          
          </View>

        </TouchableOpacity>
      </SafeAreaView>
    </Modal>
  )
}

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,.4)',
    
  },
  card: {
    backgroundColor: '#fff',
    alignSelf: 'center',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    padding: wp('6')
  },
  block: {
    marginVertical: hp('1')
  }, 
  report: {

  },
  mute: {

  },
  text: {
    fontFamily: 'OpenSans-Regular',
    fontSize: wp('5'),
    color: '#565656',
    marginVertical: hp('2')
  },
})

export { DMOptionsModal }