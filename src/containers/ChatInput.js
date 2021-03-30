import React, { useState, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import {
  ScaledSheet,
} from 'react-native-size-matters';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
import storage from '@react-native-firebase/storage'
// import { CachedImage } from 'react-native-cached-image';
import FastImage from 'react-native-fast-image'
import Icons from '@assets/icons'
import ImagePicker from 'react-native-image-picker';
import { uniqueId } from 'lodash'


function ChatInput(props) {
  const [ isLoading, toggleLoading ] = useState(false)
  const [ pictureUrl, setPictureUrl ] = useState('')
  const [ picture, setPicture ] = useState({})
  const [ picRef, setRef ] = useState('')

  const textInput = useRef(null)

  const sendMessage = () => {
    if (!props.text) return;
    props.onSendMsg(pictureUrl)
    setPicture({})
    setRef('')
    setPictureUrl('')
    textInput.current.clear()
  }

  const takePicture = async () => {
    toggleLoading(true)
    const options = {
      title: 'Attach an image',
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
          const reference = storage().ref(`public_discussion/${props.meeting.id}/${fileId}`)
          setRef(reference)

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

  const deletePicture = () => {
    setPicture({})
    setPictureUrl('')
    picRef.delete().then(() => {
      setRef('')
    }).catch((err) => {
      console.log(err)
    })
  }

  let icon = props.text === ""? Icons.greySend : Icons.greenSend
  return (
    <View style={{backgroundColor: 'transparent'}}>
      <View style={{flexDirection: 'row'}}>

        {picture.uri?<TouchableOpacity >
            <FastImage 
            source={picture}
            style={{
              width: wp('20'),
              height: wp('20'),
              marginLeft: wp('5'),
              borderRadius: wp('1'),
              backgroundColor: 'transparent'
            }}
          />
        </TouchableOpacity>:null}

        {picture.uri?<TouchableOpacity style={styles.xBtn} onPress={deletePicture}>
          <FastImage 
            source={Icons.x}
            style={{
              width: wp('6'),
              height: wp('6'),            
            }}
          />
        </TouchableOpacity>:null}
      </View>

      <View style={styles.container}>
        <TouchableOpacity onPress={takePicture}  style={{justifyContent: 'flex-end'}}>
          <FastImage
            source={Icons.paperclip}
            style={{
              width: wp('7'),
              height: wp('7'),
              alignSelf: 'center',
              margin: wp('1')
            }}
          />
        </TouchableOpacity>

        <TextInput
          ref={textInput}
          multiline
          style={styles.input}
          onChangeText={(text) => props.onType(text)}
          value={props.text}
          placeholder="Enter message"
          placeholderTextColor="dimgrey"

        />
        <TouchableOpacity disabled={!props.text || isLoading} onPress={sendMessage} style={{justifyContent: 'flex-end'}}>
          <FastImage
            source={icon}
            style={styles.mediaIcon}
          />
        </TouchableOpacity>
      </View>
    </View>

  )
}

const styles = ScaledSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: '20@ms',
    borderWidth: '1@ms',
    borderColor: 'dimgrey',
    margin: '5@ms',
    paddingLeft: '10@ms',
    padding: '4@ms',
    marginBottom: '15@ms',
    backgroundColor: 'transparent',
  },
  input: {
    flex: 1,
    fontSize: '20@ms',
    marginRight: '10@ms'
  },
  inputText: {

  },
  mediaIcon: {
    width: '34@ms',
    height: '34@ms',
    alignSelf: 'flex-end',
    marginRight: '5@ms',
  },
  xBtn: {
    borderRadius: wp('3'),
    borderColor: 'dimgrey',
    borderWidth: 1,
    alignSelf: 'center',
    marginLeft: wp('3')
  },
})

export { ChatInput }
