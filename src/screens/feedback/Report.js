import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native'
import FastImage from 'react-native-fast-image'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
import {
  ScaledSheet
} from 'react-native-size-matters'

import {
  BasicMultilineInput,
} from '../../containers'
import {
  Block,
  BackNavBar,
} from '../../common'
import {
  ConfirmBtn
} from '../../buttons'
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import Spinny from 'react-native-spinkit'

function Report(props) {
  const [ reason, editReason ] = useState('')
  const [ isLoading, toggleLoading ] = useState(false)
  const [ successMessage, setSuccessMessage ] = useState('')
  const reportedUser = props.route.params.reportedUser
  const currentUser = props.route.params.currentUser
  const disclaimers = [`We take all claims seriously and we will act to protect our user's safety and privacy`]
  console.log(props.item)

  useEffect(() => {

    return () => {
      setSuccessMessage('')
      editReason('')
    }
  }, [])


  const renderFooter = () => {
    if (isLoading) {
      return (
        <View style={{alignSelf: 'center'}}>
          <Spinny color="#000" size={wp(7)} type="Arc" />
        </View>
      )
    } else if (successMessage) {
      return (
        <Text style={styles.success}>{successMessage}</Text>
      )
    } else {
      return (
        <ConfirmBtn 
          text="Submit"
          onPress={report}
        />
      )
    }
  }

  const report = () => {
    toggleLoading(true)
    let report = {
      reason,
      reportedUser,
      author: currentUser,
    }
    
    firestore()
    .collection('reports').add(report)
    .then((doc) => {
      return firestore().collection('users').doc(reportedUser.id)
      .collection('reports').add({
        ref: doc,
        reportedBy: currentUser,
        reason: reason
      })
    }).then(() => {
      toggleLoading(false)
      setSuccessMessage('Report has been successfully sent')
      setTimeout(() => {
        props.navigation.goBack()
      }, 2800)
    }).catch((err) => {
      toggleLoading(false)
      setSuccessMessage('An eror has occurred. Please try again')
      setTimeout(() => {
        props.navigation.goBack()
      }, 2800)
    })
  }


  return (
    <Block>
      <BackNavBar 
        title={'Report'}
      />


      <Text style={styles.disclaimer}>
        {disclaimers[0]}
      </Text>

      <BasicMultilineInput 
        placeholder={`Reason for reporting ${reportedUser.name}`}
        typed={editReason}
        value={reason}
        title={`Reason for reporting ${reportedUser.name}`}
      />

      <View style={{ marginVertical: hp('3')}}/>

      {renderFooter()}
    </Block>
  )
}

const styles = ScaledSheet.create({
  header: {
    fontFamily: 'Montserrat-Regular',
    color: '#000',
    fontSize: wp('4'),
  },
  name: {
    fontFamily: 'OpenSans-Regular',
    color: '#000',
    fontSize: wp('4'),
    marginHorizontal: wp(2)
  },
  disclaimer: {
    fontFamily: 'Montserrat-Regular',
    color: '#000',
    fontSize: wp('4'),
    margin: wp('5'),
  },
  success: {
    fontFamily: 'Montserrat-Regular',
    color: '#4F6D7A',
    fontSize: wp('4'),
    margin: wp('5'),
    textAlign: 'center',
  },
})

export default Report