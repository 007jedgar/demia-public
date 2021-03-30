import React, {useState, useEffect} from 'react'
import {
  TouchableOpacity,
  Text,
  View,
} from 'react-native'
import {
  BasicInput
}from '../../containers'
import {
  BackNavBar,
  Block,
} from '../../common'
import { 
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
import { ScaledSheet }from 'react-native-size-matters'
import auth from '@react-native-firebase/auth'
import { KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import FastImage from 'react-native-fast-image'
import Icons from '@assets/icons'

function ForgotPassword(props) {
  const [ email, editEmail ] = useState('')
  const [ showSuccess, toggleSuccess ] = useState(false)
  const [ error, setError ] = useState(false)
  
  useEffect(() => {
    toggleSuccess(false)
    editEmail('')
  }, [])

  const sendEmail = () => {
    if (!email) return alert('Please enter an email address')
    auth().sendPasswordResetEmail(email)
    .then(() => {
      toggleSuccess(true)
      editEmail('')
      setError('')
      setTimeout(() => {
        // Actions.pop()
        props.navigation.goBack()
      }, 2000);
    }).catch((e) => {
      console.log(e.code)
      if (e.code === 'auth/user-not-found') {
        setError('Email does not match any of our accounts')
      }
    })
  }

  return (
    <Block style={{flex :1, }}>
      <BackNavBar title="Reset Password" />
      <FastImage 
        source={Icons.backpack}
        style={{ position: 'absolute', bottom: 0, alignSelf: 'center', width: wp('80'), height: wp('70')}}
      />
      <KeyboardAwareScrollView style={{flex: 1}}>

     
      <View style={{
        marginVertical: hp('2')
      }} />

      <View style={{
        marginHorizontal: wp('5')
      }}>
        <BasicInput 
          value={email}
          text={email}
          placeholder="email"
          title="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          typed={editEmail}
        />
      </View>

      <View style={{
        marginVertical: hp('3')
      }} />

      <TouchableOpacity style={styles.btn} onPress={sendEmail}>
        <Text style={styles.btnText}>Send Reset Email</Text>
      </TouchableOpacity>
      
      {showSuccess?<Text style={styles.successText}>Success! Please check your email</Text>:null}
      {error?<Text style={styles.errorText}>{error}</Text>:null}
      
      </KeyboardAwareScrollView>
    </Block>
  )
}

const styles = ScaledSheet.create({
  header: {
    marginVertical: hp('3'),
    alignSelf: 'center',
    color: 'dimgrey',
    fontSize: wp('5'),
    fontFamily: 'Montserrat-SemiBold',
  },
  btn: {
    marginHorizontal: wp('10'),
    // backgroundColor: '#000',
    borderRadius: 3,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: '#000',
  },
  btnText: {
    textAlign: 'center',
    fontSize: wp('5'),
    margin: wp('3'),
    fontFamily: 'Montserrat-Medium',
    color: '#000',
  },
  successText: {
    textAlign: 'center',
    fontSize: wp('5'),
    margin: wp('3'),
    fontFamily: 'Montserrat-Medium',
    color: '#27A587',
  },
  errorText: { 
    textAlign: 'center',
    fontSize: wp('5'),
    margin: wp('3'),
    fontFamily: 'Montserrat-Medium',
    color: '#D7646F',
  },
})

export default ForgotPassword