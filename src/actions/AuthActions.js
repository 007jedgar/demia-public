import {
  GET_USER,
  GET_USER_FAIL,
  SIGNIN,
  SIGNIN_FAIL,
  CLEAR_ERROR,
  AUTH_ATTEMPT,
  FCM_TOKEN_SUCCESS,
  FCM_TOKEN_FAILED,
} from './types'
import moment from 'moment'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import messaging from '@react-native-firebase/messaging'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Notifications} from 'react-native-notifications';

import appleAuth from '@invertase/react-native-apple-authentication';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-community/google-signin';
import * as RootNavigation from '../RootNavigation';

export const getUser = () => {
  return (dispatch) => {
    dispatch({ type: AUTH_ATTEMPT })
    
    const user = auth().currentUser

    if (!user) return
    
    firestore().collection('users').doc(user.uid)
    .get().then((doc) => {
      if (!doc.exists) return;
      
      dispatch({ type: SIGNIN, payload: {...doc.data(), id: doc.id }})
      getToken(dispatch)
      RootNavigation.navigate('board')
    }).catch((err) => {
      dispatch({
        type: SIGNIN_FAIL, payload: err
      })
    })
  }
}

export const clearError = () => {
  return (dispatch) => {
    dispatch({
      type: CLEAR_ERROR
    })
  }
}

export const loginWithEmail = (email, password ) => {
  return (dispatch) => {
    dispatch({ type: AUTH_ATTEMPT })
    auth().signInWithEmailAndPassword(email, password)
    .then((user) => {
      firestore().collection('users').doc(user.uid)
      .get().then((doc) => {
        if (!doc.exists) {
          return createUser(user, {email}, 'email', dispatch)
        }

        let profile = { ...doc.data(), id: doc.id }
        getToken(dispatch)
        return dispatch({ type: SIGNIN, payload: profile })
      }).catch((err) => dispatch({ type: SIGNIN_FAIL, payload: err }))
    }).catch((err) => {
      dispatch({ type: SIGNIN_FAIL, payload: err })
    })
  }
}

export const signinWithEmail = ({ email, password, name }) => {
  return (dispatch) => {
    dispatch({ type: AUTH_ATTEMPT })

    auth().createUserWithEmailAndPassword(email, password).then((user) => {
      auth().user.updateProfile({
        displayName: name,
      })
      return createUser(user, {email, name}, 'email', dispatch)
    }).catch((err) => {
      if (err.code === 'auth/email-already-in-use') {
        return auth().signInWithEmailAndPassword(email, password)
        .then((user) => {
          return firestore().collection('users').doc(user.uid)
          .get().then((doc) => {
            if (!doc.exists) {
              return createUser(user, {email, name}, 'email', dispatch)
            }
    
            let profile = { ...doc.data(), id: doc.id }
            getToken(dispatch)
            return dispatch({ type: SIGNIN, payload: profile })
          })
        }).catch((err) => {dispatch({ type: SIGNIN_FAIL, payload: err });console.log(err)})
      }
      dispatch({ type: SIGNIN_FAIL, payload: err })
    })
  }
}

export const signinWithGoogle = () => {
  return async (dispatch) => {
    dispatch({ type: AUTH_ATTEMPT })
    try {
      await GoogleSignin.hasPlayServices()
      let userInfo = await GoogleSignin.signIn()
      const googleCredential = auth.GoogleAuthProvider.credential(userInfo.idToken)
      const fbUser = await auth().signInWithCredential(googleCredential)

      let doc = {}
      let sent = false
      // run a user doc check for routing purposes
      doc = await firestore().collection('users').doc(fbUser.user.uid).get()
      if (!doc.exists && !sent) {
        return createUser(fbUser, userInfo, 'google', dispatch )
      }

      let profile = {...doc.data(), id: doc.id}
      dispatch({
        type: SIGNIN,
        payload: profile
      })
      getToken(dispatch)
      return RootNavigation.navigate('board')
    } catch (error) {
      dispatch({
        type: SIGNIN_FAIL,
      })
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        // alert('Sign up cancelled')
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        alert('Google services not available')
      } else {
        alert('An error has occured while authenticating')
      }
    }    
  }
}

export const signinWithApple = () => {
   return async (dispatch) => {
     try {
      dispatch({ type: AUTH_ATTEMPT })
      // Start the sign-in request
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      })

      console.log(appleAuthRequestResponse)
    
      // Ensure Apple returned a user identityToken
      if (!appleAuthRequestResponse.identityToken) {
        throw 'Apple Sign-In failed - no identify token returned';
      }
    
      // Create a Firebase credential from the response
      let { identityToken, nonce } = appleAuthRequestResponse;
      const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);
      // Sign the user in with the credential
      const fbUser = await auth().signInWithCredential(appleCredential)
      console.log(fbUser)
      let doc = {}
      // run a user doc check for routing purposes
      doc = await firestore().collection('users').doc(fbUser.user.uid).get()
      if (!doc.exists) {
        //create a user doc
        return createUser(fbUser, appleAuthRequestResponse, 'apple', dispatch )
      }

      console.log(doc)
      let profile = {...doc.data(), id: doc.id}

      getToken(dispatch)
      RootNavigation.navigate('board')
      return dispatch({
        type: SIGNIN,
        payload: profile
      })
    } catch(err) {
      dispatch({
        type: SIGNIN_FAIL,
      })
      console.log(err)
      alert('The authentication was not completed')
    }
  }
}

const createUser = (firebaseUser, authUserCreds = {}, authType, dispatch ) => {
  dispatch({ type: AUTH_ATTEMPT })
  authUserCreds.joined = moment().format()
  authUserCreds.authType = authType
  authUserCreds.onBlockedUserIds = []
  
  firestore().collection('users').doc(firebaseUser.user.uid)
  .set(authUserCreds).then(() => {
    let profile = { ...authUserCreds, id: firebaseUser.user.uid }
    dispatch({
      type: SIGNIN,
      payload: profile
    })
    getToken(dispatch)
    return RootNavigation.navigate('board')
  }).catch((err) => {
    dispatch({
      type: SIGNIN_FAIL,
      payload: err
    })
  })
}

const createWelcomeBoard = () => {
  // firestore().collection().doc()
}

const getToken = async (dispatch) => {
  try {
    //check for internally stored token 
    let fcmToken = await AsyncStorage.getItem('fcmToken')
    
    if (!fcmToken) {
      //ask for permission
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      
      if (!enabled) {
        return;
      }

      await Notifications.registerRemoteNotifications()

      //no token stored internally so get the phone's token
      fcmToken = await messaging().getToken()
      if (fcmToken) {
        await AsyncStorage.setItem('fcmToken', fcmToken)
        return storeToken(fcmToken, dispatch)
      } else return;  
    }

    storeToken(fcmToken, dispatch)
  } catch(err) {
    // alert(err.message)
    dispatch({ type: FCM_TOKEN_FAILED, payload: err })
  }
}

const storeToken = (fcmToken, dispatch) => {
  const user = auth().currentUser
  console.log('storing fcm token:', fcmToken)

  return firestore()
  .collection('users').doc(user.uid)
  .update({
    fcmToken: fcmToken,
  }).then(() => {
    dispatch({ type: FCM_TOKEN_SUCCESS })
  }).catch((err) => {
    dispatch({ type: FCM_TOKEN_FAILED, payload: err })
  })
}