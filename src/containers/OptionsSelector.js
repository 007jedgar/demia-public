import React, {useState, useEffect} from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  FlatList,
  TextInput,
} from 'react-native'


import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen'

let service = {
  1: {
    suggestedPrice: '$5'
  },
  2: {
    suggestedPrice: '$5'
  },
  3: {
    suggestedPrice: '$15/hr'
  },
}

let o = [
  {id: 1, name: 'Homework Check', selected: false, price: ''},
  {id: 2, name: 'Essay Edit', selected: false, price: ''},
  {id: 3, name: 'Live Tutoring', selected: false, price: ''},
  {id: 4, name: 'Example Problems', selected: false, price: ''},
  {id: 5, name: 'Study Help', selected: false, price: ''},
  {id: 6, name: 'Research', selected: false, price: ''},
  {id: 7, name: 'Study Guide/Flash card', selected: false, price: ''},
  {id: 8, name: 'College Apps', selected: false, price: ''},
]
function OptionsSelector({ changeSelection, options }) {
  let selectedBtn = {
    backgroundColor: '#4F6D7A'
  }

  let selectedText = {
    color: '#fff'
  }

  return (
    <View>
      <View style={{marginLeft: wp('3')}}>
        <Text style={styles.priceTitle}>Services</Text>
      </View>
      <View style={styles.container}>
        {options.map((option, index) => {
          return <TouchableOpacity onPress={() => {
            
            let newOptions = [...options]
            newOptions[index].selected = !option.selected
            changeSelection(newOptions)
          }} activeOpacity={.5} key={index+1} style={[styles.btn, option.selected?selectedBtn:{}]}>
            <Text style={[styles.btnText, option.selected?selectedText:{}]}>{option.name}</Text>
          </TouchableOpacity>
        })}
      </View>

      <View style={{
        margin: wp('3')
      }}>
        {options.filter(o => o.selected).length?<View >
          <Text style={styles.priceTitle}>Suggested Pricing</Text>
        </View>:null}
        {options.map((option, index) => {
          if (option.selected) {
            return <View style={{flexDirection: 'row', }} key={index+1}>
              <Text style={styles.optionName}>{option.name}:  $</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="  "
                value={option.price}
                onChangeText={(t) => {
                  let newOptions = [...options]
                  newOptions[index].price = t
                  // setOptions(newOptions)
                  changeSelection(newOptions)
                }}
              />
            </View>
          }
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: wp(1)
  },
  btn: {
    borderColor: '#454545',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#fff',
    margin: wp('1'),
  },
  btnText: {
    margin: 4,
    fontFamily: 'Montserrat-Regular',
    fontSize: wp('4'),
    color: '#454545',
  },
  optionName: {
    margin: 4,
    fontFamily: 'Montserrat-Regular',
    fontSize: wp('4.5'),
    color: '#454545',
  },
  input: {
    margin: 4,
    fontFamily: 'Montserrat-Regular',
    fontSize: wp('4.5'),
    color: '#454545',
    borderBottomColor: '#565656',
    borderBottomWidth: 1,
    width: wp('10'),
    maxWidth: wp('20'),
  }, 
  priceTitle: {
    margin: 4,
    fontFamily: 'Montserrat-Medium',
    fontSize: wp('4.5'),
    color: '#454545',
  }
})

export { OptionsSelector }