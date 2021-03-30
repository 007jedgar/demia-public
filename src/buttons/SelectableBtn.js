import React, { useState, useEffect } from 'react'
import {
  FlatList,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Modal,
  StyleSheet,
  SafeAreaView,
} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';


function SelectableBtn({ selected, option, textStyle, onPress }) {

  return (
    <TouchableOpacity 
      onPress={onPress}
      style={
        [styles.selectableBtn, {borderColor: selected?'#39827E':'#000'}]
      }
    >
      <Text style={[styles.text, {color: selected?'#39827E':'#000'}, textStyle]}>{option}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  selectableBtn: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#000',
    marginHorizontal: wp('1'),
    marginVertical: wp('1'),
  },
  text: {
    fontSize: wp('4.5'),
    fontFamily: 'Montserrat-Regular',
    color: '#000',
    margin: wp('1'),
    // alignSelf: 'center',
    textAlign: 'center',
  },
})

export {SelectableBtn}