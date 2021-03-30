import React, { useEffect, useState } from 'react'
import {
  Text,
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  Alert,
  Linking
} from 'react-native'
import {
  Block
} from '../../common'
import {
  ProfileCard,
  MenuSeparator,
} from '../../containers'
import { 
  DangerBtn,
} from '../../buttons'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
import auth from '@react-native-firebase/auth'
import storage from '@react-native-firebase/storage'
import firestore from '@react-native-firebase/firestore'
import FastImage from 'react-native-fast-image'
import Icons from '@assets/icons'
import Spinny from 'react-native-spinkit'
import ImagePicker from 'react-native-image-picker';
import { uniqueId } from 'lodash' 
import * as RootNavigation from '../../RootNavigation';
import Toggle from 'react-native-toggle-element';

function Profile(props) {
  const [ currentUser, setCurrentUser ] = useState({})
  const [ email, setEmail ] = useState('')
  const [ profilePic, setProfilePic ] = useState('')
  const [ error, setError ] = useState('')
  const [ isLoading, toggleLoading ] = useState(true)
  const [ doesTAExist, toggleTA ] = useState(false)
  const [ taMode, toggleTaMode ] = useState(false)
  
  useEffect(() => {
    let user = auth().currentUser
    let unsub = firestore()
    .collection('teacher_assistants').doc(user.uid)
    .onSnapshot((doc) => {
      if (!doc.exists) {
        return toggleTA(false)
      }

      if (doc.data().expressAccount) {
        return toggleTA(true)
      }

      toggleTA(false)

    }, (err) => {
      console.log(err)
    })

    return () => unsub()
  }, [])

  useEffect(() => {
    
    let user = auth().currentUser

    setEmail(user.email)



    let unsubscribe = firestore()
    .collection('users').doc(user.uid)
    .onSnapshot((doc) => {
      if (!doc.data().profilePic) {
        toggleLoading(false)
        setCurrentUser({ ...doc.data(), id: doc.id })
        toggleTaMode(doc.data().taMode)
        return setProfilePic('')
      }
      toggleTaMode(doc.data().taMode)
      setCurrentUser({ ...doc.data(), id: doc.id })
      toggleLoading(false)
      setProfilePic({uri: doc.data().profilePic})
    }, () => {
      toggleLoading(false)
      setProfilePic('')
    })

    return () => unsubscribe()
  }, [])

  const pickProfile = async () => {
    try {
      console.log('entered')
      toggleLoading(true)
      const options = {
        title: 'Select a Profile Picture',
        storageOptions: {
          skipBackup: true,
          path: 'images',
        }
      }
      ImagePicker.showImagePicker(options, async (response)=> {
        console.log(response)
        if (!response) return console.log('no response')
        if (response.didCancel) {
          toggleLoading(false)
          console.log('User cancelled image picker');
        } else if (response.error) {
          toggleLoading(false)
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          toggleLoading(false)
          console.log('User tapped custom button: ', response.customButton);
        } else {
          let user = auth().currentUser
  
          // setProfilePic(source)
  
          let fileId = uniqueId(response.fileName)
          const reference = storage().ref(`profilePics/${user.uid}/${fileId}`)
          
          await reference.putFile(response.uri)
          let fileUrl = await reference.getDownloadURL()
          await firestore().collection('users').doc(user.uid).update({
            profilePic: fileUrl
          })
  
          toggleLoading(false)
        
        }
      })
    } catch(err) {
      console.log(err)
      toggleLoading(false)
      setError('Upload Failed. Please try again')

      setTimeout(() => {
        setError('')
      }, 4000)
    }
  }

  const logout = () => {
    Alert.alert(
      "Logout?",
      " ",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Logout", onPress: () => {
          auth().signOut().then(() => {
            props.navigation.navigate('welcome')
          }).catch((err) => {
            props.navigation.navigate('welcome')
          })
        } }
      ],
      { cancelable: false }
    )
  }

  const openPrivacy = () => {
    firestore().collection('links')
    .doc('privacy_security').get().then((doc) => {
      let link = doc.data().link
      Linking.openURL(link)
    }).catch((err) => {
      console.log(err)
    })
  }

  const toggleTAMode = (taMode) => {
    let user = auth().currentUser
    firestore().collection('users').doc(user.uid)
    .update({
      taMode: taMode,
    }).then(() => {
      toggleTaMode(taMode)
    }).catch((err) => {
      console.log(err)
    })
  }
  
  return (
    <Block>
      <ScrollView style={{flex: 1}}>

        <Text style={styles.header}>profile</Text>
        <View style={{marginVertical: hp('1')}}/>

        {doesTAExist?<TouchableOpacity onPress={() =>  toggleTAMode(!taMode)} style={styles.modeToggle} activeOpacity={.7}>
          <Text style={styles.taText}>Teacher Assistant Mode</Text>
          <Toggle
            value={taMode||false}
            onPress={(newState) => toggleTAMode(!taMode)}
            trackBar={{
              width: wp('19'),
              height: wp('5'),
              radius: 10,
              inActiveBackgroundColor: '#3c4145',
              activeBackgroundColor: '#69A2B0',
              borderActiveColor: '#86c3d7',
              borderInActiveColor: '#1c1c1c',
            }}
            thumbButton={{
              width: wp(8),
              height: wp(8)
            }}
            thumbStyle={{
              backgroundColor: '#f1f1f1',
            }}
          />
        </TouchableOpacity>:null}

        <MenuSeparator title="Account Settings"/>
        <ProfileCard onPress={() => RootNavigation.navigate('personalInfo')} title={'Personal Info'}/>
        {/* <ProfileCard onPress={() => RootNavigation.navigate('payments')} title={'Payments & Payouts'}/> */}
        <ProfileCard onPress={() => RootNavigation.navigate('notifications')} title={'Notifications'}/>
        <ProfileCard onPress={() => RootNavigation.navigate('changePassword')} title={'Change Password'}/>
        
        <MenuSeparator title="Teacher Assistant"/>

        {doesTAExist?<View>
          <ProfileCard onPress={() => RootNavigation.navigate('taPayments')} title={'Activity'}/>
          <ProfileCard onPress={() => RootNavigation.navigate('editProfile')} title={'Public Profile'}/>
        </View>:<ProfileCard onPress={() => RootNavigation.navigate('createTA')} title={'Learn about Teacher Assistants'}/>}
    
        <ProfileCard onPress={() => RootNavigation.navigate('honorCode')} title={'Honor Code'}/>

        <MenuSeparator title="Support"/>

        <ProfileCard onPress={() => RootNavigation.navigate('sendFeedback')} title={'Feedback & Contact'}/>
        
        <MenuSeparator title="Legal"/>
        <ProfileCard onPress={openPrivacy} title={'Privacy, Terms & Security'}/>
     
        <FastImage 
          source={Icons.reading}
          style={{
            width: wp('50'),
            height: wp('50'),
            alignSelf: 'center',
          }}
        />
        
        {isLoading?<View style={{alignSelf: 'center'}}><Spinny type="Arc" size={wp('7')}/></View>:<DangerBtn onPress={logout} text="Logout"/>}

        <Text style={styles.error}>{error}</Text>
      </ScrollView>

    </Block>
  )
}

const styles = StyleSheet.create({
  header: {
    fontSize: wp('6'),
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
    color: 'dimgrey',
    marginTop: hp('1'),

  },
  email: {
    fontSize: wp('4'),
    fontFamily: 'Montserrat-Medium',
    textAlign: 'center',
    color: 'dimgrey',
    marginTop: hp('1'),
  },
  error: {
    fontSize: wp('4'),
    fontFamily: 'Montserrat-Medium',
    textAlign: 'center',
    color: 'red',
    marginTop: hp('1'),
  },
  profile: {
    alignSelf: 'center',
    width: wp('20'),
    height: wp('20'),
    borderRadius: wp('10')
  },
  modeToggle: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: .2,
    shadowOffset: { width: 0, height: 1},
    marginHorizontal: wp('7'),
    padding: wp('3'),
  } ,
  taText: {
    fontSize: wp('4'),
    fontFamily: 'Montserrat-Medium',
    color: 'dimgrey',
  }
})

export default Profile