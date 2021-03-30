import React, {useState, useEffect, useRef } from 'react'
import {
  View,
  KeyboardAvoidingView,
  FlatList,
  Alert,
} from 'react-native'
import {
  Block,
  MessageNavBar,
} from '../../common'
import {
  MessagerInput, RequestCard,
  RequestResponseCard,
  PeerMessageCard,
} from '../../containers'
import {
  EmptyMessage,
} from '../../emptyOrError'
import {
  TaMessengerModal,
  CommentOptionsModal,
  ImageViewerModal,
} from '../../modals'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { connect } from 'react-redux'
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import storage from '@react-native-firebase/storage'
import { includes } from 'lodash' 
import moment from 'moment'
import Clipboard from "@react-native-community/clipboard";
import Spinny from 'react-native-spinkit'
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-crop-picker';

function AssistantMessenger(props) {
  const [ messages, setMessages ] = useState([])
  const [ message, setMessage ] = useState('')
  const [ currentUser, setCurrentUser ] = useState({})
  const [ customer, setCustomer ] = useState(props.route.params.customer)
  const [ ta, setTa ] = useState(props.route.params.ta)
  const [ text, setText ] = useState('')
  const [ showPostOptionsModal, togglePostOptionsModal ] = useState(false)
  const [ showOptionsModal, toggleOptionsModal ] = useState(false)
  const [ comment, setComment ] = useState({})
  const [ currentIndex, setCurrentIndex ] = useState(0)
  const [ isLoading, toggleLoading ] = useState(true)
  const [ showMessageModal, toggleMessageModal ] = useState(false)
  const [ messageRef, setMessageRef ] = useState(props.route.params.thread) 
  const [ selectedFile, setFile ] = useState({})
  const [ selectedImgs, setSelectedImgs ] = useState([])
  const [ isTa, setTaMode ] = useState(props.route.params.isTa)
  const [ loadedComments, setLoadedComments ] = useState(20)
  const [ showFooter, toggleShowFooter ] = useState(false)
  const [ stopLoading, toggleStopLoading ] = useState(false)
  const [ showImageModal, toggleImageModal ] = useState(false)
  const [ modalUrls, setModalUrls ] = useState([])
  const messagesList = useRef(null)

  
  useEffect(() => {
    toggleLoading(true)
    const user = auth().currentUser
    let isTa = props.route.params.isTa
    let userRef = 'teacher_assistants'
    if (!isTa) userRef = 'users'
    
    firestore().collection(userRef).doc(user.uid)
    .get().then((doc) => {
      setCurrentUser({ ...doc.data(), id: doc.id })
    }).catch((err) => console.log(err))
   
    let unsub = firestore()
    .collection('message_threads')
    .doc(messageRef.id)
    .collection('messages')
    .orderBy('date', 'desc')
    .limit(loadedComments)
    .onSnapshot((querySnap) => {
      sortMessages(querySnap)
    }, (err) => {
      console.log(err)
      toggleLoading(false)
      setMessages([])
    })

    return () => {unsub()}
  }, [])

  const loadMore = () => {
    if (stopLoading) return;
    toggleLoading(true)
    let latestMsg = messages[messages.length -1] 

    messageRef.collection('messages')
    .limit(loadedComments+10)
    .orderBy('date', 'desc')
    .startAfter(latestMsg.ref)
    .get().then((querySnap) => {
      sortMessages(querySnap, true)
      if (querySnap.size < loadedComments) {
        toggleShowFooter(!showFooter)
        toggleStopLoading(true)
      }

      setLoadedComments(loadedComments+10)
    }).catch((err) => {
      toggleLoading(false)
    })
  }

  const sortMessages = (querySnap, loadMore) => {
    if (querySnap.empty) {
      toggleLoading(false)
      return setMessages([])
    }

    let comments = []
    let sortedMsgs = []
    let days = []
    querySnap.forEach((doc) => {
      let msg = { ...doc.data(), id: doc.id, ref: doc.ref }
      let tstmp = msg.date._seconds
      let today = moment().format('MMM Do')
      let time = moment(tstmp).format('MMM Do')
  
      if (today === time) {
        msg.isToday = true
        msg.isNew = includes(days, time)? false:true
      } else if (includes(days, time)) {
        msg.isNew = false
      } else {
        msg.isNew = true
      }

      days.push(time)
      sortedMsgs.push(msg)

      comments.push(sortedMsgs.sort((a, b) => a.date._seconds + b.date._seconds ))
    })
    
    setMessages(sortedMsgs)
    toggleLoading(false)
    setTimeout(() => {
      if(loadMore) return
      scrollToBottom()
    },150)
  }


  const sendMsg = async () => {
    if (!text && !selectedImgs && !selectedFile.uri) return;
    toggleLoading(true)

    try {
      setLoadedComments(loadedComments+2)
      let newMessage = {
        author: currentUser,
        date: firestore.Timestamp.now(),
        text: text.trim(),
        type: 'message',
        files: [],
        images: [],
      }
  
      let doc = await messageRef.collection('messages').add(newMessage)
      
      if (selectedFile.uri) {
        toggleLoading(true)
        let file = await uploadFile(doc)
        await doc.update({
          file: file,
        })
        setFile({})
        toggleLoading(false)
      } 
  
      if (selectedImgs) {
        toggleLoading(true)
        let urls = await uploadImages(doc)
        await doc.update({
          images: urls
        })
        setSelectedImgs([])
        toggleLoading(false)
      }
      setText('')
      toggleLoading(false)
    } catch(err) {
      console.log(err)
    }
  }

  const uploadFile = (messageRef) => {
    return new Promise((res, rej) => {
      const reference = storage().ref(`messages/${messageRef.id}/${selectedFile.name}`)
  
      reference.putFile(selectedFile.uri).then(() => {
        return reference.getDownloadURL()
      }).then((url) => {
        console.log(url)
        res({url, name: selectedFile.name, type: selectedFile.type, size: selectedFile.size })
      }).catch((err) => {
        rej(err)
      })
    })
  }

  const handleRenderItem = ({ item }) => {
    switch (item.type) {
      case 'request':
        return <RequestCard isTa={isTa} onAccept={() => acceptRequest(item)} onDeny={() => denyRequest(item)} key={item.id} item={item}/>
      case 'request_response':
        return <RequestResponseCard key={item.id} item={item}/>
      default:
        return <PeerMessageCard key={item.id} 
        onLongPress={() => {
          setMessage(item)
          setTimeout(() => {
            toggleMessageModal(!showMessageModal)
          }, 40)
        }} item={item}
          onViewImages={() => {
            setModalUrls(item.images.map((img) => { return {url: img, props: {}} }))
            setTimeout(() => {
              toggleImageModal(!showImageModal)
            }, 30)
          }}
        />
    }
  }

  const acceptRequest = (request) => {
    
    let requestResponse = {
      type: 'request_response',
      status: 'accepted',
      date: firestore.Timestamp.now(),
      total: request.total,
    }
    
    messageRef
    .collection('messages').doc(request.id)
    .update({
      status: 'accepted',
    })

    messageRef
    .collection('messages')
    .add(requestResponse)
  }

  const denyRequest = (request) => {
    let requestResponse = {
      type: 'request_response',
      status: 'denied',
      date: firestore.Timestamp.now(),
      total: request.total,
    }
    
    messageRef
    .collection('messages').doc(request.id)
    .update({
      status: 'denied',
    })
    
    messageRef
    .collection('messages')
    .add(requestResponse)
  }

  const selectFile = async () => {
    toggleLoading(true)
    if (selectedFile.uri) {
      // delete prev selected file
      setFile({})
    }

    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      })

      console.log(
        res
      )

      setFile(res)
      toggleLoading(false)
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        toggleLoading(false)
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        toggleLoading(false)
        throw err
      }
    }
  }

  const pickImages = () => {
    toggleLoading(true)
    ImagePicker.openPicker({
      multiple: true
    }).then(images => {
      // console.log(images)
      setSelectedImgs(images)
      toggleLoading(false)
    }).catch(err => {
      console.log(err)
      toggleLoading(false)
    })
  }

  const scrollToBottom = () => {
    messagesList.current.scrollToIndex({index: 0})
  }

  const uploadImages = (messageRef) => {
    return new Promise(async (res, rej) => {
        let urls = []

        try {
          await Promise.all(selectedImgs.map(async (img) => {
            let ref = storage().ref(`messages/${messageRef.id}/${Date.now()}/${img.filename}`)
            await ref.putFile(img.sourceURL)
            let url = await ref.getDownloadURL()
            urls.push(url)
          }))
  
          res(urls)
        } catch(err) {
          rej(err)
        }
    })
  }

  const renderLoading = () => {
    if (isLoading) {
      return (
        <View style={{alignSelf: 'center'}}>
          <Spinny type="Arc" color="#454545" size={wp('10')}/>
        </View>
      )
    } else if (false) {
      return (
        <View>
          <Text>Load more</Text>
        </View>
      )
    }
  }

  const blockUser = () => {

  }
  
  return (
    <Block> 
      <MessageNavBar 
        profilePic={isTa?'':ta.profilePic}
        title={currentUser.id==ta.id?customer.name:ta.name}
        onOptions={() => {
          toggleOptionsModal(!showOptionsModal)
          setTimeout(() => {
          }, 50)
        }}        
      />

      <View style={{flex: 1, justifyContent: 'space-between'}}>
        <View style={{flex: 1}}>
          <FlatList
            inverted={messages.length}
            ref={messagesList}
            data={messages}
            extraData={messages}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={<EmptyMessage />}
            renderItem={handleRenderItem}
            ListHeaderComponent={renderLoading()}
            onEndReached={() => loadMore()}
          />
        </View>
        
        <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={hp(8)}>
          <MessagerInput
            onSend={() => {
              setText('')
              sendMsg()
            }} 
            onUploadImage={pickImages}
            selectedImgs={selectedImgs}
            onRemoveImg={(imgs) => {
              setSelectedImgs(imgs)
            }}
            onUploadFile={selectFile}
            selectedFile={selectedFile}
            value={text}
            onChangeText={setText}
            onRemoveFile={() => {
              setFile({})
            }}
            isLoading={isLoading}
          />
        </KeyboardAvoidingView>
      </View>

      <TaMessengerModal 
        visible={showOptionsModal}
        toggleModal={() => toggleOptionsModal(!showOptionsModal)}
        request={() => {}} 
        block={() => {
          toggleOptionsModal(!showOptionsModal)
          setTimeout(() => {
            Alert.alert(
              "Block this user?",
              `You can unblock this user in "personal info"`,
              [
                {
                  text: "Cancel",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel"
                },
                { text: "Block", onPress: () => {
                  let otherUser = currentUser.id==customer.id?ta:customer 
                  let role = isTa?'teacher_assistants':'users'
                  firestore().collection('users').doc(currentUser.id)
                  .collection('blocked_users').doc(otherUser.id).set({
                    ref: messageRef,
                    ta,
                    customer, 
                    blockedBy: currentUser.id,
                    user: otherUser,
                    isTa: isTa,
                  }).then(() => {
                    messageRef.update({
                      blockedBy: firestore.FieldValue.arrayUnion(currentUser.id)
                    })
                    firestore().collection(role).doc(currentUser.id)
                    .collection('message_threads').doc(otherUser.id).update({
                      blockedBy: firestore.FieldValue.arrayUnion(currentUser.id),
                      isBlocked: true,
                    }).then(() => props.navigation.navigate('search'))
                  })
                }}
              ],
              { cancelable: false }
            )
          })
          
        }}
        report={() => {
          let otherUser = currentUser.id==customer.id?ta:customer 
          toggleOptionsModal(!showOptionsModal)
          props.navigation.navigate('report', {
            item: message,
            currentUser,
            reportedUser: otherUser
          })
        }} 
      />

      {message?<CommentOptionsModal 
        visible={showMessageModal}
        onToggleModal={() => toggleMessageModal(!showMessageModal)}
        comment={message}
        onDeletePost={() => {
          messageRef.collection('messages').doc(message.id)
          .delete().catch((err) => console.log(err))
        }}
        onReportPost={() => props.navigation.navigate('report', {item:message})}
        onCopyText={() => {
          Clipboard.setString(message.text)
          toggleMessageModal(!showMessageModal)
        }}
      />:null}

      {showImageModal?<ImageViewerModal 
        visible={showImageModal}
        images={modalUrls}
        onCancel={() => toggleImageModal(!showImageModal)}
      />:null}

    </Block>
  )
}

const mapStateToProps = state => {


  return {
 
  }
}

const dispatchToState = {

}

export default
  connect(mapStateToProps, dispatchToState)
(AssistantMessenger)