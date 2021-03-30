import React from 'react'
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet
} from 'react-native'
import FastImage from 'react-native-fast-image'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen'

function MentionsCard({ item, onPress }) {
  
  
  return (
    <TouchableOpacity style={styles.mentionContainer} onPress={() => onPress(item)}>

      <Text style={styles.mentionUsername}> {item.username} </Text>
      <Text style={styles.mentionName}> {item.name} </Text>

    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  img: {
    width: wp('8'),
    height: wp('8'),
    borderRadius: wp('4')
  },
  mentionUsername: {
    margin: wp(1),
    color: '#000',
    fontSize: wp('3'),
    fontFamily: 'Montserrat-SemiBold', 
  },
  mentionName: {
    marginHorizontal: wp(1),
    color: 'dimgrey',
    fontSize: wp('3'),
    fontFamily: 'Montserrat-SemiBold', 
  },
  mentionContainer: {
    marginLeft: wp('2'),
    paddingVertical: hp('1'),
    flexDirection: 'row'
  },
  mentionsCard: {
    backgroundColor: '#C0D6DF',
    borderRadius: 5,
    margin: wp('2'),
    marginLeft: wp('4'),
  },
})

export { MentionsCard }