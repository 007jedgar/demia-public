import React, { useState, useEffect } from 'react'
import {
  Text,
  View,
  ScrollView
} from 'react-native'
import { 
  Block,
 } from '../../common'
 import {
  getUser, setMeeting,
 } from '../../actions'
import { ScaledSheet, moderateScale } from 'react-native-size-matters'
import { ConfirmBtn, SilentBtn, } from '../../buttons'
import {JoinPresentationModal } from '../../modals'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import auth from '@react-native-firebase/auth'
import Spinny from 'react-native-spinkit'
import { connect } from 'react-redux'
import FastImage from 'react-native-fast-image'
import Icons from '@assets/icons'
import { TouchableOpacity } from 'react-native-gesture-handler'

function Welcome(props) {
  const { header, authPrompts, line } = styles
  const [ joinModalVisible, setJoinModal ] = useState(false)
  const [ loading, toggleLoading ] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      auth().onAuthStateChanged((user) => {
        toggleLoading(false)
        if (!user) return
        props.getUser()
      })
    },1500)

  }, [])


  return (
    <Block>
      
  
      <ScrollView style={{flex: 1, marginTop: hp('2')}}>
        <View>
          <View style={{marginBottom: hp('1%')}}>
            <FastImage 
              source={Icons.demiaTrans}
              style={{
                width: hp('20'),
                height: hp('20'),
                alignSelf: 'center',
              }}
            />

            <Text style={{
              textAlign: 'center',
              fontFamily: 'Montserrat-Regular',
              marginHorizontal: wp('5'),
              fontSize: wp('5'),
              color: '#3D405B',
            }}>designed for classrooms</Text>
            
          </View>
 
          {!loading?<View style={{ marginTop: hp('20')}}>

            {!loading?<TouchableOpacity style={{margin: wp(4), padding: wp(2)}} onPress={() => setJoinModal(!joinModalVisible)}>
              <Text style={styles.joinBtnText}>Join a classroom</Text>
            </TouchableOpacity>:null}
            <SilentBtn onPress={() => props.navigation.navigate('signin')} text="Sign In"/>
            <SilentBtn onPress={() => props.navigation.navigate('signup')} text="Create an account"/>
            
          </View>:null}

          <View style={{
            alignSelf: 'center',
          }}>
            <Spinny 
              color={'#4F6D7A'}
              type={'Arc'}
              size={50}   
              isVisible={loading}       
            />
          </View>
          
          {joinModalVisible?<JoinPresentationModal  
            setMeeting={(info, profile) => props.setMeeting(info, profile)}
            visible={joinModalVisible}
            onExit={() => setJoinModal(!joinModalVisible)}
            joinMeeting={() => {
              setJoinModal(!joinModalVisible) 
              props.navigation.navigate('meeting')
            }}
          />:null}
        </View>
      </ScrollView>

    </Block>
  )
}

const styles = ScaledSheet.create({
  header: {
    textAlign: 'center',
    fontSize: wp('6'),
    fontFamily: 'Raleway-Bold',
    color: '#DB6443',
  },
  authPrompts: {
    textAlign: 'center',
    margin: '10@ms',
    fontFamily: 'Montserrat-Regular'
  },
  line: {
    alignSelf: 'center',
    backgroundColor: 'dimgrey',
    width: wp('70%'),
    height: '1@ms',
    marginVertical: hp('1%')
  },  
  joinBtnText: {
    textAlign: 'center',
    fontSize: wp('5'),
    fontFamily: 'Montserrat-Regular',
    color: '#232323',
    textDecorationStyle: 'solid',
    textDecorationColor: '#232323',
    textDecorationLine: 'underline'
  },
})

const mapStateToProps = state => {
  const { profile } = state.auth

  return {
    profile,
  }
}

const mapDispatchToProps = {
  getUser, setMeeting,
}

export default connect(mapStateToProps, mapDispatchToProps)(Welcome);