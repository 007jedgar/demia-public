import React, {Component} from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native';
import {
  scale, moderateScale, verticalScale, ScaledSheet,
} from 'react-native-size-matters';

class FootInput extends Component {
  constructor(props) {
    super(props)

    this.state = {
      continuable: props.continuable,
      counter: 0,
    }
  }

  componentDidUpdate(nextProps) {
    if (nextProps.continuable != this.state.continuable) {
      this.setState({ continuable: nextProps.continuable})
    }
  }

  renderContinue() {
    const { pressed, children } = this.props;
    if (this.state.continuable) {
      return (
        <TouchableOpacity onPress={pressed}>
          {children}
        </TouchableOpacity>
      )
    }
  }

  render() {
    const { label, value, onChangeText, placeholder, secureTextEntry, style, keyboardType, keyboardAppearance, returnKeyType, onFocus, maxLength, onChange, onSubmitEditing } =this.props;
    const { inputStyle, labelStyle, containerStyle } = styles;

    return (
      <TouchableWithoutFeedback >
        <View style={[containerStyle, style ]}>
          <TextInput
            placeholderTextColor="#fff"
            placeholder={placeholder}
            autoCorrect={false}
            secureTextEntry={secureTextEntry}
            style={[labelStyle, label]}
            value={value}
            onChangeText={onChangeText}
            onChange={onChange}
            keyboardType={keyboardType}
            returnKeyType={returnKeyType}
            maxLength={maxLength}
            keyboardAppearance={keyboardAppearance}
            onSubmitEditing={onSubmitEditing}
            onFocus={onFocus}
          />
          {this.renderContinue()}
        </View>
      </TouchableWithoutFeedback>
    )
  }
};

const styles = ScaledSheet.create({
  inputStyle: {
    color: '#fff',
    paddingRight: 5,
    paddingLeft: 5,
    fontSize: 18,
    lineHeight: 23,
  },
  labelStyle: {
    fontSize: '22@ms',
    fontWeight: '800',
    color: '#000',    
    textAlign: 'left'
  },
  containerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0E4457',
    height: '70@vs',
    paddingLeft: '20@ms',
    justifyContent: 'space-between',
  }
})


export { FootInput };
