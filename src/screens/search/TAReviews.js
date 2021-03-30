import React, {useState, useEffect} from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import Spinny from 'react-native-spinkit'
import FastImage from 'react-native-fast-image'
import { 
  Block,
  BackNavBar,
} from '../../common'
import {
  BasicInput1,
} from '../../containers'
import {
  ConfirmBtn,
  BubbleBackBtn,
} from '../../buttons'
import Icons from '@assets/icons'
import moment from 'moment'
import { times } from 'lodash'

const ReviewCard = ({item}) => {
  let stars = times(item.rating, String)
  return (
    <TouchableOpacity style={styles.reviewCard}>
      <View style={{flexDirection: 'row'}}>
        <Text style={styles.reviewAuthor}>{item.author.name}</Text>
        <Text style={styles.reviewDate}>{moment.unix(item.date._seconds).fromNow()}</Text>
      </View>
      <View style={{flexDirection: 'row'}}>
        {
          stars.map((star) => {
            return (
              <FastImage 
                key={star}
                source={Icons.yellowStar}
                style={{
                  width: wp('5'),
                  height: wp('5'),
                }}
              />
            )
          })
        }
        <Text style={{alignSelf: 'center', color: '#454545', marginLeft: wp(1)}}>{item.rating}/5</Text>
      </View>

      <Text style={styles.review}>
        {item.review}
      </Text>
    </TouchableOpacity>
      
  )
}


function TAReviews(props) {
  const [ isLoading, toggleLoading ] = useState(false)
  const [ reviews, setReviews ] = useState([])
  const [ ta, setTa ] = useState(props.route.params.ta)
  const [ currentUser, setCurrentUser ] = useState(props.route.params.currentUser)

  useEffect(() => {
    toggleLoading(true)

    let unsub = firestore()
    .collection('teacher_assistants').doc(ta.id)
    .collection('reviews')
    .onSnapshot((querySnap) => {
      if (querySnap.empty) {
        toggleLoading(false)
        return setReviews([])
      }

      let reviews = []
      querySnap.forEach((doc) => {
        let review = { ...doc.data(), id: doc.id }
        reviews.push(review)
      })

      setReviews(reviews)
      toggleLoading(false)
    })

    return () => {
      unsub()
    }
  }, [])

  const writeAReview = () => {
    props.navigation.navigate('reviewTA', {ta, currentUser})
  }

  const renderEmpty = () => {
    return (
      <View>
        <Text style={styles.empty}>There are no written reviews yet.</Text>
      </View>
    )
  }

  return (
    <Block>
      <BackNavBar title="TA Reviews"/>

      <View style={styles.topView}>
        <FastImage 
          source={{uri: ta.profilePic}}
          style={styles.profilePic}
        />

        <View style={{ flex: 1}}>
          
          <Text style={styles.header}>{ta.name}</Text>
          <Text style={styles.subHeader}>Rating and reviews</Text>

          <TouchableOpacity style={styles.writeBtn} onPress={writeAReview}>
            <Text style={styles.writeText}>Write a review</Text>
          </TouchableOpacity>

        </View>

      </View>


      <FlatList 
        data={reviews}
        renderItem={({item}) => <ReviewCard item={item}/>}
        keyExtractor={item => item.id}
        ListEmptyComponent={renderEmpty()}
      />
    </Block>
  )
}

const styles = StyleSheet.create({
  profilePic: {
    width: wp('20'),
    height: wp('20'),
    borderRadius: 3,
    marginRight: wp('2'),
  },
  topView: {
    flexDirection: 'row', 
    margin: wp('3'), 
    borderColor: '#c2c2c2', 
    borderBottomWidth: 1,
    padding: wp(2)
  },
  writeBtn: {
    marginVertical: wp(3),
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 4,
  },
  writeText: {
    textAlign: 'center',
    fontFamily: 'OpenSans-Regular',
    fontSize: wp('4'),
  },
  empty: {
    textAlign: 'center',
    fontFamily: 'OpenSans-Regular',
  },
  header: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: wp('4'),
  },
  subHeader: {
    fontFamily: 'OpenSans-Regular',
    fontSize: wp('4'),
  },
  reviewCard: {
    padding: wp('2'),
    marginHorizontal: wp('2'),
    borderBottomColor: '#c2c2c2',
    borderBottomWidth: 1,
  },
  reviewAuthor: {
    marginRight: wp('4'),
    fontFamily: 'OpenSans-Regular',
    fontSize: wp('4'),
  },
  reviewDate: {
    fontFamily: 'OpenSans-Regular',
    fontSize: wp('4'),
  },
  review: {
    fontFamily: 'OpenSans-Regular',
    fontSize: wp('4'),
  },
})

export default TAReviews