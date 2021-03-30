import React, { useState, useEffect } from 'react'
import {
  FlatList,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native'

import { Block, } from '../../common'
import { BoardCard } from '../../containers'
import { PostDetailModal } from '../../modals'
import {
  AddBtn,
} from '../../buttons'
import {
  EmptyBoardCard
} from '../../emptyOrError'
import * as RootNavigation from '../../RootNavigation';

import { ScaledSheet } from 'react-native-size-matters'
import { connect } from 'react-redux'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'

import FastImage from 'react-native-fast-image'


function Boards(props) {
  const [ modalInfo, setModalInfo ] = useState({})
  const [ modalVisible, toggleModal ] = useState(false)
  const [ meetings, setMeetings ] = useState([])
  const [ isLoading, toggleLoading ] = useState(false)
  const [ currentBoard, setBoard ] = useState({ })

  useEffect(() => {
    const user = auth().currentUser

    let unsubscribe = firestore()
    .collection('users').doc(user.uid)
    .collection('meetings').onSnapshot((querySnap) => {
      if (querySnap.empty) {
        toggleLoading(false)
        return setMeetings([])
      }

      let meetings = []
      querySnap.forEach((doc) => {
        meetings.push({ ...doc.data(), id: doc.id })
      })
      setMeetings(meetings)
    }, () => {
      toggleLoading(false)
      setMeetings([])
    })

    return () => unsubscribe
  }, [])


  const onBoardPressed = (item) => {
    let doc = item.doc

    RootNavigation.navigate('meeting', {
      screen: 'stream',
      params: {
        doc: doc,
      },
    })
  }

  const deleteClassroom = (meeting) => {
    try {
      
    } catch(err) {

    }
  }

  const onLeaveClassroom = async (meeting) => {
    const user = auth().currentUser 
    try {

      let members = await meeting.doc
      .collection('current_attendance').get()

      let groupProfile = await meeting.doc
      .collection('current_attendance')
      .get()

      let admins = []
      let meetingProfile = {}
      groupProfile.forEach((doc) => {
        if (doc.data().admin) {
          admins.push({ ...doc.data(), id: doc.id })
        }
        if (doc.id === user.uid) {
          meetingProfile = {...doc.data(), id: doc.id }
        }
      })

      if (meetingProfile.admin && admins.length === 1) {
        let bla = 'You are the only admin for this group. You have to delete the group from the admin settings or set a new admin. Cheers'
        return alert(bla)
      }

      await firestore().collection('users').doc(user.uid)
      .collection('subscription_refs')
      .where("meetingId", "==", meeting.id)
      .get().then((querySnap) => {
        if (querySnap.empty) {
          
        }
        var batch = firestore().batch()
  
        querySnap.forEach((doc) => {        
          batch.delete(doc.data().ref)
          batch.delete(doc.ref)
        })
          
        let memberRef = meeting.doc
        .collection('current_attendance').doc(user.uid)
    
        let userMeetingRef = firestore()
        .collection('users').doc(user.uid)
        .collection('meetings').doc(meeting.id)

        batch.delete(memberRef)
        batch.delete(userMeetingRef)

        if (members.size === 1) {
          let groupIdRef = firestore()
          .collection('groupIds').doc(meeting.groupId)

          batch.delete(groupIdRef)
        } 

        Alert.alert(
          "Leave this group?",
          " ",
          [
            {
              text: "Cancel",
              onPress: () => {commit = false},
              style: "cancel"
            },
            { 
              text: "OK", 
              onPress: () => {
                meeting.doc
                .update({
                  admins: firestore.FieldValue.arrayRemove(user.uid)
                })
                
                batch.commit().catch((err) => {
                  console.log(err)
                }) 
              } 
            }
          ],
          { cancelable: false }
        )
      }).catch(err => { 
        console.log(err)
      })
    } catch(err) {
      console.log(err)
    }
  }

  return (
    <Block >
      <View>

        <TouchableOpacity>
          <FastImage />
        </TouchableOpacity>
      </View>

      <FlatList
        ListHeaderComponent={<Text style={styles.header}>classrooms</Text>}
        data={meetings}
        renderItem={({item}) => (
          <BoardCard 
            onPress={() => onBoardPressed(item)} 
            header={item.group.title} 
            description={item.group.description}
            optionPressed={() => {
              setBoard(item)
              // console.log(item)
              setTimeout(() => {
                toggleModal(!modalVisible)
              }, 20)
            }}
          />
        )}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<EmptyBoardCard />}
        showsVerticalScrollIndicator={false}
      />

      
      <AddBtn onPress={() => props.navigation.navigate('createMeeting')}/>
      {modalVisible?<PostDetailModal 
        closeModal={() => toggleModal(!modalVisible)} 
        modalVisible={modalVisible} 
        title={currentBoard.group.title}
        onLeave={() => {
          toggleModal(!modalVisible)
          onLeaveClassroom(currentBoard)
        }}
      />:null}
    </Block>
  )
  
}

const styles = ScaledSheet.create({
  header: {
    fontSize: wp('6'),
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
    color: 'dimgrey',
    marginTop: hp('1'),
  },
  scrollViewStyle: {
    flex: 1,
    paddingBottom: hp('30%')
  },
})

const mapStateToProps = state => {
  const { profile } = state.auth
  

  return {
    profile,
  }
}

const mapDispatchToProps = { } 


export default 
  connect(mapStateToProps, mapDispatchToProps)
(Boards)