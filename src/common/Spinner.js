import React from 'react';
import { View, StyleSheet, } from 'react-native';
import Spinny from 'react-native-spinkit'
import { 
widthPercentageToDP as wp,
} from 'react-native-responsive-screen'

const Spinner = ({ size, color }) => {
  return (
    <View style={{alignSelf: 'center'}}>
      <Spinny color='#4F6D7A' size={wp(8)} type="Arc"/>
    </View>
  );
}

export { Spinner }
