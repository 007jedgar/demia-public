import React, { useState, useEffect } from 'react'
import { 
  FlatList,
  Linking,
  View,
} from 'react-native'
import {
  Block,
  SubNavBar,
  MinorAlert,
} from '../../common'
import {
  DocumentCard
} from '../../containers'
import {
  AddBtn
} from '../../buttons'
import {
  uploadDoc
} from '../../actions'
import {
  EmptyDocCard
} from '../../emptyOrError'
import { SliderOptionsModal } from '../../modals'
const wordDoc = require('../../../assets/icons/word_doc.png')

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { ScaledSheet } from 'react-native-size-matters'
import DocumentPicker from 'react-native-document-picker';

import { connect } from 'react-redux'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import Spinny from 'react-native-spinkit'

import Clipboard from "@react-native-community/clipboard";


function SharedDocs(props) {
  const [ showAlert, toggleShowAlert ] = useState(false)
  const [ showDocOptions, toggleDocOptions ] = useState(false)
  const [ isLoading, toggleLoading ] = useState(false)
  const [ selectedDoc, setDoc ] = useState({})
  const [ documents, setDocuments ] = useState([])
  const [ documentSubscribers, setDocumentSubs ] = useState([])

  useEffect(() => {
    toggleLoading(true)

    let unsubscribe = firestore()
    .collection('meetings').doc(props.meeting.id)
    .collection('documents').onSnapshot((querySnap) => {
      if (querySnap.empty) {
        toggleLoading(false)
        return setDocuments([])
      }

      let documents = []
      querySnap.forEach((doc) => {
        documents.push({ ...doc.data(), id: doc.id })
      })

      setDocuments(documents)
      toggleLoading(false)
    }, (err) => {
      toggleLoading(false)
      setDocuments([])
    })

    let unsub = firestore()
    .collection('meetings').doc(props.meeting.id)
    .onSnapshot((doc) => {
      let { documentSubscribers } = doc.data()
      if (!documentSubscribers) return setDocumentSubs([])

      setDocumentSubs(documentSubscribers)
    }, (err) => {
      console.log(err)
    })

    return () => {
      unsubscribe()
      unsub()
    }
  }, [])


  const subscribeToDoc = (item) => {
    const user = auth().currentUser
    item.type="document"
    // add subscriptions to poll collection
    let subsRef = firestore().collection('meetings').doc(props.meeting.id)
    .collection('documents').doc(item.id)
    .collection('subscriptions').doc(user.uid)
    .set(props.profile)

    let meetingRef = firestore().collection('meetings').doc(props.meeting.id)
    .collection('documents').doc(item.id)
    .update({
      subscribers: firestore.FieldValue.arrayUnion(user.uid)
    })

    let userRef =  firestore().collection('users').doc(user.uid)
    .collection('subscriptions').doc(item.id)
    .set({item, meeting: props.meeting})

    Promise.all([ subsRef, meetingRef, userRef ])
    .catch((err) => {
      console.log(err)
    })
  }
  

  const onAddDoc = async () => {
    let meeting = props.meeting
    let profile = props.meetingProfile

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
      props.uploadDoc({file: res, title: res.name, meeting, profile })
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        
        throw err;
      }
    }
  }

  const onDocOptionsPressed = (item) => {
    if (!item) return;
    setDoc(item)
    Linking.openURL(item.url)
  }
  

  const renderAlert = () => {
    if (showAlert) {
      return (
        <MinorAlert 
          hideAlert={() => toggleShowAlert(!showAlert)} 
          text="Link Copied"
        />
      )
    }
  }

  const renderLoading = () => {
    if (isLoading) {
      return (
        <View style={{alignSelf: 'center'}}>
          <Spinny size={wp('9')} type="Arc" color="#000" />
        </View>
      )
    }
  }

  const onSubscribe = async () => {
    console.log('subscribing')
    const user = auth().currentUser
    try {

      let sub = {
        meeting: props.meeting,
        meetingId: props.meeting.id,
        item: {},
        itemId: '',
        type: 'documents',
        event: 'documents_subscribed',
        date: firestore.Timestamp.now(),
      }
  
      let docSubRef = firestore()
      .collection('meetings').doc(props.meeting.id)
      .collection('documents_subs')
      
      let userSubCollectionRef = firestore()
      .collection('users').doc(user.uid)
      .collection('subscription_refs')
  
      let userSubsRef = firestore()
      .collection('users').doc(user.uid)
      .collection('subscriptions')
  
      let meetingRef  = firestore()
      .collection('meetings').doc(props.meeting.id)
  
      meetingRef.update({
        documentSubscribers: firestore.FieldValue.arrayUnion(user.uid)
      })
  
      let userDocMeetingSubRef = await docSubRef.add(props.profile)
      
      let userSubDoc = await userSubsRef.add(sub)
  
      sub.ref = userSubDoc
      await userSubCollectionRef.add(sub)
  
      sub.ref = userDocMeetingSubRef
      await userSubCollectionRef.add(sub)
    } catch(err) {
      console.log(err)
    }
  }

  const onUnsubscribe  = () => {
    console.log('unsubscribing')
    const user = auth().currentUser

    let meetingRef  = firestore()
    .collection('meetings').doc(props.meeting.id)

    let userSubCollectionRef = firestore()
    .collection('users').doc(user.uid)
    .collection('subscription_refs')
    
    userSubCollectionRef.where("type", "==", "documents")
    .where("meetingId" , "==", props.meeting.id)
    .get().then((querySnap) => {
      let batch = firestore().batch()
      querySnap.forEach((doc) => {
        batch.delete(doc.ref)
        batch.delete(doc.data().ref)
      })

      batch.commit()
    })

    meetingRef.update({
      documentSubscribers: firestore.FieldValue.arrayRemove(user.uid)
    })
  }

  const deleteDoc = (selectedDoc) => {
    firestore()
    .collection('meetings').doc(props.meeting.id)
    .collection('documents').doc(selectedDoc.id)
    .delete()
  }

  return (
    <Block>

      <SubNavBar 
        title="Documents" 
        onToggleSub={() => {
          let user = auth().currentUser
          if (documentSubscribers.includes(user.uid)) {
            onUnsubscribe()
          } else {
            onSubscribe()
          }
        }}
        isSubbed={documentSubscribers.includes(auth().currentUser.uid)}
      />

      <FlatList
        data={documents}
        renderItem={({item}) => (
          <DocumentCard  
            onCommentPress={() => {
              props.navigation.navigate('feedThread', {
                subject: 'documents_thread', 
                subjectDoc: {...item, type: 'documents'},
              })
            }}
            item={item} 
            onDocOptions={() => {
              setDoc(item)
              toggleDocOptions(!showDocOptions)
            }}
          />
        )}
        keyExtractor={item => item.id.toString()}
        ListHeaderComponent={renderLoading()}
        ListEmptyComponent={<EmptyDocCard />}
      />
          
      <AddBtn onPress={onAddDoc} />

      {renderAlert()}

      <SliderOptionsModal 
        visible={showDocOptions}
        onToggleModal={() => toggleDocOptions(!showDocOptions)}
        details={() => {}} 
        download={() => {
          toggleDocOptions(!showDocOptions)
          Linking.openURL(selectedDoc.url)
        }}
        copyLink={() => {
          Clipboard.setString(selectedDoc.url)
          toggleShowAlert(!showAlert)
          toggleDocOptions(!showDocOptions)
        }}
        onDelete={() => {
          toggleDocOptions(!showDocOptions)
          deleteDoc(selectedDoc)
        }} 
        profile={props.meetingProfile}
        item={selectedDoc}
      />
    </Block>
  )
  
}

const mapDispatchToProps = {uploadDoc}

const mapStateToProps = state => {
  const { profile } = state.auth
  const { meetingProfile, meeting, } = state.meeting 

  return {
    profile,
    meeting, 
    meetingProfile,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
(SharedDocs)