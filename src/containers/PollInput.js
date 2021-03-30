import React, {useState} from 'react'
import {
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native'
import {ScaledSheet} from 'react-native-size-matters'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image'
import add from '../../assets/icons/plus.png'

function PollInput({ placeholder, value, onChangeText, showAdd, onAdd }) {
  const [ options, setOptions ] = useState([])

  return (
    <View style={styles.container}>
      {/* <View>

      </View> */}
      <TextInput 
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        style={styles.textInput}
        placeholderTextColor="dimgrey"
      />
      {showAdd?<TouchableOpacity onPress={onAdd} style={{alignSelf: 'center'}}>
        <FastImage 
          style={styles.add}
          source={add}
        />
      </TouchableOpacity>:null}
    </View>
  )
}
const styles = ScaledSheet.create({
  container: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    // justifyContent: 'center',
    width: wp('70'),
    alignSelf: 'center',
  },
  textInput: {
    // height: hp('8%'),
    width: wp('60'),
    fontSize: '20@ms',
    backgroundColor: '#fff',
    marginVertical: wp(4),
    borderColor: '#c2c2c2',
    borderBottomWidth: 1,
    color: '#000',
  },
  add: {
    width: wp('8'),
    height: wp('8'),
    alignSelf: 'flex-end',
  },
})

export {PollInput}