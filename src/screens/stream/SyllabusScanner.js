import React, { useState} from 'react'
import {
  View,
  Text,
} from 'react-native'
import {
  Block,
  BackNavBar,
} from '../../common'
import {
  ConfirmBtn
} from '../../buttons'
import { utils } from '@react-native-firebase/app';
import ml from '@react-native-firebase/ml';
import ImagePicker from 'react-native-image-picker';
import moment from 'moment' 
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'


function SyllabusScanner() {
  const [ isLoading, toggleLoading ] = useState(false) 
  const [ syllabiDoc, setSyllabiDoc ] = useState({})

  const takePicture = async () => {
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
          
          processFile(response.uri)
          // let fileId = response.fileName + '_' + moment().unix()
          // const reference = storage().ref(`syllabi/${fileId}`)
          
          // await reference.putFile(response.uri)
          // let fileUrl = await reference.getDownloadURL()
  
        }
      })
    } catch(err) {

    }
  }

  let processFile = async (file) => {
    const processed = await ml().cloudDocumentTextRecognizerProcessImage(file);

    // console.log('Found text in document: ', processed.text);
  
    processed.blocks.forEach(block => {
      console.log(block)
      console.log('Found block with text: ', block.text);
      console.log('Confidence in block: ', block.confidence);
    })

    firestore().collection('syllabi_text')
    .add({
      text: processed.text, 
      refDate: firestore.Timestamp.now(),
    })
  }



  return (
    <Block>
      <BackNavBar title="Scan a syllabus"/>

      <ConfirmBtn onPress={takePicture} text="Pick a syllabus"/>
    </Block>
  )
}

export default SyllabusScanner