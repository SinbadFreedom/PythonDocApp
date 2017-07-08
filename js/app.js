'use strict';

import React, {Component} from 'react';
import {
    AppRegistry,
    WebView,
    StatusBar,
    StyleSheet,
    View,
    BackHandler,
    ToastAndroid,
    Text,
    Button,
    ActivityIndicator,
    PermissionsAndroid,
    Platform
} from 'react-native';

import RNFetchBlob from 'react-native-fetch-blob'

const styles = StyleSheet.create({
                                     container: {
                                         flex: 1,
                                         backgroundColor: '#1FB9FF',
                                         borderWidth: 0
                                     },
                                 });

const WEB_VIEW_REF = "webView";
const WEB_ROOT = "http://apetools.cn/html_python/";

const BUNDLE_VERSION = '1.0';
const APP_PACKAGE_NAME = 'PythonDocApp';
const PYTHON_DOC_APP_BUNDLE = "http://apetools.cn/bundle/" + APP_PACKAGE_NAME + "/" + Platform.OS + "/" + BUNDLE_VERSION
                              + "/" + "index.android.bundle";

class DocApp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true
        };
    }

    componentDidMount() {
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', this.backHandler);
            this.requestAndroidPermission();
        }
        let dirs = RNFetchBlob.fs.dirs.SDCardApplicationDir + '/files/index.android.bundle';
        console.log("---------------dirs-------- : " + dirs);
        console.log("---------------PYTHON_DOC_APP_BUNDLE-------- : " + PYTHON_DOC_APP_BUNDLE);
        RNFetchBlob
            .config({
                        // response data will be saved to this path if it has access right.
                        fileCache: true,
                        path: dirs
                    })
            .fetch('GET', PYTHON_DOC_APP_BUNDLE, {
                //some headers ..
            })
            .then((res) => {
                // the path should be dirs.DocumentDir + 'path-to-file.anything'
                console.log('The file saved to ', res.path());
                this.setState({isLoading: false}, function () {
                    // do something with new state
                });
            })
    }

    componentWillUnmount() {
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress', this.backHandler);
        }
    }

    backHandler = () => {
        if (this.state.backButtonEnabled) {
            this.refs[WEB_VIEW_REF].goBack();
            return true;
        } else {
            if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
                /** 最近2秒内按过back键，可以退出应用*/
                return false;
            }
            this.lastBackPressed = Date.now();
            ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT);
            return true
        }
    };

    requestAndroidPermission = async() => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    'title': '需要读写权限',
                    'message': '启禀皇上:本应用需要存储权限存储数据'
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("You can use WRITE_EXTERNAL_STORAGE")
            } else {
                console.log("WRITE_EXTERNAL_STORAGE permission denied")
            }
        } catch (err) {
            console.warn(err)
        }
    };

    render() {
        if (this.state.isLoading) {
            return (
                <View style={{flex: 1, paddingTop: 20}}>
                    <ActivityIndicator />
                </View>
            );
        }
        return (
            <View style={styles.container}>
                <StatusBar hidden={true}></StatusBar>
                <WebView
                    ref={WEB_VIEW_REF}
                    source={ {uri : WEB_ROOT}}
                    onNavigationStateChange={this.onNavigationStateChange.bind(this)}
                />
            </View>
        );
    }

    onNavigationStateChange(navState) {
        this.setState({
                          backButtonEnabled: navState.canGoBack
                      });
    }
}

AppRegistry.registerComponent(APP_PACKAGE_NAME, () => DocApp);
