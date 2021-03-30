import React from 'react'
import { 
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { ScaledSheet } from 'react-native-size-matters'
import auth from '@react-native-firebase/auth'
import FastImage from 'react-native-fast-image'
const wordDoc = require('../../assets/icons/word_doc.png')
const pdfDoc = require('../../assets/icons/pdf_doc.png')
const csvDoc = require('../../assets/icons/csv.png')
const audio = require('../../assets/icons/audio.png')
const jpg = require('../../assets/icons/jpg.png')
const png = require('../../assets/icons/png.png')
const ppt = require('../../assets/icons/ppt.png')
const video = require('../../assets/icons/video.png')
const excel = require('../../assets/icons/excel.png')
const menuDots = require('../../assets/icons/menu_dots.png')
const comment = require('../../assets/icons/blue_comments.png')
import moment from 'moment'
import Icons from '@assets/icons'


function DocumentCard({ onDocOptions, item, onCommentPress, onSubscribe, onUnsubscribe }) {
  
  const pickDocImg = () => {
    let img = png
    switch (item.contentType) {
      case 'application/pdf':
        img = pdfDoc
        break;
      case 'audio/mpeg':
        img = audio
        break;
      case 'video/mpeg':
        img = video
        break;
      case 'text/csv':
        img = csvDoc
        break;
      case 'image/jpeg':
        img = jpg
        break;
      case 'application/vnd.ms-excel':
        img = excel
        break;
      case 'application/vnd.ms-powerpoint':
        img = ppt
        break;
      case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
        img = ppt
        break;
      case 'application/msword':
        img = wordDoc
        break;
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        img = wordDoc
        break;
      default:
        img = wordDoc
        break;
    }
    return img
  }


  return (
    <View style={styles.card}>
      <View style={styles.container}>
        <FastImage 
          source={pickDocImg()}
          style={styles.docImg}
        />
        <View style={{flex: 1}}>
          <Text style={styles.docName}>{item.title}</Text>
          <View style={styles.docMetaContainer}>
            <Text style={styles.metaData}>Shared by {item.sharedBy}</Text>
            <Text style={styles.metaData}>{moment(item.dateUploaded).format('LLL')}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={onCommentPress} style={styles.menu}>
          <FastImage 
            source={Icons.messages}
            style={styles.menuImg}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDocOptions} style={styles.menu}>
          <FastImage 
            source={menuDots}
            style={styles.menuImg}
          />
        </TouchableOpacity>

      </View>

      {/* <TouchableOpacity 
        onPress={item.subscribers.includes(auth().currentUser.uid)?onUnsubscribe:onSubscribe}
      >
        <Text style={styles.sub}>{ item.subscribers.includes(auth().currentUser.uid)?`Subscribed!`:`Subscribe to updates`}</Text>
      </TouchableOpacity> */}
    </View>
  )
}

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row', 
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#fff',
    paddingVertical: '10@ms',
    paddingRight: '5@ms',
    marginHorizontal: '5@ms',
    shadowOffset: {width: 1, height: 1},
    shadowColor: '#393939',
    shadowOpacity: .3,
    marginHorizontal: wp('2'),
    marginVertical: wp('2'),
  },
  docImg: {
    width: '50@ms',
    height: '50@ms',
    alignSelf: 'center',
  },
  docMetaContainer: {
    // flexDirection: 'row',
    // justifyContent: 'space-between',
  },
  docName: {
    fontFamily: 'OpenSans-Regular',
    fontSize: '17@ms',
  },
  metaData: {
    fontFamily: 'Montserrat-Regular',
  },
  menuImg: {
    width: '30@ms',
    height: '30@ms',
  },
  menu: {
    alignSelf: 'center',

  },
  sub: {
    fontSize: wp('4.4'),
    fontFamily: 'Montserrat-SemiBold',
    color: '#2A93F3',
    marginTop: hp('1'),
    padding: wp('3'),
    paddingBottom: 0,
    textAlign: 'center',
  },
})

export {DocumentCard}