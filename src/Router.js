import React, { Component } from "react";
import {
  Image,
  View,
  Text,
} from 'react-native'
// import { Router, Scene, Stack, Actions } from 'react-native-router-flux';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
import { 
  ScaledSheet,
  moderateScale,
} from 'react-native-size-matters'
import Boards from './screens/Boards'
import Signin from './screens/Signin'


// const Stack = createStackNavigator();

// function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         <Stack.Screen name="boardsScreen" component={Boards} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }


const styles = ScaledSheet.create({
  tabs: {
    backgroundColor: '#fff',
    height: '60@ms',
    justifyContent: 'center',
  },
  image: {
    width: '26@ms',
    height: '26@ms',
    alignSelf: 'center',
    padding: moderateScale(5),
    alignSelf: 'center',
  },
  tabText: {
    fontFamily: 'Montserrat-Bold',
    width: '60@ms',
    height: '60@ms',
    textAlign: 'center',
    fontSize: '11.5@ms',
    color: '#000',
    alignSelf: 'center',
    paddingTop: '16@ms',
  },
  focusedBar: {
    backgroundColor: '#000',
    height: '0@ms',
  },
})

export default RouterComponent