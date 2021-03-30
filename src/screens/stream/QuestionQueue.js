import React, {Component} from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Image,
  KeyboardAvoidingView,
} from 'react-native'
import {
  Block,
  BackNavBar,
} from '../../common'
import moment from 'moment'
import { ScaledSheet } from 'react-native-size-matters'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { uniqueId } from 'lodash'
import KeyboardAwareScrollView from 'react-native-keyboard-aware-scroll-view'
const sendBtn = require('../../../assets/icons/greenSend.png')
const greySendBtn = require('../../../assets/icons/greySend.png')

let queue = [
  {message: 'Question on #3', author: 'Jeremy', sentAt: moment().format(), id: uniqueId()},
  {message: 'When is worksheet 1.4.1 due?', author: 'Jane', sentAt: moment().format(), id: uniqueId()},
  {message: 'Question on #7', author: 'Julia', sentAt: moment().format(), id: uniqueId()},
  {message: 'Question on #3', author: 'Jeremy', sentAt: moment().format(), id: uniqueId()},
  {message: 'When is worksheet 1.4.1 due?', author: 'Jane', sentAt: moment().format(), id: uniqueId()},
  {message: 'Question on #7', author: 'Julia', sentAt: moment().format(), id: uniqueId()},
  {message: 'Question on #3', author: 'Jeremy', sentAt: moment().format(), id: uniqueId()},
  {message: 'When is worksheet 1.4.1 due?', author: 'Jane', sentAt: moment().format(), id: uniqueId()},
  {message: 'Question on #7', author: 'Julia', sentAt: moment().format(), id: uniqueId()},
  {message: 'Question on #3', author: 'Jeremy', sentAt: moment().format(), id: uniqueId()},
  {message: 'When is worksheet 1.4.1 due?', author: 'Jane', sentAt: moment().format(), id: uniqueId()},
  {message: 'Question on #7', author: 'Julia', sentAt: moment().format(), id: uniqueId()},
]

class QuestionQueue extends Component {
  constructor(props) {
    super(props)

    this.state = {
      text: '',
    }
  }

  handleTextInput = (text) => {
    this.setState({text})
  }


  renderItem = ({item}) => {
    return (
      <View style={styles.messageItem}>
        <Text style={styles.name}>{item.author}</Text>
        <Text style={styles.message}>{item.message}</Text>
      </View>
    )
  }

  render() {
    return (
      <Block>
        <BackNavBar navigation={this.props.navigation} title="Questions/Comments"/>

        
        <View style={styles.listContainer}>
          <FlatList 
            data={queue}
            renderItem={this.renderItem}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>


      <KeyboardAvoidingView keyboardVerticalOffset={hp('6%')} behavior="position">
        <View style={styles.inputContainer}>
          <TextInput 
            style={styles.textInput}
            placeholder="Message"
            onChangeText={this.handleTextInput}
            placeholderTextColor="#c2c2c2"
            value={this.state.text}
          />
    
          <TouchableOpacity style={styles.btnContainer} activeOpacity={.4}>
            {<Image 
              style={styles.sendBtn}
              source={this.state.text.length?sendBtn:greySendBtn}
            />}
          </TouchableOpacity>
        </View>
        </KeyboardAvoidingView>
      </Block>
    )
  }
}

const styles = ScaledSheet.create({
  textInput: {
    width: wp('80%'),
    height: hp('5%'),
    fontSize: '18@ms',
    margin: wp('2%'),
    color: '#000',
  },
  listContainer: {
    maxHeight: hp('76%')
  },
  inputContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    borderRadius: '5@ms',
    borderColor: 'dimgrey',
    backgroundColor: '#fff',
    shadowOffset: {width: 3, height: 3},
    shadowColor: '#393939',
    shadowOpacity: .3,
  },
  messageItem: {
    padding: wp('5%'),
    backgroundColor: '#fff',
    marginHorizontal: wp('2%'),
    shadowOffset: {width: 3, height: 3},
    shadowColor: '#393939',
    shadowOpacity: .3,
  },
  name: {
    fontFamily: 'Montserrat-Bold',
    fontSize: '17@ms',
  },
  message: {
    fontFamily: 'Montserrat-Regular',
    fontSize: '17@ms',
  },
  sendBtn: {
    width: '30@ms',
    height: '30@ms',

  },
  btnContainer: {
    alignSelf: 'center',
    shadowOffset: {width: 3, height: 3},
    shadowColor: '#393939',
    shadowOpacity: .3,
    margin: wp('2%'),
  },
})

export default QuestionQueue;