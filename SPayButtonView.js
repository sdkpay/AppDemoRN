
import React from 'react';
import {requireNativeComponent} from 'react-native';

export default class SPayButton extends React.Component {
  render() {
    return(
      <RNTSPayButton {...this.props} />
    );
  }
}

const RNTSPayButton = requireNativeComponent('RNTSPayButton');

module.exports = SPayButton;