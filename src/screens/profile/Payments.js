import React, {useEffect, useState} from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native'
import {
  Block,
  BackNavBar,
} from '../../common'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import storage from '@react-native-firebase/storage'
import ImagePicker from 'react-native-image-picker';
import Spinny from 'react-native-spinkit'
import FastImage from 'react-native-fast-image'
import Icons from '@assets/icons'
import moment from 'moment'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen'


function Payments(props) {
  const [ currentUser, setCurrentUser ] = useState({})
  const [ error, setError ] = useState('')
  const [ isLoading, toggleLoading ] = useState(true)
  
  useEffect(() => {
    toggleLoading(true)
    let user = auth().currentUser
    
    let unsubscribe = firestore()
    .collection('users').doc(user.uid)
    .onSnapshot((doc) => {
      setCurrentUser({ ...doc.data(), id: doc.id })
      toggleLoading(false)
    }, (err) => {
      toggleLoading(false)
      setError(err)
    })

    return () => unsubscribe()
  }, [])


  const makePayment = async () => {
    try {
      stripe.setOptions({
        publishableKey: 'pk_test_51HR8k7IM1EHxQ7h74SMwyeCU4lyNlKjoOJz8Mx1ogTs1rBZ0Ag3xtLhw6AoXZAXcN5VO6U80Q2bscS7TfobCIlrA00MPPP1MkH',
        merchantId: 'merchant.com.varsityprep', // Optional
        androidPayMode: 'test', // Android only
      })
  
      const items = [{
        label: 'Whisky',
        amount: '50.00',
      }, {
        label: 'Tipsi, Inc',
        amount: '50.00',
      }]
      const options = {
      }
  
      const token = await stripe.paymentRequestWithApplePay(items, options)
      await firestore().collection('users').doc(currentUser)
      .collection('payment_token').add(token)

      stripe.completeApplePayRequest()
    } catch(err) {
      stripe.cancelNativePayRequest()
    }
  }

  return (
    <Block>
      <BackNavBar title="Activity"/>
      {/* header */}
      <View style={{flexDirection: 'row', margin: wp('2')}}>
        <View>
          <Text style={styles.email}>{currentUser.email}</Text>
          <Text>Joined {moment(currentUser.joined).format('MMM YYYY')}</Text>

        </View>
      </View>

      {/* recent services */}
      <Text style={styles.listHeader}>Recent Services</Text>
      <FlatList 
      
      />
    </Block>
  )
}

const styles = StyleSheet.create({
  profilePic: {
    height: wp('12'),
    width: wp('12'),
    borderRadius: wp('6'),
    marginRight: wp('2')
  },
  email: {
    fontFamily: 'Montserrat-Regular',
    fontSize: wp('5.5'),
    marginVertical: wp('1')
  },
  moneyAmount: {
    fontFamily: 'Montserrat-Regular',
    fontSize: wp('5.5'),
    marginVertical: wp('1')
  },
  earnedText: {

  },
  payoutBtn: {
    backgroundColor: '#15B67C',
    borderRadius: 4,
    
    width: wp('60'),
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1,},
    shadowRadius: 4,
    shadowOpacity: .5,
    marginBottom: wp('5'),
  },  
  payoutBtnText: {
    color: '#fff',
    fontFamily: 'Montserrat-Medium',
    fontSize: wp('5'),
    textAlign: 'center',
    margin: wp('2')
  },  
  viewOnStripe: {
    color: '#15B67C',
    fontFamily: 'Montserrat-Medium',
    fontSize: wp('4.2'),
    // textAlign: 'center',
  },
  listHeader: {
    color: '#000',
    fontFamily: 'Montserrat-Medium',
    fontSize: wp('5'),
    margin: wp('2')
  },
})

export default Payments