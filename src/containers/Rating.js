import React, {useState, useEffect} from 'react'
import {
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image'
import Icons from '@assets/icons'

function Rating({ onChangeRating, rating, }) {
  let stars = [1,2,3,4,5]
  return (
    <View style={{
      flexDirection: 'row'
    }}>
      {stars.map((star, i) => {
        return (
        <TouchableOpacity activeOpacity={.8} key={i+1} onPress={() => onChangeRating(i+1)}>
          <FastImage 
            source={rating >= i?Icons.yellowStar:Icons.emptyStar}
            style={{
              width: wp(10),
              height: wp(10),
            }}
          />
        </TouchableOpacity>
      )})}
    </View>
  )
}

export { Rating }