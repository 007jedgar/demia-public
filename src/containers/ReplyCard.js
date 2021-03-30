import React, {useState, useEffect} from 'react'
import {
  TouchableOpacity,
  Text,
  View,
  FlatList,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp, widthPercentageToDP } from 'react-native-responsive-screen';
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import moment from 'moment'
import { includes } from 'lodash'
import {SubReplyCard} from './SubReplyCard'
import Autolink from 'react-native-autolink';
import Communications from 'react-native-communications';


function ReplyCard({ item, index, onPress, onLongPress, post, onDeepReplyPress, children }) {
  if (!item.author || !item.text) return null;
  const [ replies, setReplies ] = useState([])
  const [ isShowingReplies, toggleReplies ] = useState(false)


  useEffect(() => {
    
  }, [])


  const showReplies = () => {
    let currentComment = item
    if (isShowingReplies) {
      return (
        <View 
          style={{
            marginLeft: wp('2'),
            borderLeftWidth: 1,
            borderLeftColor: '#c2c2c2',
          }}
        >
          <FlatList 
            data={replies}
            inverted={true}
            extraData={replies}
            keyExtractor={item => item.id.toString()}
            renderItem={({item, index}) => (
              <SubReplyCard 
                item={item} 
                currentComment={currentComment}
                post={post}
                onPress={() => onDeepReplyPress(item)}
              />
            )}
          />          
        </View>
      )
    }
  }

  const renderData = () => {
    return (
      <View>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.postAuthor}>{item.author.displayName}</Text>
          <Text style={styles.postTime}>{moment(item.timeSent).fromNow()}</Text>

        </View>
        {/* <Text style={styles.postText}>{item.text}</Text> */}

        <Autolink 
          style={styles.postText} 
          text={item.text} 
          onPress={(url, match) => {
            switch (match.getType()) {
              case 'url':
                return Linking.openURL(url)
              case 'phone':
                return Communications.text(url.split('tel:')[1])
              case 'email':
                return Communications.email(['url', ''],null,null,'','')
              default:
                console.log(match.getType())
            }
          }}
        />

        <TouchableOpacity 
          activeOpacity={.6}
          onPress={() => toggleReplies(!isShowingReplies)}><Text style={styles.commentCountText}>{replies.length?`${isShowingReplies?'Hide Replies':`Show ${replies.length} Repl${replies.length===1?'y':'ies'}`}`:''}</Text></TouchableOpacity>
        
      </View>
    )
  }

  return (
    <TouchableOpacity 
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={.8} 
      style={styles.postCard}
    >
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
      
        <View style={{ flexDirection: 'row' }}>
          {renderData()}
        </View>

      </View>

      {showReplies()}
    </TouchableOpacity>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  postCard: {
    marginHorizontal: wp('3'),
    borderColor: 'dimgrey',
  },
  postAuthor: {
    marginHorizontal: wp(2),
    fontSize: wp('4'),
    fontFamily: 'Montserrat-BoldItalic',
  },
  postTime: {
    marginHorizontal: wp(2),
    fontSize: wp('4'),
    fontFamily: 'Montserrat-MediumItalic',
  },
  postText: {
    color: '#000',
    fontFamily: 'OpenSans-Regular',
    margin: wp(2),
    fontSize: wp('4'),
    flex: 1,
  },
  commentCountText: {
    color: '#000',
    fontFamily: 'Montserrat-Regular',
    fontSize: wp('4'),
    marginLeft: wp(2),
  },
  userAvi: {
    width: wp('10'),
    height: wp('10'),
    borderRadius: wp('5'),
  },
  isLiked: {
    width: wp('8'),
    height: wp('8'),
    transform: [
      {rotate: '180deg'}
    ]
  },
})

export { ReplyCard }