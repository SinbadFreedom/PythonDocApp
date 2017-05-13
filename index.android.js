import React, {Component} from 'react';
import {
    AppRegistry,
    WebView
    } from 'react-native';

class PythonDocApp extends Component {
    render() {
        return (
            <WebView
                source={require("./html/index.html")}
                />
        );
    }
}

AppRegistry.registerComponent('PythonDocApp', () => PythonDocApp);
