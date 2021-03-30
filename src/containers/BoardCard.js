import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native'
import {
  ScaledSheet,
} from 'react-native-size-matters'
import {
  widthPercentageToDP as wp, 
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image'
import Icons from '@assets/icons';


function BoardCard({ onPress, header, description, optionPressed}) {
  const [ showOptions, toggleOptions ] = useState(false)

  

  return ( 
    <TouchableWithoutFeedback onPress={onPress} >
      <View style={styles.container}>

        <View style={{flex: 1}}>
          <Text style={styles.headerText}>{header}</Text>
          <Text style={styles.descriptionText}>{description}</Text>
        </View>

        <TouchableOpacity  
          onPress={optionPressed}
          style={{ alignSelf: 'center', padding: wp('3') }}
        >
          <FastImage 
            source={Icons.menuDots}
            style={{
              width: wp('6'),
              height: wp('6'),
              alignSelf: 'center'
            }}
          />
        </TouchableOpacity>

      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = ScaledSheet.create({
  container: {
    shadowColor: '#81B29A',
    shadowOffset: { x: 1, y:2},
    shadowRadius: 3,
    shadowOpacity: .6,
    elevation: 1,

    margin: wp('2.5'),
    marginHorizontal: wp('5.5'),

    borderRadius: 8,
    backgroundColor: '#fff',

    paddingLeft: wp('4'),
    paddingVertical: wp('4'),
    
    flexDirection: 'row',
    flex: 1
  },
  headerText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: wp('5.5'),
    marginLeft: wp('7'),
    marginBottom: '5@ms',
    color: 'dimgrey',
  },
  descriptionText: {
    fontSize: wp('3.5'),
    fontFamily: 'Montserrat-Medium',
    marginLeft: wp('7'),
    marginRight: wp('10'),
    color: '#000'
  },
  triangle: {
    width: '20%',
    height: '100%',
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 40,
    borderRightWidth: 40,
    borderBottomWidth: 40,
    borderTopWidth: 40,
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: '#6ebad3',
    borderBottomColor: '#6ebad3',
    // transform: [
    //   {rotate: '-90deg'}
    // ],
    right: 4,
    position: 'absolute',
    borderBottomRightRadius: 8,
    borderTopRightRadius: 8,
  }
})

export { BoardCard }