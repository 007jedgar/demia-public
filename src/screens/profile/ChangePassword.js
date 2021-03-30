import React, {useState, useEffect} from 'react'
import { 
  TouchableOpacity,
  View,
  Text,
} from 'react-native'

import { 
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
 } from 'react-native-responsive-screen'
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import { ScaledSheet } from 'react-native-size-matters'
import {
   KeyboardAwareScrollView
} from 'react-native-keyboard-aware-scroll-view'

import { BackNavBar, Block , LineInput} from '../../common'
import {
  BasicInput1,
} from '../../containers'
import {
  OutlinedBtn,
} from '../../buttons'

function ChangePassword() {
  const [ oldPassword, setOldPassword ] = useState('')
  const [ confirmPassword, setConfirmPassword ] = useState('')
  const [ newPassword, setNewPassword ] = useState('')
  const [ isLoading, toggleLoading ] = useState(false)
  const [ authType, setAuthType ] = useState(false)

  useEffect(() => {
    const user = auth().currentUser

    firestore().collection('users').doc(user.uid)
    .get().then((doc) => {
      let { authType } = doc.data()
      setAuthType(authType)
    })
  }, [])

  const onChangePassword = () =>{
    if (authType !== 'email') return alert('This account uses social authentication to log in. There is no password assocciated with this account.')
    if (oldPassword === newPassword ) return alert('Your old password and new password matches.')
    
    if (newPassword === confirmPassword) {
      toggleLoading(true)
      const user = auth().currentUser;

      user.updatePassword(newPassword).catch((err) => {
        const credential = auth().EmailAuthProvider.credential(user.email, oldPassword)
        return user.reauthenticateWithCredential(credential).then(() => {
          return user.updatePassword(newPassword)
        })
      }).then(() => {
        toggleLoading(false)
        toggleShowSuccess(true)
      }).catch((err) => {
        console.log(err)
        toggleLoading(false)
        // toggleShowFail(true)
      })
    } else alert('Passwords do not match')
  }

  return (
    <Block>
      <BackNavBar title={'Change Password'}/>
      <KeyboardAwareScrollView>
        {/* <View style={styles.header}>
          <Text style={styles.headerText}>Change Password</Text>
        </View> */}

        <View style={{marginVertical: hp('4')}}/>

        <BasicInput1 
          placeholder="old password"
          placeholderTextColor="dimgrey"
          onChangeText={setOldPassword}
          value={oldPassword}
          title={"Old Password"}
        />

        <BasicInput1 
          placeholder="new password"
          placeholderTextColor="dimgrey"
          onChangeText={setNewPassword}
          value={newPassword}
          title={"New Password"}
        />

        <BasicInput1 
          placeholder="confirm password"
          placeholderTextColor="dimgrey"
          onChangeText={setConfirmPassword}
          value={confirmPassword}
          title={"Confirm Password"}
        />

        <OutlinedBtn onPress={onChangePassword} text="Change Password"/>
      </KeyboardAwareScrollView>
    </Block>
  )
}

const styles = ScaledSheet.create({
  header: {
    marginVertical: hp('2')
  },
  headerText: {
    textAlign: 'center',
    fontFamily: 'Montserrat-Bold',
    color: '#565656',
    fontSize: wp('6'),
  },
  btn: {
    marginHorizontal: wp('10'),
    borderRadius: 4,
    borderWidth: 1,
    marginVertical: hp('3'),
  },
  btnText: {
    margin: wp('3'),
    fontFamily: 'Montserrat-MediumItalic',
    fontSize: wp('5'),
    textAlign: 'center',
    color: '#565656',
  },
})

export default ChangePassword