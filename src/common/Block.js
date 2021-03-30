import React from 'react';
import {
  View,
  SafeAreaView,
} from 'react-native';
import {
  ScaledSheet,
} from 'react-native-size-matters';
import { 
  widthPercentageToDP as wp, 
  heightPercentageToDP as hp, 
} from 'react-native-responsive-screen'

const Block = (props) => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={[styles.containerStyle, props.style]}>
        {props.children}
      </View>
    </SafeAreaView>
  )
}

const styles = ScaledSheet.create({
  containerStyle: {
    flex: 1,
    backgroundColor: '#fff',
    borderColor: '#2BA888',
    marginBottom: '5@vs',
    width: wp('100%'),
    height: hp('100%'),
  },
})

export { Block };