import React, {Component} from 'react'
import { 
  FlatList,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native'
import {
  Block,
  BackNavBar
} from '../../common'
import { 
  AddBtn
} from '../../buttons'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { ScaledSheet } from 'react-native-size-matters'
import moment from 'moment'
const clear_icon = require('../../../assets/icons/clear.png')

let numbers = [1,2,3,4,5,6,7,8,9,0,'back']

class Timers extends Component {
  constructor(props) {
    super(props)

    this.state = {
      hours: '00', 
      minutes: '00', 
      seconds: '00',
      interval: 'seconds',
    }
  }

  setIntervalToEdit = (interval) => {
    this.setState({interval })
  }

  onHandleNumPress = (item) => {
    let interval = this.state.interval
    let currentTime = this.state[interval]
    
    if (currentTime === '00') {
      currentTime = ''
    }

    if (currentTime.length==2) {
      return;
    }
    
    this.setState({
      [interval]: `${currentTime + item }`,
    })
  }

  onBackPressed = () => {
    let interval = this.state.interval
    let intervalTime = this.state[interval]
    intervalTime = Math.round(intervalTime/10)
    this.setState({
      [interval]: intervalTime
    })
  }

  renderItem = ({item}) => {
    if (item === 'back') {
      return (
        <TouchableOpacity onPress={this.onBackPressed}>
          <Image 
            source={clear_icon}
            style={styles.clearBtn}
          />
        </TouchableOpacity>
      )
    }

    return (
      <TouchableOpacity onPress={() => this.onHandleNumPress(item)}>
        <Text style={styles.numListItem}>{item}</Text>
      </TouchableOpacity>
    )
  }

  render() {
    const { hours, minutes, seconds, miliseconds} = this.state
    return (
      <Block>

        <BackNavBar title="Timers" navigation={this.props.navigation}/>
        <AddBtn />

        <View style={styles.timerContainer}>
          <TouchableOpacity onPress={() => this.setIntervalToEdit('hours')}>
            <Text style={styles.timeText}>{`${hours}`}</Text>
          </TouchableOpacity>
            <Text style={styles.timeText}>:</Text>
          <TouchableOpacity onPress={() => this.setIntervalToEdit('minutes')}>
            <Text style={styles.timeText}>{`${minutes}`}</Text>
          </TouchableOpacity>
            <Text style={styles.timeText}>:</Text>
          <TouchableOpacity onPress={() => this.setIntervalToEdit('seconds')}>
            <Text style={styles.timeText}>{`${seconds}`}</Text>
          </TouchableOpacity>
        </View>

        
        <View style={{height: hp('60%')}}>
          <FlatList 
            data={numbers}
            renderItem={this.renderItem}
            keyExtractor={(item) => item.toString()}
            numColumns={3}
            style={styles.list}
            contentContainerStyle={{alignItems: 'center'}}
            scrollEnabled={false}
          />
        </View>

        <Text style={styles.startText}>START</Text>
      </Block>
    )
  }
}

const styles = ScaledSheet.create({
  timerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: '50@ms',
    fontFamily: 'Montserrat-Regular',
    margin: wp('1%')
  },
  startText: {
    fontSize: '25@ms',
    textAlign: 'center',
  },
  numListItem: {
    textAlign: 'center',
    fontSize: wp('9%'),
    color: 'dimgrey',
    margin: wp('10%'),
    marginVertical: hp('3%')
  },
  list: {
    alignSelf: 'center',
    margin: wp('4%'),
    
  },
  clearBtn: {
    width: wp('10%'),
    height: wp('10%'),
    margin: wp('10%'),
    marginVertical: hp('3%')
  },
})

export default Timers