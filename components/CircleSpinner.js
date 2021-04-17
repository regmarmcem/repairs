import React, { Component } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { yellowColor, modalBackground } from '../styles/colors';
import * as Progress from 'react-native-progress';

export default class CircleSpinner extends Component {
  render() {
    return(
      <View style={[styles.container, styles.horizontal]}>
        <Progress.Circle size={30} indeterminate={true} animationType={'decay'} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: modalBackground
  }
});
