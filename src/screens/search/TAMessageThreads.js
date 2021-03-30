import React, {useEffect, useState} from 'react'
import {
  StyleSheet,
  Text,
  FlatList,
  View,
  TouchableOpacity,
} from 'react-native'
import {
  Block,
} from '../../common'
import {
  BubbleBackBtn,
} from '../../buttons'
import {
 widthPercentageToDP as wp,
 heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
import {
  EmptyThread,
} from '../../emptyOrError'
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import FastImage from 'react-native-fast-image'
import Spinny from 'react-native-spinkit'



const ThreadCard = ({ item, onPress, isTa}) => {
  let imageLinks = [
    'https://firebasestorage.googleapis.com/v0/b/tickets-79e75.appspot.com/o/mobile_assets%2Fpluto-100.png?alt=media&token=40cfaa15-1b13-485a-96be-9d30333cbad3',
    'https://firebasestorage.googleapis.com/v0/b/tickets-79e75.appspot.com/o/mobile_assets%2Fpluto-101.png?alt=media&token=2b34c09f-67d0-40bd-b1c7-e77e4d19bda5',
    'https://firebasestorage.googleapis.com/v0/b/tickets-79e75.appspot.com/o/mobile_assets%2Fpluto-104.png?alt=media&token=b6e0b44d-f483-4b94-878b-18d4694f0cf9',
    'https://firebasestorage.googleapis.com/v0/b/tickets-79e75.appspot.com/o/mobile_assets%2Fpluto-109.png?alt=media&token=d5719271-d59f-440c-b4fe-dc24138faec4',
    'https://firebasestorage.googleapis.com/v0/b/tickets-79e75.appspot.com/o/mobile_assets%2Fpluto-122.png?alt=media&token=148a9397-e194-418d-a5cf-3c337cac8246',
    'https://firebasestorage.googleapis.com/v0/b/tickets-79e75.appspot.com/o/mobile_assets%2Fpluto-128.png?alt=media&token=fb6341a5-aa7f-4540-ad93-3decca97e933',
    'https://firebasestorage.googleapis.com/v0/b/tickets-79e75.appspot.com/o/mobile_assets%2Fpluto-131.png?alt=media&token=258b1d2d-d23c-4b4c-9bf9-3121c1ce1ead',
    'https://firebasestorage.googleapis.com/v0/b/tickets-79e75.appspot.com/o/mobile_assets%2Fpluto-458.png?alt=media&token=34ba6585-23c8-422d-89d1-c18f14ccd22d',
  ]

  let rndm = Math.floor(Math.random() * 9)
  if (isTa) {
    return (
      <TouchableOpacity onPress={onPress} style={styles.threadCard} activeOpacity={.8}>
        <View style={styles.threadCardContainer}>
          <FastImage 
            source={{ uri: imageLinks[rndm] }}
            style={styles.customerPic}
            resizeMode="contain"
          />

          <View>
            <Text style={styles.name}>{`${item.customer.firstName} ${item.customer.lastName}`}</Text>
            <Text style={styles.lastMsg}>{item.lastMessage}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
  return (
    <TouchableOpacity onPress={onPress} style={styles.threadCard} activeOpacity={.8}>
      <View style={styles.threadCardContainer}>
        <FastImage 
          source={{ uri: item.ta.taProfilePic }}
          style={styles.profilePic}
        />

        <View>
          <Text style={styles.name}>{item.ta.name}</Text>
          <Text style={styles.lastMsg}>{item.lastMessage}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

function TAMessageThreads(props) {
  const [ threads, setThreads ] = useState([])
  const [ isLoading, toggleLoading ] = useState(false)
  const [ taMode, toggleTa ] = useState(false)

  useEffect(() => {
    toggleLoading(true)
    const user = auth().currentUser

    firestore()
    .collection('users').doc(user.uid)
    .get().then((doc) => {
      if (doc.data().taMode) {
        toggleTa(true)
        getTaThreads()
      } else {
        toggleTa(false)
        getUserThreads()
      }
    }).catch((Err) => {
      toggleLoading(false)
    })

  }, [])

  const getUserThreads = () => {
    const user = auth().currentUser

    firestore()
    .collection('users').doc(user.uid)
    .collection('message_threads')
    .get()
    .then((querySnap) => {
      if (querySnap.empty) {
        toggleLoading(false)
        return setThreads([])
      }

      let threads = []
      querySnap.forEach((doc) => {
        threads.push({ ...doc.data(), id: doc.id, readRef: doc.ref })
      })

      setThreads(threads)
      toggleLoading(false)
    })
    .catch((err) => {
      toggleLoading(false)
    })
  }

  const getTaThreads = () => {
    const user = auth().currentUser

    firestore()
    .collection('teacher_assistants').doc(user.uid)
    .collection('message_threads').get()
    .then((querySnap) => {
      if (querySnap.empty) {
        toggleLoading(false)
        return setThreads([])
      }

      let threads = []
      querySnap.forEach((doc) => {
        threads.push({ ...doc.data(), id: doc.id, readRef: doc.ref })
      })

      setThreads(threads)
      toggleLoading(false)
    })
    .catch((err) => {
      toggleLoading(false)
    })
  }


  const toMessageThread = (item) => {
    let thread = item.ref
    props.navigation.navigate('assistantMessenger', {item, customer: item.customer, ta: item.ta, thread, isTa: taMode })
  }

  const renderLoading = () => {
    if (isLoading) {
      return (
        <View style={{ alignSelf: 'center', marginTop: hp(3) }}>
          <Spinny type="Arc" size={wp(8)} color="#454545" />
        </View>
      )
    }
  }

  const renderEmpty = () => {
    return (
      <EmptyThread />
    )
  }

  return (
    <Block>
      <BubbleBackBtn />

      <FlatList 
        ListHeaderComponent={isLoading?renderLoading():<Text style={styles.header}>messages</Text>}
        data={threads}
        keyExtractor={item => item.id}
        renderItem={({item}) => {
          return (
            <ThreadCard 
              item={item} 
              onPress={() => {
                if (item.isBlocked) return alert(`You have blocked this user. To unblock, navigate to the blocked users list in "personal info".`)
                toMessageThread(item)
              }}
              isTa={taMode}
            />
          )
        }}
        ListEmptyComponent={renderEmpty()}
      />
    </Block>
  )
}

const styles = StyleSheet.create({
  header: {
    textAlign: 'center',
    marginVertical: hp('3'),
    fontFamily: 'OpenSans-SemiBold',
    color: 'dimgrey',
    fontSize: wp('4')
  },
  threadCard: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1},
    shadowOpacity: .2,
    margin: wp(2),
    marginHorizontal: wp('4')
  },
  threadCardContainer: {
    flexDirection: 'row',
    padding: wp('3'),
  },
  profilePic: {
    width: wp('14'),
    height: wp('14'),
    borderRadius: wp('7'),
  },
  customerPic: {
    width: wp('14'),
    height: wp('14'),
  },
  name: {
    fontFamily: 'OpenSans-Regular',
    color: 'dimgrey',
    fontSize: wp('4.5'),
    margin: wp('1'),
    marginHorizontal: wp('5'),
  },
  lastMsg: {
    flex: 1,
    fontFamily: 'OpenSans-Regular',
    color: '#454545',
    fontSize: wp('4'),
    marginHorizontal: wp('5'),
  },
})

export default TAMessageThreads