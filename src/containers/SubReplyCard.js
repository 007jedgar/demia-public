import React, {useState} from 'react'
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
} from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp, widthPercentageToDP } from 'react-native-responsive-screen';
import moment from 'moment'
function SubReplyCard({ item, post, currentComment, onPress, onDeepReplyPressed }) {
  if (!item.author || !item.text) return null;


  const renderDetails = () => {
    return (
      <View style={{width: wp('75')}}>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.postAuthor}>{item.author.displayName}</Text>
          <Text style={styles.postAuthor}>{moment(item.timeSent).fromNow()}</Text>

        </View>
        <Text style={styles.postText}>{item.text}</Text>
      </View>
    )
  }

  return (
    <TouchableOpacity 
      onPress={onPress}
      activeOpacity={.8} 
      style={styles.postCard}
    >
      <View style={{flexDirection: 'row', justifyContent: 'space-between',}}>
        <View style={{flexDirection: 'row'}}>

          {renderDetails()}

        </View>
      </View>

    </TouchableOpacity>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  postCard: {
    marginHorizontal: wp('2'),
    marginVertical: hp('1'),
    borderColor: 'dimgrey',
  },
  postAuthor: {
    marginHorizontal: wp('2'),
    fontSize: wp('4'),
    fontFamily: 'Montserrat-MediumItalic',
  },
  postText: {
    color: '#000',
    fontFamily: 'OpenSans-Regular',
    margin: wp(2),
    fontSize: wp('4.3'),
    flex: 1,
  },
  userAvi: {
    width: wp('7'),
    height: wp('7'),
    borderRadius: wp('3.5'),
  },
  isLiked: {
    width: wp('6'),
    height: wp('6'),
    transform: [
      {rotate: '180deg'}
    ]
  },
})

export { SubReplyCard }