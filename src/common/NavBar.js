import React, { Component } from 'react';
import {
  Text,
  Image,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { ScaledSheet, moderateScale } from 'react-native-size-matters';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'


class NavBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bottonRow: props.bottomRow,
      topStyle: {marginTop: moderateScale(10)},
    }
  }

  componentDidMount() {
    var iphoneX = this.isIphoneX();
    if (iphoneX) {
      this.iphoneXOptimization();
    }
  }

  isIphoneX() {
    let d = Dimensions.get('window');
    const { height, width } = d;

    return (
      // This has to be iOS duh
      Platform.OS === 'ios' &&

      // Accounting for the height in either orientation
      (height === 812 || width === 812)
    );
  }

  iphoneXOptimization() {
    //stuff for iphone x nav bar
    // this.setState({ topStyle: {marginTop: -10}})
  }

  renderBack() {
    var {children} = this.props
    if (children) {
      return (
        <View style={styles.leftBtnView}>
          {children}
        </View>
      )
    }
  }

  render() {
    const {
      leftBtnView, titleStyle, rightBtnStyle, titleView,
      container, top } = styles;
    const {
      children, title, style,
      titleViewStyle, titleText } = this.props;

    return (
      <View style={[container, style]}>

          {this.renderBack()}

          <View style={[titleView, titleViewStyle]}>
            <Text style={[titleStyle, titleText]}>{title}</Text>
          </View>

      </View>
    );
  }
}

const styles = ScaledSheet.create({
  container: {
    backgroundColor: '#171717',
    shadowOffset: {width: 3, height: 3},
    shadowColor: '#393939',
    shadowOpacity: .3,
    flexDirection: 'row',
    padding: '7@ms',
    paddingLeft: '4@ms',
    justifyContent: 'center',
  },
  leftBtnView: {
    justifyContent: 'center',
    paddingLeft: '10@s',
  },
  titleView: {
    flex: 1,
    alignSelf: 'center',
  },
  titleStyle: {
    fontSize: '26@ms',
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'Arial',
  },
})

export { NavBar };
