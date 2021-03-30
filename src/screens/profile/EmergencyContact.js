import React, {useState, useEffect} from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  KeyboardAvoidingView,
} from 'react-native'
import {
  Block,
  BackNavBar,
} from '../../common'
import {
  BasicInput1,
  OptionsSelector,
  PhoneNumberInput,
} from '../../containers'

import {
  OutlinedBtn,
  BasicInputBtn,
} from '../../buttons'
import {
  DatePickerModal,
  CountryCodeModal,
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

function EmergencyContact(props) {
  const [currentUser, setCurrentUser] = useState({})
  const [isLoading, toggleLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [message , setMessage] = useState("")
  const [name, setName] = useState(props.route.params?props.route.params.contact.name:'')
  const [email, setEmail] = useState(props.route.params?props.route.params.contact.email:'')
  const [phoneNumber, setPhoneNumber] = useState(props.route.params?props.route.params.contact.phoneNumber:'')
  const [countryCode, setCountryCode] = useState("+1")
  const [showCC, toggleCC] = useState(false)

  const [relationship, setRelationship] = useState(props.route.params?props.route.params.contact.relationship:'')

  useEffect(() => {
    let user = auth().currentUser
    toggleLoading(true)
    console.log(props.route.params)

    let unsubUser = firestore().collection('users').doc(user.uid)
    .onSnapshot((doc) => {
      setCurrentUser({ ...doc.data(), id: doc.id })
      toggleLoading(false)
    }, (err) => {
      setErrorMessage(err.message)
      toggleLoading(false)
    })

    return () => {
      // unsubExpress()
      unsubUser()
    }
  }, [])

  const saveContact = () => {
    if (!name || !email || !phoneNumber) return alert('You must supply a name, phone number and email for your emergency contact')
    toggleLoading(true)
    let emergencyContact = {
      name,
      email,
      phoneNumber: countryCode+phoneNumber,
      relationship,
      dateAdded: firestore.Timestamp.now()
    }
    const user = auth().currentUser

    if (props.route.params) {
      return firestore().collection('users').doc(user.uid)
      .collection('emergency_contacts').doc(props.route.params.contact.id)
      .update(emergencyContact)
      .then(() => {
        toggleLoading(false)
        setMessage('Contact saved')
        setTimeout(() => {
          props.navigation.goBack()
        }, 1500)
      }).catch((err) => toggleLoading(false))
    }

    firestore().collection('users').doc(user.uid)
    .collection('emergency_contacts')
    .add(emergencyContact)
    .then(() => {
      toggleLoading(false)
      setMessage('Contact saved')
      setTimeout(() => {
        props.navigation.goBack()
      }, 1500)
    }).catch((err) => toggleLoading(false))
  }


  return (
    <Block>
      <BackNavBar title="Emergency Contact"/>
      <KeyboardAwareScrollView contentContainerStyle={{paddingBottom: hp(4)}} bahevior="position">

        <BasicInput1 
          value={name}
          onChangeText={setName}
          placeholder="Legal name is prefered"
          title="Name"
        />
        <BasicInput1 
          value={relationship}
          onChangeText={setRelationship}
          placeholder="Ex: mom, partner, friend"
          title="Relationship"
        />
        <BasicInput1 
          value={email}
          onChangeText={setEmail}
          placeholder="Enter email address"
          title="Email"
        />
        <PhoneNumberInput 
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="Enter Phone Number"
          title="Phone Number"
          editable={false}
          textContentType="telephoneNumber"
          toggleCountryCodes={() => {
            toggleCC(!showCC)
          }}
          countryCode={countryCode}
        />

        {message?<Text style={styles.message}>{message}</Text>:<OutlinedBtn isLoading={isLoading} onPress={saveContact} text={props.route.params?'Save':"Add Contact"}/>}
        
      </KeyboardAwareScrollView>

      <CountryCodeModal 
        visible={showCC} 
        closeModal={() => toggleCC(!showCC)} 
        selectCountry={(cc) => {
          toggleCC(!showCC)
          setCountryCode(cc)
        }}
      />
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
  saveText: {
    color: '#4F6D7A',
    fontSize: wp('6'),
    margin: wp('2'),
    textAlign: 'center',
    fontFamily: 'Montserrat-Regular'
  },
  message: {
    color: '#4F6D7A',
    fontSize: wp('6'),
    margin: wp('2'),
    textAlign: 'center',
    fontFamily: 'Montserrat-Regular'
  },
})

export default EmergencyContact