import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { AppRegistry } from 'react-native';
import NavigationContainer from './containers/navigation/NavigationContainer';
import store from './store';


export default class App extends Component {

  render() {
    return(
      <Provider store={store}>
        <NavigationContainer />
      </Provider>
    )
  }
}
