import React from 'react'
import { 
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { ScaledSheet } from 'react-native-size-matters'
const wordDoc = require('../../assets/icons/word_doc.png')
const pdfDoc = require('../../assets/icons/pdf_doc.png')
const menuDots = require('../../assets/icons/menu_dots.png')
import moment from 'moment'

function EmptyDocCard({ onDocOptions, item }) {

  return (
    <View style={styles.container}>
      <View 
        style={styles.docImg}
      />
      <View style={{flex: 1, marginLeft: wp('2%')}}>
        <View style={styles.docName}>
          <Text style={styles.text}>Shared documents will appear here</Text>
        </View>
        <View style={styles.docMetaContainer}/>
      </View>

    </View>
  )
}

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row', 
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingVertical: '10@ms',
    paddingRight: '5@ms',
    marginHorizontal: '5@ms',
    shadowOffset: {width: 3, height: 3},
    shadowColor: '#393939',
    shadowOpacity: .3,
  },
  docImg: {
    width: '50@ms',
    height: '50@ms',
    alignSelf: 'center',
    backgroundColor: '#DBE9EE',
    marginLeft: wp('2%')
  },
  docMetaContainer: {
    marginTop: hp('1.4%'),
    marginRight: wp('5%'),
    height: hp('1.2%'),
    backgroundColor: '#DBE9EE',
    width: wp('40%'),
  },
  docName: {
    height: hp('3%'),
    backgroundColor: '#DBE9EE',
    justifyContent: 'center',
  },
  metaData: {
    height: hp('1.2%'),
    width: wp('25%'),
    backgroundColor: '#DBE9EE',
  },
  menu: {
    alignSelf: 'center',
  },
  text: {
    fontSize: wp('4%'),
    color: '#4F6D7A',
    fontFamily: 'OpenSans-SemiBold',
    marginLeft: wp('1%'),
  }
})

export {EmptyDocCard}