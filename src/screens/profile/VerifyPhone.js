import React, {useState, useEffect} from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native'
import {
  Block,
  BackNavBar,
} from '../../common'
import {
  PhoneNumberInput,
} from '../../containers'

import {
  OutlinedBtn,
} from '../../buttons'
import {
  CountryCodeModal
} from '../../modals'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import FastImage from 'react-native-fast-image'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Icons from '@assets/icons'
import Spinny from 'react-native-spinkit'


function VerifyPhone(props) {
  const [ phoneNumber, setPhoneNumber] = useState('')
  const [ countryCode, setCountryCode] = useState('+1')
  const [ showCC, toggleCC ] = useState(false)
  const [ code, setCode] = useState('')
  const [ codeSent, toggleCodeSent ] = useState(false)
  const [ error, setError ] = useState('')
  const [ status, setStatus ] = useState('')
  const [ message, setMessage ] = useState('')

  useEffect(() => {
    let user = auth().currentUser
    let unsub = firestore().collection('phone_verification')
    .doc(user.uid).onSnapshot((doc) => {
      if (!doc.exists) return;

      let { status, } = doc.data()
      if (status === 'sent') {
        toggleCodeSent(true)
      }
      if (status === 'approved') {
        setMessage('Phone number has been verified')
        setTimeout(() => {
          props.navigation.goBack()
        }, 1500)
      }
      console.log(status)
      setStatus(status)
    }, (err) => {
      setError('An error has occured')
    })

    return () => {
      unsub()
      firestore().collection('phone_verification')
      .doc(user.uid).update({status: 'none'})
    }
  }, [])

  const normalize = (phoneNumberString) => {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '')
    var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/)
    if (match) {
      var intlCode = (match[1] ? '+1 ' : '')
      return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('')
    }
    return null
  }

  const sendMessage = () => {
    if (!phoneNumber) return;
    let num = countryCode + phoneNumber
    setCode('')
    const user = auth().currentUser
    firestore().collection('phone_verification')
    .doc(user.uid).set({
      phoneNumber: num,
      status: 'pending'
    }).then(() => {
      toggleCodeSent(true)
    }).catch(() => {
      setError('')
      toggleCodeSent(false)
    })
  }

  const confirmCode = () => {
    const user = auth().currentUser
    let num = countryCode + phoneNumber
    firestore().collection('phone_verification')
    .doc(user.uid)
    .update({
      userId: user.uid,
      phoneNumber: num,
      code: code,
    })
  }



  return (
    <Block>
      <BackNavBar title="Verify phone"/>
      <KeyboardAwareScrollView behavior="position">

        {!codeSent && status!=='approved'?<View>

          <Text style={styles.info}>For notifications, reminders, a help logging in.</Text>

          <PhoneNumberInput 
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="Enter Phone Number"
            title="Phone Number"
            editable={false}
            textContentType="telephoneNumber"
            keyboardType="phone-pad"
            toggleCountryCodes={() => {
              toggleCC(!showCC)
            }}
            countryCode={countryCode}
          />

          <Text style={styles.disclaimer}>We'll call or text you to confirm your number. Standard message and data rates apply.</Text>
        </View>:null}
       
        {codeSent && status!=='approved'?<View >

          <Text style={styles.info}>Sending a message to {normalize(phoneNumber)}</Text>

          <Text style={styles.info}>Enter the verification code</Text>

          <TextInput 
            title={"Code"}
            value={code}
            onChangeText={setCode}
            placeholder="123456"
            placeholderTextColor="dimgrey"
            style={styles.codeInput}
            maxLength={6}
            keyboardType="number-pad"
          />

          
          <View style={{flexDirection: 'row', alignSelf: 'center' }}>
            <Text style={[styles.tryAgain, {color: '#454545'}]}>Didn't receive a code?</Text>
            <TouchableOpacity>
              <Text style={styles.tryAgain}> Try again</Text>
            </TouchableOpacity>
          </View>
        </View>:null}
        
        {status!=='approved'&&status!=='sent'?<OutlinedBtn onPress={sendMessage} text="Send sms"/>:null}
        {status=='sent'?<OutlinedBtn onPress={confirmCode} text="Verify Code"/>:null}
        {status==="approved"?<Text style={styles.message}>{message}</Text>:null}
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
  info: {
    marginHorizontal: wp(5),
    fontFamily: 'OpenSans-Regular',
    fontSize: wp('4'),
    marginTop: hp(2)
  },  
  disclaimer: {
    marginHorizontal: wp(5),
    fontSize: wp('3.5'),

  },
  codeInput: {
    marginHorizontal: wp('5'),
    marginVertical: wp('2'),

    alignSelf: 'center',
    width: wp('34'),

    fontFamily: 'OpenSans-Regular',
    fontSize: wp('7'),
    textAlign: 'center',

    borderColor: 'dimgrey',
    borderWidth: 1,
    borderRadius: 5,
    padding: wp(2)
  },

  tryAgain: {
    color: '#69A2B0',
    // marginHorizontal: wp(5),
    fontFamily: 'OpenSans-Regular',
    fontSize: wp('4'),
    // marginTop: hp(2)
  },
  message: {
    marginHorizontal: wp(5),
    fontFamily: 'OpenSans-Regular',
    fontSize: wp('4'),
    marginTop: hp(2),
    textAlign: 'center',
  },
  error: {

  },
})

export default VerifyPhone