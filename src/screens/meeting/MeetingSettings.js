import React, {useEffect, useState, } from 'react'
import {
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  View,
  Alert,
} from 'react-native'
import { connect } from 'react-redux'

import {
  Block,
  BackNavBar,
} from '../../common'
import {
  BasicInput,
} from '../../containers'
import {
  DangerBtn
} from '../../buttons'

import Spinny from 'react-native-spinkit'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
import { ScaledSheet } from 'react-native-size-matters'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import RNSimpleCrypto from "react-native-simple-crypto";
import * as RootNavigation from '../../RootNavigation'

function MeetingSettings(props) {
  const [ groupName, setGroupName ] = useState(props.meeting.title)
  const [ oldGroupPassword, setOldGroupPassword ] = useState('')
  const [ newGroupPassword, setNewGroupPassword ] = useState('')
  const [ groupAdmins, setGroupAdmins ] = useState([])

  useEffect(() => {

    firestore()
    .collection('meetings').doc(props.meeting.id)
    .collection('current_attendance')
    .where("admin", "==", true)
    .get().then((querySnap) => {
      let admins = []
      querySnap.forEach((doc) => {
        admins.push({ ...doc.data(), id: doc.id  })
      })
      setGroupAdmins(admins)
    })
  }, [])

  const changeTitle = async () => {
    console.log(props.meeting)
    try {
      await firestore()
      .collection('groupIds').doc(props.meeting.groupId)
      .update({
        "group.title": groupName,
      })
  
      await firestore()
      .collection('meetings').doc(props.meeting.id)
      .update({
        title: groupName,
      })

      alert('Changed classroom name')
    } catch(err)  {
      console.log(err)
    }
  }

  const settingBtn = (title) => {
    return (
      <TouchableOpacity 
        onPress={() => {

        }}>
        <Text style={styles.settingTitle}>{title}</Text>
      </TouchableOpacity>
    )
  }

  const onChangePassword = async () => {
    if (!newGroupPassword) {
      return Alert.alert(
        "Remove Password?",
        "Your group can be joined by anyone",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { text: "OK", onPress: () => removePassword() }
        ],
        { cancelable: false }
      )
    }

    const hashedPassword = await RNSimpleCrypto.SHA.sha256(newGroupPassword)

    await firestore()
    .collection('groupIds').doc(props.meeting.groupId)
    .update({
      "group.password": hashedPassword,
    })
    
    await firestore()
    .collection('meetings').doc(props.meeting.id)
    .update({
      password: hashedPassword,
    })

    alert('Password changed')
  }

  const removePassword = () => {
    firestore()
    .collection('groupIds').doc(props.meeting.groupId)
    .update({
      "group.password": firestore.FieldValue.delete(),
    })
    
    firestore()
    .collection('meetings').doc(props.meeting.id)
    .update({
      password: firestore.FieldValue.delete(),
    })
  }

  const onDelete = () => {
    return Alert.alert(
      "Delete Group?",
      "Your group can be joined by anyone",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => removePassword() }
      ],
      { cancelable: false }
    )
  }

  const setOwner = () => {

  }

  const deleteGroup = async () => {
    console.log('delete group')
    try {
      let members = await firestore()
      .collection('meetings').doc(props.meeting.id)
      .collection('current_attendance').get()
  
      let batch = firestore().batch()
  
      members.forEach((doc) => {
        let meetingRef = firestore()
        .collection('users').doc(doc.id)
        .collection('meetings').doc(props.meeting.id)
  
        batch.delete(meetingRef)
      })
  
      await batch.commit()
      
      await firestore()
      .collection('groupIds').doc(props.meeting.groupId)
      .delete()

      await firestore().collection('meetings')
      .doc(props.meeting.id).update({ active: false })

      return RootNavigation.navigate('board')
    } catch(err) {
      console.log(err)
    }
  }

  return (
    <Block>
      <BackNavBar title={'Classroom Settings'}/>

      <ScrollView style={{flex: 1}}>
        
          <View style={{ marginVertical: hp('1')}}/>
          <Text style={styles.settingTitle}>Change Group Name</Text>
          <BasicInput 
            placeholder={props.meeting.title}
            text={groupName}
            typed={setGroupName}
            title="classroom Name"
          />
           
          <TouchableOpacity onPress={changeTitle} style={styles.btn}>
            <Text style={styles.name}>Change Group Name</Text>
          </TouchableOpacity>
          
          <View style={{ marginVertical: hp('2')}}/>

          <Text style={styles.settingTitle}>Change Classroom Password</Text>

          <BasicInput 
            placeholder={'new Password'}
            text={newGroupPassword}
            typed={setNewGroupPassword}
            title="new classroom Password"
            autoCapitalize={"none"}
          />

          {!newGroupPassword?<Text style={{
            textAlign: 'center',
          }}>Change now to remove password from classroom</Text>:null}

          <TouchableOpacity onPress={onChangePassword} style={styles.btn}>
            <Text style={styles.name}>Change Group Password</Text>
          </TouchableOpacity>

          <View style={{ marginVertical: hp('2')}}/>

        <Text style={styles.settingTitle}>Classroom Admins</Text>

        {
          groupAdmins.map((item) => {
            return (
              <View key={item.id} style={styles.userCard}>
                <Text style={styles.name}>{item.displayName}</Text>
              </View>
            )
          })
        }

      </ScrollView>
      
      <DangerBtn onPress={() => {
        Alert.alert(
          "Delete Group?",
          "Your group will be disbanded. Any and all data will be deleted.",
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            },
            { text: "OK", onPress: () => deleteGroup() }
          ],
          { cancelable: false }
        )        
      }} text="Delete Group" />
    </Block>
  )
}

const styles = ScaledSheet.create({
  settingTitle: {
    marginLeft: wp('3'),
    fontFamily: 'Montserrat-Regular',
    fontSize: wp('4.7'),
    color: '#000',
  },
  userCard: {
    marginHorizontal: wp('10'),
    marginVertical: hp('1'),
    borderRadius: 2,
    borderBottomColor: '#000',
    borderBottomWidth: 1,
    padding: wp('1')
  },
  btn: {
    
    borderRadius: 4,
    borderColor: 'dimgrey',
    borderWidth: 1, 
    marginHorizontal: wp('9'),
    marginVertical: hp('1'),
    padding: wp('2'),

    backgroundColor: '#fff',

    shadowColor: '#000',
    shadowRadius: 2,
    shadowOffset: { width: 1, height: 1},
    shadowOpacity: .3,
  },
  name: {
    fontFamily: 'Montserrat-Regular',
    fontSize: wp('4.5'),
    alignSelf: 'center',
  },
  deleteBtn: {
    
    borderRadius: 4,
    borderColor: '#D85531',
    borderWidth: 1, 
    marginHorizontal: wp('9'),
    marginVertical: hp('1'),
    padding: wp('2'),
    backgroundColor: '#fff',
    shadowColor: '#D85531',
    shadowRadius: 2,
    shadowOffset: { width: 1, height: 1},
    shadowOpacity: .3,
  },
  delete: {
    color: '#D85531',
    fontFamily: 'Montserrat-Regular',
    fontSize: wp('4.5'),
    alignSelf: 'center',
  },
})

const mapStateToProps = state => {
  const { meeting, meetingProfile } = state.meeting
  const { profile } = state.auth

  return {
    meeting,
    meetingProfile,
    profile,
  }
}

const mapDispatchToProps = {
  
}



export default connect(mapStateToProps, mapDispatchToProps)(MeetingSettings)
