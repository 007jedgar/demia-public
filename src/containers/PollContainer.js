import React, {useState, useEffect} from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  FlatList,
} from 'react-native'
import { ScaledSheet } from 'react-native-size-matters'
import { PollOptionCard } from './PollOptionCard'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import moment from 'moment'
import {includes} from 'lodash'
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import Icons from '@assets/icons'
import FastImage from 'react-native-fast-image'
import * as RootNavigation from '../RootNavigation';

function PollContainer({ poll, voteOnPoll, showOptions }) {
  const [ newPoll, setPoll ] = useState(poll) 
  const [ hasVoted, setVoted ] = useState(false) 
  const [ selectedIndex, setSelectedIndex ] = useState(poll) 
  const [ optionSelected, isOptionSelected ] = useState(false) 

  useEffect(() => {
    if (includes(poll.voted, auth().currentUser.uid)) {
      setVoted(true)
    }

  }, [poll])

  const onVote = () => {
    if (!optionSelected) return alert('Please select an option')
    const userId = auth().currentUser.uid
    let optionVotes = ['choice1Votes', 'choice2Votes', 'choice3Votes', 'choice4Votes']    
    let optionVote = optionVotes[selectedIndex]

    let vote = {
      [optionVote]: firestore.FieldValue.increment(1),
      voted: firestore.FieldValue.arrayUnion(userId),
      voters: firestore.FieldValue.increment(1),
    }

    voteOnPoll(vote)
  }

  const onSelectOption = (item, index) => {
    if (!moment().isBefore(poll.duration)) return console.log('expired')

    var np = {...newPoll}
    np.options.map((p) => {
      p.isSelected = false
    })
    let option = {...item}
    option.isSelected = !option.isSelected 
    np.options[index] = option
    

    setPoll({...np})
    setSelectedIndex(index)
    isOptionSelected(true)
  }

  return (
    <View style={styles.container}>

      <Text style={styles.pollText}>{poll.question}</Text>

      <FlatList 
        showsVerticalScrollIndicator={false}
        data={newPoll.options}
        renderItem={({item, index}) => (
          <PollOptionCard 
            onPress={() => onSelectOption(item, index)} 
            isSelected={item.isSelected}
            optionText={item.statement}
            poll={poll} 
            index={index}
          />         
        )}
        keyExtractor={(item) => item.statement.toString()}
      />

      <View style={styles.infoContainer}>
        <View >
          <Text style={styles.exp}>{poll.voted.length} voted</Text>
          <Text style={styles.exp}>Expire{moment().isBefore(poll.duration)?'s':'d'} {moment(poll.duration).fromNow()}</Text>
        </View>

        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={() => RootNavigation.navigate('feedThread', {subject: 'polls_thread', subjectDoc: {...poll, type: 'polls'} })}>
            <FastImage  
              source={Icons.messages}
              style={styles.commentIcon}
            />
          </TouchableOpacity>

          {poll.author.id==auth().currentUser.uid?<TouchableOpacity onPress={() => showOptions(poll)}>
            <FastImage  
              source={Icons.menuDots}
              style={styles.commentIcon}
            />
          </TouchableOpacity>:null}
        </View>
      </View>

      {moment().isBefore(poll.duration)?<TouchableOpacity disabled={hasVoted} onPress={onVote} style={[styles.voteBtn, {backgroundColor: hasVoted?'dimgrey':'#69A2B0'}]}>
        <Text style={styles.voteText}>{hasVoted?'Voted!':'Vote'}</Text>
      </TouchableOpacity>:null}

      {/* {moment().isBefore(poll.duration)?<TouchableOpacity 
        onPress={poll.subscribers.includes(auth().currentUser.uid)?onUnsubscribe:onSubscribe}>
        <Text style={styles.sub}>{poll.subscribers.includes(auth().currentUser.uid)?`Subscribed!`:`Subscribe to updates`}</Text>
      </TouchableOpacity>:null} */}

    </View>
  )
}

const styles = ScaledSheet.create({
  container: {
    marginVertical: '20@ms',
  },
  pollText: {
    fontFamily: 'Menlo-Bold',
    fontSize: '19@ms',
    textAlign: 'center',
    width: '92%',
    alignSelf: 'center',
  },
  voteBtn: {
    backgroundColor: '#5C6AC4',
    width: wp('80%'),
    height: hp('5%'),
    borderRadius: '5@ms',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: '10@ms',
  },
  voteText: {
    color: '#fff',
    alignSelf: 'center',
    fontSize: '19@ms',
    fontFamily: 'Arial',
    fontWeight: '600'
  },
  exp: {
    // textAlign: 'center',
    marginLeft: wp('10'),
    color: 'dimgrey',
    fontSize: wp('4'),
  },
  commentIcon: {
    width: wp('9'),
    height: wp('9'),
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: wp('10')
  },
  sub: {
    fontSize: wp('4.4'),
    fontFamily: 'Montserrat-SemiBold',
    color: '#2A93F3',
    marginTop: hp('1'),
    padding: wp('3'),
    paddingBottom: 0,
    textAlign: 'center',
  },
})

export { PollContainer }