import React, {Component} from 'react';
import {
    AppRegistry,
    WebView,
    StatusBar,
    StyleSheet,
    View,
    BackHandler
} from 'react-native';

const styles = StyleSheet.create({
                                     container: {
                                         flex: 1,
                                         backgroundColor: '#1FB9FF',
                                         borderWidth: 0
                                     },
                                 });

const WEB_VIEW_REF = "webView";

class PythonDocApp extends Component {

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.backHandler);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.backHandler);
    }

    backHandler = () => {
        this.refs[WEB_VIEW_REF].goBack();
        return true;
    };

    render() {
        return (
            <View style={styles.container}>
                <StatusBar hidden={true}></StatusBar>
                <WebView
                    ref={WEB_VIEW_REF}
                    source={ {uri : 'http://139.59.45.254/html/'}}
                />
            </View>
        );
    }
}

AppRegistry.registerComponent('PythonDocApp', () => PythonDocApp);
