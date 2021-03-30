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


const ActivityCard = ({item, }) => {
  return (
    <View style={styles.activityCard}>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.date}>{moment.unix(item.date._seconds).format('MMM do YYYY, h:mm a')}</Text>
    </View>
  )  
}

function TAPayments(props) {
  const [ currentUser, setCurrentUser ] = useState({})
  const [ weeklyEarned, setWeeklyEarned ] = useState(15.00)
  const [ balance, setBalance ] = useState(0)
  const [ activities, setActivities ] = useState([])
  const [ error, setError ] = useState('')
  const [ isLoading, toggleLoading ] = useState(true)
  
  useEffect(() => {
    toggleLoading(true)
    let user = auth().currentUser

    firestore()
    .collection('teacher_assistants').doc(user.uid)
    .get().then((doc) => {
      setCurrentUser({ ...doc.data(), id: doc.id })
    }).catch((err) => console.log(err))
    
    firestore()
    .collection('teacher_assistants').doc(user.uid)
    .collection('activities')
    .get().then((querySnap) => {
      if (querySnap.exists) {
        return setActivities([])
      }

      let activites = []
      querySnap.forEach((doc) => {
        activites.push({ ...doc.data(), id: doc.id })
      })
      setActivities(activites)
    }).catch((err) => console.log(err)) 

  }, [])

  const renderEmtpty = () => {
    return (
      <View>
        <Text style={{
          textAlign: 'center',
          fontFamily: 'OpenSans-Regular',
          fontSize: wp('4'),
        }}>No activity</Text>
      </View>
    )
  }

  return (
    <Block>
      <BackNavBar title="Activity"/>
      {/* header */}
      <View style={{
        flexDirection: 'row', 
        margin: wp('2'),
        marginBottom: wp(0),
        padding: wp('2'),
        borderBottomColor: '#c2c2c2',
        borderBottomWidth: 1,
        }}>
        <FastImage 
          source={{uri: currentUser.profilePic}}
          style={styles.profilePic}
        />
        <View>
        <Text>Joined {moment(currentUser.joined).format('MMM YYYY')}</Text>
          <Text style={styles.email}>{currentUser.email}</Text>
          {/* <TouchableOpacity activeOpacity={.7}>
            <Text style={[styles.viewOnStripe,{textAlign: 'left'}]}>View Stripe account</Text>
          </TouchableOpacity> */}
        </View>
      </View>

      {/* Balance */}

      {/* <View style={{flexDirection: 'row',  marginVertical: wp('2'), marginHorizontal: wp('5')}}>
        <View style={{marginRight: wp('10') }}>
          <Text>This Week</Text>
          <Text style={styles.moneyAmount}>${weeklyEarned.toFixed(2)}</Text>
        </View>
        
        <View >
          <Text>Your Balance</Text>
          <Text style={styles.moneyAmount}>${balance.toFixed(2)}</Text>
        </View>
      </View> */}

        <View style={{ marginHorizontal: wp('5'), }}>
          {balance?<TouchableOpacity style={styles.payoutBtn}>
            <Text style={styles.payoutBtnText}>Pay out now</Text>
          </TouchableOpacity>:null}
          {/* <TouchableOpacity activeOpacity={.7}>
            <Text style={styles.viewOnStripe}>View payouts on Stripe</Text>
          </TouchableOpacity> */}
        </View>

      {/* recent services */}
      {/* <Text style={styles.listHeader}>Recent Services</Text> */}
      <FlatList 
        data={activities}
        renderItem={({item}) => <ActivityCard item={item}/>}
        keyExtractor={item => item.id}
        ListEmptyComponent={renderEmtpty()}
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
    fontSize: wp('4.5'),
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
  activityCard: {
    marginHorizontal: wp(2),
    marginVertical: wp(1),
    borderColor: '#c2c2c2',
    borderWidth: 1,
    borderRadius: 4,
    padding: wp(2),
  },
  description: {
    color: '#000',
    fontFamily: 'OpenSans-Regular',
    fontSize: wp('4'),
    marginBottom: wp('1')
  },
  date: {
    color: 'dimgrey',
    fontFamily: 'OpenSans-Regular',
    fontSize: wp('4'),
    // marginBottom: wp('2')
  },
})

export default TAPayments