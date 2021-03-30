import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  FlatList,
  Text,
  KeyboardAvoidingView,
} from 'react-native';
import {
  ScaledSheet,  verticalScale
} from 'react-native-size-matters';
import { ChatInput } from './ChatInput'
import { MessageCard } from './MessageCard'
import {
  EmptyMessage
} from '../emptyOrError'


function ChatInterface(props) {
  const  [ messages, setMessages ] = useState(props.messages)
  const messagesList = useRef(null)

  useEffect(() => {
    // setTimeout(() => messagesList.current.scrollToEnd(), 700)
  }, [])

  return (
    <View style={{flex: 1, justifyContent: 'space-between'}}>
      <View style={{flex: 1}}>
        <FlatList
          ref={messagesList}
          data={messages}
          extraData={messages}
          renderItem={({item, index}) => (
            <MessageCard 
              index={index} 
              message={item} role={props.role} 
              onLongPress={this.props.onLongPress}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={<EmptyMessage />}
        />
      </View>

      <KeyboardAvoidingView keyboardVerticalOffset={verticalScale(100)} behavior="padding">
        <ChatInput 
          text={props.text} 
          onSendMsg={() => this.props.sendSMS()} 
          onType={(t) => props.typing(t)}
        />
      </KeyboardAvoidingView>
    </View>
  )
  
}

export { ChatInterface }
