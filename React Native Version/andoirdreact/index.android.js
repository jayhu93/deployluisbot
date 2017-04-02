/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { WebView } from 'react-native';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

export default class andoirdreact extends Component {
  render() {
    return (
            <WebView
        source={{uri: 'https://webchat.botframework.com/embed/ANewBot?s=vT4Se7ZlN-A.cwA.Hio.5OMcDJd42lNd2e4-pA52t3iAlyqZb7Vc1qNl4vy5tWc'}}
        style={{marginTop: 20}}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('andoirdreact', () => andoirdreact);
