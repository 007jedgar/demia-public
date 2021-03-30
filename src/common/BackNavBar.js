import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {
  ScaledSheet,
  moderateScale,
} from 'react-native-size-matters';
import { 
  widthPercentageToDP as wp, 
  heightPercentageToDP as hp 
} from 'react-native-responsive-screen'
import * as RootNavigation from '../RootNavigation'
import FastImage from 'react-native-fast-image'
import Icons from '@assets/icons'

class BackNavBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bottonRow: props.bottomRow,
      topStyle: {marginTop: moderateScale(10)},
      backArrow: require('../../assets/icons/backArrow.png'),
    }
  }

  componentDidMount() {
    if (this.props.backArrow) {
      this.setState({ backArrow: this.props.backArrow})
    }
  }

  render() {
    const {
      leftBtnView, titleStyle,
      container,  top } = styles;
    const { title, style, titleText, onPress } = this.props;

    return (
      <View>
        <View style={[container, style]}>
          <TouchableOpacity style={leftBtnView} onPress={() => {
            if (!onPress) return RootNavigation.goBack()
            return onPress()
          }}>
              <FastImage
                source={Icons.backArrow}
                style={styles.navImage}
              />
            </TouchableOpacity>

          <View style={[top, this.props.topStyle]}>

          <Text style={[titleStyle, titleText]}>{title}</Text>

          </View>
        </View>
      </View>
    );
  }
}

const styles = ScaledSheet.create({
  container: {
    paddingTop: hp('2'),
    height: hp('9%'),
    backgroundColor: '#fff',
    shadowOffset: {width: 3, height: 3},
    shadowColor: '#393939',
    shadowOpacity: .3,
    marginBottom: '4@vs',
    justifyContent: 'center',
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  titleView: {
    alignSelf: 'center',
    marginLeft: '57@s',
  },
  titleStyle: {
    fontSize: wp('5.5'),
    textAlign: 'center',
    color: '#000',
    alignSelf: 'center',
    fontFamily: 'Montserrat-Regular',
  },
  navImage: {
    width: wp('12'),
    height: wp('12'),
  },
  leftBtnView: {
    position: 'absolute',
    top: hp('2.5'),
    left: wp('2'),
    zIndex: 5
  },
})

export { BackNavBar };
