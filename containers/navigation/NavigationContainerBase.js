import React, { Component } from 'react';
import { addNavigationHelpers } from 'react-navigation';
import { View, StyleSheet } from 'react-native';
import AppNavigator from './AppNavigator';
import ProgressSpinner from '../../components/ProgressSpinner';
import CircleSpinner from '../../components/CircleSpinner';
import {
  createReduxBoundAddListener,
  createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers';

const middleware = createReactNavigationReduxMiddleware(
  "root",
  state => state.nav,
);
const addListener = createReduxBoundAddListener("root");

export default class NavigationContainerBase extends Component {

  marginTop () {
    return 0;
  }

  render() {
    const navHelpersConfig = {
      dispatch: this.props.dispatch,
      state: this.props.nav,
      addListener
    };
    return (
      <View style={[styles.container, { marginTop: this.marginTop() }]}>
        {
          this.props.language &&
          <AppNavigator navigation={addNavigationHelpers(navHelpersConfig)} ref={(o) => this.appNavigator = o} />
        }
        {
          this.props.isAppWorking && <CircleSpinner />
        }
      </View>
    );
  }

  static mapToStateProps(state) {
    return {
      nav: state.nav,
      language: state.language,
      isAppWorking: state.isAppWorking
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
