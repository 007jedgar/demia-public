import React, {useState, useEffect, useRef } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native'
import {
  Block,
} from '../../common'

import {
  BubbleBackBtn,
  ConfirmBtn,
} from '../../buttons'
import {
  ApplePayButton,
} from 'react-native-payments';
import { ScaledSheet, moderateScale } from 'react-native-size-matters'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { connect } from 'react-redux'
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import stripe from 'tipsi-stripe'
import Icons from '@assets/icons'
import FastImage from 'react-native-fast-image'
import apiKeys from '../../apiKeys.json'

stripe.setOptions({
  publishableKey: apiKeys.stripePublishableKey,
  merchantId: apiKeys.appleMerchantId,
})

function Checkout(props) {
  const [ currentUser, setCurrentUser ] = useState({})
  const [ ta, setTa ] = useState(props.route.params.request.ta)
  const [ services, serServices ] = useState(props.route.params.request.services)
  const [ subtotal, setSubtotal ] = useState(props.route.params.request.subtotal)
  const [ feesAndTaxes, setFees ] = useState(props.route.params.request.taxesAndFees)
  const [ total, setTotal ] = useState(props.route.params.request.total)
  const [ message, setMessage ] = useState(props.route.params.request.message)
  const [ optionSelected, toggleOption ] = useState(false)
  
  useEffect(() => {
    const user = auth().currentUser

    let unsub = firestore()
    .collection('users').doc(user.uid)
    .onSnapshot((doc) => {
      setCurrentUser({ ...doc.data(), id: doc.id })
    }, (err) => {
      console.log(err)
    })
    
    setTimeout(() => {
      if (currentUser.customer) createPI()
    }, 1000)
    return () => unsub()
  }, [])



  const createCustomer = () => {
    if (!currentUser.email) return;

    firestore().collection('users').doc(currentUser.id)
    .collection('create_customer')
    .add({
      userId: currentUser.id,
      email: currentUser.email,
    })
  }

  const createPI = () => {
    let realTotal = total*100 +''
    
    firestore().collection('users').doc(currentUser.id)
    .collection('payment_intents').doc(ta.id)
    .set({
      amount: realTotal,
      currency: 'usd',
      customer: currentUser.customer.id,
      setup_future_usage: 'off_session',
    })
  }

  const addMethod = async () => {
    const options = {
      requiredBillingAddressFields: 'full',
      prefilledInformation: {
        billingAddress: {
          name: 'Joneaux Guy',
          line1: '123 Random Adress Ln',
          line2: '',
          city: 'Houston',
          state: 'Texas',
          country: 'US',
          postalCode: '77007',
        },
      },
    }

    try {
      let token = await stripe.paymentRequestWithCardForm(options)
      
      firestore().collection('users').doc(currentUser.id)
      .collection('update_payment_method').add(token)
    } catch(err) {
      console.log(err)
    }
  }

  const payWithApple = () => {
    return new Promise(async (res, rej) => {
      let items = []
  
      services.map((ser) => {
        if (ser.optionSelected){
          items.push({
            label: ser.name,
            amount: ser.price + '.00',
          })
        }
      })
      items.push({
        label: ta.name,
        amount: total,
      })
  
      try {
        if (optionSelected) return res(false)

        let token = await stripe.paymentRequestWithNativePay({
          requiredBillingAddressFields: ['all'],
        },items)
  
        // await firestore().collection('users').doc(currentUser.id)
        // .collection('apple_pay_token').add(token)
        await stripe.completeNativePayRequest()
        res(token)
  
      } catch(err) {
        await stripe.cancelNativePayRequest()
        console.log(err)
        rej(err)
      }
    })
  }

  const sendRequest = async () => {
    let options = []
    services.map((ser) => {
      if (ser.optionSelected){
        options.push(ser)
      }
    })

    let paymentMethod = optionSelected?'card':'applepay';
    let token = await payWithApple()

    let request = {
      text: message,
      ta,
      selectedServices: options,
      amount: total,
      appleToken: token,
      paymentMethod,
      date: firestore.Timestamp.now(),
      author: currentUser, 
      type: 'request',
      status: 'pending'
    }
    
    firestore().collection('users').doc(currentUser.id)
    .collection('message_threads').doc(ta.id)
    .get().then((doc) => {
      if (!doc.exists) {
        //create message ref
        return firestore().collection('message_threads').add({
          ta: ta,
          taRef: firestore().collection('teacher_assistants').doc(ta.id),
          customer: currentUser,
          customerRef: firestore().collection('users').doc(currentUser.id)
        }).then((doc) => {
          Promise.all([
            custRef.set({
              ref: doc,
              ta: ta,
              customer: currentUser
            }),
            taRef.set({
              ref: doc,
              ta: ta,
              customer: currentUser,  
            }),
            doc.collection('messages').add(request)
          ]).then(() => {
            props.navigation.navigate('assistantMessenger', {item, customer: currentUser, ta: ta, thread: doc, isTa: isTa })
          })
        }).catch((err) => console.log(err))
      }

      let threadRef = doc.data().ref
      threadRef.collection('messages').add(request)
      .then(() => {

      })
    })
  }
  
  const checkMark = () => {
    return (
      <View style={{
        backgroundColor: '#fff',
        position: 'absolute',
        borderRadius: wp(4),
        width: wp('8'),
        height: wp('8'),
        borderWidth: 1,
        borderColor: '#69A2B0',
        right: -wp('3'),
        top: wp('1'),
        justifyContent: 'center'
      }}>
        <FastImage style={{
          width: wp(6),
          height: wp(6),
          alignSelf: 'center',
        }} source={Icons.blueCheckmark}/>
      </View>
    )
  }

  return (
    <Block>
      <BubbleBackBtn />
      <ScrollView style={{flex: 1}}>

        <Text style={styles.title}>Request</Text>
        <View style={{marginTop: hp(3)}}/>
        <Text style={styles.sectionTitle}>Summary</Text>
        
          {services.map((ser, i) => {
            if (ser.optionSelected) {
              return (
                <View key={i+1} style={styles.spread}>
                  <Text style={styles.total}>{ser.name}</Text>
                  <Text style={styles.price}>${parseInt(ser.price).toFixed(2)}</Text>
                </View>
              )
            }
          })}

        {message?<Text style={styles.termsOfSale}>{message}</Text>:null}
        
        <View style={styles.sectionLine}/>
        <Text style={styles.sectionTitle}>Select Payment Method</Text>
        
        <View style={[styles.spread, {justifyContent: 'flex-start', marginHorizontal: wp(7)}]}>
            {!currentUser.paymentMethod?<View>
              <TouchableOpacity onPress={addMethod} activeOpacity={.6} style={styles.addMethodBtn}>
                <Text style={styles.addMethodText}>Add a card</Text>
              </TouchableOpacity>
            </View>:
            <TouchableOpacity activeOpacity={.7} onPress={() => toggleOption(true)} style={styles.option1}>
              <View>
                <Text style={styles.card}> <Text style={styles.brand}>{currentUser.paymentMethod.brand}</Text> {currentUser.paymentMethod.last4}</Text>
              </View>
              {optionSelected?checkMark():null}
            </TouchableOpacity>}

            <View>
              <ApplePayButton
                key="first"
                width={wp('30')}
                buttonStyle={'black'}
                buttonType={'setUp'}
                onPress={() => toggleOption(false)}
              />
              {!optionSelected?checkMark():null}
            </View>
        </View>

        <Text style={styles.termsOfSale}>
          Once your request has been accepted, your payment method
          will be charged. You may also cancel your request before
          it is accepted to cancel the charge.
        </Text>
        <View style={styles.sectionLine}/>
        
        <View style={styles.spread}>
          <Text style={styles.total}>Subtotal</Text>
          <Text style={styles.total}>${subtotal}</Text>
        </View>
        <View style={styles.spread}>
          <Text style={styles.total}>Fees and taxes</Text>
          <Text style={styles.total}>${feesAndTaxes}</Text>
        </View>
        <View style={styles.spread}>
          <Text style={styles.total}>Total</Text>
          <Text style={styles.total}>${total}</Text>
        </View>

        <View style={styles.sectionLine}/>

        <TouchableOpacity onPress={() => {}} activeOpacity={.5}>
          <Text style={styles.termsOfSale}>
            By tapping "Send Request" you agree to our 
            <Text style={{color: '#3E8E8A', fontSize: wp('3.8'),}}> terms of sale.</Text>
          </Text>
        </TouchableOpacity>

        <ConfirmBtn onPress={sendRequest} text="Send Request"/>

      </ScrollView>

    </Block>
  )
}

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    color: '#000',
    fontFamily: 'OpenSans-Regular',
    fontSize: wp('5'),
    marginTop: wp('4')
  },
  or: {
    textAlign: 'center',
    color: '#000',
    fontFamily: 'OpenSans-Regular',
    fontSize: wp('4'),
    marginVertical: hp('1')
  },
  sectionTitle: {
    color: '#000',
    fontFamily: 'OpenSans-Regular',
    fontSize: wp('5'),
    marginLeft: wp('7')
  },
  sectionLine: {
    height: 1,
    backgroundColor: '#c2c2c2',
    width: wp('90'),
    alignSelf: 'center',
    marginVertical: wp('3')
  },
  spread: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: wp('7'),
    marginVertical: wp('2')
  },
  service: {
    color: 'dimgrey',
    fontFamily: 'OpenSans-Regular',
    fontSize: wp('5'),
  },
  price: {
    color: 'dimgrey',
    fontFamily: 'OpenSans-SemiBold',
    fontSize: wp('4.5'),
  },
  addMethodBtn: {
    marginHorizontal: wp(7),
    borderRadius: 5,
    borderColor: '#69A2B0',
    borderWidth: 1,
    padding: wp('2'),
    paddingHorizontal: wp('6'),
  },
  addMethodText: {
    color: 'dimgrey',
    fontFamily: 'OpenSans-Regular',
    fontSize: wp('4.5'),
  },
  termsOfSale: {
    marginHorizontal: wp('7'),
    marginVertical: wp('2'),
    fontSize: wp('3.8'),
  },
  total: {
    color: 'dimgrey',
    fontFamily: 'OpenSans-SemiBold',
    fontSize: wp('4'),
  },
  brand: {
    color: 'dimgrey',
    fontFamily: 'OpenSans-SemiBold',
    fontSize: wp('4'),
  },
  card: {
    color: 'dimgrey',
    fontFamily: 'OpenSans-Regular',
    fontSize: wp('4'),
    textAlign: 'center',
  },
  option1: {
    marginHorizontal: wp(7),
    borderRadius: 5,
    borderColor: '#69A2B0',
    borderWidth: 1,
    padding: wp('2'),
    paddingHorizontal: wp('6'),
  },
})

export default Checkout