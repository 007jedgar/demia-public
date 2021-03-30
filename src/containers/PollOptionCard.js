import React, {useState, useEffect} from 'react'
import {
  View,
  TouchableOpacity,
  Text,
} from 'react-native'
import { ScaledSheet } from 'react-native-size-matters'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import moment from 'moment'

function PollOptionCard({ onPress, isSelected, optionText, poll, index }) {
  if (!optionText) return null
  const [ result, setResult ] = useState('')
  const optionVotes = ['choice1Votes', 'choice2Votes', 'choice3Votes', 'choice4Votes']

  useEffect(() => {
    if (!moment().isBefore(poll.duration)) {
      //get # of votes for option
      let oVotes = poll[optionVotes[index]]
      
      //get total num votes
      let totalVotes = poll.voted.length
      if (totalVotes === 0) {
        return setResult('0')
      }
      
      //devide option's votes by total # of votes 
      let percentage = oVotes / totalVotes
      return setResult(`${percentage.toFixed(2) * 100}`)
    }

    
  }, [])


  return (
    <TouchableOpacity activeOpacity={.7} onPress={onPress}>
      <View style={styles.container}>
        <View style={[styles.resultsBar, {width: isSelected?'100%':'0%'}, result?{width: `${result}%`}:{}]}>
        </View>
          <Text style={styles.textStyle}>{optionText}</Text>
          <Text style={styles.textStyle}>{result?`${result}%`:null}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = ScaledSheet.create({
  container: {
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
    fontSize: '18@ms',
    fontFamily: 'Montserrat-Regular',
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
    backgroundColor: '#69A2B0',
    position: 'absolute'
  },
})


export { PollOptionCard }