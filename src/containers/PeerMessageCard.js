import React, {useState, useEffect, useRef } from 'react'
import {
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  Text,
  Linking,
} from 'react-native'
import auth from '@react-native-firebase/auth'
import FastImage from 'react-native-fast-image'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Icons from '@assets/icons'
import moment from 'moment'

function PeerMessageCard({ item, onLongPress, onViewImages }) {
  const orders = [ 'Example Problems', 'Homework Check']
  const displayDate = () => {
    let now = item.date._seconds
    if (now > 86400) {
      return moment.unix(item.date._seconds).format('MMM Do YYYY, h:mm a')
    }
    else return moment.unix(item.date._seconds).fromNow()
  }
  if (item.author.id === auth().currentUser.uid) {
    return (
      <TouchableOpacity  onLongPress={onLongPress} activeOpacity={.7} style={styles.meContainer}>
        <View>

        
          <View style={styles.imgContainer}>
            {item.images.map((img, i) => {
              return <TouchableOpacity onPress={onViewImages} key={i+1}>
                <FastImage 
                  source={{uri: img }}
                  style={styles.imgages}
                />
              </TouchableOpacity>
            })}
          </View>

          <Text style={styles.meInfo}>{item.text}</Text>
          
            {item.file?<TouchableOpacity onPress={() => Linking.openURL(item.file.url)} activeOpacity={.8} style={styles.attachment}>
              <Text style={styles.attachmentText}>{item.file.name}</Text>
              <Text style={styles.attachmentText}>{(item.file.size/1000000).toFixed(2)}MB</Text>
            </TouchableOpacity>:null}
          
          <Text style={styles.meTime}>{displayDate()}</Text>
        </View>
      </TouchableOpacity>      
    )
  }

  return (
    <TouchableOpacity activeOpacity={.7} style={styles.container}>
      <View>
        
        <Text style={styles.info}>{item.text}</Text>

        {item.file?<TouchableOpacity onPress={() => Linking.openURL(item.file.url)} activeOpacity={.8} style={styles.attachment}>
          <Text style={styles.attachmentText}>{item.file.name}</Text>
          <Text style={styles.attachmentText}>{(item.file.size/1000000).toFixed(2)}MB</Text>
        </TouchableOpacity>:null}

        
        <Text style={styles.time}>{moment.unix(item.date._seconds).fromNow()}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    margin: wp(2),
    padding: wp(2),
    backgroundColor: '#D6E5EA',
    alignSelf: 'flex-start',

    borderRadius: 5,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 20,
    borderTopRightRadius: 20,
  },
  meContainer: {
    margin: wp('4'),
    padding: wp(2),
    backgroundColor: '#7ca5f2',
    alignSelf: 'flex-end',

    borderRadius: 5,
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 20,
    borderTopLeftRadius: 20,
  },
  info: {
    fontFamily: 'OpenSans-Regular',
    fontSize: wp('4'),
  },
  meInfo: {
    fontFamily: 'OpenSans-Regular',
    fontSize: wp('4'),
    color: '#fff',
    
  },
  time: {
    textAlign: 'center',
    color: 'dimgrey',
    margin: wp('2')
  },  
  meTime: {
    textAlign: 'center',
    color: '#fff',
    margin: wp('2'),
  },  
  btn: {
    flex: 1,
    marginHorizontal: wp(1),
    marginTop: wp('2')
  },
  accept: {
    textAlign: 'center',
    margin: wp('2'),
    fontSize: wp('4.5'),
    fontFamily: 'OpenSans-Regular',
  },
  deny: {
    textAlign: 'center',
    margin: wp('2'),
    fontSize: wp('4.5'),
    fontFamily: 'OpenSans-Regular',
  },
  attachment: {
    backgroundColor: '#DBE9EE',
    borderRadius: 4,
    padding: wp(1),
  },
  attachmentText: {
    fontFamily: 'OpenSans-Regular',
  },
  imgages: {
    width: wp('20'),
    height: wp('20'),
    borderRadius: 5,
    margin: wp(1),
  },
  imgContainer: {
    flexDirection: 'row',
    maxWidth: wp('70'),
    flexWrap: 'wrap',
  },
})

export {PeerMessageCard}