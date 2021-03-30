import React from 'react'
import {
  View,
  TouchableOpacity,
  Text,
} from 'react-native'
import { ScaledSheet } from 'react-native-size-matters'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'


function EmptyPoll() {

  return (
    <View style={styles.container}>
      <View style={styles.pollText} />

        <View style={styles.pollContainer}>
          <View style={[styles.resultsBar, {width: '60%'}]} />
          <View style={styles.textStyle} />
        </View>
        <View style={styles.pollContainer}>
          <View style={[styles.resultsBar, {width: '10%'} ]} />
          <View style={styles.textStyle} />
        </View>
        <View style={styles.pollContainer}>
          <View style={[styles.resultsBar, {width: '30%'}]} />
          <View style={styles.textStyle} />
        </View>

      <TouchableOpacity activeOpacity={.9} style={styles.voteBtn}>
        <Text style={styles.noPolls}>There are currently no polls</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = ScaledSheet.create({
  container: {
    marginVertical: '20@ms',
  },
  pollContainer: {
    marginVertical: '5@ms',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: wp('80%'),
    height: hp('6%'),
    alignSelf: 'center',
    backgroundColor: '#D3D1D1',
    alignSelf: 'center',
  },
  textStyle: {
    backgroundColor: 'dimgrey',
    height: hp('3'),
    alignSelf: 'center',
    marginLeft: '5@ms',
    marginRight: '5@ms',
  }, 
  resultsBar: {
    marginVertical: '5@ms',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    height: hp('6%'),
    alignSelf: 'center',
    backgroundColor: '#C7E2E4',
    position: 'absolute'
  },
  pollText: {
    width: '92%',
    height: hp('3'),
    backgroundColor: '#c2c2c2',
    alignSelf: 'center',
  },
  voteBtn: {
    backgroundColor: '#69A2B0',
    width: wp('80%'),
    height: hp('5%'),
    borderRadius: '5@ms',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: '10@ms',
  },
  noPolls: {
    color: '#fff',
    textAlign: 'center',
    fontSize: wp('4'),
    fontFamily: 'Montserrat-Bold'
  },
})

export { EmptyPoll }