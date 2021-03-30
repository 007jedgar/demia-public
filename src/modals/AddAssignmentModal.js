import React, { useState, useEffect } from 'react'
import {
  Modal,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native'
import { ScaledSheet } from 'react-native-size-matters'
import { 
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
 } from 'react-native-responsive-screen'
import FastImage from 'react-native-fast-image'
import moment from 'moment'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { 
  BasicInput,
} from '../containers'
import { 
  ConfirmBtn ,
  FilledConfirmBtn,
  UploadBtn,
} from '../buttons'
// import {
//   DatePickerModal
// } from '../modals'
import {
  Spinner
} from '../common'
import DocumentPicker from 'react-native-document-picker';
import storage from '@react-native-firebase/storage'
import Spinny from 'react-native-spinkit'
import { uniqueId } from 'lodash'
import ImagePicker from 'react-native-image-picker';
import Icons from '@assets/icons'

function AddAssignmentModal({ visible, closeModal, sendAssignment, meeting, profile }) {
  const [ date, setDate ] = useState(new Date())
  const [ showDatePicker, toggleDatePicker ] = useState(false)
  const [ isLoading, toggleLoading ] = useState(false)
  const [ title, setTitle ] = useState('')
  const [ description, setDescription ] = useState('')
  const [ link, setLink ] = useState('')
  const [ fileUrl, setFile ] = useState(null)
  const [ fileName, setFileName ] = useState('')
  const [ picture, setPicture ] = useState(null)
  const [ pictureUrl, setPictureUrl ] = useState('')

  useEffect(() => {
    setTitle('')
    setDescription('')
    setLink('')
    setFileName('')
    setFile(null)
    setPicture(null)
    setPictureUrl('')
  }, [])

  const onPickDate = () => {
    toggleDatePicker(true)
  }

  const takePicture = async () => {
    toggleLoading(true)
    const options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    }
    try { 
      ImagePicker.showImagePicker(options, async (response) => {
        console.log('Response = ', response)
      
        if (response.didCancel) {
          toggleLoading(false)
  
        } else if (response.error) {
          toggleLoading(false)
  
        } else {
          const source = { uri: response.uri }
          setPicture(source)
  
          let fileId = uniqueId(response.fileName)
          const reference = storage().ref(`assignmentPictures/${meeting.id}/${fileId}`)
          
          await reference.putFile(response.uri)
          let fileUrl = await reference.getDownloadURL()
          setPictureUrl(fileUrl)
          toggleLoading(false)
        }
      })
    } catch(err) {
      toggleLoading(false)
    }
  }

  const pickDoc = async () => {
    toggleLoading(true)
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      })

      console.log(
        res.uri,
        res.type, // mime type
        res.name,
        res.size
      )
        setFileName(res.name)
      // this.props.uploadDoc({file: res, title: res.name, meeting, profile })
      let fileId = uniqueId(res.name)
      const reference = storage().ref(`assignmentFiles/${meeting.id}/${fileId}`)
      
      await reference.putFile(res.uri)
      let fileUrl = await reference.getDownloadURL()
      setFile(fileUrl)
    
      toggleLoading(false)
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
        toggleLoading(false)
      } else {
        toggleLoading(false)
        throw err;
      }
    }
  }

  const donePressed = () => {
    if (!title) return alert('Please supply a title')
    if (!date) return alert('Please supply a due date')


    const assignment = {
      date,
      title,
      description,
      link,
      file: fileUrl,
      picture: pictureUrl,
      author: profile,
      type: 'assignment',
    }

    sendAssignment(assignment) 
  }

  const onClosePressed = () => {
    
    if (title || fileUrl || picture ) {
      Alert.alert(
        'Wait',
        'You have unsaved changes. Do you still want to leave?',
        [{
          text: 'Yes', onPress: () => closeModal()
        },
        {
          text: 'No' }]
      )
    } else closeModal()
    
  }

  return (
    <Modal
      animationType="slide"
      visible={visible}
    >
      <SafeAreaView style={styles.container}>
        <KeyboardAwareScrollView style={{flex: 1}}>

          <TouchableOpacity onPress={closeModal}>
            <Text style={styles.close}>Close</Text>
          </TouchableOpacity>

          <Text style={styles.header}>
            Add an assignment
          </Text>

          <BasicInput 
            placeholder="Title"
            text={title}
            typed={setTitle}
            title={'Title'}
          />
          <BasicInput 
            placeholder="Description"
            text={description}
            typed={setDescription}
            title={'Description'}
          />

          {/* <Text style={styles.btnTitle}>{'Date'}</Text> */}
          <ConfirmBtn onPress={onPickDate} text={date?moment(date).format('MMMM Do YYYY'):'Due Date'}/>
          <BasicInput 
            placeholder="Link"
            text={link}
            typed={setLink}
            title={'Link'}
          />

          <View style={{ flexDirection: 'row', justifyContent: 'center'}}>
            <UploadBtn onPress={pickDoc} text={fileName?fileName:"Upload file"}/>
            {picture?<TouchableOpacity style={styles.imgContainer}>
              <FastImage 
                source={picture}
                style={styles.picture}
              />
              </TouchableOpacity>:<UploadBtn onPress={takePicture} text="Take picture"/>}
          </View>

          {!isLoading?<FilledConfirmBtn 
            disabled={false}
            text="Done"
            onPress={donePressed}
          />:
          <View style={{alignSelf: 'center'}}>
            <Spinny 
              color="#69A2B0"
              size={wp('10')}
              type="Arc"
            /> 
          </View>}
 

          {/* <DatePickerModal  
            visible={showDatePicker}
            closeModal={() => toggleDatePicker(false)}  
            returnDate={(_date) => setDate(_date)}
          /> */}
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </Modal>
  )
}

const styles = ScaledSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  close: {
    fontFamily: 'OpenSans-Bold',
    fontSize: wp('5'),
    color: 'dimgrey',
    margin: wp('3'),
  },
  header: {
    fontFamily: 'OpenSans-Bold',
    fontSize: wp('7'),
    color: 'dimgrey',
    margin: wp('3')
  },
  btnTitle: {
    marginLeft: wp('14'),
    marginBottom: hp('.5'),
    fontSize: wp('4'),
    fontFamily: 'Montserrat-Medium',
  },
  imgContainer: {
    borderRadius: '4@ms',

    alignSelf: 'center',
    margin: wp('5'),

    height: wp('25%'),
    width: wp('25%'),

    shadowColor: 'black',
    shadowOffset: { x: 2, y:2},
    shadowRadius: '2@ms',
    shadowOpacity: .6,
    elevation: '1@ms',

    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  picture: {
    height: wp('25%'),
    width: wp('25%'),
  },
})

export {AddAssignmentModal}