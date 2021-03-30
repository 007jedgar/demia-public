import React from 'react'
import {
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen'

function DangerBtn({ onPress, text, }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.deleteBtn}>
      <Text style={styles.delete}>{text}</Text>
    </TouchableOpacity>
  )
}


const styles = StyleSheet.create({
  deleteBtn: {
    
    borderRadius: 4,
    borderColor: '#D85531',
    borderWidth: 1, 
    marginHorizontal: wp('9'),
    marginVertical: hp('1'),
    padding: wp('2'),
    backgroundColor: '#fff',
    shadowColor: '#D85531',
    shadowRadius: 2,
    shadowOffset: { width: 1, height: 1},
    shadowOpacity: .3,
  },
  delete: {
    color: '#D85531',
    fontFamily: 'Montserrat-Regular',
    fontSize: wp('4.5'),
    alignSelf: 'center',
  },
})

export { DangerBtn }