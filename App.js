import React, {useState, useEffect} from 'react';
import {
  StatusBar,
  View,
  Alert,
} from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { 
  createStore, 
  applyMiddleware, 
} from 'redux';
import reducers from './src/reducers';
import ReduxThunk from 'redux-thunk';
import logger from 'redux-logger'
import { createFirestoreInstance } from 'redux-firestore'
import firebase from '@react-native-firebase/app'
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import AppStack from './src/AppStack'
import { ReactReduxFirebaseProvider } from 'react-redux-firebase'
import {
  GoogleSignin,
} from '@react-native-community/google-signin';
import SplashScreen from 'react-native-splash-screen'
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import apiKeys from './src/apiKeys.json'

export default function App() {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: apiKeys.googleWebClientId,
    })
    SplashScreen.hide()
    firestore()
    auth()
  })

  useEffect(() => {
    PushNotificationIOS.addEventListener('register', onRegistered)
    PushNotificationIOS.addEventListener(
      'registrationError',
      onRegistrationError,
    )
    PushNotificationIOS.addEventListener('notification', onRemoteNotification)
    PushNotificationIOS.addEventListener(
      'localNotification',
      onLocalNotification,
    )

    PushNotificationIOS.requestPermissions().then(
      (data) => {
        console.log('PushNotificationIOS.requestPermissions', data)
      },
      (data) => {
        console.log('PushNotificationIOS.requestPermissions failed', data)
      },
    )

    return () => {
      PushNotificationIOS.removeEventListener('register')
      PushNotificationIOS.removeEventListener('registrationError')
      PushNotificationIOS.removeEventListener('notification')
      PushNotificationIOS.removeEventListener('localNotification')
    }
  }, [])

  const sendLocalNotification = () => {
    PushNotificationIOS.addNotificationRequest({
      alertTitle: 'Sample Title',
      alertBody: 'Sample local notification',
      applicationIconBadgeNumber: 1,
    })
  }

  const onRegistered = (deviceToken) => {
    // Alert.alert('Registered For Remote Push', `Device Token: ${deviceToken}`, [
    //   {
    //     text: 'Dismiss',
    //     onPress: null,
    //   },
    // ]);
  }

  const onRegistrationError = (error) => {
    // Alert.alert(
    //   'Failed To Register For Remote Push',
    //   `Error (${error.code}): ${error.message}`,
    //   [
    //     {
    //       text: 'Dismiss',
    //       onPress: null,
    //     },
    //   ],
    // );
  }

  const onRemoteNotification = (notification) => {
    const isClicked = notification.getData().userInteraction === 1;

    const result = `${notification.getTitle()}\n${notification.getMessage()}`

    // if (notification.getTitle() == undefined) {
    //   Alert.alert('Silent push notification Received', result, [
    //     {
    //       text: 'Send local push',
    //       onPress: sendLocalNotification,
    //     },
    //   ]);
    // } else {
    //   Alert.alert('Push Notification Received', result, [
    //     {
    //       text: 'Dismiss',
    //       onPress: () => {},
    //     },
    //   ]);
    // }
  }

  const onLocalNotification = (notification) => {
    const isClicked = notification.getData().userInteraction === 1;
    let res = `${notification.getTitle()}\n${notification.getMessage()}`
    // Alert.alert(
    //   res,
    //   [
    //     {
    //       text: 'Dismiss',
    //       onPress: () => {},
    //     },
    //   ],
    // )
  }

  const showPermissions = () => {
    PushNotificationIOS.checkPermissions((permissions) => {
      setPermissions({permissions})
    })
  }
  

  let rrfConfig = {
    logErrors: false
  }

  let store = createStore(
    reducers, 
    {},  
    applyMiddleware(ReduxThunk, logger)
  )
    
  const rrfProps = {
    firebase,
    config: rrfConfig,
    dispatch: store.dispatch,
    createFirestoreInstance
  }

  return (
    <Provider store={store}>
      <ReactReduxFirebaseProvider {...rrfProps}>
        <SafeAreaProvider style={{ flex: 1, backgroundColor: '#000' }}>
          <View style={{backgroundColor: '#F4F1DE'}}>
            <StatusBar  barStyle="dark-content" />
          </View>

          <AppStack />
        </SafeAreaProvider>
      </ReactReduxFirebaseProvider>
    </Provider>
  )
}
