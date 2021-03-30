import React, {useState, useEffect} from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native'
import { ScaledSheet } from 'react-native-size-matters'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
const chackmark = require('../../assets/icons/white_checkmark.png')
import moment from 'moment'
import FastImage from 'react-native-fast-image'
import Icons from '@assets/icons'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'

const checkBox = (isChecked) => {
  let checkedStyle = isChecked? {backgroundColor:'#3D6FCB', borderWidth: 0}:{backgroundColor:'#fff'}
  return (
    <View style={[styles.box, checkedStyle]}>
      <Image 
        source={chackmark}
        style={styles.checkmark}
      />
    </View>
  )
}  

function AssignmentCard({ onPress, meeting, index, item, onCommentPress, onOptionsPressed }) {
  const [ showStatus, toggleShowStatus ] = useState(false)
  const [ currentStatus, setCurrentStatus ] = useState('')

  useEffect(() => {
    const userId = auth().currentUser.uid
    const { notStarted, currentlyWorking, hasCompleted } = item

    if (notStarted.includes(userId)) setCurrentStatus('notStarted')
    if (currentlyWorking.includes(userId)) setCurrentStatus('currentlyWorking')
    if (hasCompleted.includes(userId)) setCurrentStatus('hasCompleted')
  }, [item])

  const setStatus = (status) => {
    let user = auth().currentUser

    let notStarted = status==='notStarted'?firestore.FieldValue.arrayUnion(user.uid):firestore.FieldValue.arrayRemove(user.uid)
    let currentlyWorking = status==='currentlyWorking'?firestore.FieldValue.arrayUnion(user.uid):firestore.FieldValue.arrayRemove(user.uid)
    let hasCompleted = status==='hasCompleted'?firestore.FieldValue.arrayUnion(user.uid):firestore.FieldValue.arrayRemove(user.uid)

    firestore()
    .collection('meetings').doc(meeting.id)
    .collection('assignments').doc(item.id)
    .update({
      notStarted: notStarted,
      currentlyWorking : currentlyWorking,
      hasCompleted : hasCompleted,
    }).catch((err) => {
      console.log(err)
    })
  }

  const showOptions = () => {
    let notStartedStyle = currentStatus==='notStarted'?{backgroundColor: '#69A2B0'}:{}
    let notStartedText = currentStatus==='notStarted'?{color: '#fff'}:{}

    let currentlyWorkingStyle = currentStatus==='currentlyWorking'?{backgroundColor: '#69A2B0'}:{}
    let currentlyWorkingText = currentStatus==='currentlyWorking'?{color: '#fff'}:{}

    let hasCompletedStyle = currentStatus==='hasCompleted'?{backgroundColor: '#69A2B0'}:{}
    let hasCompletedText = currentStatus==='hasCompleted'?{color: '#fff'}:{}

    if (showStatus) {
      return (
        <View style={styles.hiddenView}>

          <Text style={styles.completedText}>I have ... this assignment</Text>

          <View style={{marginVertical: hp('2')}}>
            <TouchableOpacity activeOpacity={.5} 
              style={[styles.completedBtn, notStartedStyle]}
              onPress={() => setStatus('notStarted')}
            >
              <Text style={[styles.completeBtnText, notStartedText]}>{`${item.notStarted.length}`} - Not started</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={.5} 
              style={[styles.completedBtn, currentlyWorkingStyle]}
              onPress={() => setStatus('currentlyWorking')}
            >
              <Text style={[styles.completeBtnText, currentlyWorkingText]}>{`${item.currentlyWorking.length}`} - Started working on</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={.5} 
              style={[styles.completedBtn, hasCompletedStyle]}
              onPress={() => setStatus('hasCompleted')}
            >
              <Text style={[styles.completeBtnText, hasCompletedText]}>{`${item.hasCompleted.length}`} - Completed</Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    }
  }

  return (
    <TouchableOpacity 
      activeOpacity={.9}
      onLongPress={() => toggleShowStatus(!showStatus)}
    >
      <View style={styles.container}>
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.details}>{item.description}</Text>
          <View style={styles.separator}/>
          <Text style={styles.dueDate}>Due: {moment.unix(item.dueDate._seconds).format('dddd MMMM Do')}</Text>
          <Text style={styles.dueDate}>({moment.unix(item.dueDate._seconds).fromNow()})</Text>
          <View style={styles.separator}/>
          
          {<Text style={styles.completedText}>[ Tap and Hold {!showStatus?`for more info`:`to hide`} ]</Text>}
            {showOptions()}
          <View style={{flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>

              {item.link?<TouchableOpacity onPress={() => Linking.openURL(item.link)} >
                <Text style={styles.link}>Link</Text>
              </TouchableOpacity>:null}

              {item.file?<TouchableOpacity onPress={() => Linking.openURL(item.file)} >
                <Text style={styles.link}>File</Text>
              </TouchableOpacity>:null}

              {item.picture?<TouchableOpacity onPress={() => Linking.openURL(item.picture)} >
                <Text style={styles.link}>Image</Text>
              </TouchableOpacity>:null}

            </View>

            <View style={{ flexDirection: 'row'}}>
              <TouchableOpacity onPress={onCommentPress} style={styles.commentIcon}>
                <FastImage 
                  source={Icons.messages}
                  style={styles.commentIcon}
                />
              </TouchableOpacity>
              {item.author.id ==auth().currentUser.uid?<TouchableOpacity onPress={() => onOptionsPressed(item)} style={styles.commentIcon}>
                <FastImage 
                  source={Icons.menuDots}
                  style={styles.commentIcon}
                />
              </TouchableOpacity>:null}
            </View>
          </View>

        </View>

      </View>
    </TouchableOpacity>
  )
}

const styles = ScaledSheet.create({
  container: {
    borderRadius: 3,
    backgroundColor: '#fff',
    marginHorizontal: wp('3%'),
    marginVertical: hp('1'),
    shadowOffset: {width: 1, height: 1},
    shadowColor: '#4F6D7A',
    shadowOpacity: .3,
    padding: '15@ms',
    flexDirection: 'row',
  },
  separator: {
    marginVertical: hp('2'),
    marginHorizontal: wp('2'),
    backgroundColor: 'dimgrey',
    height: 1,
  },
  completedContainer: {
    flex: 1,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: wp('4.4'),
    fontFamily: 'OpenSans-Regular',
  },
  link: {
    fontSize: wp('4.4'),
    fontFamily: 'Montserrat-SemiBold',
    color: '#69A2B0',
    marginTop: hp('1'),
    padding: wp('3'),
    paddingBottom: 0,
    textDecorationColor: '#69A2B0',
    textDecorationLine: 'underline',
  },
  details: {
    fontSize: wp('4.4'),
    fontFamily: 'Montserrat-SemiBold',
    color: 'dimgrey',
  },
  dueDate: {
    fontSize: wp('4.2'),
    fontFamily: 'OpenSans-SemiBold',
    color: '#000'
  },
  completedText: {
    fontSize: wp('4.4'),
    fontFamily: 'OpenSans-Regular',
    textAlign: 'center',
  },
  box: {
    width: '30@ms',
    height: '30@ms',
    borderRadius: '5@ms',
    borderColor: 'dimgrey',
    borderWidth: '1@ms',
    justifyContent: 'center',
  },
  commentIcon: {
    width: wp('9'),
    height: wp('9'),
    alignSelf: 'flex-end',
  },
  hiddenView: {
    marginVertical: hp('2')
  },
  completedBtn: {
    borderRadius: 4,
    borderColor: '#69A2B0',
    borderWidth: 1,
    margin: wp('1'),
    marginHorizontal: wp('10')
  }, 
  completeBtnText: {
    color: '#69A2B0',
    margin: wp('2'),
    fontFamily: 'OpenSans-SemiBold',
    textAlign: 'center',
  },
})

export { AssignmentCard }