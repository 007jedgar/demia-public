import React, {useState} from 'react'
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  SafeAreaView,
} from 'react-native'
import { 
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
import { ScaledSheet } from 'react-native-size-matters'
import FastImage from 'react-native-fast-image'
const checkmark = require('../../assets/icons/blue_checkmark.png')

const SelectionCard = ({ selected, onPress, title }) => {
  let secondaryView = selected?{backgroundColor: '#69A2B0'}:{}
  let secondaryText = selected?{color: '#fff'}:{}
  let secondaryCircle = selected?{borderColor: '#fff'}:{}

  return (
    <TouchableOpacity activeOpacity={.5} onPress={onPress}>
      <View style={[styles.selectionCard, secondaryView]}>
        <View style={[styles.checkmarkCircle, secondaryCircle]}>

          {selected?<FastImage 
            source={checkmark}
            style={styles.checkmark}
          />:null}

        </View>

        <Text style={[styles.title, secondaryText]}>{title}</Text>
      </View>
    </TouchableOpacity>
  )
}


function SelectorModal({ visible, toggleModal, setCategory, initialOptions }) {
  const [options, editSelection ] = useState(initialOptions)

  const onSelect = (index) => {
    // make all selected false
    options.map((option) => {option.selected = false})
    
    // make pressed option selected true
    options[index].selected = true 
    
    //return a new object to usestate
    let newOptions = Object.create(options)
    editSelection(newOptions)
  }

  const onDonePressed = () => {
    let selected = options.filter(option => option.selected === true )
    if (!selected.length) {
      return toggleModal()
    }
    
    setCategory(selected[0].title)
    toggleModal()
  }

  return (
    <View>
      <Modal
        animationType="slide"
        visible={visible}
      >
        <SafeAreaView style={styles.modal}>

          <ScrollView style={{flex: 1}}>
            <Text style={styles.header}>Select Category</Text>
            {options.map((item, index) => (
              <SelectionCard onPress={() => onSelect(index)} key={index+1} selected={item.selected} title={item.title}/>
            ))
            }
          </ScrollView>

          <TouchableOpacity style={styles.doneBtn} onPress={onDonePressed}>
            <Text style={styles.doneText}>Done</Text>
          </TouchableOpacity>
        </SafeAreaView>

      </Modal>
    </View>
  )
}

const styles = ScaledSheet.create({
  modal: {
    width: wp('100%'),
    height: hp('100%'),
    backgroundColor: '#fff',
  },
  modalView: {
    width: wp('100%'),
  },
  header: {
    fontFamily: 'OpenSans-Bold',
    fontSize: wp('10%'),
    color: '#232323',
    marginHorizontal: wp('5%'),
    marginVertical: wp('4%'),
  },
  selectionCard: {
    flexDirection: 'row',
    width: wp('92%'),
    height: hp('8%'),
    backgroundColor: '#fff',
    borderRadius: wp('2%'),
    margin: wp('3%'),
    borderColor: 'dimgrey',
    borderWidth: '1@ms',
    alignSelf: 'center',
  },
  checkmark: {
    width: wp('6.5%'),
    height: wp('6.5%'),
    alignSelf: 'center',
  },
  checkmarkCircle: {
    width: wp('8%'),
    height: wp('8%'),
    borderRadius: wp('4%'),
    backgroundColor: '#fff',
    borderColor: 'dimgrey',
    borderWidth: '1@ms',
    alignSelf: 'center',
    marginHorizontal: wp('5%'),
    justifyContent: 'center',
  },  
  doneBtn: {
    width: wp('100%'),
    height: hp('8%'),
    justifyContent: 'center',
    backgroundColor: '#69A2B0'
  },
  doneText: {
    fontSize: wp('7%'),
    fontFamily: 'OpenSans-SemiBold',
    textAlign: 'center',
    color: '#fff',
  },
  title: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: wp('5%'),
    alignSelf: 'center',
  },
})


export { SelectorModal }