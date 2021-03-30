import React from 'react'
import {
  Text,
  View,
  StyleSheet
} from 'react-native'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
import Icons from '@assets/icons'

function EmptySubscriptionCard(props) {
  const parseIcon = () => {

    return Icons.documentIcon
  }

  return (
    <View style={styles.card}>
      <View style={styles.imgContainer} />

      

      <View style={styles.details}>
        <View style={styles.groupName} />

        <View style={styles.info} />

        <View style={styles.comment}>
          <Text style={styles.eventDetail}>There are no subscribed events. 
            You can subscribe to certain parts of a 
            group to be updated when something happens.
          </Text>
        </View>

      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    shadowColor: 'black',
    shadowOffset: { x: 1, y:1},
    shadowRadius: 2,
    shadowOpacity: .6,
    elevation: 1,

    flexDirection: 'row',
    marginHorizontal: wp('3'),
    marginVertical: hp('1'),
    backgroundColor: '#fff',
    borderRadius: 4,
    padding: wp('2'),
  },
  subIcon: {
    width: wp('8'),
    height: wp('8'),
  },
  imgContainer: {
    alignSelf: 'center',
    marginHorizontal: wp('2'),
    backgroundColor: '#DBE9EE',
    width: wp('10'),
    height: wp('10'),
  },
  groupName: {
    height: wp('4'),
    width: wp('40'),
    backgroundColor: 'dimgrey',
    
  },
  details: {
    marginHorizontal: wp('2'),
    flex: 1,
  },
  comment: {
    borderLeftColor: 'dimgrey',
    borderLeftWidth: 2,
    paddingLeft: wp('2.4'),
    justifyContent: 'center',
  },
  info: {
    height: wp('3.7'),
    width: wp('70'),
    marginVertical: hp('.6'),
    backgroundColor: '#DBE9EE',
  },  
  eventDetail: {
    fontFamily: 'OpenSans-Regular',
    fontSize: wp('3.6')
  },
})

export {EmptySubscriptionCard}