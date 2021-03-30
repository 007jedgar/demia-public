import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from 'react-native'
import FastImage from 'react-native-fast-image'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
import {
  ScaledSheet
} from 'react-native-size-matters'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import { connect } from 'react-redux'
import {
  Block,
  BackNavBar
} from '../../common'
import {
  ConfirmBtn
} from '../../buttons'

function BlockedTaUsers(props) {
  const [ blockedUsers, setBlockedUsers] = useState([])
  
  useEffect(() => {
    const user = auth().currentUser

    const unsub = firestore()
    .collection('users').doc(user.uid)
    .collection('blocked_users')
    .onSnapshot((querySnap) => {
      if (querySnap.empty) {
        setBlockedUsers([])
      }

      let blockedUsers = []
      querySnap.forEach((doc) => {
        blockedUsers.push({ ...doc.data(), id: doc.id })
      })

      setBlockedUsers(blockedUsers)
    }, (err) => {
      console.log(err)
    })

    return () => unsub()
  }, [])

  const unblock = async (item) => {
    try {
      const user = auth().currentUser
      
      let role = item.isTa?'teacher_assistants':'users'

      firestore()
      .collection(role).doc(user.uid)
      .collection('message_threads').doc(item.user.id)
      .update({
        blockedBy: firestore.FieldValue.arrayRemove(user.uid),
        isBlocked: false
      })

      item.ref.update({
        blockedBy: firestore.FieldValue.arrayRemove(user.uid),
        isBlocked: false,
      })

      firestore()
      .collection('users').doc(user.uid)
      .collection('blocked_users').doc(item.id)
      .delete()

    } catch(err) {
      console.log(err)
    }
  }

  const renderLoading = () => {

  }

  const empty = () => {
    return (
      <Text style={styles.empty}>No blocked users</Text>
    )
  }

  return (
    <Block>
      <BackNavBar 
        title="Blocked Users"
      />

      <FlatList 
        ListEmptyComponent={empty()}
        data={blockedUsers}
        renderItem={({item}) => (
          <View style={styles.userCard}>
            <Text style={styles.name}>{item.user.name}</Text>
            <TouchableOpacity 
              onPress={() => unblock(item)} 
              style={styles.btn}
            >
              <Text style={styles.unblockText}>Unblock</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={item => item.id}
      />

    </Block>
  )
}

const styles = ScaledSheet.create({
  userCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: wp('10'),
    marginVertical: hp('1'),
    borderRadius: 2,
    borderBottomColor: '#000',
    borderBottomWidth: 1,


  },
  btn: {
    
    borderRadius: 4,
    borderColor: 'dimgrey',
    borderWidth: 1, 
    margin: wp('2'),
    padding: wp('2'),
  },
  name: {
    fontFamily: 'Montserrat-Regular',
    fontSize: wp('4.5'),
    alignSelf: 'center',
  },
  unblockText: {

  },
  empty: {
    fontFamily: 'Montserrat-Regular',
    fontSize: wp('4.5'),
    alignSelf: 'center',    
    marginVertical: hp('2')
  },
})

const mapStateToProps = state => {
  const { meeting, meetingProfile } = state.meeting
  const { profile } = state.auth

  return {
    meeting,
    meetingProfile,
    profile
  }
}

const mapDispatchToState = {

}

export default connect(mapStateToProps, mapDispatchToState)(BlockedTaUsers)