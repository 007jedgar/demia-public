import React, {Component} from 'react';
import {
  SafeAreaView,
  TouchableOpacity,
} from 'react-native'
import { NavigationContainer, TabActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { navigationRef } from './RootNavigation';
import FastImage from 'react-native-fast-image'

import CreateMeeting from './screens/CreateMeeting'

import Signin from './screens/onboarding/Signin'
import Signup from './screens/onboarding/Signup'
import Welcome from './screens/onboarding/Welcome'
import EmailProvider from './screens/onboarding/EmailProvider'
import ForgotPassword from './screens/onboarding/ForgotPassword'

import Boards from './screens/boards/Boards'
import Profile from './screens/boards/Profile'
import Subscriptions from './screens/boards/Subscriptions'
import Search from './screens/boards/Search'


import TutorProfile from './screens/search/TutorProfile'
import AssistantMessenger from './screens/search/AssistantMessenger'
import Checkout from './screens/search/Checkout'
import TAMessageThreads from './screens/search/TAMessageThreads'
import TAReviews from './screens/search/TAReviews'

import MeetingAttendance from './screens/meeting/MeetingAttendance'
import MeetingComments from './screens/meeting/MeetingComments'
import MeetingStream from './screens/meeting/MeetingStream'
import MeetingSettings from './screens/meeting/MeetingSettings'

import Polls from './screens/stream/Polls'
import Assignments from './screens/stream/Assignments'
import SharedDocs from './screens/stream/SharedDocs'
import Timers from './screens/stream/Timers'
import QuestionQueue from './screens/stream/QuestionQueue'
import Groups from './screens/stream/Groups'
import CreateAssignment from './screens/stream/CreateAssignment'
import Events from './screens/stream/Events'
import CreateEvent from './screens/stream/CreateEvent'
import CreatePoll from './screens/stream/CreatePoll'
import SyllabusScanner from './screens/stream/SyllabusScanner'

import FeedThread from './screens/comments/FeedThread'
import ChangePassword from './screens/profile/ChangePassword'
import Support from './screens/profile/Support'
import EditProfile from './screens/profile/EditProfile'
import Payments from './screens/profile/Payments'
import PersonalInfo from './screens/profile/PersonalInfo'
import VerifyPhone from './screens/profile/VerifyPhone'
import TAPayments from './screens/profile/TAPayments'
import EmergencyContact from './screens/profile/EmergencyContact'
import CreateTA from './screens/profile/CreateTA'
import HonorCode from './screens/profile/HonorCode'
import BlockedTaUsers from './screens/profile/BlockedTaUsers'

import BlockedUsers from './screens/feedback/BlockedUsers'
import SendFeedback from './screens/feedback/SendFeedback'
import Report from './screens/feedback/Report'
import Notifications from './screens/feedback/Notifications'
import ReviewTA from './screens/feedback/ReviewTA'

import { ScaledSheet } from 'react-native-size-matters';
import blueCB from '../assets/icons/blue_clipboard.png'
import greyCB from '../assets/icons/grey_clipboard.png'
import Icons from '@assets/icons'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'



class AppStack extends Component {
  MeetingTabs() {
    const Tab = createBottomTabNavigator();
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => {
            let icon;
            if (route.name === 'stream') {
              icon = focused?Icons.blueCb:Icons.greyCb
            } else if (route.name === 'messages') {
              icon = focused?Icons.blueMessages:Icons.greyMessages
            } else if (route.name === 'attendance') {
              icon = focused?Icons.blueUsers:Icons.greyUsers
            }
            return <FastImage source={icon}  style={styles.tabIcon}/>;
          },
        })} 
        tabBarOptions={{
          activeTintColor: '#69a2b0',
          labelStyle: styles.label,
          style: styles.tabBar
        }}     
      >
        <Tab.Screen name="stream" component={MeetingStream} 
          options={{
            title: 'Stream',
            tabBarButton: (props) => <TouchableOpacity {...props}/>
          }} 
        />
        <Tab.Screen name="messages" component={MeetingComments} 
          options={{
            title: 'Discussion',
            tabBarButton: (props) => <TouchableOpacity {...props}/>
          }}
        />
        <Tab.Screen name="attendance" component={MeetingAttendance} 
          options={{
            title: 'Members',
            tabBarButton: (props) => <TouchableOpacity {...props}/>
          }}
        />
      </Tab.Navigator>      
    )
  }

  MeetingStack = () => {
    
    return createStackNavigator({
      stream: MeetingStream
    })
    return (
      <MeetingStreamStack.Navigator headerMode="none">
        <MeetingStreamStack.Screen name="stream" component={MeetingStream} />
        <MeetingStreamStack.Screen name="polls" component={Polls} />
        <MeetingStreamStack.Screen name="assignments" component={Assignments} />
        <MeetingStreamStack.Screen name="sharedDocs" component={SharedDocs} />
      </MeetingStreamStack.Navigator>
    )
  }

  profileTabs() {
    const Tab = createBottomTabNavigator()
    
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => {
            let icon
            if (route.name === 'board') {
              icon = focused?blueCB:greyCB
            } else if (route.name === 'profile') {
              icon = focused?Icons.blueProfile:Icons.greyProfile
            } else if (route.name === 'subscription') {
              icon = focused?Icons.blueSub:Icons.greySub
            } else if (route.name === 'search') {
              icon = focused?Icons.blueSearch:Icons.greySearch
            }
            return <FastImage source={icon}  style={styles.tabIcon}/>;
          },
        })} 
        tabBarOptions={{
          activeTintColor: '#69a2b0',
          labelStyle: styles.label,
          style: styles.tabBar
        }}     
      >
        <Tab.Screen name="board" component={Boards} 
          options={{
            title: 'Classrooms',
            tabBarButton: (props) => <TouchableOpacity {...props}/>
          }}         
        />
        <Tab.Screen name="search" component={Search} 
          options={{
            title: 'Search',
            tabBarButton: (props) => <TouchableOpacity {...props}/>
          }}         
        />
        <Tab.Screen name="subscription" component={Subscriptions} 
          options={{
            title: 'Alerts',
            tabBarButton: (props) => <TouchableOpacity {...props}/>
          }}         
        />
        <Tab.Screen name="profile" component={Profile} 
          options={{
            title: 'Profile',
            tabBarButton: (props) => <TouchableOpacity {...props}/>
          }}            
        />
      </Tab.Navigator> 
    )
  }

  render() {
    const Stack = createStackNavigator()


    return (
      <SafeAreaView style={{flex: 1}}>
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator headerMode="none">
            <Stack.Screen name="syllabusScanner" component={SyllabusScanner} />
              <Stack.Screen name="welcome" component={Welcome} />
              <Stack.Screen name="email" component={EmailProvider} />
              <Stack.Screen name="forgotPassword" component={ForgotPassword} />
              <Stack.Screen name="meeting" component={this.MeetingTabs} />
              <Stack.Screen name="polls" component={Polls} />
              <Stack.Screen name="signin" component={Signin} />
              <Stack.Screen name="signup" component={Signup} />
              <Stack.Screen name="board" component={this.profileTabs} />
              <Stack.Screen name="createMeeting" component={CreateMeeting} />
              <Stack.Screen name="profile" component={Profile} />
              <Stack.Screen name="assignments" component={Assignments} />
              <Stack.Screen name="createAssignment" component={CreateAssignment} />
              <Stack.Screen name="sharedDocs" component={SharedDocs} />
              <Stack.Screen name="timers" component={Timers} />
              <Stack.Screen name="questionQueue" component={QuestionQueue} />
              <Stack.Screen name="groups" component={Groups} />
              <Stack.Screen name="feedThread" component={FeedThread} />
              <Stack.Screen name="changePassword" component={ChangePassword} />
              <Stack.Screen name="support" component={Support} />
              <Stack.Screen name="report" component={Report} />
              <Stack.Screen name="sendFeedback" component={SendFeedback} />
              <Stack.Screen name="blockedUsers" component={BlockedUsers} />
              <Stack.Screen name="blockedTaUsers" component={BlockedTaUsers} />
              <Stack.Screen name="notifications" component={Notifications} />
              <Stack.Screen name="meetingSettings" component={MeetingSettings} />
              <Stack.Screen name="events" component={Events} />
              <Stack.Screen name="createEvent" component={CreateEvent} />
              <Stack.Screen name="payments" component={Payments} />
              <Stack.Screen name="editProfile" component={EditProfile} />
              <Stack.Screen name="personalInfo" component={PersonalInfo} />
              <Stack.Screen name="createPoll" component={CreatePoll} />
              <Stack.Screen name="tutorProfile" component={TutorProfile} />
              <Stack.Screen name="assistantMessenger" component={AssistantMessenger} />
              <Stack.Screen name="verifyPhone" component={VerifyPhone} />
              <Stack.Screen name="taPayments" component={TAPayments} />
              <Stack.Screen name="emergencyContact" component={EmergencyContact} />
              <Stack.Screen name="createTA" component={CreateTA} />
              <Stack.Screen name="honorCode" component={HonorCode} />
              <Stack.Screen name="checkout" component={Checkout} />
              <Stack.Screen name="taMessageThreads" component={TAMessageThreads} />
              <Stack.Screen name="reviewTA" component={ReviewTA} />
              <Stack.Screen name="taReviews" component={TAReviews} />
              
              
            </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView> 
    )
  }
}

const styles = ScaledSheet.create({
  tabIcon: {
    width: '25@ms',
    height: '25@ms',
  },
  label: {
    fontSize: '13@ms',
    fontFamily: 'Montserrat-Medium'
  },
  tabBar: {
    height: hp('10%'), 
  },
})

export default AppStack;