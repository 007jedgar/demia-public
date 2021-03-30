import React, { useState } from 'react'
import {
  Text,
  View,
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { ScaledSheet, moderateScale } from 'react-native-size-matters'
import { connect } from 'react-redux'
import validator from 'validator'
import FastImage from 'react-native-fast-image'

import { Block, BackNavBar } from '../../common'
import { AuthBtn, ConfirmBtn } from '../../buttons'
import { BasicInput } from '../../containers'
import { signinWithApple, signinWithGoogle, loginWithEmail } from '../../actions'
import ball from '../../../assets/illus/online_edu.png'
import Icons from '@assets/icons'
import Spinny from 'react-native-spinkit'

function Signin(props) {
  const { header, authPrompts, line } = styles
  const [ emailState, setEmail ] = useState('')
  const [ passwordState, setPassword ] = useState('')

  const _onContinuePressed = () => {
    if (!validator.isEmail(emailState)) return alert('Please enter a valid email')
    if (!passwordState) return alert('Please enter a password')

    props.loginWithEmail(emailState, passwordState)
  }

  const onApplePressed = () => {
    props.signinWithApple()
  }

  const onGooglePressed = () => {
    props.signinWithGoogle()
  }

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

  const renderLoading = () => {
    if (props.isLoading) {
      return (
        <View style={{
          alignSelf: 'center',
        }}>
          <Spinny 
            color="#4F6D7A"
            size={wp('15')}
            type="Arc"
          />
        </View>
      )
    }
  }

  return (
    <Block>
      <BackNavBar  title="Sign in"/>
      <FastImage 
        source={Icons.onlineClass}
        style={{ position: 'absolute', bottom: 0, alignSelf: 'center', width: wp('80'), height: wp('70')}}
      />
      <KeyboardAwareScrollView contentContainerStyle={{ marginTop: hp('3'), justifyContent: 'center' }}>
        <View>
          <View>
            <Text style={header}>Welcome back!</Text>
          </View>
          
          {!props.isLoading?<View>
            <AuthBtn onPress={() => props.navigation.navigate('email', {authType: true})} type="Email" text="Continue with"/>
            <AuthBtn onPress={onApplePressed} type="Apple" text="Continue with"/>
            <AuthBtn onPress={onGooglePressed} type="Google" text="Continue with"/>
          </View>:null}

          {renderLoading()}
          
        </View>
      </KeyboardAwareScrollView>

    </Block>
  )
}

const styles = ScaledSheet.create({
  header: {
    textAlign: 'center',
    fontSize: '20@ms',
    fontFamily: 'Montserrat-ExtraBold',
    color: 'dimgrey',
    fontSize: wp('6'),
    marginBottom: hp('4'),
  },
  authPrompts: {
    textAlign: 'center',
    // margin: '10@ms',
    fontFamily: 'Montserrat-Regular'
  },
  line: {
    alignSelf: 'center',
    backgroundColor: 'dimgrey',
    width: wp('70%'),
    height: '1@ms',
    marginVertical: hp('1%')
  },  
})

const mapStateToProps = state => {
  const { profileErr, isLoading } = state.auth

  return {
    profileErr,
    isLoading,
  }
}

const mapDispatchToProps = {
  signinWithApple, signinWithGoogle, loginWithEmail
}


export default connect(mapStateToProps, mapDispatchToProps)(Signin);