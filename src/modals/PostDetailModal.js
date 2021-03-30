import React from 'react'
import {
  Modal,
  View,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {
  ScaledSheet
} from 'react-native-size-matters'

function PostDetailModal({img, title, description, modalVisible, closeModal, onLeave, onShare }) {
  return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}    
      >
        <TouchableOpacity 
          activeOpacity={0} 
          onPress={closeModal}  
          style={styles.overlay}
        >
          <SafeAreaView style={styles.bla}>
            <View style={styles.bla}>
              <Image 
                style={styles.headerImg}
                source={img}
              />

              <Text style={styles.title}>{title}</Text>

              {/* <TouchableOpacity
                style={styles.optionCard}
                onPress={onShare}
              >
                <Text style={styles.option}>Share Classroom</Text>
              </TouchableOpacity> */}

              <TouchableOpacity
                style={styles.optionCard}
                onPress={onLeave}
              >
                <Text style={styles.option}>Leave Classroom</Text>
              </TouchableOpacity>

            </View>
          </SafeAreaView>
        </TouchableOpacity>
      </Modal>
  )
}

const styles = ScaledSheet.create({
  overlay: {
    height: hp('100'),
    flexDirection: 'row',
  },
  bla: {
    alignSelf: 'flex-end',
    width: wp('100'),
    height: hp('30%'),
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 2,
  },
  title: {
    fontFamily: 'Montserrat-Medium',
    fontSize: wp('5'),
    textAlign: 'center',
    marginVertical: hp('2')
  },
  optionCard: {
    // backgroundColor: '#f1f1f1',
    padding: wp('3'),
  },
  option: {
    fontSize: wp('5'),
    marginVertical: wp('2'),

  },
})

export {PostDetailModal}