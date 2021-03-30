import React, {useState, useEffect} from 'react'
import { 
  Text, 
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native'
import { connect } from 'react-redux'
import {
  Block,
  BackNavBar
} from '../../common'
import {
  BasicInput
} from '../../containers'
import { signinWithEmail,clearError } from '../../actions'
import {
  ConfirmBtn
} from '../../buttons'
import ball from '../../../assets/illus/pablo-homework.png'

import FastImage from 'react-native-fast-image'
import { KeyboardAwareScrollView }  from 'react-native-keyboard-aware-scroll-view'
import validator from 'validator'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import firestore from '@react-native-firebase/firestore'

const parseError = (error) => {
  if (!error) return ''

  switch(error.code) {
    case 'auth/weak-password':
      return 'The password entered is weak or invalid'
    case 'auth/credential-already-in-use':
      return 'The email entered is already linked to an account'
    case 'auth/email-already-in-use':
      return 'The email entered is already linked to an account'
    case 'auth/account-exists-with-different-credential':
      return 'The credentials entered do not match'
    case 'auth/wrong-password':
      return 'The credentials entered do not match'
    default:
      return ''
  }
}

function EmailProvider(props) {
  const [ email, setEmail] = useState('')
  const [ name, setName] = useState('')
  const [ password, setPassword] = useState('')
  const [ validEmail, toggleValidEmail] = useState(true)
  const [ authType, toggleAuthType] = useState(false)

  useEffect(() => {
    console.log(props)
    toggleAuthType(props.route.params.authType)
    props.clearError()
  }, [])

  const onEnterEmail = (email) => {
    if (!validator.isEmail(email)) {
      toggleValidEmail(false)
      return setEmail(email)
    }
     
    toggleValidEmail(true)
    setEmail(email)
  }

  const onContinue = () => {
    // return console.log(email, password)
    if (!validEmail) return alert('Please enter a valid email')
    if (password.length < 6) return alert('Please enter a valid password')

    props.signinWithEmail({email, password, name})
  }

  const onForgotPassword = () => {

  }

  const navToTerms = () => {
    firestore().collection('links')
    .doc('terms_of_service').get()
    .then((doc) => {
      Linking.openURL(doc.data().link)
    })
  }

  return (
    <Block>
      <BackNavBar title="Continue with email"/>
      
      <FastImage 
        source={ball}
        style={{ position: 'absolute', bottom: 0, alignSelf: 'center', width: wp('80'), height: wp('70')}}
      />    
      
      <KeyboardAwareScrollView>
        {!authType?<BasicInput 
          title="name"
          placeholder={'name'}
          text={name}
          typed={setName}
          textContentType="name"
          autoCompleteType="name"
        />:null}
        <BasicInput 
          title="email"
          placeholder={'email'}
          text={email}
          typed={onEnterEmail}
          autoCapitalize="none"
          textContentType="emailAddress"
          autoCompleteType="email"
        />
        <BasicInput 
          title="password"
          placeholder={'password'}
          text={password}
          secureTextEntry={true}
          typed={setPassword}
          autoCapitalize="none"
          textContentType={!authType?"newPassword":"password"}
          autoCompleteType="password"
        />

        <TouchableOpacity onPress={navToTerms} activeOpacity={.6}>
          <Text style={styles.terms}>
            By tapping "Continue" you agree to our <Text style={styles.highlighted}> terms of service</Text>  and
            acknowlege that our <Text style={styles.highlighted}>privacy policy</Text>  applies.
          </Text>
        </TouchableOpacity>
  
        <ConfirmBtn onPress={onContinue} text="Continue"/>
        
        <Text style={{
          color: '#E35B31',
          fontSize: wp('4%'),
          fontFamily: 'Montserrat-Regular',
          textAlign: 'center',
          margin: wp('2%'),
        }}>{parseError(props.profileErr)}</Text>

        {authType?<TouchableOpacity
          activeOpacity={.6}
          onPress={() => props.navigation.navigate('forgotPassword')}
        >
          <Text style={{
            color: 'dimgrey',
            fontSize: wp('4%'),
            fontFamily: 'Montserrat-Regular',
            textAlign: 'center',
            margin: wp('2%'),
          }}>Forgot password?</Text>
        </TouchableOpacity>:null}
      </KeyboardAwareScrollView>

    </Block>
  )
  
}

const styles = StyleSheet.create({
  terms: {
    marginHorizontal: wp('7'),
    marginVertical: wp('2'),
    fontSize: wp('3.8'),
    fontFamily: 'OpenSans-Regular',
  },
  highlighted: {
    color: '#3E8E8A',
  },
})

const mapStateToProps = state => {
  const { profileErr } = state.auth

  return {
    profileErr
  }
}

const mapDispatchToProps = { signinWithEmail, clearError }


export default connect(mapStateToProps, mapDispatchToProps)(EmailProvider)