import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  ScaledSheet,
  moderateScale,
} from 'react-native-size-matters';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


class EditNavBar extends Component {
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
    const { title, style, titleText, onPress, navigation, isEditing, toggleEditing } = this.props;

    return (
      <View>
        <View style={[container, style]}>
          <TouchableOpacity style={leftBtnView} onPress={() => {
            if (!onPress) return navigation.goBack()
            return onPress()
          }}>
            <Image
              source={this.state.backArrow}
              style={styles.navImage}
            />
          </TouchableOpacity>

          <View style={[top, this.props.topStyle]}>
            <Text style={[titleStyle, titleText]}>{title}</Text>
          </View>

          <TouchableOpacity onPress={toggleEditing} style={styles.editBtn}>
            <Text style={styles.editBtnText}>{isEditing?'Done':'Edit'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = ScaledSheet.create({
  container: {
    height: hp('7%'),
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
  leftBtnView: {
    position: 'absolute',
    zIndex: 5,
    marginLeft: wp('1%')
  },
  titleView: {
    alignSelf: 'center',
    marginLeft: '57@s',
  },
  titleStyle: {
    fontSize: '24@ms',
    textAlign: 'center',
    color: 'dimgrey',
    alignSelf: 'center',
  },
  navImage: {
    width: '44@ms',
    height: '44@ms',
    padding: '10@ms',
    alignSelf: 'center',
  },
  editBtnText: {
    color: '#166088',
    fontFamily: 'Arial',
    fontWeight: '400',
    fontSize: '18@ms',

  },
  editBtn: {
    alignSelf: 'flex-end',
    position: 'absolute',
    right: wp('4%')
  }
})

export { EditNavBar };
