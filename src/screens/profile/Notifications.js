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

import { BackNavBar, Block } from '../../common'


function Notifications() {
  const [ isLoading, toggleLoading ] = useState(false)

  
  useEffect(() => {
    const user = auth().currentUser

    firestore().collection('users').doc(user.uid)
    .get().then((doc) => {
      let { authType } = doc.data()
      setAuthType(authType)
    })
  }, [])

  return (
    <Block>
      <BackNavBar />
      <Text>Notifications</Text>
      
      <View>

      </View>
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

export default Notifications