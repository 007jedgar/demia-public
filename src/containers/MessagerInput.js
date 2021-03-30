import React, {useState, useEffect, useRef } from 'react'
import {
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  ScrollView,
  Text,
  FlatList,
} from 'react-native'
import FastImage from 'react-native-fast-image'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Icons from '@assets/icons'
import { KeyboardAwareScrollView  } from 'react-native-keyboard-aware-scroll-view'
import Spinny from 'react-native-spinkit'

function MessagerInput({value, onChangeText, onSend, onUploadImage, onUploadFile, selectedFile, onRemoveFile, selectedImgs, onRemoveImg, isLoading }) {
  const inputRef = useRef(null)
  const [ isInputFocused, toggleInputFocused ] = useState(false)
  const [images, setImages ] = useState(selectedImgs) 
  
  useEffect(() => {
    setImages([...selectedImgs])
  }, [selectedImgs])

  const removeImage = (index) => {
    let imgs = selectedImgs
    imgs.splice(index, 1)
    setImages(imgs.length?[...imgs]:[])
    onRemoveImg(imgs)
  }

  const renderMediaIcons = () => {
    return (
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity onPress={onUploadImage}>
          <FastImage 
            style={styles.icons}
            source={Icons.imageIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onUploadFile} style={{flexDirection: 'row'}}>
          <FastImage 
            style={styles.icons}
            source={Icons.paperclip}
          />
        </TouchableOpacity>
      </View>
    )
  }

  const selectFileImg = () => {
      let img = ''
      switch (selectedFile.type) {
        case 'application/pdf':
          img = Icons.pdfDoc
          break;
        case 'audio/mpeg':
          img = Icons.audio
          break;
        case 'video/mpeg':
          img = Icons.video
          break;
        case 'text/csv':
          img = Icons.csvDoc
          break;
        case 'image/jpeg':
          img = Icons.jpg
          break;
        case 'application/vnd.ms-excel':
          img = Icons.excel
          break;
        case 'application/vnd.ms-powerpoint':
          img = Icons.ppt
          break;
        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
          img = Icons.ppt
          break;
        case 'application/msword':
          img = Icons.wordDoc
          break;
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          img = Icons.wordDoc
          break;
        default:
          img = Icons.wordDoc
          break;
      }
      return img
  }

  return (
    <View behavior="position" keyboardVerticalOffset={hp(8)} style={[styles.container, {marginBottom: isInputFocused?hp(5):hp(0)}]}  >

      {selectedFile.uri?<View style={styles.attachmentContainer}>
        <Text style={styles.attachmentName}>Attachment: {selectedFile.name}</Text>
        <FastImage 
          source={selectFileImg()}
          style={{
            width: wp('7'),
            height: wp('7'),
            alignSelf: 'center',
          }}
        />
        <TouchableOpacity onPress={onRemoveFile}>
          <FastImage 
            source={Icons.x}
            style={{
              width: wp('7'),
              height: wp('7'),
              alignSelf: 'center',
            }}
          />
        </TouchableOpacity>
      </View>:null}

        {selectedImgs.length?<FlatList 
          horizontal
          extraData={images}
          data={images}
          renderItem={({item, index}) => <View>
          <TouchableOpacity onPress={() => removeImage(index)} activeOpacity={.7} style={styles.xbtn}>
            <FastImage 
              source={Icons.x}
              style={{
                width: wp('5'),
                height: wp('5'),
                alignSelf: 'center',
              }}
            />
          </TouchableOpacity>
            <FastImage 
            source={{uri: item.sourceURL}}
            style={{
              width: wp('20'),
              height: wp('20'),
              margin: wp(1),
            }}
          />
          </View>}
          keyExtractor={item => item.localIdentifier}
        />:null}

      <View style={{flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#fff'}}>
        {!isInputFocused?renderMediaIcons():null}

        {/* <ScrollView keyboardDismissMode="on-drag" bounces={false} keyboardShouldPersistTaps="never"> */}
          <TextInput 
            onFocus={({ nativeEvent: { target } }) => {
              toggleInputFocused(true)
            }}
            onBlur={() => {
              console.log('blured')
              toggleInputFocused(false)
            }} 
            ref={inputRef}
            placeholder="Type your message"
            style={[styles.input, {width: !isInputFocused?wp(60):wp(85)} ]}
            placeholderTextColor="dimgrey"
            multiline={true}
            value={value}
            onChangeText={onChangeText}
          />
        {/* </ScrollView> */}
        {!isLoading?<TouchableOpacity onPress={() => {
          inputRef.current.blur()
          onSend()
        }} style={{alignSelf: 'flex-end',}}>
          <FastImage 
            style={styles.icons}
            source={value.trim()?Icons.greenSend:Icons.greySend}
          />
        </TouchableOpacity>:<View>
          <Spinny color="#4F6D7A" type="Arc" size={wp(7)} />
          </View>}
      </View>
        
      {isInputFocused?renderMediaIcons():null}

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: wp('2'),
    borderTopRightRadius: wp('2'),
    borderTopLeftRadius: wp('2'),

    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: .1,
    shadowOffset: {width: 0, height: -3},
    shadowRadius: 4,
  },
  input: {
    fontFamily: 'OpenSans-Regular',
    fontSize: wp('4.5'),
    backgroundColor: '#f1f1f1',
    borderRadius: wp('3'),
    padding: wp('2'),
    paddingLeft: wp('5'),
    width: wp('85'),
    maxHeight: hp('10')
  },
  icons: {
    width: wp('7'),
    height: wp('7'),
    margin: wp('2'),
  },
  attachmentContainer:{ 
    margin: wp('2'),
    backgroundColor: '#c2c2c2',
    borderRadius: 4,
    padding: wp('2'),
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  attachmentName: {
    fontFamily: 'OpenSans-Regular',
    fontSize: wp('4'),
  },
  imgsContainer: {
    flexDirection: 'row',
  },
  xbtn: {
    padding: wp(.5),
    backgroundColor: '#fff',
    position: 'absolute',
    right: 0,
    zIndex: 2,
    borderRadius: wp('5'),
    shadowColor: '#000',
    shadowOpacity: .3,
    shadowOffset: { width: 1, height: 0},
  },
})

export {MessagerInput}