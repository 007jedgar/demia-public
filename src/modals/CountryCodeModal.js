import React, {useState} from 'react'
import { 
  TouchableOpacity, 
  Text, 
  Modal, 
  StyleSheet,
  FlatList,
  SafeAreaView,
} from 'react-native'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
import countryCodes from '../specialStuff/countryCodes.json'
import FastImage from 'react-native-fast-image'
import Icons from '@assets/icons'

function CountryCodeModal({ visible, closeModal, selectCountry }) {
  return (
    <Modal
      animationType="none"
      visible={visible}
    >
      <SafeAreaView style={{flex: 1}}>

        <TouchableOpacity style={{margin: wp(2)}} onPress={closeModal}> 
          <FastImage  
            source={Icons.backArrow}
            style={{
              width: wp('10'),
              height: wp('10'),
            }}
          />
        </TouchableOpacity>

        

        <FlatList 
          ListHeaderComponent={<Text style={styles.header}>Select country or region</Text>}
          data={countryCodes}
          renderItem={({item, index}) => (
            <TouchableOpacity onPress={() => selectCountry(item.dial_code)} activeOpacity={.7} style={styles.container}>
              <Text style={styles.countryName}>{item.name} <Text style={styles.countryCode}>({item.dial_code})</Text></Text>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.name}
        />
      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  header: {
    marginLeft: wp('2'),
    marginBottom: hp('.5'),
    fontSize: wp('5'),
    fontFamily: 'Montserrat-ExtraBold',
    color: 'dimgrey',
    textAlign: 'center',
  },
  container: {
    marginHorizontal: wp('5'),
    borderBottomWidth: 1,
    borderBottomColor: '#c2c2c2',
  },
  countryName: {
    marginLeft: wp('2'),
    marginVertical: hp('1'),
    fontSize: wp('5'),
    color: '#454545',
    fontFamily: 'Montserrat-Regular',
  },
  countryCode: {
    marginLeft: wp('2'),
    marginBottom: hp('.5'),
    fontSize: wp('5'),
    fontFamily: 'OpenSans-Regular',
  },
})

export { CountryCodeModal}