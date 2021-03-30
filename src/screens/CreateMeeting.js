import React, {useState, useEffect, useRef} from 'react'
import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import {
  Block, BackNavBar,
} from '../common'
import {
  BasicInput,
  BasicMultilineInput,
} from '../containers'
import {
  ConfirmBtn,
} from '../buttons'
import {
  SelectorModal,
} from '../modals'
import {
  createMeeting,
  joinGroup,
  joinNewGroup,
} from '../actions'
import { ScaledSheet } from 'react-native-size-matters'
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { connect } from 'react-redux'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import { uniqueId } from 'lodash'
import RNSimpleCrypto from "react-native-simple-crypto";


const INITIAL_OPTIONS = [
  {title: 'Conference',  selected: false },
  {title: 'Lecture',  selected: false },
  {title: 'Meeting',  selected: false },
  {title: 'Classroom',  selected: false },
  {title: 'Other',  selected: false },
]

function CreateMeeting(props) {
  const [ showModal, toggleModal ] = useState(false)
  const [ category, setCategory ] = useState('[Select a category]')
  const [ title, setTitle ] = useState('')
  const [ displayName, setDisplayName ] = useState('')
  const [ description, setDescription ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ newGroupPassword, setGroupPassword ] = useState('')
  const [ groupCategory, setCatInput ] = useState('')
  const [ groupId, typeGroupId ] = useState('')
  const [ newGroupId, typeNewGroupId ] = useState('')
  const [ isValidGroupId, setValidGroupId ] = useState(false)
  const scrollView = useRef(null)

  useEffect(() => {
    checkGroupId(newGroupId)
    
    // const sha256Hash = await RNSimpleCrypto.SHA.sha256("test");
    // const toUtf8 = RNSimpleCrypto.utils.convertArrayBufferToUtf8
    
    // console.log(sha256Hash)
    
    // const toHex = RNSimpleCrypto.utils.convertArrayBufferToHex
    // const arrayBufferToHash = RNSimpleCrypto.utils.convertUtf8ToArrayBuffer("test");
    // const sha256ArrayBuffer = await RNSimpleCrypto.SHA.sha256(arrayBufferToHash);
    // console.log('SHA256 hash bytes', toHex(sha256ArrayBuffer));
    // if (toHex(sha256ArrayBuffer) !== sha256Hash) {
    //   console.error('SHA256 result mismatch!')
    // } else console.log('hello')


  }, [newGroupId])

  const checkGroupValid = () => {
    let groupIsValid = true

    if (!title) groupIsValid = false
    if (!description) groupIsValid = false
    if (category === '[Select a category]') groupIsValid = false
    if (category === 'Other' && !groupCategory) groupIsValid = false

    return groupIsValid
  }

  const checkGroupId = (groupId) => {
    firestore().collection('groupIds')
    .doc(groupId).get().then((doc) => {
      if (doc.exists) return setValidGroupId(false)
      else return setValidGroupId(true)
    })
  }

  const joinGroup = async () => {
    const toHex = RNSimpleCrypto.utils.convertArrayBufferToHex
    const arrayBufferToHash = RNSimpleCrypto.utils.convertUtf8ToArrayBuffer(password)
    const typedPasswordHashed = await RNSimpleCrypto.SHA.sha256(arrayBufferToHash)

    props.joinNewGroup(groupId, props.profile, displayName, toHex(typedPasswordHashed))
  }

  const saveGroup = async () => {
    try {

      if (!title) return alert('Please supply a title')
      if (!description) return alert('Please supply a description')
      if (category === '[Select a category]') return alert('Please supply a category')
      if (category === 'Other' && !groupCategory) return alert('Please supply your custom category')
      if (!displayName) return alert('Please supply a display name') 
  
      const hashedPassword = await RNSimpleCrypto.SHA.sha256(newGroupPassword)

      let group = {
        title,
        description,
        category,
        groupCategory,
        groupId: newGroupId,
        password: hashedPassword, 
      }
  
      props.createMeeting(group, props.profile, displayName,) 
    } catch(err) {
      console.log(err)
    }
  }

  return (
    <Block>
      <BackNavBar title="Join a classroom"/>

      <KeyboardAwareScrollView style={{flex: 1, }}>

        <BasicInput 
          placeholder="Classroom ID"
          title="classroom ID"
          text={groupId}
          typed={(typed) => typeGroupId(typed)}
        />
        <BasicInput 
          title="display name"
          placeholder="Display name"
          text={displayName}
          typed={setDisplayName}
        />

        <BasicInput 
          placeholder="Password (if applicable)"
          title="password (if applicable)"
          text={password}
          typed={setPassword}
          secureTextEntry={true}
          autoCapitalize="none"
        />

        {groupId.length>2?<ConfirmBtn onPress={() => joinGroup()} text="Join"/>:null}

        <View style={{
          alignSelf: 'center',
          backgroundColor: 'dimgrey',
          width: wp('70%'),
          height: 1,
          marginVertical: hp('1%')
        }}/>

        

        <Text style={styles.header}>Create a new classroom</Text>

        <BasicInput 
          placeholder="classroom name"
          text={title}
          typed={(typed) => {
            setTitle(typed)
            typeNewGroupId(typed.replace(/[^\w]/g, ''))
          }}
          title="classroom name"
        /> 
        <BasicMultilineInput 
          placeholder="Description"
          text={description}
          typed={(typed) => setDescription(typed)}
          title="description"
        />
        <BasicInput 
          title="classroom ID"
          placeholder="Classroom ID"
          text={newGroupId.toString()}
          typed={(typed) => typeNewGroupId(typed.replace(/[^\w]/g, ''))}
        />
         <Text style={styles.groupId}>The group identifier will be what your future 
          members use to join the classroom. <Text style={styles.groupIdAvailable}>{newGroupId && isValidGroupId?`${newGroupId} is available`:`${newGroupId?`${newGroupId} is not available`:``}`}</Text>
        </Text>

        <BasicInput 
          placeholder="Password (optional)"
          text={newGroupPassword}
          typed={setGroupPassword}
          autoCapitalize="none"
          title="password (optional)"
        />

        <BasicInput 
          placeholder="Display name"
          text={displayName}
          typed={setDisplayName}
          title="display name"
        />

        <TouchableOpacity style={styles.categoryBtn} onPress={() => toggleModal(!showModal)}>
          <Text style={styles.categoryBtnText}>Category: {category}</Text>
        </TouchableOpacity>

        {category==='Other'?<BasicInput 
          placeholder="Group Category"
          text={groupCategory}
          typed={(typed) => setCatInput(typed)}
        />:null}
      </KeyboardAwareScrollView>

      {checkGroupValid()?<ConfirmBtn onPress={() => saveGroup()} text="Save"/>: false}
      
      
      <SelectorModal 
        visible={showModal}
        toggleModal={() => toggleModal(!showModal)}
        setCategory={(category) => setCategory(category)}
        initialOptions={INITIAL_OPTIONS}
      />
    </Block>
  )
}

const styles = ScaledSheet.create({
  header: {
    fontFamily: 'Montserrat-Bold',
    fontSize: wp('5.5'),
    color: 'dimgrey',
    marginHorizontal: wp('5%'),
    marginVertical: wp('1'),
    textAlign: 'center',
  },
  categoryBtn: {
    margin: wp('3'),
    marginBottom: hp(5)
  },
  categoryBtnText: {
    textAlign: 'center',
    fontFamily: 'OpenSans-SemiBold',
    fontSize: wp('5%'),
    color: '#232323'
  },
  groupId: {
    marginHorizontal: wp('8'),
    textAlign: 'center',
  },
  groupIdAvailable: {
    fontFamily: 'OpenSans-SemiBold', 
  },
})

const mapStateToProps = state => {
  const { profile } = state.auth

  return {
    profile
  }
}

const mapDispatchToProps = { 
  createMeeting,
  joinGroup,
  joinNewGroup,
}

export default connect(mapStateToProps,mapDispatchToProps)(CreateMeeting);