import React from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  Linking,
} from 'react-native'
import { connect } from 'react-redux'
import FastImage from 'react-native-fast-image'
import { ScaledSheet, moderateScale } from 'react-native-size-matters'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Block, BackNavBar } from '../../common'
import { AuthBtn } from '../../buttons'
import { signinWithApple, signinWithGoogle } from '../../actions'
import ball from '../../../assets/illus/online_edu.png'
import firestore from '@react-native-firebase/firestore'

function Signup(props) {

  const onApplePressed = () => {
    props.signinWithApple()
  }

  const onGooglePressed = () => {
    props.signinWithGoogle()
  }


  const navToTerms = () => {
    firestore().collection('links')
    .doc('terms_of_service').get()
    .then((doc) => {
      Linking.openURL(doc.data().link)
    }).catch((err) => {
      alert('an error has occured')
    })
  }

  return (
    <Block>
      <BackNavBar onPress={() => props.navigation.goBack()} title="Sign up"/>
      <FastImage 
          source={ball}
          style={{ position: 'absolute', bottom: 0, alignSelf: 'center', width: wp('80'), height: wp('70')}}
        />

      <KeyboardAwareScrollView contentContainerStyle={{marginTop: hp('2'), justifyContent: 'center' }}>
        <View>

          {/* <Text style={styles.header}>Welcome to your Classroom</Text> */}

          <AuthBtn onPress={() => props.navigation.navigate('email', {authType: false})} type="Email" text={'Sign up with'}/>
          <AuthBtn onPress={onApplePressed} type="Apple" text={'Sign up with'}/>
          <AuthBtn onPress={onGooglePressed} type="Google" text={'Sign up with'}/>
          
          <TouchableOpacity onPress={navToTerms} activeOpacity={.6}>
            <Text style={styles.terms}>
              By tapping "Sign up with Apple" or "Sign up with Google" you agree to our <Text style={styles.highlighted}> terms of service</Text>  and
              acknowlege that our <Text style={styles.highlighted}>privacy policy</Text>  applies.
            </Text>
          </TouchableOpacity>
        </View>

      </KeyboardAwareScrollView>
    </Block>
  )
}

const styles = ScaledSheet.create({
  header: {
    textAlign: 'center',
    fontSize: wp('5'),
    fontFamily: 'Montserrat-ExtraBold',
    color: 'dimgrey',
    marginBottom: hp('4'),
  },
  authPrompts: {
    textAlign: 'center',
    margin: '10@ms',
    fontFamily: 'Montserrat-Regular'
  },
  line: {
    alignSelf: 'center',
    backgroundColor: 'dimgrey',
    width: wp('70%'),
    height: '1@ms',
    marginVertical: hp('1%')
  },  
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
    profileErr,
  }
}

const mapDispatchToProps = {
  signinWithApple, signinWithGoogle
}


export default connect(mapStateToProps, mapDispatchToProps)(Signup);