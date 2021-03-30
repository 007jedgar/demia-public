import React, { useState, useEffect } from 'react'
import {
  FlatList,
  View,
} from 'react-native'

import { FilterNavBar, Block, } from '../../common'
import { BoardCard, MentorCard } from '../../containers'
import { PostDetailModal } from '../../modals'
import {
  AddBtn,
  ConfirmBtn
} from '../../buttons'
import {
  EmptyBoardCard,
  EmptyMentorCard,
} from '../../emptyOrError'
import {
  FiltersModal
} from '../../modals'
import * as RootNavigation from '../../RootNavigation';

import { ScaledSheet } from 'react-native-size-matters'
import { connect } from 'react-redux'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import algoliasearch from 'algoliasearch';
import apikey from '../../apiKeys.json'
const client = algoliasearch(apikey.alogoliaAppId, apikey.alogoliaSearchKey)
const taIndex = client.initIndex('teacher_assistants')


function Search(props) {
  const [ tas, setTas ] = useState([])
  const [ showFilters, toggleFilters] = useState(false)
  const [ unread, setUnread ] = useState([])
  
  useEffect(() => {
    seachAll()
    getMessageNotifications()
  }, [])

  const seachAll = () => {
    taIndex.search(``,{
      filters: `isVisible:true`
    }).then((res) => {
      let tas = []
      res.hits.forEach((hit) => {
        let ta = hit
        ta.id = hit.objectID

        tas.push(ta)
      })
      console.log(tas)

      setTas(tas)
    })
  }

  const getMessageNotifications = () => {
    const user = auth().currentUser
    firestore().collection('users').doc(user.uid)
    .collection('message_threads').where("read", "==", false)
    .get().then((querySnap) => {
      if (querySnap.empty) {
        return setUnread([])
      } 

      let unread = []
      querySnap.forEach((doc) => {
        unread.push(doc.data())
      })

      setUnread(unread)
    })
  }

  const renderHeader = () => {
    return (
      <View>

      </View>
    )
  }

  const renderEmpty = () => {

  }

  return (
    <Block>

      <FilterNavBar 
        onPress={() => toggleFilters(!showFilters)} 
        title="find TAs"
        toMessages={() => {
          props.navigation.navigate('taMessageThreads')
        }}
        unread={unread.length}
      />  

      <FlatList 
        data={tas}
        renderItem={({item}) => (
          <MentorCard 
            item={item}
            onPress={() => props.navigation.navigate('tutorProfile', {item})}
          />
        )}
        keyExtractor={item => item.id }
        ListEmptyComponent={<EmptyMentorCard/>}
      />



      <FiltersModal 
        visible={showFilters}
        onToggle={() => toggleFilters(!showFilters)}
        searchWith={(filters) => {
          toggleFilters(!showFilters)
          
          taIndex.search(filters.keywords, {
            filters: `rating>=${filters.lowestRating} AND isVisible:true`
          }).then((res) => {
            let tas = []
            res.hits.forEach((hit) => {
              let ta = hit
              ta.id = hit.objectID
      
              tas.push(ta)
            })
      
            setTas(tas)
          }).catch((err) => console.log(err))
        }}
      />
    </Block>
  )
}

const mapStateToProps = state => {

  return {

  }
}

export  default connect(mapStateToProps, {})(Search)