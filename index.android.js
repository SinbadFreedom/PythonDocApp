import React, {Component} from 'react';
import {
    AppRegistry,
    WebView,
    StatusBar,
    StyleSheet,
    View
} from 'react-native';

const styles = StyleSheet.create({
                                     container: {
                                         flex: 1,
                                         backgroundColor: '#1FB9FF',
                                         borderWidth:0
                                     },
                                 });

class PythonDocApp extends Component {
    render() {
        return (
            <View style={styles.container}>
                <StatusBar hidden={true}></StatusBar>
                <WebView source={require("./html/index.html")}/>
            </View>
        );
    }
}

AppRegistry.registerComponent('PythonDocApp', () => PythonDocApp);
