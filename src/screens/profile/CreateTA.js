import React, {useState, useEffect} from 'react'
import {
  Text,
  StyleSheet,
} from 'react-native'
import {
  Block,
} from '../../common'


import {
  OutlinedBtn,
  ConfirmBtn,
  BubbleBackBtn,
} from '../../buttons'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import FastImage from 'react-native-fast-image'
import Icons from '@assets/icons'
import Illus from '@illus/Illus'
import * as RootNavigation from '../../RootNavigation'
import Spinny from 'react-native-spinkit'

let services = [
  {id: 1, name: 'Homework Checks', selected: false, price: ''},
  {id: 2, name: 'Essay Edits', selected: false, price: ''},
  {id: 3, name: 'Live Tutoring', selected: false, price: ''},
  {id: 4, name: 'Example Problems', selected: false, price: ''},
  {id: 5, name: 'Study Help', selected: false, price: ''},
  {id: 6, name: 'Research', selected: false, price: ''},
  {id: 7, name: 'Study Guide/Flash card', selected: false, price: ''},
  {id: 8, name: 'College Apps', selected: false, price: ''},
  {id: 9, name: 'Problem Explanation', selected: false, price: ''},
]

function CreateTA(props) {
  const [ currentUser, setCurrentUser ] = useState({})

  useEffect(() => {
    let user = auth().currentUser

    firestore().collection('users').doc(user.uid)
    .get().then((doc) => {
      setCurrentUser({ ...doc.data(), id: doc.id })
    })
  }, [])

  const initializeTAAccount = async () => {
    try {
      const user = auth().currentUser

      let doc = await firestore()
      .collection('teacher_assistants').doc(user.uid)
      .get()
      
      if (!doc.exists) {
        await firestore()
        .collection('teacher_assistants').doc(user.uid)
        .set({
          joined: firestore.Timestamp.now(),
          email: currentUser.email,
          dob: currentUser.dob,
          fcmToken: currentUser.fcmToken,
          phoneNumber: currentUser.phoneNumber,
          name: '',
          description: '',
          links: [],
          availability: '',
          isAvailableNow: false,
          verified: false,
          isNew: true,
          profilePic: '',
          services: services,
          rating: 5.0,
          ratingNum: 0,
          numRatings: 0,
          responseTime: '',
          school: '',
          zip: '',
          taMode: false,
          isVisible: false,
        })

        await firestore().collection('users').doc(user.uid)
        .collection('create_connect_express')
        .add({userId: user.uid })

        return RootNavigation.goBackAndDo(
          {andDo: () => RootNavigation.navigate('editProfile')}
        )
      }

      if (!doc.data.expressAccount) {
        await  firestore().collection('users').doc(user.uid)
        .collection('create_connect_express')
        .add({userId: user.uid })

        return RootNavigation.goBackAndDo(
          {andDo: () => RootNavigation.navigate('editProfile')}
        )
      }
      
    } catch(err) {
      console.log(err)
    }
  }

  return (
    <Block>
      <BubbleBackBtn />
      <FastImage 
        style={{
          width: wp('100'),
          height: wp('50'),
        }}
        source={Illus.growth} 
      />
       
      <Text style={styles.header}>Lend your knowlege and earn cash</Text>
      <Text style={styles.header}>Join a supportive community</Text>
      
      <ConfirmBtn onPress={initializeTAAccount} text="Get started on Demia"/>
    </Block>
  )
}

const styles = StyleSheet.create({
  header: {
    color: '#454545',
    fontFamily: 'Montserrat-Bold',
    fontSize: wp(6),
    margin: wp('2'),
  },
})

export default CreateTA