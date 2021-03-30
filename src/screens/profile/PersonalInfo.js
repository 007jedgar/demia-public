import React, {useState, useEffect} from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import {
  Block,
  SaveNavBar,
} from '../../common'
import {
  BasicInput1,
  OptionsSelector,
} from '../../containers'

import {
  BasicInputBtn,
  MultiInputBtn,
} from '../../buttons'
import {
  DatePickerModal
} from '../../modals'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import storage from '@react-native-firebase/storage'
import stripe from 'tipsi-stripe'
import FastImage from 'react-native-fast-image'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Icons from '@assets/icons'
import ImagePicker from 'react-native-image-picker';
import moment from 'moment'
import Spinny from 'react-native-spinkit'

function PersonalInfo(props) {
  const [currentUser, setCurrentUser] = useState({})
  const [isLoading, toggleLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")
  const [errorMsg , setError] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [showDatePicker, toggleShowDatePicker] = useState(false)
  const [birthdate, setBirthdate] = useState(new Date())
  const [emergencyContacts, setEmergencyContacs] = useState([])
  const [ blockedUsers, setBlockedUsers ] = useState([])

  useEffect(() => {
    toggleLoading(true)
    let user = auth().currentUser

    firestore().collection('users').doc(user.uid)
    .get().then((doc) => {
      const { firstName, lastName, email } = doc.data()
      if (firstName) setFirstName(firstName)
      if (lastName) setLastName(lastName)
      if (email) setEmail(email)
      setCurrentUser({ ...doc.data(), id: doc.id })
      toggleLoading(false)
    }).catch((err) => {
      console.log(err)
      toggleLoading(false)
    })

    let unsubBlocked = firestore()
    .collection('users').doc(user.uid)
    .collection('blocked_users')
    .onSnapshot((querySnap) => {
      if (querySnap.empty) return setBlockedUsers(0)
      setBlockedUsers(querySnap.size)
    }, (err) => {
      console.log(err)
    })
  

    let unsubContacts = firestore()
    .collection('users').doc(user.uid)
    .collection('emergency_contacts')
    .onSnapshot((querySnap) => {
      if (querySnap.empty) {
        return setEmergencyContacs([])
      }

      let contacts = []
      querySnap.forEach((doc) => {
        let contact = {...doc.data(), id: doc.id, text: doc.data().name }
        contacts.push(contact)
      })
      let add = {text: 'New emergency contact', }

      contacts.push(add)
      setEmergencyContacs(contacts)
    }, (err) => {
      console.log(err)
    })

    return () => {
      unsubContacts()
      unsubBlocked()
    }
  }, [])


  const saveProfile = () => {
    toggleLoading(true)
    let name = firstName + ' ' + lastName
    let personalInfo = {
      firstName,
      lastName,
      email,
      name,
    }
    const user = auth().currentUser

    firestore().collection('users').doc(user.uid)
    .update(personalInfo).then(() => {
      toggleLoading(false)
    }).catch((err) => {toggleLoading(false)})
  }

  const saveBirthday = (dob) => {
    if (!dob) return;

    const user = auth().currentUser
    firestore().collection('users').doc(user.uid)
    .update({
      dob: firestore.Timestamp.fromDate(dob),
    })
  }


  return (
    <Block>
      <SaveNavBar onSave={saveProfile} title="Edit personal info"/>
      <KeyboardAwareScrollView contentContainerStyle={{paddingBottom: hp(4)}} bahevior="position">
        <Text style={styles.disclaimerText}>This information is not shared publicly</Text>
        {!isLoading?<View>
          <BasicInput1 
            value={firstName}
            onChangeText={setFirstName}
            placeholder="First name"
            title="First name"
          />
          <BasicInput1 
            value={lastName}
            onChangeText={setLastName}
            placeholder="Last name"
            title="Last name"
          />
          <BasicInput1 
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            title="Email"
            textContentType="emailAddress"
          />
        
          <View style={{margin: wp('1')}}/>

          <BasicInputBtn 
            title="Birthday"
            value={currentUser.dob?moment.unix(currentUser.dob._seconds).format('MMM Do YYYY'):"Birthday"}
            onPress={() => toggleShowDatePicker(!showDatePicker)}
          />

          <BasicInputBtn 
            title="Phone number"
            value={currentUser.phoneNumber?currentUser.phoneNumber:"Phone number"}
            onPress={() => props.navigation.navigate('verifyPhone')}
          />

          <BasicInputBtn 
            title="Blocked Users"
            value={`${blockedUsers} blocked users`}
            onPress={() => props.navigation.navigate('blockedTaUsers')}
          />


          {/* <MultiInputBtn 
            data={emergencyContacts}
            title="Emergncy contact"
            onPress={() => {}}
            onEdit={(contact) => {
              if (contact.id) {
                return pro79ps.navigation.navigate('emergencyContact', {contact: contact})
              }
              props.navigation.navigate('emergencyContact')
            }}
          /> */}
        </View>:<View style={{alignSelf: 'center', marginTop: hp('4')}}>
          <Spinny color="#000" type="Arc" />
        </View>}

        {showDatePicker?<DatePickerModal 
          visible={showDatePicker}
          onDateChange={(dob) => saveBirthday(dob)}
          displayDate={currentUser.dob?currentUser.dob.toDate():new Date()}
          onCloseIOS={() => toggleShowDatePicker(!showDatePicker)}
          iosHeading={"Select your birthday"}
        />:null}
      </KeyboardAwareScrollView>


    </Block>
  )
}

const styles = StyleSheet.create({
  becomeMentorBtn: {
    shadowColor: '#81B29A',
    shadowOffset: { width: 1, height: 1},
    shadowRadius: 4,
    elevation: 2,
    borderRadius: 4,

    margin: wp('2'),
    marginHorizontal: wp('10'),
    backgroundColor: '#fff',
    borderColor: '#81B29A',
    borderWidth: 2,
  },
  lightBtnText: {
    color: '#81B29A',
    fontSize: wp('5'),
    margin: wp('2'),
    textAlign: 'center',
    fontFamily: 'Montserrat-Medium'
  },
  saveBtn: {
    margin: wp('7'),
  },
  disclaimerText: {
    color: '#454545',
    fontSize: wp('4.5'),
    margin: wp('2'),
    textAlign: 'center',
    fontFamily: 'Montserrat-Regular'
  },
  blockedText: {
    // color: '#'
  },
  blockedBtn: {
    marginHorizontal: wp(4),
  },
})

export default PersonalInfo