import React, { useState } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  Modal,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView
} from 'react-native'

import {
  BasicInput1,
  
} from '../containers'
import {
  XBtn,
  SelectableBtn,
} from '../buttons'

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';


function FiltersModal({ visible, onToggle, searchWith }) {
  const [ keywords, setkeywords] = useState('')
  const [ lowestRating, setLowestRating ] = useState([ true, false, false, false ])


  const searchWithFacets = () => {
    let stars = 0
    lowestRating.forEach((rating, i) => {
      if (rating) { 
        stars = i + 1 
      }
    })
    searchWith({ keywords, lowestRating: stars })
  }

  const handleLowestRating = (star) => {
    let lr = lowestRating.map((r, i) => {
      r = false
      if (i == star) {
        r = true
      }
      return r
    })
    setLowestRating(lr)
  }

  return (
    <Modal
      animationType="slide"
      visible={visible}
    >
      <SafeAreaView style={{flex: 1}}>
        <KeyboardAvoidingView style={{flex: 1}}>

          <View style={{flexDirection: 'row', marginBottom: hp(1)}}>
            <XBtn onPress={onToggle}/>
            <Text style={styles.header}>Filter</Text>
          </View>

          
          <Text style={styles.optionsText}>Key words</Text>
          <BasicInput1 
            placeholder="College apps, essay edits, tutoring..."
            value={keywords}
            onChangeText={setkeywords}
          />
          
          {/* 
          <Text style={styles.optionsText}>Current Availability</Text>
          <View style={{flexDirection: 'row', marginLeft: wp('5'), marginVertical: hp(1)}}>
            <SelectableBtn selected={true} option="Any"/>
            <SelectableBtn selected={false} option="Now"/>
          </View> */}

          {/* <Text style={styles.optionsText}>Location</Text>
          <View style={{flexDirection: 'row', marginLeft: wp('5'), marginVertical: hp(1)}}>
            <SelectableBtn selected={true} option="Any"/>
            <SelectableBtn selected={false} option="< 5 mi"/>
            <SelectableBtn selected={false} option="< 10 mi"/>
            <SelectableBtn selected={false} option="< 25 mi"/>
          </View> */}

          <Text style={styles.optionsText}>Lowest Rating</Text>
            <View style={{flexDirection: 'row', marginLeft: wp('5'), marginVertical: hp(1)}}>
              <SelectableBtn onPress={() => handleLowestRating(0)} selected={lowestRating[0]} option="1 star"/>
              <SelectableBtn onPress={() => handleLowestRating(1)} selected={lowestRating[1]} option="2 stars"/>
              <SelectableBtn onPress={() => handleLowestRating(2)} selected={lowestRating[2]} option="3 stars"/>
              <SelectableBtn onPress={() => handleLowestRating(3)} selected={lowestRating[3]} option="4 stars"/>
            </View>

          <View style={{marginTop: hp('5')}}/>
          
          <TouchableOpacity onPress={searchWithFacets} style={styles.searchBtn}>
            <Text style={styles.searchBtnText}>Search</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>

      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  header: {
    fontSize: wp('6'),
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
    color: 'dimgrey',
    position: 'absolute',
    alignSelf: 'center',
    left: wp('42')
  },
  searchBtn: {
    margin: wp('2'),
    marginHorizontal: wp('8'),
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#000',
  },
  optionsText: {
    fontSize: wp('5'),
    fontFamily: 'Montserrat-Regular',
    color: '#000',
    marginLeft: wp('5'),
    marginTop: wp('5')
  },  
  searchBtnText: {
    fontSize: wp('5'),
    fontFamily: 'Montserrat-Regular',
    textAlign: 'center',
    color: '#000',
    alignSelf: 'center',
    margin: wp('2'),

  },
})

export { FiltersModal }