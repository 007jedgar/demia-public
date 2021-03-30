import React from 'react'
import { 
  TouchableOpacity,
  View,
  Text,
} from 'react-native'


import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
 } from 'react-native-responsive-screen'

import { ScaledSheet } from 'react-native-size-matters'
import {
   KeyboardAwareScrollView
} from 'react-native-keyboard-aware-scroll-view'
import Communications from 'react-native-communications';

import { BackNavBar, Block } from '../../common'

function Support(props) {

  const callSupport = () => {
    Communications.phonecall('+14153268957', false)
  }

  const textSupport = () => {
    Communications.text('+14153268957')
  }

  const emailSupport = () => {
    Communications.email(['jonathan@varsityprep.com'], null, null, null, null)
  }

  const supportDescription = "Having problems? We'd be happy to help with anything. See below for support.";

  return (
    <Block>
      <BackNavBar title="Contact Support"/>
      <KeyboardAwareScrollView>
        {/* <View style={styles.header}>
          <Text style={styles.headerText}>Contact Support</Text>
        </View> */}
        <View style={{marginVertical: hp('3')}} /> 

        <Text style={styles.subHeader}>{supportDescription}</Text>
        
        <TouchableOpacity style={styles.nameContainer} onPress={callSupport}>
          <Text style={styles.name}>Call</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.nameContainer} onPress={textSupport}>
          <Text style={styles.name}>Text</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.nameContainer} onPress={emailSupport}>
          <Text style={styles.name}>Email</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </Block>
  )
}

const styles = ScaledSheet.create({
  header: {
    marginVertical: hp('2')
  },
  headerText: {
    textAlign: 'center',
    fontFamily: 'Montserrat-Bold',
    color: '#565656',
    fontSize: wp('6'),
  },
  container: {
    flex: 1,
    margin: '15@ms',
  },
  infoContainer: {
    marginTop: '15@ms',
  },
  subHeader: {
    fontSize: wp('5'),
    fontFamily: 'Montserrat-Medium',
    color: 'dimgrey',
    textAlign: 'center',
    marginHorizontal: wp('5')
  },
  name: {
    fontSize: '20@ms',
    fontFamily: 'Montserrat-Medium',
    marginRight: '10@ms',
    color: '#27a587',
    textAlign: 'center',
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: '15@ms',
  },
})

export default Support