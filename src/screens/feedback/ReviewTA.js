import React, {useState, useEffect} from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import storage from '@react-native-firebase/storage'
import Clipboard from "@react-native-community/clipboard";
import Spinny from 'react-native-spinkit'
import { KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import FastImage from 'react-native-fast-image'
import { 
  Block,
  BackNavBar,
} from '../../common'
import {
  BasicInput1,
  BasicMultilineInput,
  Rating,
} from '../../containers'
import {
  ConfirmBtn
} from '../../buttons'
import Icons from '@assets/icons'

function ReviewTA(props) {
  const [ review, setReview ] = useState('')
  const [ feedback, setFeedback ] = useState('')
  const [ starsCount , setStarsCount ] = useState(5)
  const ta = props.route.params.ta
  const currentUser = props.route.params.currentUser

  const sendReview = () => {

    let user = auth().currentUser
    let _rating = {
      review: review.trim(),
      feedback: feedback.trim(),
      rating: starsCount,
      date: firestore.Timestamp.now(),
      author: currentUser,
    }

    firestore()
    .collection('teacher_assistants').doc(ta.id)
    .collection('reviews').doc(user.uid).set(_rating)
    .then(() => { 
      props.navigation.goBack()
    }).catch((err) => {
      console.log(err)
    })

  }

  return (
    <Block>
      <BackNavBar title="Write a review" />
      <KeyboardAwareScrollView style={{flex: 1}}>

        <Text style={styles.header}>How was your experience with {ta.name}</Text>
        <View style={{marginHorizontal: wp(4), justifyContent: 'center', alignSelf: 'center'}}>
          <Rating 
            rating={starsCount-1}
            onChangeRating={setStarsCount}
          />
        </View>
        
        <BasicInput1 
          multiline={true}
          title="public review"
          value={review}
          onChangeText={setReview}
          placeholder={`How helpful was ${ta.name}`}
        />

        <View style={{marginTop: hp(1)}}/>

        <BasicInput1 
          multiline={true}
          title={`feedback for ${ta.name} only`}
          value={feedback}
          onChangeText={setFeedback}
          placeholder={`What can they improve on?`}
        />

        <ConfirmBtn 
          text="Submit"
          onPress={sendReview}
        />
      </KeyboardAwareScrollView>
      
    </Block>
  )
}

const styles = StyleSheet.create({
  header: {
    fontSize: wp(4),
    fontFamily: 'OpenSans-Regular',
    marginHorizontal: wp(5),
    marginTop: wp(2)
  },
})

export default ReviewTA