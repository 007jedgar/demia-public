import React, { useState, useRef, useEffect } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native'

import { BackNavBar, Block, } from '../../common'
import { BasicInput1 } from '../../containers'
import {
  ConfirmBtn,
  SelectableBtn,
} from '../../buttons'
import {
  TotalModal,
} from '../../modals'
import { connect } from 'react-redux'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import Icons from '@assets/icons'
import FastImage from 'react-native-fast-image'


function TutorProfile(props) {
  const [ message, setMessage ] = useState('')
  const [ descriptionLines, setDescriptionLines ] = useState(4)
  const [ services, selectServices ] = useState(props.route.params.item.services)
  const [ isTa, toggleTa ] = useState(false)
  const [ currentUser, setCurrentUser] = useState({})
  const [ ta, setTa ] = useState(props.route.params.item)
  const [ showTotalModal, toggleTotalModal ] = useState(false)
  const [ showCustomPromt, togggleCustomerPrompt] = useState(false)
  const [ pricing, setPricing ] = useState({
    subtotal: 0,
    taxesAndFees: 0,
    total: 0
  })

  useEffect(() => {
    let user = auth().currentUser

    firestore().collection('users').doc(user.uid)
    .get().then((doc) => {
      setCurrentUser({...doc.data(), id: doc.id })
      if (doc.data().taMode) toggleTa(true)
    }).catch((err) => {
      console.log(err)
    })

    return () => {
      let newServices = []
      newServices = services.map((service) => {
        service.optionSelected = false
        return services
      })
      costOfServices()
      return selectServices(newServices)
    }
  }, [])

  let item = props.route.params.item

  const costOfServices = () => {
    let selectedPrice = 0
    let serNum = 0


    let selected = []
    services.forEach((ser, i) => {
      if (ser.optionSelected) {
        togggleCustomerPrompt(true)
        selected.push(i)
        if (ser.price) {
          togggleCustomerPrompt(false)
          serNum+=1
          selectedPrice = selectedPrice + parseFloat(ser.price, 10)
        }
      }
    })

    if (!selected.length) togggleCustomerPrompt(false)

    if (serNum == 0) return setPricing({
      subtotal: 0,
      taxesAndFees: 0,
      total: 0,
    })

    let subtotal = selectedPrice.toFixed(2)
    let taxesAndFees = ((selectedPrice * .13) + .30).toFixed(2)
    let total = (parseFloat(selectedPrice) + parseFloat(taxesAndFees)).toFixed(2)

    return setPricing({
      subtotal,
      taxesAndFees,
      total,
    })
  }

  const toMessageThread = () => {
    if (isTa) return alert('You are currently in ta mode')

    let custRef = firestore().collection('users').doc(currentUser.id)
    .collection('message_threads').doc(item.id)

    let taRef = firestore().collection('teacher_assistants').doc(ta.id)
    .collection('message_threads').doc(currentUser.id)

    custRef.get().then((doc) => {
      if (!doc.exists) {
        //create message ref
        return firestore().collection('message_threads').add({
          ta: ta,
          taRef: firestore().collection('teacher_assistants').doc(ta.id),
          customer: currentUser,
          customerRef: firestore().collection('users').doc(currentUser.id),
          isBlocked: false,
          blockedBy: [],
        }).then((doc) => {
          return Promise.all([
            custRef.set({
              ref: doc,
              ta: ta,
              customer: currentUser
            }),
            taRef.set({
              ref: doc,
              ta: ta,
              customer: currentUser,  
            })
          ]).then(() => {
            props.navigation.navigate('assistantMessenger', {item, customer: currentUser, ta: ta, thread: doc, isTa: isTa })
          })
        }).catch((err) => console.log(err))
      }

      let thread = doc.data().ref
      props.navigation.navigate('assistantMessenger', {item, customer: currentUser, ta: ta, thread, isTa: isTa })
    }).catch((err) => console.log(err))
  }

  const createRequest = () => {
    if (isTa) {
      return alert('You are currently in TA mode. Change it in the profile screen to access TA requests.')
    }

    let custRef = firestore().collection('users').doc(currentUser.id)
    .collection('message_threads').doc(item.id)

    let taRef = firestore().collection('teacher_assistants').doc(ta.id)
    .collection('message_threads').doc(currentUser.id)
    
    let request = {
      ta: item,
      author: currentUser,
      customer: currentUser,
      message: message.trim(),
      services,
      subtotal: pricing.subtotal,
      taxesAndFees: pricing.taxesAndFees,
      total: pricing.total,
      status: 'pending',
      type: 'request',
      date: firestore.Timestamp.now(),
      files: [],
      images: [],
    }
    // props.navigation.navigate('checkout', {request})

    firestore().collection('users').doc(currentUser.id)
    .collection('message_threads').doc(item.id)
    .get().then((doc) => {
      if (!doc.exists) {
        //create message ref
        return firestore().collection('message_threads').add({
          ta: item,
          taRef: firestore().collection('teacher_assistants').doc(item.id),
          customer: currentUser,
          customerRef: firestore().collection('users').doc(currentUser.id)
        }).then((doc) => {
          Promise.all([
            custRef.set({
              ref: doc,
              ta: item,
              customer: currentUser
            }),
            taRef.set({
              ref: doc,
              ta: item,
              customer: currentUser,  
            }),
            doc.collection('messages').add(request)
          ]).then(() => {
            props.navigation.navigate('assistantMessenger', {item, customer: currentUser, ta: item, thread: doc, isTa: isTa })
          })
        }).catch((err) => console.log(err))
      }

      let threadRef = doc.data().ref
      threadRef.collection('messages').add(request)
      .then(() => {
        props.navigation.navigate('assistantMessenger', { item, customer: currentUser, ta: item, thread: threadRef, isTa: isTa })
      })
    })
  }

  const showReviews = () => {
    props.navigation.navigate('taReviews', { ta, currentUser})
  }

  return (
    <Block>
      <BackNavBar title={item.name}/>
      <ScrollView style={{flex: 1}}>

        <View style={styles.top}>

            <FastImage 
              source={{uri: item.profilePic}}
              style={{
                width: wp('25'),
                height: wp('25'),
                borderRadius: 3,
                marginRight: wp('2'),
                // alignSelf: 'center',
              }}
            />
              
          <View style={{flex: 1}}>
            <View style={{flexDirection: 'row'}}>
              <FastImage 
                source={Icons.yellowStar}
                style={styles.star}
              />
              <Text style={styles.ratingQuality}>{item.rating.toFixed(1)} ({item.ratingNum})</Text>
              <TouchableOpacity onPress={showReviews} style={styles.reviewBtn} >
                <Text style={styles.reviews}>Reviews</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.highschool}>Kingwood High School</Text>
           
            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
              {item.services.map((ser, i) => ser.selected?<Text key={i+1} style={styles.toh}>{ser.name}  </Text>:null)}
            </View>

            <TouchableOpacity 
              style={styles.messageBtn}
              onPress={toMessageThread}
            >
              <Text style={styles.messageBtnText}>Message</Text>
            </TouchableOpacity>
          </View>
        </View>
        

        <View style={{height: hp(1)}}/>

        <TouchableOpacity onPress={() => {
          if (descriptionLines !== 4 ) return setDescriptionLines(4)
          setDescriptionLines(item.description.length/40 + 2)
        }} activeOpacity={.8}>
          <View style={styles.descriptionContainer}>
            <Text numberOfLines={descriptionLines} style={styles.description}>
              {item.description}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.skillsContainer}>
          {item.skills.split(', ').map((skill, i) => {
            return (
              <View key={i+1} style={styles.skillCard}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            )
          })}
        </View>

        <View style={{height: hp(1)}}/>
        

        <Text style={styles.subHeader}>Select service(s)</Text>
        <View style={{ width: wp(90),  marginHorizontal: wp('4')}}>
          {services.map((service, i) => {
            if (service.selected) {
              return <SelectableBtn 
                key={i+1}
                selected={service.optionSelected} 
                textStyle={{textAlign:'left', marginLeft: wp(5)}} 
                option={`${service.name} ${service.price?'$':''}${service.price}`}
                onPress={() => {
                  if (service.optionSelected) {
                    let newServices = [ ...services ]
                    newServices[i].optionSelected = false
                    costOfServices()
                    return selectServices(newServices)
                  }
                  
                  let newServices = [ ...services ]
                  newServices[i].optionSelected = true
                  selectServices(newServices)
                  costOfServices()
                }}
              />
            }
          })}


        </View>

        {showCustomPromt?<View>
          <TouchableOpacity onPress={() => toggleTotalModal(!showTotalModal)} style={{marginVertical: hp(2)}}>
            <Text style={[styles.changeTotal, {textAlign: 'center'}]}>Create custom request</Text>
          </TouchableOpacity>

          <Text style={styles.subHeader}>Total: ${pricing.total}</Text>

          <BasicInput1 
              value={message}
              onChangeText={setMessage}
              placeholder="add a message"
              multiline={true}
              maxHeight={hp('10')}
            />
            <ConfirmBtn onPress={createRequest} text="Request"/>
        </View>:null}
        
        {pricing.total && !showCustomPromt?<View>
          <Text style={styles.subHeader}>Services Subtotal: ${pricing.subtotal}</Text>
          <Text style={styles.subHeader}>Taxes and fees: ${pricing.taxesAndFees}</Text>
          <View style={{flexDirection: 'row'}}>
          
          <Text style={styles.subHeader}>Total: ${pricing.total}</Text>
          
          <TouchableOpacity onPress={() => toggleTotalModal(!showTotalModal)} activeOpacity={.7}>
            <Text style={styles.changeTotal}>Change Total</Text>
          </TouchableOpacity>
          
          </View>
          <Text style={styles.disclaimer}>Demia does not currently facilitate any payments. We suggest cashapp, venmo, or paypal for the neartime. Requests may be used for each parties records</Text>
          {/* <Text style={styles.disclaimer}></Text> */}
          <View style={{height: hp(2)}}/>

            <BasicInput1 
              value={message}
              onChangeText={setMessage}
              placeholder="add a message"
              multiline={true}
              maxHeight={hp('10')}
            />
            <ConfirmBtn onPress={createRequest} text="Request"/>
        </View>:null}

      </ScrollView>

      <TotalModal 
        visible={showTotalModal} 
        toggleModal={() => toggleTotalModal(!showTotalModal)} 
        onCancel={() => toggleTotalModal(!showTotalModal) } 
        onAccept={(newPrice) => {
          setPricing({
            subtotal: 'custom price',
            taxesAndFees: 'custom price',
            total: parseFloat(newPrice, 10).toFixed(2),
          })
          toggleTotalModal(!showTotalModal)
        }}
        currentPrice={pricing.total}
      />

    </Block>
  )
}

const mapStateToProps = state => {
  return {

  }
}

const styles = StyleSheet.create({
  contianer: {
    margin: wp('2'),
    padding: wp('2'),
    borderRadius: 4,
    backgroundColor: '#fff',
    shadowColor: '#81B29A',
    shadowOffset: { x: 1, y:2},
    shadowRadius: 3,
    shadowOpacity: .6,
    elevation: 1,
  },
  subHeader: {
    marginLeft: wp('6'),
    fontFamily: 'Montserrat-Regular',
    fontSize: wp('4.5'),
    color: 'dimgrey',
  },
  top: {
    flexDirection: 'row',
    marginHorizontal: wp(3),
    marginTop: hp(1),
  
  },
  bottom: {
    flexDirection: 'row',
    marginTop: wp('2'),
    margin: wp('1'),
  },
  ratingQuality: {
    alignSelf: 'center',
    fontFamily: 'Montserrat-Regular',
    fontSize: wp('4'),
    color: 'dimgrey',
  },
  ratingQuantity: {
    alignSelf: 'center',
    fontFamily: 'Montserrat-Regular',
    fontSize: wp('4.5'),
    color: 'dimgrey',
  },
  toh: {
    // flex: 1,
    margin: wp('.5'),
    alignSelf: 'center',
    fontFamily: 'Montserrat-Regular',
    fontSize: wp('3'),
    color: '#454545',
  },
  descriptionContainer: {
    backgroundColor: '#fff',
    margin: wp('2'),  
  },
  description: {
    flex: 1,
    margin: wp('1'),
    fontFamily: 'OpenSans-Regular',
    fontSize: wp('4.5'),
    color: '#454545',
  },
  avail: {
    fontFamily: 'OpenSans-Regular',
    fontSize: wp('4'),
    color: 'dimgrey',
  },
  messageBtn: {
    borderRadius: 4,
    borderColor: '#000',
    borderWidth: 1,
    margin: wp('1'),
  },
  messageBtnText: {
    fontSize: wp('4.5'),
    textAlign: 'center',
    fontFamily: 'Montserrat-Regular',
    margin: wp('1')
  },
  star: {
    width: wp('5'),
    height: wp('5'),
    alignSelf: 'center',
  },
  highschool: {
    fontFamily: 'Montserrat-Regular',
    fontSize: wp('3.5'),
    color: 'dimgrey',
    marginLeft: wp(.4)
  },
  disclaimer: {
    margin: wp('2'),
    marginHorizontal: wp('5'),
  },
  changeTotal: {
    marginLeft: wp('6'),
    fontFamily: 'Montserrat-Regular',
    fontSize: wp('4.5'),
    color: '#166088',
  },
  reviewBtn: {
    margin: wp(2)
  },
  reviews: {
    fontFamily: 'OpenSans-Regular',
    textAlign: 'center',
    fontSize: wp('4.5'),
    color: '#166088',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: wp('2'),
  },
  skillText: {
    margin: wp('1'),
    fontFamily: 'OpenSans-Regular',
    fontSize: wp('4.5'),
    color: '#454545',
  },
  skillCard: {
    marginHorizontal: wp('1'),
    marginVertical: wp(1),
    backgroundColor: '#f1f1f1',
    borderRadius: 4,
  },
})


export default connect(mapStateToProps, {})(TutorProfile)