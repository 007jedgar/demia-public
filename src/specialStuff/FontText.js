import React, { Component } from 'react' ;
import { Text } from 'react-native' ;
import { connect } from 'react-redux'

class FontText extends Component {
  Loadtext() {
    console.log(this.props.isFontLoaded)
    if (this.props.isFontLoaded) {
      return (
        <Text 
          style={this.props.style}
        >
          {this.props.children}
        </Text>
      )
    } else { return (
      <Text 
      style={[this.props.style, {fontFamily: 'Arial'}]}
    >
      {this.props.children}
    </Text>       
    )
    }
  }

  render() {
    return (
      this.Loadtext()
    )
  }
}

const mapStateToProps = state => {
  const { isFontLoaded } = state.font

  return {
    isFontLoaded,
  }
}

export default connect(mapStateToProps, {})(FontText);