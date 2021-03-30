import React from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image'
import Icons from '@assets/icons'


function MentorCard({ onPress, item }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={.8}>
      <View style={styles.contianer}>
        
        <View style={styles.left}>
          <FastImage 
            source={item.profilePic?{uri: item.profilePic}:Icons.avatar}
            style={{
              width: wp('25'),
              height: wp('25'),
              borderRadius: 3,
              marginRight: wp('2'),
            }}
          />
          
        </View>

        <View style={styles.right}>
          <View style={{flexDirection: 'row', marginRight: wp('10')}}>
            <Text style={styles.ratingQuality}>{item.name}</Text>
            <View style={{width: wp(2)}}/>
            <FastImage 
              source={Icons.yellowStar}
              style={{
                width: wp('5'),
                height: wp('5'),
                alignSelf: 'center',
                marginRight: wp('2')
              }}            
            />
            <Text style={styles.ratingQuality}>{item.rating.toFixed(1)} <Text style={styles.ratingQuantity}>({item.ratingNum})</Text></Text>
          </View>
            
          <View style={{marginVertical: wp(1)}}>
            <Text style={styles.avail}>{item.school}</Text>
          </View>

          <Text numberOfLines={3} style={styles.toh}>{item.description}</Text>
        </View>
        
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  contianer: {
    margin: wp('2'),
    padding: wp('2'),
    borderRadius: 4,
    backgroundColor: '#fff',
    shadowColor: '#81B29A',
    shadowOffset: { x: 1, y:2},
    shadowRadius: 3,
    shadowOpacity: .6,
    elevation: 1,
    flexDirection: 'row',
  },
  top: {
    flexDirection: 'row',
  },
  right: {
    flex: 1,
  },
  ratingQuality: {
    alignSelf: 'center',
    fontFamily: 'Montserrat-Bold',
    fontSize: wp('3.5'),
    color: 'dimgrey',
  },
  ratingQuantity: {
    alignSelf: 'center',
    fontFamily: 'Montserrat-Regular',
    fontSize: wp('3.5'),
    color: 'dimgrey',
  },
  toh: {
    flex: 1,
    fontFamily: 'Montserrat-Regular',
    fontSize: wp('4'),
    color: '#454545',
  },
  avail: {
    fontFamily: 'OpenSans-Regular',
    fontSize: wp('3.7'),
    color: 'dimgrey',
  },
})

export {MentorCard}