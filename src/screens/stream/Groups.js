import React, {Component} from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native'
import {
  Block,
  BackNavBar,
} from '../../common'
import { ScaledSheet } from 'react-native-size-matters'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'


class Groups extends Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  render() {
    return (
      <Block>
        <BackNavBar navigation={this.props.navigation} title="Groups"/>

        
      </Block>
    )
  }
}

const styles = ScaledSheet.create({

})

export default Groups;