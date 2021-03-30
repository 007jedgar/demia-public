import React from 'react'
import {
  View,
  Text,
  StyleSheet
} from 'react-native'

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen'

function EmptyAssignmentCard(props) {
  const { container, line, text, longText, mediumText, blueText } = styles
  return (
    <View style={container}>
      <View style={text}/>
      <View style={line}/>
      <View style={longText}/>
      <View style={mediumText}/>
      <View style={longText}/>
      <View style={line}/>
      <Text style={blueText}>There are no timely assignments</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 3,
    backgroundColor: '#fff',
    marginHorizontal: wp('3%'),
    marginVertical: hp('1'),
    shadowOffset: {width: 1, height: 1},
    shadowColor: '#393939',
    shadowOpacity: .1,
    padding: wp('3'),
    // height: hp('20')
    // flexDirection: 'row',    
  },
  text: {
    backgroundColor: 'dimgrey',
    height: hp('1.2'),
    width: wp('20'),
  },
  longText: {
    backgroundColor: '#C7E2E4',
    height: hp('1.2'),
    width: wp('80'),
    marginVertical: hp('1'),
  },
  mediumText: {
    backgroundColor: 'dimgrey',
    height: hp('1.2'),
    width: wp('60'),
    marginVertical: hp('1'),
  },
  line: {
    backgroundColor: 'dimgrey',
    height: 1,
    width: '100%',
    marginVertical: hp('1')
  },
  blueText: {
    fontSize: wp('4.4'),
    fontFamily: 'Montserrat-SemiBold',
    color: '#69A2B0',
    marginTop: hp('1'),
    margin: wp('3'),
    paddingBottom: 0,
  },
})

export {EmptyAssignmentCard}