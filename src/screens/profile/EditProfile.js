import React, {useState, useEffect} from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  KeyboardAvoidingView,
  Alert,
} from 'react-native'
import {
  Block,
  BackNavBar,
  SaveNavBar,
} from '../../common'
import {
  BasicInput1,
  OptionsSelector,
} from '../../containers'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import storage from '@react-native-firebase/storage'
import stripe from 'tipsi-stripe'
import FastImage from 'react-native-fast-image'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Icons from '@assets/icons'
import ImagePicker from 'react-native-image-picker';
import Toggle from 'react-native-toggle-element';
import Spinny from 'react-native-spinkit'

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

function PublicProfile(props) {
  const [ currentUser, setCurrentUser ] = useState({})
  const [ isLoading, toggleLoading ] = useState(false)
  const [ skills, setSkills ] = useState("")
  const [ errorMessage, setErrorMessage ] = useState("")
  const [ profileImg, setProfileImg ] = useState("")
  const [ errorMsg , setError ] = useState("")
  const [ options, setOptions ] = useState(o)
  const [ description, setDescription ] = useState("")
  const [ name, setName ] = useState("")
  const [ availability, setAvailability ] = useState('')
  const [ services, setServices ] = useState([{}])
  const [ tags, setTags ] = useState("")
  const [ isAvailableNow, toggleAvailabilityNow ] = useState(false)
  const [ hasChanged, toggleChanged ] = useState(false)
  const [ showSaved, toggleSaved ] = useState(false)
  const [ school, setSchool ] = useState('')
  const [ isVisible, toggleVisibility ] = useState(false)
  
  useEffect(() => {
    let user = auth().currentUser
    toggleLoading(true)

    firestore()
    .collection('teacher_assistants').doc(user.uid)
    .get().then((doc) => {
      let { name, description, isVisible, skills, services, availability, isAvailableNow, profilePic, school } = doc.data()

      setDescription(description)
      setName(name)
      setSkills(skills)
      setServices(services)
      setAvailability(availability)
      toggleAvailabilityNow(isAvailableNow)
      setProfileImg(profilePic)
      setSchool(school)
      toggleVisibility(isVisible)
    })

    let unsubUser = firestore()
    .collection('teacher_assistants').doc(user.uid)
    .onSnapshot((doc) => {
      if (!doc.exists) {
        setCurrentUser({})
        return toggleLoading(false)
      }

      let { name, description, skills, services, availability, isAvailableNow, profilePic, school } = doc.data()

      setProfileImg(profilePic)
      toggleAvailabilityNow(isAvailableNow)

      setCurrentUser({ ...doc.data(), id: doc.id })
      toggleLoading(false)
    }, (err) => {
      setErrorMessage(err.message)
      toggleLoading(false)
    })

    return () => {
      unsubUser()
    }
  }, [])

  const pickProfileImg = async () => {
    try {
      toggleLoading(true)
      const options = {
        title: 'Select a Profile Picture',
        storageOptions: {
          skipBackup: true,
          path: 'images',
        }
      }

      ImagePicker.showImagePicker(options, async (response)=> {
        if (!response) return console.log('no response')
        if (response.didCancel) {
          toggleLoading(false)
        } else if (response.error) {
          toggleLoading(false)
        } else if (response.customButton) {
          toggleLoading(false)
        } else {
          let user = auth().currentUser
          toggleChanged(true)
          // setProfilePic(source)
          const reference = storage().ref(`ta_profile_pics/${user.uid}`)
          
          await reference.putFile(response.uri)
          let fileUrl = await reference.getDownloadURL()
          await firestore().collection('teacher_assistants').doc(user.uid).update({
            taProfilePic: fileUrl,
            profilePic: fileUrl
          })
          setProfileImg(fileUrl)
          toggleLoading(false)
        
        }
      })
    } catch(err) {
      toggleLoading(false)
      setError('Upload Failed. Please try again')

      setTimeout(() => {
        setError('')
      }, 1400)
    }
  }

  const saveTAProfile = () => {
    toggleLoading(true)
    const user = auth().currentUser
    let profile = {
      name,
      description,
      services,
      availability,
      profilePic: profileImg,
      skills,
      school,      
    } 

    firestore()
    .collection('teacher_assistants').doc(user.uid)
    .update(profile)
    .then(() => {
      toggleLoading(false)
      toggleSaved(true)
      toggleChanged(false)
      setTimeout(() => {
        toggleSaved(false)
      }, 2000)
    }).catch((err) => {
      toggleLoading(false)
    })
  }  

  const setAvailabilityNow = (newState) => {
    firestore()
    .collection('teacher_assistants').doc(currentUser.id)
    .update({
      isAvailableNow: newState
    }).then(() => {
      toggleAvailabilityNow(newState)
    }).catch((err) => {
      console.log(err)
    })
  }

  const setVisibility = (visibilityState) => {
    firestore()
    .collection('teacher_assistants').doc(currentUser.id)
    .update({
      isVisible: visibilityState
    }).then(() => {
      toggleVisibility(visibilityState)
    }).catch((err) => {

    })
  }

  if (isLoading) {
    return (
      <Block>
        <SaveNavBar 
          title="TA Profile"
        />

        <View style={{margin: wp('20'), alignSelf: 'center'}}>
          <Spinny type="Arc"  color="#69A2B0" size={wp('10')}/>
        </View>
      </Block>
    )
  }

  return (
    <Block>
      <SaveNavBar 
        onSave={saveTAProfile} 
        title="TA Profile"
        onPress={() => {

          if (hasChanged) {
            Alert.alert(
              "Changes were made",
              "Would you like to save or continue without saving?",
              [
                {
                  text: "Save",
                  onPress: () => {
                    saveTAProfile()
                    setTimeout(() => {
                      props.navigation.goBack()
                    }, 1500)
                  }
                },
                {
                  text: "Cancel",
                  onPress: () => {},
                  style: "cancel"
                },
                { text: "Continue without saving", onPress: () => props.navigation.goBack() }
              ],
              { cancelable: false }
            )
          } else {
            props.navigation.goBack()
          }
        }}        
      />
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: hp(4)}} bahevior="position">
        {showSaved?<Text style={styles.savedText}>Saved!</Text>:null}
        <TouchableOpacity activeOpacity={.6} onPress={() => {
          pickProfileImg()
          if (profileImg) {

          } else {

          }
        }}>
          <FastImage 
            source={profileImg?{uri: profileImg}:Icons.pickProfile}
            style={{
              width: wp('20'),
              height: wp('20'),
              alignSelf: 'center',
              borderRadius: profileImg?wp(10):0,
            }}
          />
          <Text style={{textAlign: 'center'}}>Tap to edit/change profile picture</Text>
        </TouchableOpacity>
        
        <View style={{flexDirection: 'row', justifyContent: 'space-between', margin: wp(2), marginHorizontal: wp(8)}}>
          <View >
            <Text style={styles.availabilityTitle}>Available Now?</Text>
            <Toggle
              value={isAvailableNow}
              onPress={(newState) => setAvailabilityNow(isVisible)}
              leftTitle="No"
              rightTitle="Yes"
              trackBar={{
                inActiveBackgroundColor: '#3c4145',
                activeBackgroundColor: '#69A2B0',
                borderActiveColor: '#86c3d7',
                borderInActiveColor: '#1c1c1c',
              }}
              thumbStyle={{
                backgroundColor: '#f1f1f1',
              }}
            />
          </View>

          <View >
            <Text style={styles.availabilityTitle}>Visible to search?</Text>
            <Toggle
              value={isVisible}
              onPress={(newState) => setVisibility(newState)}
              leftTitle="No"
              rightTitle="Yes"
              trackBar={{
                inActiveBackgroundColor: '#3c4145',
                activeBackgroundColor: '#69A2B0',
                borderActiveColor: '#86c3d7',
                borderInActiveColor: '#1c1c1c',
              }}
              thumbStyle={{
                backgroundColor: '#f1f1f1',
              }}
            />
          </View>
        </View>
        
        <BasicInput1 
          value={name}
          onChangeText={(t) => {setName(t); toggleChanged(true)}}          
          placeholder="Your Name"
          title="Name"
          textContentType="name"
        />

        <BasicInput1 
          value={description}
          onChangeText={(t) => {setDescription(t); toggleChanged(true)}}
          placeholder="Who are you and what are you really good at?"
          title="Description"
          multiline={true}
          maxHeight={hp('10')}
        />

        <BasicInput1 
          value={school}
          onChangeText={(t) => {setSchool(t); toggleChanged(true)}}
          placeholder="High School/College"
          title="School"
        />
                
        <BasicInput1 
          value={availability}
          onChangeText={(t) => {setAvailability(t); toggleChanged(true)}}
          placeholder="When are you generally available"
          title="General Availability"
          multiline={true}
          maxHeight={hp('10')}
        />
        
        <BasicInput1 
          value={skills}
          onChangeText={(t) => {setSkills(t); toggleChanged(true)}}
          multiline={true}
          placeholder="skills you have (algerbra, debate)"
          title="Skills (separate by comma)"
        />
        
        <OptionsSelector 
          changeSelection={(selection) => {
            setServices(selection)
            toggleChanged(true)
          }} 
          options={services}
        />

      </KeyboardAwareScrollView>

    </Block>
  )
}

const styles = StyleSheet.create({
  becomeMentorBtn: {
    shadowColor: '#81B29A',
    shadowOffset: { width: 1, height: 1},
    shadowRadius: 4,
    elevation: 2,
    borderRadius: 4,

    margin: wp('2'),
    marginHorizontal: wp('10'),
    backgroundColor: '#fff',
    borderColor: '#81B29A',
    borderWidth: 2,
  },
  lightBtnText: {
    color: '#81B29A',
    fontSize: wp('5'),
    margin: wp('2'),
    textAlign: 'center',
    fontFamily: 'Montserrat-Medium'
  },
  saveBtn: {
    margin: wp('7'),
  },
  saveText: {
    color: '#4F6D7A',
    fontSize: wp('6'),
    margin: wp('2'),
    textAlign: 'center',
    fontFamily: 'Montserrat-Regular'
  },
  availabilityTitle: {
    margin: wp('2'),
    fontSize: wp('4'),
    fontFamily: 'OpenSans-Regular',
    alignSelf: 'center',
  },
  savedText: {
    margin: wp('2'),
    fontSize: wp('5'),
    fontFamily: 'Montserrat-Regular',
    alignSelf: 'center',
    color: '#4F6D7A'
  },
})

export default PublicProfile